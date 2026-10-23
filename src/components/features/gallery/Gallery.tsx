"use client";

import { useState } from "react";
import GalleryModal from "./GalleryModal";
import { type ImageType } from "@/utils/types";
import Image from "next/image";
import { getImageUrl } from '@/utils/image-url';

export type GalleryProps = {
  images: ImageType[];
};

function Gallery({ images }: GalleryProps) {
  const [modalMode, setModalMode] = useState<boolean>(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const initialSlide = images.findIndex(
    (image) => image.id === selectedImageId,
  );
  const handleImageClick = (image: ImageType) => {
    setSelectedImageId(image.id);
    setModalMode(true);
  };

  if (modalMode) {
    return (
      <GalleryModal
        initialSlide={initialSlide}
        onCloseModal={setModalMode}
        images={images}
      />
    );
  }
  return (
    <>
      {images?.map((image) => (
        <div
          key={image.id}
          className="group relative aspect-square overflow-hidden rounded-lg shadow-lg"
        >
          <Image
            onClick={() => handleImageClick(image)}
            src={getImageUrl(image.path)}
            alt={image.altText || "Image description not available"}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      ))}
    </>
  );
}

export default Gallery;
