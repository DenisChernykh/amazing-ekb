import { ImageType } from "@/utils/types";
import { Swiper, SwiperSlide } from "swiper/react";
import PostImage from "./PostImage";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import PostMainImageSwitcher from "./PostMainImageSwitcher";
import { useState } from "react";
import { updateMainImage } from "@/actions/updateMainImage";

type PostImageGalleryProps = {
  images: ImageType[];
  altText: string;
  isAdmin: boolean;
  loading: boolean;
};

const PostImageGallery = ({
  images,
  isAdmin,
  loading,
  altText,
}: PostImageGalleryProps) => {
  const initialMainImage = images.find((image) => image.mainImage);
  const [mainImageId, setMainImageId] = useState<string | null>(
    initialMainImage?.id ?? null,
  );

  const handleMainImageChange = (newId: string) => {
    setMainImageId(newId);
    void updateMainImage(newId).catch(() => {
      setMainImageId(initialMainImage?.id ?? null);
    });
  };
  if (loading) return null;
  return (
    <Swiper
      className="custom-swiper"
      pagination={{ clickable: true, hideOnClick: true }}
      modules={[Pagination]}
      style={{
        width: "100%",
      }}
      slidesPerView={1}
      loop={false}
      initialSlide={initialMainImage ? images.indexOf(initialMainImage) : 0}
    >
      {images.map((image) => {
        return (
          <SwiperSlide key={image.id}>
            <div className="relative aspect-square">
              <PostMainImageSwitcher
                isMain={image.id === mainImageId}
                onClick={() => handleMainImageChange(image.id)}
                isAdmin={isAdmin}
              />
              <PostImage path={image.path} altText={altText} />
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default PostImageGallery;
