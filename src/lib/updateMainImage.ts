import { PrismaPostRepository } from "@/adapters/PrismaPostRepository";
import { UpdateMainImageUseCase } from "@/use-cases/UpdateMainImageUseCase";
import prisma from "@/utils/db";


export async function updateMainImage(imageId: string) {
	const repo = new PrismaPostRepository(prisma)
	const useCase = new UpdateMainImageUseCase(repo)
	return useCase.execute(imageId)
}