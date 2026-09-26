import { CloudflareCategoryRepository, CloudflareImageRepository, CloudflarePostRepository } from '@/adapters/cloudflare/repositories';
import { CategoryRepository } from '@/ports/CategoryRepository';
import { ImageRepository } from '@/ports/ImageRepository';
import { PostRepository } from '@/ports/PostRepository';

export const postRepo: PostRepository = new CloudflarePostRepository();
export const categoryRepo: CategoryRepository = new CloudflareCategoryRepository();
export const imageRepo: ImageRepository = new CloudflareImageRepository();
