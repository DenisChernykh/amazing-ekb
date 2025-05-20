import { PostRepository } from "@/ports/PostRepository";
import { ValidatePostDataUseCase } from "./ValidatePostDataUseCase";
import { ResolveCategoryUseCase } from "./ResolveCategoryUseCase";
import { CheckDuplicateUseCase } from "./CheckDuplicateUseCase";

interface Dependencies {
	postRepo: PostRepository
	duplicateChecker: CheckDuplicateUseCase
	categoryResolver: ResolveCategoryUseCase
}

export class CreatePostUseCase {

	private readonly validatePostData = new ValidatePostDataUseCase()
	constructor(private readonly deps: Dependencies) { }
	async exexute(formData: FormData) {
		const validated = this.validatePostData.execute(formData)
		if (validated.telegramPost) {
			await this.deps.duplicateChecker.execute(validated.telegramPost)

		}
		const categoryId = await this.deps.categoryResolver.execute(validated.category)
		await this.deps.postRepo.create({
			title: validated.title,
			price: validated.price,
			mapUrl: validated.mapUrl,
			categoryId,
			telegramPostId: validated.telegramPost
		})
	}

}


