import { PostRepository } from "@/ports/PostRepository";

export class GetPostsUseCase {
	constructor(private postRepo: PostRepository) { }
	async execute() {
		return this.postRepo.getAllPosts()
	}
}