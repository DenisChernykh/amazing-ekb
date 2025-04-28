
import { PostsContext } from "@/context/posts-context";
import { useContext } from "react";

export function usePosts() {
	const context = useContext(PostsContext);
	if (context === undefined) {
		throw new Error('useCategories must be used within a CategoriesProvider');
	}
	return { ...context, posts: context.posts || [] };
}