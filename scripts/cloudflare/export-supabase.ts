import 'dotenv/config';
import { Client } from 'pg';
import { createClient } from '@supabase/supabase-js';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { normalizeImagePath } from '../../src/shared/data-contracts';
import { snapshotSchema, snapshotToSql, tableNames } from './migration';
import { downloadAsset, writeManifest } from './assets';

async function main() {
  const connectionString = process.env.SUPABASE_DB_URL;
  const base = process.env.SUPABASE_URL;
  const storageKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!connectionString || !base || !storageKey) throw new Error('Set SUPABASE_DB_URL, SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the private migration environment');
  const output = path.resolve(process.env.MIGRATION_DIR ?? `.migration/${new Date().toISOString().replace(/[:.]/g, '-')}`);
  await mkdir(output, { recursive: true, mode: 0o700 });
  const db = new Client({ connectionString });
  await db.connect();
  const tables: Record<string, unknown> = {};
  try {
    await db.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
    const actual = await db.query<{ tablename: string }>("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
    const known = new Set<string>([...tableNames, '_prisma_migrations']);
    const unexpected = actual.rows.map((row) => row.tablename).filter((name) => !known.has(name));
    if (unexpected.length) throw new Error(`Unexpected public tables; review before migration: ${unexpected.join(', ')}`);
    for (const name of tableNames) tables[name] = (await db.query(`SELECT * FROM "${name}" ORDER BY id`)).rows;
    const schema = await db.query("SELECT table_name, column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position");
    await writeFile(path.join(output, 'source-schema.json'), JSON.stringify(schema.rows, null, 2), { mode: 0o600 });
    await db.query('COMMIT');
  } finally { await db.end(); }
  const raw = JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), tables });
  // pg Date objects become canonical UTC ISO strings here.
  const snapshot = snapshotSchema.parse(JSON.parse(raw));
  const sql = snapshotToSql(snapshot);
  await writeFile(path.join(output, 'snapshot.json'), JSON.stringify(snapshot, null, 2), { mode: 0o600 });
  await writeFile(path.join(output, 'data.sql'), sql, { mode: 0o600 });

  const storage = createClient(base, storageKey, { auth: { persistSession: false } }).storage.from('post-images');
  const objectPaths = new Set<string>();
  async function list(prefix = '') {
    for (let offset = 0;; offset += 1000) {
      const { data, error } = await storage.list(prefix, { limit: 1000, offset, sortBy: { column: 'name', order: 'asc' } });
      if (error) throw new Error('Unable to list Supabase Storage');
      for (const object of data) {
        const key = prefix ? `${prefix}/${object.name}` : object.name;
        if (!object.id) await list(key); else objectPaths.add(key);
      }
      if (data.length < 1000) break;
    }
  }
  await list();
  for (const key of objectPaths) {
    const encoded = key.split('/').map(encodeURIComponent).join('/');
    await downloadAsset(new URL(`/storage/v1/object/post-images/${encoded}`, base), normalizeImagePath(key), { apikey: storageKey, Authorization: `Bearer ${storageKey}` });
  }
  const manifest = await writeManifest();
  const available = new Set(manifest.files.map((file) => file.path));
  for (const image of snapshot.tables.Image) {
    if (!available.has(normalizeImagePath(image.path))) throw new Error(`Image ${image.id} is missing from storage`);
  }
  await writeFile(path.join(output, 'asset-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(JSON.stringify({ output, rows: Object.fromEntries(tableNames.map((name) => [name, snapshot.tables[name].length])), assets: manifest.files.length, bytes: manifest.files.reduce((sum, file) => sum + file.bytes, 0) }, null, 2));
}
main().catch((error: unknown) => { console.error(error instanceof Error ? error.message.replace(/postgres(?:ql)?:\/\/\S+/g, '[redacted]') : 'Export failed'); process.exitCode = 1; });
