import { ImageType } from "@/utils/types";
import { Swiper, SwiperSlide } from "swiper/react";
import PostImage from "./PostImage";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

type PostImageGalleryProps = {
  images: ImageType[];
  altText: string;
};

const PostImageGallery = ({ images, altText }: PostImageGalleryProps) => {
  return (
    <Swiper
      className="custom-swiper"
      pagination={{ clickable: true }}
      modules={[Pagination]}
      style={{
        width: "100%",
      }}
      slidesPerView={1}
      loop={true}
    >
      {images.map((image) => {
        return (
          <SwiperSlide key={image.id}>
            <div className="relative aspect-square">
              <PostImage path={image.path} altText={altText} />
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default PostImageGallery;
