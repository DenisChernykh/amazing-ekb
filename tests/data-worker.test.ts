import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { snapshotToSql, type Snapshot } from '../scripts/cloudflare/migration';
import { normalizeImagePath } from '../src/shared/data-contracts';

const appToken = 'app-test-secret-at-least-32-characters';
const importToken = 'import-test-secret-at-least-32-characters';
const timestamp = '2026-09-26T10:00:00.000Z';
const audit = { createdAt: timestamp, updatedAt: timestamp };
const snapshot: Snapshot = {
  version: 1, exportedAt: timestamp,
  tables: {
    Category: [{ id: 'category', ...audit, name: 'Кофе' }],
    Profile: [{ id: 'old-cuid', telegramId: '123', firstName: 'Денис', lastName: null, username: null, avatar: null, role: 'ADMIN', createdAt: timestamp, updatetAd: timestamp }],
    TelegramPost: [{ id: 'tg', text: "Текст 'кофе';\n☕", date: timestamp, postLink: 'https://t.me/example/1', isHidden: true, postId: null }],
    Post: [{ id: 'post', ...audit, title: 'Кафе', price: '100–200', mapUrl: 'https://maps.example', categoryId: 'category', telegramPostId: 'tg' }],
    Image: [
      { id: 'photo-1', ...audit, telegramPostId: 'tg', path: '/one.jpg', altText: 'Первое', mainImage: true },
      { id: 'photo-2', ...audit, telegramPostId: 'tg', path: '/two.jpg', altText: null, mainImage: false },
    ],
  },
};
let mf: Miniflare;
before(async () => {
  mf = new Miniflare(convertV4MiniflareOptions({ workers: [{
    name: 'data',
    modules: true, scriptPath: 'cloudflare/.wrangler/build/index.js',
    compatibilityDate: '2026-09-26', compatibilityFlags: ['nodejs_compat'],
    d1Databases: ['DB'], bindings: { APP_API_TOKEN: appToken, IMPORT_API_TOKEN: importToken, READ_ONLY: 'false' },
    serviceBindings: { ASSETS: (request) => new Response(null, { status: new URL(request.url).pathname.includes('missing') ? 404 : 200 }) },
  }] }));
  const db = await mf.getD1Database('DB');
  const schema = await readFile('cloudflare/migrations/0001_initial.sql', 'utf8');
  for (const statement of schema.split(';').filter((s) => s.trim())) await db.prepare(statement).run();
  await db.prepare(await readFile('cloudflare/migrations/0002_image_path_ownership.sql', 'utf8')).run();
  for (const statement of snapshotToSql(snapshot).split(';').filter((s) => s.trim())) await db.prepare(statement).run();
});
after(async () => { await mf?.dispose(); });

const request = (path: string, method = 'GET', body?: unknown, token = appToken) => mf.dispatchFetch(`https://worker.test${path}`, {
  method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

test('migration preserves IDs, Unicode, dates, roles and relationships', async () => {
  const response = await request('/v1/posts');
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.data[0].id, 'post');
  assert.equal(result.data[0].telegramPost.text, snapshot.tables.TelegramPost[0].text);
  assert.equal(result.data[0].telegramPost.date, timestamp);
  assert.equal(result.data[0].telegramPost.images[0].path, '/images/one.jpg');
  assert.equal((await (await request('/v1/profiles/old-cuid')).json()).data.role, 'ADMIN');
  assert.deepEqual((await (await request('/v1/telegram-posts')).json()).data, []);
  assert.equal((await (await request('/v1/images?postId=post')).json()).data.length, 2);
});

test('service tokens are mandatory and import token cannot access profiles', async () => {
  assert.equal((await request('/v1/posts', 'GET', undefined, '')).status, 401);
  assert.equal((await request('/v1/profiles/old-cuid', 'GET', undefined, importToken)).status, 401);
  assert.equal((await request('/v1/import/images')).status, 401);
  assert.equal((await request('/v1/import/images', 'GET', undefined, importToken)).status, 200);
});

test('place selector excludes hidden and already linked Telegram posts', async () => {
  const db = await mf.getD1Database('DB');
  await db.prepare('UPDATE TelegramPost SET isHidden = 0 WHERE id = ?').bind('tg').run();
  await db.prepare('INSERT INTO TelegramPost (id, text, date, postLink) VALUES (?, ?, ?, ?)').bind('available', 'Available', timestamp, 'https://t.me/example/99').run();
  assert.deepEqual((await (await request('/v1/telegram-posts')).json()).data.map((p: { id: string }) => p.id), ['available']);
  await db.prepare('UPDATE TelegramPost SET isHidden = 1 WHERE id = ?').bind('tg').run();
});

test('profile refresh preserves existing admin role and rejects role injection', async () => {
  const profile = await request('/v1/profiles', 'POST', { telegramId: '123', firstName: 'Обновлён' });
  const result = await profile.json();
  assert.equal(result.data.id, 'old-cuid');
  assert.equal(result.data.role, 'ADMIN');
  assert.equal((await request('/v1/profiles', 'POST', { telegramId: '456', firstName: 'User', role: 'ADMIN' })).status, 400);
  assert.equal((await (await request('/v1/profiles', 'POST', { telegramId: '456', firstName: 'User' })).json()).data.role, 'USER');
});

test('concurrent main-image changes leave exactly one main; invalid ID changes nothing', async () => {
  await Promise.all([request('/v1/images/photo-1/main', 'PATCH'), request('/v1/images/photo-2/main', 'PATCH')]);
  const db = await mf.getD1Database('DB');
  assert.equal(await db.prepare('SELECT COUNT(*) AS n FROM Image WHERE telegramPostId = ? AND mainImage = 1').bind('tg').first('n'), 1);
  await request('/v1/images/photo-2/main', 'PATCH');
  assert.equal((await request('/v1/images/not-there/main', 'PATCH')).status, 404);
  assert.equal(await db.prepare('SELECT mainImage FROM Image WHERE id = ?').bind('photo-2').first('mainImage'), 1);
});

test('repeat import is idempotent and preserves selected image and hidden flag', async () => {
  await request('/v1/images/photo-2/main', 'PATCH');
  const input = { id: 'tg', text: 'Updated', date: timestamp, postLink: 'https://t.me/example/1', images: [{ path: '/images/one.jpg' }, { path: '/images/two.jpg' }] };
  for (let n = 0; n < 2; n++) assert.equal((await request('/v1/import/telegram-post', 'POST', input, importToken)).status, 200);
  const db = await mf.getD1Database('DB');
  assert.equal(await db.prepare('SELECT COUNT(*) AS n FROM Image WHERE telegramPostId = ?').bind('tg').first('n'), 2);
  assert.equal(await db.prepare('SELECT mainImage FROM Image WHERE id = ?').bind('photo-2').first('mainImage'), 1);
  assert.equal(await db.prepare('SELECT isHidden FROM TelegramPost WHERE id = ?').bind('tg').first('isHidden'), 1);
});

test('missing assets prevent any database changes', async () => {
  const response = await request('/v1/import/telegram-post', 'POST', { id: 'new-missing', text: '', date: timestamp, postLink: 'https://t.me/example/2', images: [{ path: '/images/missing.jpg' }] }, importToken);
  assert.equal(response.status, 409);
  const db = await mf.getD1Database('DB');
  assert.equal(await db.prepare('SELECT id FROM TelegramPost WHERE id = ?').bind('new-missing').first(), null);
});

test('an image belonging to another post aborts the complete import', async () => {
  const response = await request('/v1/import/telegram-post', 'POST', { id: 'collision', text: '', date: timestamp, postLink: 'https://t.me/example/4', images: [{ path: '/images/unique.jpg' }, { path: '/images/one.jpg' }] }, importToken);
  assert.equal(response.status, 409);
  const db = await mf.getD1Database('DB');
  assert.equal(await db.prepare('SELECT id FROM TelegramPost WHERE id = ?').bind('collision').first(), null);
  assert.equal(await db.prepare('SELECT id FROM Image WHERE path = ?').bind('/images/unique.jpg').first(), null);
  assert.equal(await db.prepare('SELECT telegramPostId FROM Image WHERE path = ?').bind('/images/one.jpg').first('telegramPostId'), 'tg');
});

test('D1 batch rolls back post and earlier images when a later insert fails', async () => {
  const db = await mf.getD1Database('DB');
  await db.prepare("CREATE TRIGGER reject_test_image BEFORE INSERT ON Image WHEN NEW.path = '/images/reject.jpg' BEGIN SELECT RAISE(ABORT, 'test failure'); END").run();
  const response = await request('/v1/import/telegram-post', 'POST', { id: 'rolled-back', text: '', date: timestamp, postLink: 'https://t.me/example/3', images: [{ path: '/images/good.jpg' }, { path: '/images/reject.jpg' }] }, importToken);
  assert.equal(response.status, 500);
  assert.equal(await db.prepare('SELECT id FROM TelegramPost WHERE id = ?').bind('rolled-back').first(), null);
  assert.equal(await db.prepare('SELECT id FROM Image WHERE path = ?').bind('/images/good.jpg').first(), null);
});

test('maps relational conflicts and validates input', async () => {
  assert.equal((await request('/v1/categories', 'POST', { name: 'Кофе' })).status, 409);
  assert.equal((await request('/v1/posts', 'POST', { title: 'X', price: '1', mapUrl: 'https://maps.example', categoryId: 'absent', telegramPostId: 'tg' })).status, 409);
  assert.equal((await request('/v1/categories', 'POST', { name: '' })).status, 400);
});

test('normalizes historic paths and refuses traversal and migration collisions', () => {
  assert.equal(normalizeImagePath('https://hqajvfrvzozkuqhnxdyl.supabase.co/storage/v1/object/public/post-images/one.jpg'), '/images/one.jpg');
  assert.throws(() => normalizeImagePath('../secrets'));
  const invalid = structuredClone(snapshot);
  invalid.tables.Image[1].path = '/images/one.jpg';
  assert.throws(() => snapshotToSql(invalid), /collision/);
});

test('maintenance mode keeps reads available and rejects both kinds of writes', async () => {
  const readonly = new Miniflare(convertV4MiniflareOptions({
    modules: true, scriptPath: 'cloudflare/.wrangler/build/index.js',
    compatibilityDate: '2026-09-26', compatibilityFlags: ['nodejs_compat'],
    d1Databases: ['DB'], bindings: { APP_API_TOKEN: appToken, IMPORT_API_TOKEN: importToken, READ_ONLY: 'true' },
  }));
  try {
    const db = await readonly.getD1Database('DB');
    const schema = await readFile('cloudflare/migrations/0001_initial.sql', 'utf8');
    for (const statement of schema.split(';').filter(s => s.trim())) await db.prepare(statement).run();
    assert.equal((await readonly.dispatchFetch('https://worker.test/v1/posts', { headers: { Authorization: `Bearer ${appToken}` } })).status, 200);
    for (const [path, token] of [['categories', appToken], ['import/telegram-post', importToken]]) {
      const response = await readonly.dispatchFetch(`https://worker.test/v1/${path}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      assert.equal(response.status, 503);
      assert.equal((await response.json()).error, 'READ_ONLY');
    }
  } finally { await readonly.dispose(); }
});
