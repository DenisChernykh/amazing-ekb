import { PrismaCategoryRepository } from "@/adapters/PrismaCategoryRepository";
import { PrismaImageRepository } from "@/adapters/PrismaImageRepository";
import { PrismaPostRepository } from "@/adapters/PrismaPostRepository";
import { CategoryRepository } from "@/ports/CategoryRepository";
import { ImageRepository } from "@/ports/ImageRepository";
import { PostRepository } from "@/ports/PostRepository";
import prisma from "@/utils/db";

export const postRepo: PostRepository = new PrismaPostRepository(prisma);
export const categoryRepo: CategoryRepository = new PrismaCategoryRepository(prisma)
export const imageRepo: ImageRepository = new PrismaImageRepository(prisma)