import { Errors } from "@/lib/errors";
import { ImageRepository } from "@/ports/ImageRepository";


export class UpdateMainImageUseCase {
	constructor(private imageRepo: ImageRepository) { }

	async execute(imageId: string): Promise<void> {
		const image = await this.imageRepo.findImageById(imageId)
		if (!image || !image.telegramPostId) {
			throw Errors.Validation('Изображение не найдено или не привязано к посту')
		}
		await this.imageRepo.resetMainImage(image.telegramPostId)
		await this.imageRepo.setMainImage(imageId)

	}
}