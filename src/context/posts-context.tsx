"use client";

import { Post } from "@/utils/types";
import { createContext } from "react";

type PostsContextType = {
  posts: Post[] | null;
};

export const PostsContext = createContext<PostsContextType>({
  posts: null,
});
