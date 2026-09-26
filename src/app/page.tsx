import AuthInitClient from "@/components/features/auth/AuthInitClient";
import PostsList from "@/components/features/posts/PostsList";
import { getPostsUseCase } from "@/di";

export default async function Home() {
  const postResult = await getPostsUseCase.execute();
  if (!postResult.success) throw new Error(postResult.error);
  const posts = postResult.data;

  return (
    <div className="container mx-auto p-4">
      <AuthInitClient />
      <PostsList initialPosts={posts} />
    </div>
  );
}
