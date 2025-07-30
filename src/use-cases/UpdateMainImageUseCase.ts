
import { ImageRepository } from "@/ports/ImageRepository";
import { AppErrorCode, ResultType } from "@/utils/types";


export class UpdateMainImageUseCase {
	constructor(private imageRepo: ImageRepository) { }

	async execute(imageId: string): Promise<ResultType<{ id: string }, AppErrorCode>> {
		return this.imageRepo.updateMainImageAtomic(imageId)

	}
}