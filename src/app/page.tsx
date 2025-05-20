import { getPosts } from "@/adapters";
import AuthInitClient from "@/components/features/auth/AuthInitClient";
import PostsList from "@/components/features/posts/PostsList";


export default async function Home() {
  const posts = (await getPosts()) || [];

  return (
    <div className="container mx-auto p-4">
      <AuthInitClient />
      <PostsList initialPosts={posts} />
    </div>
  );
}
