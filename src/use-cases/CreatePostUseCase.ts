import { PostRepository } from "@/ports/PostRepository";
import { CategoryResolver } from "@/ports/CategoryResolver";
import { AppErrorCode, ResultType } from "@/utils/types";
import { CreatePostDTO } from "@/actions/post/createPost";

interface Dependencies {
	postRepo: PostRepository
	categoryResolver: CategoryResolver
}

export class CreatePostUseCase {


	constructor(private readonly deps: Dependencies) { }
	async execute(dto: CreatePostDTO): Promise<ResultType<{ id: string }, AppErrorCode>> {

		const categoryResult = await this.deps.categoryResolver.resolve(dto.category)
		if (!categoryResult.success) {
			return { success: false, error: categoryResult.error }
		}
		const categoryId = categoryResult.data
		const result = await this.deps.postRepo.create({
			title: dto.title,
			price: dto.price,
			mapUrl: dto.mapUrl,
			categoryId,
			telegramPostId: dto.telegramPost
		})
		return result
	}

}


