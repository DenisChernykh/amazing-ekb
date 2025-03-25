'use client';
import Image from 'next/image';
import { useState } from 'react';
import GalleryModal from './GalleryModal';

export type GalleryProps = {
  images: Image[];
};
export type Image = {
  id: string;
  url: string;
  altText: string;
  mainPhoto: boolean | null;
};

function Gallery({ images }: GalleryProps) {
  const [modalMode, setModalMode] = useState<boolean>(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const initialSlide = images.findIndex(
    (image) => image.id === selectedImageId
  );
  const handleImageClick = (image: Image) => {
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
          className="group aspect-square relative rounded-lg overflow-hidden shadow-lg"
        >
          <Image
            onClick={() => handleImageClick(image)}
            src={image.url}
            alt={image.altText}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </>
  );
}

export default Gallery;
