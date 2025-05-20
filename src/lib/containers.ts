import prisma from "@/utils/db";

import { PrismaPostRepository } from "@/adapters/PrismaPostRepository";
import { PrismaPostDuplicateChecker } from "@/adapters/PrismaPostDuplicateChecker";
import { PrismaCategoryResolver } from "@/adapters/PrismaCategoryResolver";

import { PostRepository } from "@/ports/PostRepository";
import { PostDuplicateChecker } from "@/ports/PostDuplicateChecker";
import { CategoryResolver } from "@/ports/CategoryResolver";

import { CheckDuplicateUseCase } from "@/use-cases/CheckDuplicateUseCase";
import { ResolveCategoryUseCase } from "@/use-cases/ResolveCategoryUseCase";
import { CreatePostUseCase } from "@/use-cases/CreatePostUseCase";

// Адаптеры
const postRepo: PostRepository = new PrismaPostRepository(prisma);
const postDuplicateChecker: PostDuplicateChecker = new PrismaPostDuplicateChecker(prisma);
const categoryResolver: CategoryResolver = new PrismaCategoryResolver(prisma);

// Use-cases
const checkDuplicateUseCase = new CheckDuplicateUseCase(postDuplicateChecker);
const resolveCategoryUseCase = new ResolveCategoryUseCase(categoryResolver);

const createPostUseCase = new CreatePostUseCase({
  postRepo,
  duplicateChecker: checkDuplicateUseCase,
  categoryResolver: resolveCategoryUseCase,
});

export const container = {
  postRepo,
  postDuplicateChecker,
  categoryResolver,
  checkDuplicateUseCase,
  resolveCategoryUseCase,
  createPostUseCase,
};