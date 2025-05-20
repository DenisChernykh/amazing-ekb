"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import PostMeta from "./PostMeta";
import PostAction from "./PostAction";
import { Post } from "@/utils/types";
import { Badge } from "@/components/ui/badge";
import PostImageGallery from "./PostImageGallery";

type PostCardProps = {
  post: Post;
};

const PostCard = ({ post }: PostCardProps) => {
  const sortedImages = [
    ...post.telegramPost.images.filter((img) => img.mainImage),
    ...post.telegramPost.images.filter((img) => !img.mainImage),
  ];
  return (
    <Card className="gap-4 py-0">
      <CardContent className="relative flex rounded-2xl p-0">
        <PostImageGallery images={sortedImages} altText={post.title} />
      </CardContent>
      <CardHeader className="grow gap-0 px-2">
        <CardTitle>{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-2 px-2 md:px-2">
        {post.category && (
          <Badge variant="secondary">{post.category.name}</Badge>
        )}
        <PostMeta mapUrl={post.mapUrl} price={post.price} />
      </CardContent>
      <CardFooter className="flex flex-col justify-between gap-2 px-0">
        <PostAction postLink={post.telegramPost.postLink} />
      </CardFooter>
    </Card>
  );
};

export default PostCard;
