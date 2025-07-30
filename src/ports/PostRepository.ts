import { AppErrorCode, CreatePostInput, Post, ResultType } from "@/utils/types";


export interface PostRepository {
	getAllPosts(): Promise<ResultType<Post[], AppErrorCode>>;
	create(post: CreatePostInput): Promise<ResultType<{ id: string }, AppErrorCode>>;
}



