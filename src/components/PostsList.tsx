'use client';

import { useState } from 'react';
import Filter from './shared/Filter';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AspectRatio } from './ui/aspect-ratio';
import Image from 'next/image';
import { Badge } from './ui/badge';

type Post = {
  id: string;
  title: string;
  category: Category;
  images: Array<{
    id: string;
    mainPhoto: boolean | null;
    url: string;
    altText: string;
  }>;
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
      <div className="space-y-4 md:grid grid-cols-3 gap-4">
        {filteredPosts.map((post) => {
          const isMainPhoto = post.images.find((image) => image.mainPhoto);

          return (
            <Card key={post.id}>
              <CardContent className=" relative">
                <AspectRatio ratio={3 / 4}>
                  {isMainPhoto && (
                    <Image
                      fill
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
                {post.category && <Badge>{post.category.name}</Badge>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}

export default PostsList;
