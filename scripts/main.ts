import 'dotenv/config';
import { z } from 'zod';
import { spawnSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { TelegramClientService } from '@/services/TelegramClientService';
import { importPostSchema } from '@/shared/data-contracts';
import { hydrateAssets, verifyAssets, writeManifest } from './cloudflare/assets';

async function main() {
  const config = z.object({
    CLOUDFLARE_API_URL: z.string().url(), CLOUDFLARE_IMPORT_TOKEN: z.string().min(32),
    TG_API_ID: z.coerce.number().int().positive(), TG_API_HASH: z.string().min(1),
    TG_CHANNEL: z.string().default('tanya_strelchuk_blog'),
    TG_IMPORT_LIMIT: z.coerce.number().int().min(1).max(5000).default(500),
    TG_SESSION_NAME: z.string().default('.telegram-session'),
  }).parse(process.env);
  const base = config.CLOUDFLARE_API_URL;
  const target = process.argv.includes('--staging') ? 'staging' : 'production';
  const health = await fetch(new URL('/health', base), { signal: AbortSignal.timeout(30_000) });
  const identity = z.object({ success: z.literal(true), data: z.object({ service: z.literal('amazing-ekb-data'), environment: z.string() }) }).parse(await health.json());
  if (!health.ok || identity.data.environment !== target) throw new Error(`Worker URL does not match the requested ${target} environment`);
  const headers = { Authorization: `Bearer ${config.CLOUDFLARE_IMPORT_TOKEN}`, 'Content-Type': 'application/json' };
  const existingResponse = await fetch(new URL('/v1/import/images', base), { headers, signal: AbortSignal.timeout(30_000) });
  if (!existingResponse.ok) throw new Error('Cannot read existing image index; no changes published');
  const existing = z.object({ success: z.literal(true), data: z.array(z.string()) }).parse(await existingResponse.json()).data;
  // Restores old files after a fresh checkout and refuses an incomplete manifest.
  const manifest = await hydrateAssets(base);
  const known = new Set(manifest.files.map((file) => file.path));
  if (existing.some((key) => !known.has(key))) throw new Error('Manifest is older than the live database. Restore the latest manifest before importing.');
  const client = new TelegramClientService({ apiId: config.TG_API_ID, apiHash: config.TG_API_HASH, sessionName: config.TG_SESSION_NAME });
  let posts;
  try {
    await client.init();
    const messages = await client.fetchMessages(config.TG_CHANNEL, config.TG_IMPORT_LIMIT);
    posts = await client.simplifyMessages(client.groupMessages(messages), config.TG_CHANNEL);
  } finally { await client.stop(); }
  const input = posts.map((post) => importPostSchema.parse({ id: String(post.id), text: post.text,
    date: post.date.toISOString(), postLink: post.postLink, images: post.photoPaths.map((photo) => ({ path: photo.localPath })) }));
  // Save the replayable batch before publishing. No database changes on deployment failure.
  await writeFile('.migration-pending.json', JSON.stringify(input, null, 2), { mode: 0o600 });
  await writeManifest();
  await verifyAssets();
  const args = ['exec', 'wrangler', 'deploy', '--config', 'cloudflare/wrangler.jsonc'];
  if (process.argv.includes('--staging')) args.push('--env', 'staging');
  const deployed = spawnSync('pnpm', args, { stdio: 'inherit' });
  if (deployed.status !== 0) throw new Error('Asset publication failed; database was not changed');
  for (const post of input) {
    for (const image of post.images) {
      const response = await fetch(new URL(image.path, base), { method: 'HEAD', signal: AbortSignal.timeout(30_000) });
      if (!response.ok) throw new Error(`Image not published: ${image.path}`);
    }
  }
  for (const post of input) {
    const response = await fetch(new URL('/v1/import/telegram-post', base), { method: 'POST', headers, body: JSON.stringify(post), signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new Error(`Import failed for ${post.id} (${response.status}); rerunning is safe`);
  }
  console.log(`Imported ${input.length} Telegram posts. Commit cloudflare/asset-manifest.json to preserve the complete asset inventory.`);
}
main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : 'Import failed'); process.exitCode = 1; });
