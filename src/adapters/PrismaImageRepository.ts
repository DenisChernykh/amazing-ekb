import { ImageRepository } from "@/ports/ImageRepository";
import { PrismaClient } from "@prisma/client";

export class PrismaImageRepository implements ImageRepository {
	constructor(private prisma: PrismaClient) {
	}

	async findImageById(id: string): Promise<{ id: string; telegramPostId: string | null } | null> {
		return this.prisma.image.findUnique({
			where: {
				id
			},
			select: {
				id: true,
				telegramPostId: true
			}
		})
	}

	async resetMainImage(telegramPostId: string): Promise<void> {
		await this.prisma.image.updateMany({
			where: { id: telegramPostId },
			data: {
				mainImage: false
			}
		})
	}
	async setMainImage(imageId: string): Promise<void> {
		await this.prisma.image.update({
			where: { id: imageId },
			data: {
				mainImage: true
			}
		})
	}
}