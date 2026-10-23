import { z } from 'zod';
import { normalizeImagePath } from '../../src/shared/data-contracts';

export const tableNames = ['Category', 'Profile', 'TelegramPost', 'Post', 'Image'] as const;
export type TableName = typeof tableNames[number];
const timestamp = z.string().datetime();
const id = z.string().min(1);
const audit = { id, createdAt: timestamp, updatedAt: timestamp };
export const snapshotSchema = z.object({
  version: z.literal(1), exportedAt: timestamp,
  tables: z.object({
    Category: z.array(z.object({ ...audit, name: z.string() }).strict()),
    Profile: z.array(z.object({ id, telegramId: z.string(), firstName: z.string(), lastName: z.string().nullable(), username: z.string().nullable(), avatar: z.string().nullable(), role: z.enum(['ADMIN', 'USER']), createdAt: timestamp, updatetAd: timestamp }).strict()),
    TelegramPost: z.array(z.object({ id, text: z.string(), date: timestamp, postLink: z.string(), isHidden: z.boolean(), postId: z.string().nullable() }).strict()),
    Post: z.array(z.object({ ...audit, title: z.string(), categoryId: id, price: z.string(), mapUrl: z.string(), telegramPostId: id }).strict()),
    Image: z.array(z.object({ ...audit, telegramPostId: z.string().nullable(), path: z.string(), altText: z.string().nullable(), mainImage: z.boolean() }).strict()),
  }).strict(),
}).strict();
export type Snapshot = z.infer<typeof snapshotSchema>;

export function validateSnapshot(snapshot: Snapshot) {
  for (const table of tableNames) {
    const ids = snapshot.tables[table].map((row) => row.id);
    if (new Set(ids).size !== ids.length) throw new Error(`Duplicate IDs in ${table}`);
  }
  const categories = new Set(snapshot.tables.Category.map((row) => row.id));
  const telegram = new Set(snapshot.tables.TelegramPost.map((row) => row.id));
  for (const post of snapshot.tables.Post) {
    if (!categories.has(post.categoryId) || !telegram.has(post.telegramPostId)) throw new Error(`Broken references in Post ${post.id}`);
  }
  const paths = new Set<string>();
  for (const image of snapshot.tables.Image) {
    if (image.telegramPostId !== null && !telegram.has(image.telegramPostId)) throw new Error(`Broken reference in Image ${image.id}`);
    const path = normalizeImagePath(image.path);
    if (paths.has(path)) throw new Error(`Image path collision after normalization: ${path}`);
    paths.add(path);
  }
}

function sqlValue(value: string | number | boolean | null): string {
  if (value === null) return 'NULL';
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (typeof value === 'number') return String(value);
  // Hex avoids quoting, newlines, NUL bytes and SQL import parser ambiguities.
  return `CAST(X'${Buffer.from(value, 'utf8').toString('hex')}' AS TEXT)`;
}

/** Fresh database only: duplicates deliberately fail rather than overwrite a live database. */
export function snapshotToSql(snapshot: Snapshot): string {
  validateSnapshot(snapshot);
  const lines: string[] = [];
  for (const table of tableNames) {
    for (const original of snapshot.tables[table]) {
      const row = table === 'Image' && 'path' in original ? { ...original, path: normalizeImagePath(original.path) } : original;
      const entries = Object.entries(row);
      const sql = `INSERT INTO "${table}" (${entries.map(([key]) => `"${key}"`).join(',')}) VALUES (${entries.map(([, value]) => sqlValue(value)).join(',')});`;
      if (Buffer.byteLength(sql) > 95_000) throw new Error(`Row ${table}/${row.id} exceeds the D1 import statement limit`);
      lines.push(sql);
    }
  }
  return lines.join('\n') + '\n';
}
