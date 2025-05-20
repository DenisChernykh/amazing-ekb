import { PostRepository } from "@/ports/PostRepository";

export class UpdateMainImageUseCase {
	constructor(private postRepo: PostRepository) { }
	async execute(imageId: string) {
		return this.postRepo.updateMainImage(imageId)
	}
}