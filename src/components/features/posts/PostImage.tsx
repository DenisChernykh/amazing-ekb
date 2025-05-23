import { getImageUrl } from "@/utils/get-supabase-storage";

import Image from "next/image";
import { useState } from "react";

type PostImageProps = {
  path?: string;
  altText?: string;
};

const PostImage = ({ path, altText }: PostImageProps) => {
  const src = path ? getImageUrl(path) : "/placeholder-image.jpg";
  const alt = altText ? altText : "Фото поста";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  return (
    <>
      {isLoading && (
        <div className="bg-muted absolute inset-0 aspect-square animate-pulse rounded-xl" />
      )}
      <Image
        className="rounded-xl object-cover"
        fill
        src={src}
        alt={alt}
        role="img"
        aria-label="Фото поста"
        onLoadingComplete={() => setIsLoading(false)}
      />
    </>
  );
};

export default PostImage;
