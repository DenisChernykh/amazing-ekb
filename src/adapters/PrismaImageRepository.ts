
import { ImageRepository } from "@/ports/ImageRepository";
import { handleRepositoryError } from "@/utils/handleRepositoryError";
import { AppErrorCode, ResultType } from "@/utils/types";
import { PrismaClient } from "@prisma/client";
import { Result } from "@/utils/result";

export class PrismaImageRepository implements ImageRepository {
	constructor(private prisma: PrismaClient) {
	}

	async findImageById(id: string): Promise<ResultType<{ id: string, telegramPostId: string }, AppErrorCode>> {
		try {
			const image = await this.prisma.image.findUnique({
				where: {
					id
				},
				select: {
					id: true,
					telegramPostId: true
				}
			})
			if (!image) {

				return Result.fail(AppErrorCode.IMAGE_NOT_FOUND)
			}
			if (!image.telegramPostId) {
				return Result.fail(AppErrorCode.IMAGE_NOT_LINKED_TO_POST)

			}
			return Result.ok({ id: image.id, telegramPostId: image.telegramPostId })
		} catch (error) {
			return handleRepositoryError(error)
		}

	}

	async resetMainImage(telegramPostId: string): Promise<ResultType<{ id: string }, AppErrorCode>> {
		try {
			await this.prisma.image.updateMany({
				where: { telegramPostId },
				data: {
					mainImage: false
				}
			})
			return Result.ok({ id: telegramPostId })
		} catch (error) {
			return handleRepositoryError(error)
		}
	}

	async setMainImage(imageId: string): Promise<ResultType<{ id: string }, AppErrorCode>> {
		try {
			await this.prisma.image.update({
				where: { id: imageId },
				data: {
					mainImage: true
				}
			})

			return Result.ok({ id: imageId })
		} catch (error) {
			return handleRepositoryError(error)
		}
	}
	async updateMainImageAtomic(imageId: string): Promise<ResultType<{ id: string }, AppErrorCode>> {
		return this.prisma.$transaction(async (tx) => {
			const image = await tx.image.findUnique({ where: { id: imageId }, select: { telegramPostId: true } })
			if (!image?.telegramPostId) {
				return Result.fail(AppErrorCode.IMAGE_NOT_LINKED_TO_POST)
			}
			await tx.image.updateMany({
				where: { telegramPostId: image.telegramPostId },
				data: {
					mainImage: false
				}
			})
			await tx.image.update({
				where: { id: imageId },
				data: {
					mainImage: true
				}
			})
			return Result.ok({ id: imageId })

		}).catch((error) => handleRepositoryError(error));
	}
}