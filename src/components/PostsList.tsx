'use client';

import { useState } from 'react';
import Filter from './shared/Filter';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { AspectRatio } from './ui/aspect-ratio';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Link from 'next/link';


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
  categories: Category[];
  className?: string;
};

function PostsList({ initialPosts, categories }: PostsListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const filteredPosts = initialPosts.filter(
    (post) =>
      selectedCategory === 'all' || post.category.name === selectedCategory
  );

  return (
    <>
      <Filter
        className="mb-4"
        onFilterChange={setSelectedCategory}
        categories={categories}
      />
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
                    WebApp.openLink(postLink);
                  }}
                >Обзор на канале</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
}

export default PostsList;
