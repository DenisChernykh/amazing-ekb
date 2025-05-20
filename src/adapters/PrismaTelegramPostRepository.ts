
import { ImageInput, TelegramPostRepository, UpsertTelegramPostInput } from "@/ports/TelegramPostRepository";
import { PrismaClient } from "@prisma/client";

export class PrismaTelegramPostRepository implements TelegramPostRepository {
	constructor(private readonly prisma: PrismaClient) { }
	async upsertTelegramPost(data: UpsertTelegramPostInput): Promise<{ id: string }> {
		const telegramPost = await this.prisma.telegramPost.upsert({
			where: { id: data.id },
			update: {
				text: data.text,
				date: data.date,
				postLink: data.postLink,
			},
			create: {
				id: data.id,
				text: data.text,
				date: data.date,
				postLink: data.postLink
			}
		})
		return { id: telegramPost.id };
	}
	async createImages(images: ImageInput[]) {
		await this.prisma.image.createMany({
			data: images,
			skipDuplicates: true
		});
	}
}
