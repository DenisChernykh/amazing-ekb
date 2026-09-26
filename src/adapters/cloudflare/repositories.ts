import { z } from 'zod';
import { CategoryRepository } from '@/ports/CategoryRepository';
import { PostRepository } from '@/ports/PostRepository';
import { ImageRepository } from '@/ports/ImageRepository';
import { CreatePostInput, createCategoryInput } from '@/utils/types';
import { categorySchema, idResultSchema, imageSchema, postSchema, profileSchema, telegramPostSchema, type ProfileInput } from '@/shared/data-contracts';
import { dataRequest } from './client';

const telegramResponse = telegramPostSchema.transform((post) => ({ ...post, date: new Date(post.date) }));
const postResponse = postSchema.transform((post) => ({ ...post, telegramPost: { ...post.telegramPost, date: new Date(post.telegramPost.date) } }));

export class CloudflarePostRepository implements PostRepository {
  getAllPosts() { return dataRequest('/v1/posts', z.array(postResponse)); }
  create(input: CreatePostInput) { return dataRequest('/v1/posts', idResultSchema, { method: 'POST', body: JSON.stringify(input) }); }
}
export class CloudflareCategoryRepository implements CategoryRepository {
  getAllCategories() { return dataRequest('/v1/categories', z.array(categorySchema)); }
  findCategoryByName(name: string) { return dataRequest(`/v1/categories?name=${encodeURIComponent(name)}`, categorySchema); }
  create(input: createCategoryInput) { return dataRequest('/v1/categories', idResultSchema, { method: 'POST', body: JSON.stringify(input) }); }
}
export class CloudflareImageRepository implements ImageRepository {
  updateMainImageAtomic(id: string) { return dataRequest(`/v1/images/${encodeURIComponent(id)}/main`, idResultSchema, { method: 'PATCH' }); }
}
export const getTelegramPostsResult = () => dataRequest('/v1/telegram-posts', z.array(telegramResponse));
export const getImagesResult = (postId: string) => dataRequest(`/v1/images?postId=${encodeURIComponent(postId)}`, z.array(imageSchema));
export const upsertProfile = (input: ProfileInput) => dataRequest('/v1/profiles', profileSchema, { method: 'POST', body: JSON.stringify(input) });
export const findProfile = (id: string) => dataRequest(`/v1/profiles/${encodeURIComponent(id)}`, profileSchema.nullable());
