import { PostRepository } from "@/ports/PostRepository";
import { ValidatePostDataUseCase } from "./ValidatePostDataUseCase";
import { CategoryResolver } from "@/ports/CategoryResolver";

interface Dependencies {
	postRepo: PostRepository
	categoryResolver: CategoryResolver
}

export class CreatePostUseCase {

	private readonly validatePostData = new ValidatePostDataUseCase()
	constructor(private readonly deps: Dependencies) { }
	async execute(formData: FormData) {
		const validated = this.validatePostData.execute(formData)
		const categoryId = await this.deps.categoryResolver.resolve(validated.category)
		await this.deps.postRepo.create({
			title: validated.title,
			price: validated.price,
			mapUrl: validated.mapUrl,
			categoryId,
			telegramPostId: validated.telegramPost
		})
	}

}


