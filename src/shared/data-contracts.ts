import { z } from 'zod';

export const idSchema = z.string().min(1).max(200);
export const assetPathSchema = z.string().regex(/^\/images\/[a-zA-Z0-9_./-]+$/)
  .refine((path) => !path.includes('//') && !path.split('/').some((part) => part === '..' || part === '.'));
export const imageSchema = z.object({
  id: idSchema, path: assetPathSchema, altText: z.string().nullable(), mainImage: z.boolean(),
});
export const categorySchema = z.object({ id: idSchema, name: z.string() });
export const telegramPostSchema = z.object({
  id: idSchema, text: z.string(), date: z.string().datetime(), postLink: z.string(),
  images: z.array(imageSchema),
});
export const postSchema = z.object({
  id: idSchema, title: z.string(), price: z.string(), mapUrl: z.string(),
  category: categorySchema, telegramPost: telegramPostSchema,
});
export const profileSchema = z.object({
  id: idSchema, telegramId: z.string(), firstName: z.string(),
  lastName: z.string().nullable(), username: z.string().nullable(), avatar: z.string().nullable(),
  role: z.enum(['USER', 'ADMIN']), createdAt: z.string(), updatetAd: z.string(),
});
export const profileInputSchema = z.object({
  telegramId: z.string().regex(/^\d+$/).max(20), firstName: z.string().min(1).max(256),
  lastName: z.string().max(256).nullable().optional(), username: z.string().max(256).nullable().optional(),
  avatar: z.string().url().max(2048).nullable().optional(),
}).strict();
export const createPostSchema = z.object({
  title: z.string().trim().min(1).max(500), price: z.string().min(1).max(200),
  mapUrl: z.string().url().max(2048), categoryId: idSchema, telegramPostId: idSchema,
}).strict();
export const createCategorySchema = z.object({ name: z.string().trim().min(1).max(200) }).strict();
export const importPostSchema = z.object({
  id: idSchema, text: z.string().max(100_000), date: z.string().datetime(),
  postLink: z.string().url().max(2048),
  images: z.array(z.object({ path: assetPathSchema, altText: z.string().max(1000).nullable().optional() }).strict()).max(40),
}).strict();
export const errorCodeSchema = z.enum([
  'CATEGORY_NOT_FOUND', 'VALIDATION_ERROR', 'UNKNOWN_ERROR', 'UNIQUE_CONSTRAINT_VIOLATION',
  'FOREIGN_KEY_VIOLATION', 'NOT_NULL_VIOLATION', 'DATABASE_CONNECTION_ERROR', 'DATABASE_ERROR',
  'IMAGE_NOT_FOUND', 'IMAGE_NOT_LINKED_TO_POST', 'CATEGORY_ALREADY_EXISTS', 'UNAUTHORIZED',
  'FORBIDDEN', 'NOT_FOUND', 'ASSET_NOT_PUBLISHED', 'READ_ONLY',
]);
export const errorResponseSchema = z.object({ success: z.literal(false), error: errorCodeSchema });
export const idResultSchema = z.object({ id: idSchema });
export type Profile = z.infer<typeof profileSchema>;
export type ProfileInput = z.infer<typeof profileInputSchema>;
export type ImportPost = z.infer<typeof importPostSchema>;
export type DataErrorCode = z.infer<typeof errorCodeSchema>;

/** Canonical key for both historical Supabase paths and local /images paths. */
export function normalizeImagePath(input: string): string {
  let path = input;
  if (/^https?:\/\//.test(path)) {
    const url = new URL(path);
    const marker = '/storage/v1/object/public/post-images/';
    if (!url.pathname.startsWith(marker)) throw new Error('Unsupported historical image URL');
    path = decodeURIComponent(url.pathname.slice(marker.length));
  }
  path = path.replace(/^\/+/, '').replace(/^images\//, '');
  return assetPathSchema.parse(`/images/${path}`);
}
