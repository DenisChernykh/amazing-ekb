'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';

import { Badge } from './ui/badge';
import { useFilter } from '@/hooks/useFilter';

type Post = {
  id: string;
  title: string;
  category: Category;
  description: string;
  images: Array<{
    id: string;
    mainPhoto: boolean | null;
    url: string;
    altText: string;
  }>;
  postUrl: string;
};
type Category = { id: string; name: string };
type PostsListProps = {
  initialPosts: Post[];
  className?: string;
};

function PostsList({ initialPosts }: PostsListProps) {
  const { category } = useFilter();
  const filteredPosts =
    category === 'all'
      ? initialPosts
      : initialPosts.filter((post) => post.category.name === category);
  if (typeof window === 'undefined') return;

  return (
    <>
      <div className="space-y-4 md:space-y-0 md:grid grid-cols-3 gap-4">
        {filteredPosts.map((post) => {
          const isMainPhoto = post.images.find((image) => image.mainPhoto);
          const postLink = `https://t.me/tanya_strelchuk_blog/${post.postUrl}`;
          return (
            <Card key={post.id}>
              <CardContent className=" relative">
                <AspectRatio ratio={16 / 9}>
                  {isMainPhoto && (
                    <Image
                      fill
                      objectFit="cover"
                      src={isMainPhoto.url}
                      alt={isMainPhoto.altText}
                    />
                  )}
                </AspectRatio>
              </CardContent>
              <CardHeader>
                <CardTitle> {post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {post.category && (
                  <Badge className=" mb-4">{post.category.name}</Badge>
                )}
                <p>{post.description}</p>
              </CardContent>
              <CardFooter className=" flex justify-between mt-auto">
                <Link href={`/place/${post.id}`}>
                  <Button>Галерея</Button>
                </Link>
                <Button
                  onClick={async () => {
                    if (typeof window === 'undefined') return;
                    const WebApp = (await import('@twa-dev/sdk')).default;
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
