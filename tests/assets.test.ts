import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';

test('fresh checkout restores the full inventory and refuses corrupt or missing assets', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'amazing-assets-'));
  const cwd = process.cwd();
  const originalFetch = globalThis.fetch;
  try {
    process.chdir(root);
    const { hydrateAssets, verifyAssets } = await import('../scripts/cloudflare/assets');
    const old = Buffer.from('existing photo');
    const other = Buffer.from('another existing photo');
    const entry = (name: string, bytes: Buffer) => ({ path: `/images/${name}.jpg`, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
    const manifest = { version: 1, files: [entry('old', old), entry('other', other)] };
    await mkdir('cloudflare/assets/images', { recursive: true });
    await writeFile('cloudflare/asset-manifest.json', JSON.stringify(manifest));
    await writeFile('cloudflare/assets/images/old.jpg', old);
    await assert.rejects(verifyAssets(), /ENOENT/);
    globalThis.fetch = async () => new Response('corrupted contents');
    await assert.rejects(hydrateAssets('https://assets.test'), /does not match/);
    globalThis.fetch = async () => new Response(other);
    assert.equal((await hydrateAssets('https://assets.test')).files.length, 2);
    assert.deepEqual(await readFile('cloudflare/assets/images/old.jpg'), old);
    assert.deepEqual(await readFile('cloudflare/assets/images/other.jpg'), other);
    await writeFile('cloudflare/assets/images/old.jpg', 'modified');
    await assert.rejects(verifyAssets(), /Missing or modified/);
  } finally {
    globalThis.fetch = originalFetch;
    process.chdir(cwd);
    await rm(root, { recursive: true, force: true });
  }
});

test('published photos are verified without Content-Length and same-size corruption is rejected', async () => {
  const { verifyPublishedAssets, sha256 } = await import('../scripts/cloudflare/assets');
  const originalFetch = globalThis.fetch;
  const data = Buffer.from('photo');
  const manifest = { version: 1 as const, files: [{ path: '/images/test.jpg', bytes: data.length, sha256: sha256(data) }] };
  try {
    globalThis.fetch = async () => new Response(data);
    await verifyPublishedAssets('https://assets.test', manifest);
    globalThis.fetch = async () => new Response('wrong');
    await assert.rejects(verifyPublishedAssets('https://assets.test', manifest), /Published image mismatch/);
    globalThis.fetch = async () => new Response(null, { status: 404 });
    await assert.rejects(verifyPublishedAssets('https://assets.test', manifest), /Published image unavailable/);
  } finally { globalThis.fetch = originalFetch; }
});
