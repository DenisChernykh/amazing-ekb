import { createPostUseCase } from "@/di/useCases";




export async function createPost(formData: FormData) {

	return createPostUseCase.execute(formData)
}