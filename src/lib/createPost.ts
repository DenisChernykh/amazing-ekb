
import { createPostUseCase } from "./useCases";


export async function createPost(formData: FormData) {

	return createPostUseCase.exexute(formData)
}