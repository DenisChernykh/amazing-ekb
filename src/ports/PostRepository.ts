import { Post } from "@/utils/types";

export interface PostRepository {
	getAllPosts(): Promise<Post[]>;
	create(post: CreatePostInput): Promise<void>
	updateMainImage(imageId: string): Promise<{ success: boolean; message: string }>
}

type CreatePostInput = {
	title: string;
	price: string;
	mapUrl: string;
	categoryId: string;
	telegramPostId: string;
}
