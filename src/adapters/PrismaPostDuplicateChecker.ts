import { PostDuplicateChecker } from "@/ports/PostDuplicateChecker";
import { PrismaClient } from "@prisma/client";

export class PrismaPostDuplicateChecker implements PostDuplicateChecker {
	constructor(private readonly prisma: PrismaClient) { }
	async existsById(telegramPostId: string): Promise<boolean> {
		const post = await this.prisma.post.findUnique({
			where: { telegramPostId },
			select: { id: true }
		})
		return post !== null
	}
}