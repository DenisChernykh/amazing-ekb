import PostsList from '@/components/PostsList';

import { getCategories } from '@/lib/actions/category.actions';
import { getPosts } from '@/lib/actions/post.actions';

export default async function Home() {
  const categories = (await getCategories()) || [];
  const posts = (await getPosts()) || [];

  return (
    <div className="mx-auto p-4 container ">
      <PostsList initialPosts={posts} categories={categories} />
    </div>
  );
}
