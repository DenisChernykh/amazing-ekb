"use client";

import { PostsContext } from "@/context/posts-context";
import { Post } from "@/utils/types";

type PostsProviderType = {
  children: React.ReactNode;
  posts: Post[];
};
export default function PostsProvider({ posts, children }: PostsProviderType) {
  return (
    <PostsContext.Provider value={{ posts }}>{children}</PostsContext.Provider>
  );
}
