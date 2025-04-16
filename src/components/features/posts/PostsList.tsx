"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useFilter } from "@/hooks/useFilter";
import { Category } from "@/utils/types";

type Post = {
  id: string;
  title: string;
  category: Category;
  images: Array<{
    id: string;
    mainImage: boolean | null;
    imageUrl: string | null;
    altText: string | null;
  }>;
  tgPostUrl: string;
};

type PostsListProps = {
  initialPosts: Post[];
  className?: string;
};

function PostsList({ initialPosts }: PostsListProps) {
  const { category } = useFilter();
  console.log(initialPosts);
  const filteredPosts =
    category === "all"
      ? initialPosts
      : initialPosts.filter((post) => post.category.name === category);

  return (
    <>
      <Button className="mb-4">
        <Link href={"/add-place"}>Добавить пост</Link>
      </Button>
      <div className="grid-cols-3 gap-4 space-y-4 md:grid md:space-y-0">
        {filteredPosts.map((post) => {
          const isMainPhoto = post.images.find((image) => image.mainImage);
          const postLink = post.tgPostUrl || "";
          return (
            <Card key={post.id}>
              <CardContent className="relative">
                <AspectRatio ratio={16 / 9}>
                  {isMainPhoto && (
                    <Image
                      fill
                      objectFit="cover"
                      src={isMainPhoto.imageUrl || "/placeholder-image.jpg"}
                      alt={isMainPhoto.altText || "Фото поста"}
                    />
                  )}
                </AspectRatio>
              </CardContent>
              <CardHeader>
                <CardTitle> {post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {post.category && (
                  <Badge className="mb-4">{post.category.name}</Badge>
                )}
              </CardContent>
              <CardFooter className="mt-auto flex justify-between">
                <Link href={`/place/${post.id}`}>
                  <Button>Галерея</Button>
                </Link>
                <Button
                  onClick={async () => {
                    if (typeof window === "undefined") return;
                    const WebApp = (await import("@twa-dev/sdk")).default;
                    WebApp.openTelegramLink(postLink);
                  }}
                >
                  Обзор на канале
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
}

export default PostsList;
