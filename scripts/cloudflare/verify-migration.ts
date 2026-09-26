import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { z } from 'zod';
import { snapshotSchema, tableNames } from './migration';
import { normalizeImagePath } from '../../src/shared/data-contracts';
import { verifyAssets } from './assets';

async function main() {
  const input = process.argv[2];
  if (!input) throw new Error('Usage: verify-migration snapshot.json [--remote] [--staging] [--database-only]');
  const snapshot = snapshotSchema.parse(JSON.parse(await readFile(input, 'utf8')));
  const manifest = await verifyAssets();
  const staging = process.argv.includes('--staging') ? ['--env', 'staging'] : [];
  const remote = process.argv.includes('--remote');
  const queryResult = z.array(z.object({ results: z.array(z.record(z.unknown())) }));
  for (const table of tableNames) {
    const command = spawnSync('pnpm', ['exec', 'wrangler', 'd1', 'execute', 'DB', '--config', 'cloudflare/wrangler.jsonc', ...staging,
      remote ? '--remote' : '--local', '--json', '--command', `SELECT * FROM "${table}" ORDER BY id`], { encoding: 'utf8', maxBuffer: 100 * 1024 * 1024 });
    if (command.status !== 0) throw new Error(`Could not verify ${table}; Wrangler failed`);
    const actual = queryResult.parse(JSON.parse(command.stdout)).flatMap((result) => result.results);
    const expected = snapshot.tables[table].map((row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key,
      typeof value === 'boolean' ? Number(value) : table === 'Image' && key === 'path' && typeof value === 'string' ? normalizeImagePath(value) : value])));
    const canonical = (rows: Record<string, unknown>[]) => JSON.stringify(rows.sort((a, b) => String(a.id).localeCompare(String(b.id))).map((row) => Object.fromEntries(Object.entries(row).sort(([a], [b]) => a.localeCompare(b)))));
    if (canonical(actual) !== canonical(expected)) throw new Error(`Data mismatch in ${table}`);
    console.log(`${table}: ${actual.length} rows match`);
  }
  if (remote && !process.argv.includes('--database-only')) {
    const base = process.env.CLOUDFLARE_API_URL;
    if (!base) throw new Error('CLOUDFLARE_API_URL required to verify published images');
    for (const file of manifest.files) {
      const response = await fetch(new URL(file.path, base), { method: 'HEAD', signal: AbortSignal.timeout(30_000) });
      if (!response.ok || Number(response.headers.get('content-length')) !== file.bytes) throw new Error(`Published image mismatch: ${file.path}`);
    }
  }
  console.log(`Verified ${manifest.files.length} local assets`);
  if (remote) console.log(process.argv.includes('--database-only') ? 'Remote database verified; public assets were not checked' : 'Remote database and public assets verified');
}
main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : 'Verification failed'); process.exitCode = 1; });
