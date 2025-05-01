import PostsList from "@/components/features/posts/PostsList";
import { getPosts } from "@/repositories";


export default async function Home() {
  const posts = (await getPosts()) || [];

  return (
    <div className="container mx-auto p-4">
      <PostsList initialPosts={posts} />
    </div>
  );
}
