import { PrismaPostRepository } from "@/adapters/PrismaPostRepository";
import { GetPostsUseCase } from "@/use-cases/GetPostsUseCase";
import prisma from "@/utils/db";

export async function getPosts() {
	const repo = new PrismaPostRepository(prisma)
	const useCase = new GetPostsUseCase(repo)
	return useCase.execute()
}