"use client";

import { useFilter } from "@/hooks/useFilter";
import { Post } from "@/utils/types";
import AdminButton from "./AdminButton";
import PostCard from "./PostCard";
import { useIsAdmin } from "@/hooks/useIsAdmin";

type PostsListProps = {
  initialPosts: Post[];
  className?: string;
};

function PostsList({ initialPosts }: PostsListProps) {
  const { category } = useFilter();
  const { isAdmin, loading } = useIsAdmin();
  const filteredPosts =
    category === "all"
      ? initialPosts
      : initialPosts.filter((post) => post.category.name === category);
  if (loading) return null;
  return (
    <>
      <AdminButton />
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:space-y-0">
        {filteredPosts.map((post) => {
          return <PostCard isAdmin={isAdmin} key={post.id} post={post} />;
        })}
      </div>
    </>
  );
}

export default PostsList;
