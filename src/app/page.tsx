import PostsList from '@/components/PostsList';
import { getPosts } from '@/lib/actions/post.actions';

export default async function Home() {
  const posts = (await getPosts()) || [];

  return (
    <div className="mx-auto p-4 container ">
      <PostsList initialPosts={posts} />
    </div>
  );
}
