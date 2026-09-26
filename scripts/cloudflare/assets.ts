import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import { assetPathSchema, normalizeImagePath } from '../../src/shared/data-contracts';

export const assetRoot = path.resolve('cloudflare/assets');
const manifestSchema = z.object({ version: z.literal(1), files: z.array(z.object({
  path: assetPathSchema, bytes: z.number().int().positive(), sha256: z.string().regex(/^[a-f0-9]{64}$/),
})) });
export const manifestPath = path.resolve('cloudflare/asset-manifest.json');
export const sha256 = (data: Uint8Array) => createHash('sha256').update(data).digest('hex');

export function localAssetPath(key: string) {
  return path.join(assetRoot, assetPathSchema.parse(key).slice(1));
}

export async function downloadAsset(url: URL, key: string, headers?: Record<string, string>) {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(60_000) });
  if (!response.ok) throw new Error(`Image download failed (${response.status}): ${key}`);
  if (Number(response.headers.get('content-length') ?? 0) > 25 * 1024 * 1024) throw new Error(`Asset too large: ${key}`);
  const reader = response.body?.getReader();
  if (!reader) throw new Error(`Empty image: ${key}`);
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 25 * 1024 * 1024) { await reader.cancel(); throw new Error(`Asset too large: ${key}`); }
    chunks.push(value);
  }
  if (!size) throw new Error(`Empty image: ${key}`);
  const data = Buffer.concat(chunks);
  const file = localAssetPath(key);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, data);
  return data;
}

export async function readManifest() {
  return manifestSchema.parse(JSON.parse(await readFile(manifestPath, 'utf8')));
}

export async function verifyAssets() {
  const manifest = await readManifest();
  if (manifest.files.length > 20_000) throw new Error('Static Assets Free file limit exceeded');
  for (const entry of manifest.files) {
    const data = await readFile(localAssetPath(entry.path));
    if (data.length !== entry.bytes || sha256(data) !== entry.sha256) throw new Error(`Missing or modified asset: ${entry.path}`);
    if (data.length > 25 * 1024 * 1024) throw new Error(`Asset exceeds 25 MiB: ${entry.path}`);
  }
  return manifest;
}

export async function verifyPublishedAssets(base: string, manifest: z.infer<typeof manifestSchema>) {
  const pending = [...manifest.files];
  await Promise.all(Array.from({ length: 6 }, async () => {
    for (;;) {
      const entry = pending.pop();
      if (!entry) return;
      // Static Assets may omit Content-Length, including on HEAD responses.
      const response = await fetch(new URL(entry.path, base), { signal: AbortSignal.timeout(60_000) });
      if (!response.ok) throw new Error(`Published image unavailable (${response.status}): ${entry.path}`);
      const data = new Uint8Array(await response.arrayBuffer());
      if (data.length !== entry.bytes || sha256(data) !== entry.sha256) throw new Error(`Published image mismatch: ${entry.path}`);
    }
  }));
}

export async function writeManifest() {
  const files: z.infer<typeof manifestSchema>['files'] = [];
  async function walk(directory: string) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) throw new Error('Symlinks are not permitted in assets');
      if (entry.isDirectory()) await walk(file);
      else {
        const key = normalizeImagePath(path.relative(path.join(assetRoot, 'images'), file));
        const data = await readFile(file);
        files.push({ path: key, bytes: data.length, sha256: sha256(data) });
      }
    }
  }
  await mkdir(path.join(assetRoot, 'images'), { recursive: true });
  await walk(path.join(assetRoot, 'images'));
  files.sort((a, b) => a.path.localeCompare(b.path));
  await writeFile(manifestPath, JSON.stringify({ version: 1, files }, null, 2) + '\n');
  return verifyAssets();
}

export async function hydrateAssets(base: string) {
  const manifest = await readManifest();
  for (const entry of manifest.files) {
    let intact = false;
    try { intact = (await stat(localAssetPath(entry.path))).size === entry.bytes && sha256(await readFile(localAssetPath(entry.path))) === entry.sha256; } catch {}
    if (!intact) {
      const data = await downloadAsset(new URL(entry.path, base), entry.path);
      if (data.length !== entry.bytes || sha256(data) !== entry.sha256) throw new Error(`Remote asset does not match manifest: ${entry.path}`);
    }
  }
  return verifyAssets();
}
