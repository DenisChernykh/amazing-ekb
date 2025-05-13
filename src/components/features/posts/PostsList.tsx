"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";

import Image from "next/image";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useFilter } from "@/hooks/useFilter";
import { Post } from "@/utils/types";
import { Link as LinkIcon, Wallet } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import AdminButton from "./AdminButton";
import { getImageUrl } from "@/utils/get-supabase-storage";

type PostsListProps = {
  initialPosts: Post[];
  className?: string;
};

function PostsList({ initialPosts }: PostsListProps) {
  const { category } = useFilter();
  console.log("Посты", initialPosts);

  const filteredPosts =
    category === "all"
      ? initialPosts
      : initialPosts.filter((post) => post.category.name === category);
  const handleMapClick = (url: string) => {
    // Можно добавить аналитику или дополнительную логику
    window.open(url, "_blank");
  };
  return (
    <>
      <AdminButton />

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:space-y-0">
        {filteredPosts.map((post) => {
          const isMainPhoto = post.telegramPost.images.find(
            (image) => image.mainImage,
          );
          console.log("isMainPhoto", isMainPhoto);

          console.log(
            getImageUrl(isMainPhoto?.path || "/placeholder-image.jpg"),
          );

          const postLink = post.telegramPost.postLink || "";
          return (
            <Card key={post.id} className="gap-4 py-0">
              <CardContent className="relative flex rounded-2xl p-0">
                <AspectRatio ratio={1 / 1}>
                  {isMainPhoto && (
                    <Image
                      className="rounded-xl object-cover"
                      fill
                      src={
                        getImageUrl(
                          isMainPhoto.path || "/placeholder-image.jpg",
                        ) || "/placeholder-image.jpg"
                      }
                      alt={isMainPhoto.altText || "Фото поста"}
                    />
                  )}
                </AspectRatio>
              </CardContent>
              <CardHeader className="grow gap-0 px-2">
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between gap-2 px-2 md:px-2">
                {post.category && (
                  <Badge variant="secondary">{post.category.name}</Badge>
                )}
                <div className="flex items-center justify-between gap-2 text-sm">
                  <div className="flex gap-2">
                    <span className="text-xs font-semibold">
                      <Wallet size={16} />
                    </span>
                    <span className="text-xs font-medium text-blue-600">
                      {post.price}
                    </span>
                  </div>
                  <span className="flex w-px self-stretch bg-gray-300"></span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex grow-1 justify-center"
                    onClick={() => handleMapClick(post.mapUrl)}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col justify-between gap-2 px-0">
                {/* <Link href={`/place/${post.id}`}>
										<Button>Галерея</Button>
									</Link> */}
                <Button
                  className="block w-full"
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
