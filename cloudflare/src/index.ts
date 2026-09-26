import { z } from 'zod';
import {
  createCategorySchema, createPostSchema, idSchema, importPostSchema, profileInputSchema,
  type DataErrorCode,
} from '../../src/shared/data-contracts';

type Bindings = Env & { APP_API_TOKEN: string; IMPORT_API_TOKEN: string };
type ImageRow = { id: string; telegramPostId: string | null; path: string; altText: string | null; mainImage: number };
type TelegramRow = { id: string; text: string; date: string; postLink: string };
type PostRow = { id: string; title: string; price: string; mapUrl: string; categoryId: string; categoryName: string; telegramPostId: string };

class ApiError extends Error {
  constructor(readonly code: DataErrorCode, readonly status = 400) { super(code); }
}
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
const ok = (data: unknown) => json({ success: true, data });

async function matchesToken(received: string, expected?: string) {
  if (!expected || expected.length < 32) return false;
  const digest = (value: string) => crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  const [a, b] = await Promise.all([digest(received), digest(expected)]);
  return crypto.subtle.timingSafeEqual(a, b);
}

async function readBody<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new ApiError('VALIDATION_ERROR', 415);
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError('VALIDATION_ERROR');
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 256_000) { await reader.cancel(); throw new ApiError('VALIDATION_ERROR', 413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return schema.parse(JSON.parse(new TextDecoder().decode(bytes))); }
  catch { throw new ApiError('VALIDATION_ERROR'); }
}

async function telegramPosts(db: D1Database, visibleOnly = false) {
  const posts = await db.prepare(`SELECT id, text, date, postLink FROM TelegramPost ${visibleOnly ? 'WHERE isHidden = 0 AND NOT EXISTS (SELECT 1 FROM Post WHERE Post.telegramPostId = TelegramPost.id)' : ''} ORDER BY date DESC`).all<TelegramRow>();
  const images = await db.prepare('SELECT id, telegramPostId, path, altText, mainImage FROM Image ORDER BY mainImage DESC, createdAt, id').all<ImageRow>();
  const grouped = new Map<string, ReturnType<typeof mapImage>[]>();
  for (const image of images.results) {
    if (!image.telegramPostId) continue;
    const list = grouped.get(image.telegramPostId) ?? [];
    list.push(mapImage(image));
    grouped.set(image.telegramPostId, list);
  }
  return posts.results.map((post) => ({ ...post, images: grouped.get(post.id) ?? [] }));
}
const mapImage = (image: ImageRow) => ({ id: image.id, path: image.path, altText: image.altText, mainImage: image.mainImage === 1 });

async function route(request: Request, env: Bindings): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  if (path === '/health' && request.method === 'GET') return ok({ service: 'amazing-ekb-data', environment: env.DEPLOYMENT_ENV });
  if (!path.startsWith('/v1/')) return new Response('Not found', { status: 404 });
  const isImport = path.startsWith('/v1/import/');
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '') ?? '';
  if (!await matchesToken(token, isImport ? env.IMPORT_API_TOKEN : env.APP_API_TOKEN)) throw new ApiError('UNAUTHORIZED', 401);
  if (String(env.READ_ONLY) === 'true' && !['GET', 'HEAD'].includes(request.method)) throw new ApiError('READ_ONLY', 503);
  const db = env.DB;
  const now = new Date().toISOString();

  if (path === '/v1/posts' && request.method === 'GET') {
    const [rows, telegram] = await Promise.all([
      db.prepare('SELECT p.id, p.title, p.price, p.mapUrl, p.categoryId, c.name AS categoryName, p.telegramPostId FROM Post p JOIN Category c ON c.id = p.categoryId JOIN TelegramPost t ON t.id = p.telegramPostId ORDER BY t.date DESC').all<PostRow>(),
      telegramPosts(db),
    ]);
    const byId = new Map(telegram.map((post) => [post.id, post]));
    return ok(rows.results.map((row) => ({ id: row.id, title: row.title, price: row.price, mapUrl: row.mapUrl,
      category: { id: row.categoryId, name: row.categoryName }, telegramPost: byId.get(row.telegramPostId) })));
  }
  if (path === '/v1/posts' && request.method === 'POST') {
    const data = await readBody(request, createPostSchema);
    const id = crypto.randomUUID();
    await db.prepare('INSERT INTO Post (id, createdAt, updatedAt, title, price, mapUrl, categoryId, telegramPostId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, now, now, data.title, data.price, data.mapUrl, data.categoryId, data.telegramPostId).run();
    return ok({ id });
  }
  if (path === '/v1/categories' && request.method === 'GET') {
    const name = url.searchParams.get('name');
    if (name !== null) {
      const category = await db.prepare('SELECT id, name FROM Category WHERE name = ?').bind(name).first();
      if (!category) throw new ApiError('CATEGORY_NOT_FOUND', 404);
      return ok(category);
    }
    return ok((await db.prepare('SELECT id, name FROM Category ORDER BY name').all()).results);
  }
  if (path === '/v1/categories' && request.method === 'POST') {
    const data = await readBody(request, createCategorySchema);
    const id = crypto.randomUUID();
    try { await db.prepare('INSERT INTO Category (id, createdAt, updatedAt, name) VALUES (?, ?, ?, ?)').bind(id, now, now, data.name).run(); }
    catch (error) {
      if (error instanceof Error && error.message.includes('UNIQUE constraint')) throw new ApiError('CATEGORY_ALREADY_EXISTS', 409);
      throw error;
    }
    return ok({ id });
  }
  if (path === '/v1/telegram-posts' && request.method === 'GET') return ok(await telegramPosts(db, true));
  if (path === '/v1/images' && request.method === 'GET') {
    const postId = idSchema.parse(url.searchParams.get('postId'));
    const images = await db.prepare('SELECT id, path, altText, mainImage FROM Image WHERE telegramPostId = (SELECT telegramPostId FROM Post WHERE id = ?) ORDER BY mainImage DESC, createdAt, id').bind(postId).all<ImageRow>();
    return ok(images.results.map(mapImage));
  }
  const mainMatch = path.match(/^\/v1\/images\/([^/]+)\/main$/);
  if (mainMatch && request.method === 'PATCH') {
    const id = idSchema.parse(decodeURIComponent(mainMatch[1]));
    const image = await db.prepare('SELECT telegramPostId FROM Image WHERE id = ?').bind(id).first<{ telegramPostId: string | null }>();
    if (!image) throw new ApiError('IMAGE_NOT_FOUND', 404);
    if (!image.telegramPostId) throw new ApiError('IMAGE_NOT_LINKED_TO_POST');
    // A single statement preserves exactly one main image, including concurrent requests.
    await db.prepare('UPDATE Image SET mainImage = CASE WHEN id = ? THEN 1 ELSE 0 END, updatedAt = ? WHERE telegramPostId = (SELECT telegramPostId FROM Image WHERE id = ?)').bind(id, now, id).run();
    return ok({ id });
  }
  if (path === '/v1/profiles' && request.method === 'POST') {
    const data = await readBody(request, profileInputSchema);
    await db.prepare(`INSERT INTO Profile (id, telegramId, firstName, lastName, username, avatar, role, createdAt, updatetAd)
      VALUES (?, ?, ?, ?, ?, ?, 'USER', ?, ?) ON CONFLICT(telegramId) DO UPDATE SET
      firstName = excluded.firstName, lastName = excluded.lastName, username = excluded.username, avatar = excluded.avatar, updatetAd = excluded.updatetAd`)
      .bind(crypto.randomUUID(), data.telegramId, data.firstName, data.lastName ?? null, data.username ?? null, data.avatar ?? null, now, now).run();
    return ok(await db.prepare('SELECT * FROM Profile WHERE telegramId = ?').bind(data.telegramId).first());
  }
  const profileMatch = path.match(/^\/v1\/profiles\/([^/]+)$/);
  if (profileMatch && request.method === 'GET') return ok(await db.prepare('SELECT * FROM Profile WHERE id = ?').bind(idSchema.parse(decodeURIComponent(profileMatch[1]))).first());
  if (path === '/v1/import/images' && request.method === 'GET') return ok((await db.prepare('SELECT path FROM Image ORDER BY path').all<{ path: string }>()).results.map((row) => row.path));
  if (path === '/v1/import/telegram-post' && request.method === 'POST') {
    const data = await readBody(request, importPostSchema);
    for (const image of data.images) {
      const asset = await env.ASSETS.fetch(new Request(new URL(image.path, url.origin), { method: 'HEAD' }));
      if (!asset.ok) throw new ApiError('ASSET_NOT_PUBLISHED', 409);
    }
    const statements = [db.prepare(`INSERT INTO TelegramPost (id, text, date, postLink) VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET text = excluded.text, date = excluded.date, postLink = excluded.postLink`).bind(data.id, data.text, data.date, data.postLink)];
    for (const image of data.images) {
      statements.push(db.prepare(`INSERT INTO Image (id, createdAt, updatedAt, telegramPostId, path, altText, mainImage)
        VALUES (?, ?, ?, ?, ?, ?, CASE WHEN EXISTS(SELECT 1 FROM Image WHERE telegramPostId = ? AND mainImage = 1) THEN 0 ELSE 1 END)
        ON CONFLICT(path) DO NOTHING`).bind(crypto.randomUUID(), now, now, data.id, image.path, image.altText ?? null, data.id));
    }
    await db.batch(statements);
    return ok({ id: data.id });
  }
  throw new ApiError('NOT_FOUND', 404);
}

export default {
  async fetch(request, env) {
    try { return await route(request, env); }
    catch (error) {
      if (error instanceof ApiError) return json({ success: false, error: error.code }, error.status);
      if (error instanceof z.ZodError || error instanceof URIError) return json({ success: false, error: 'VALIDATION_ERROR' }, 400);
      const message = error instanceof Error ? error.message : '';
      if (message.includes('IMAGE_PATH_CONFLICT')) return json({ success: false, error: 'UNIQUE_CONSTRAINT_VIOLATION' }, 409);
      if (message.includes('UNIQUE constraint')) return json({ success: false, error: 'UNIQUE_CONSTRAINT_VIOLATION' }, 409);
      if (message.includes('FOREIGN KEY constraint')) return json({ success: false, error: 'FOREIGN_KEY_VIOLATION' }, 409);
      console.error(JSON.stringify({ event: 'data_api_error', path: new URL(request.url).pathname, type: error instanceof Error ? error.name : 'Unknown' }));
      return json({ success: false, error: 'DATABASE_ERROR' }, 500);
    }
  },
} satisfies ExportedHandler<Bindings>;
