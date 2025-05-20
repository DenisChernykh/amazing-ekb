


import { PostRepository } from "@/ports/PostRepository";
import { PrismaClient } from "@prisma/client";

export class PrismaPostRepository implements PostRepository {
	constructor(private prisma: PrismaClient) { }
	async getAllPosts() {
		return this.prisma.post.findMany({
			select: {
				id: true,
				title: true,
				price: true,
				mapUrl: true,
				telegramPost: {
					select: {
						postLink: true,
						id: true,
						text: true,
						date: true,
						images: {
							select: {
								path: true,
								altText: true,
								mainImage: true,
								id: true
							}
						}
					}

				},
				category: {
					select: {
						id: true,
						name: true
					}
				},


			},
			orderBy: {
				telegramPost: {
					date: "desc"
				}
			}
		})

	}
	async create(input: {
		title: string;
		price: string;
		mapUrl: string;
		categoryId: string;
		telegramPostId: string;
	}) {
		await this.prisma.post.create({ data: input })
	}
	async updateMainImage(imageId: string): Promise<{ success: boolean; message: string }> {
		try {
			const image = await this.prisma.image.findUnique({
				where: {
					id: imageId
				},
				select: {
					id: true,
					telegramPostId: true
				}
			})
			if (!image) {
				return {
					success: false,
					message: `Изображение с id ${imageId} не найдено`
				}

			}
			if (!image.telegramPostId) {
				return {
					success: false,
					message: `Изображение с id ${imageId} не привязано к посту`
				}
			}
			const telegramPostId = image.telegramPostId

			const resetResult = await this.prisma.image.updateMany({
				where: {
					telegramPostId,

				},
				data: {
					mainImage: false
				}
			})
			await this.prisma.image.update({
				where: {
					id: imageId
				},
				data: {
					mainImage: true
				}
			})
			return {
				success: true,
				message: `Главное изображения обновлено. Сброшено ${resetResult.count} изображений`
			}
		} catch (error) {
			console.error("Ошибка обновления главного изображения:", error);
			return {
				success: false,
				message: `Произошла непредвиденная ошибка при обновлении изображения`
			}
		}

	}
}