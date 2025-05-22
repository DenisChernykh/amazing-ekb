

import { getPostsUseCase } from "@/di/useCases";
import { withErrorHandling } from "./withErrorHandling";
import { Post, Result } from "@/utils/types";

export async function getPosts(): Promise<Result<Post[]>> {

	return withErrorHandling(() => getPostsUseCase.execute())
}