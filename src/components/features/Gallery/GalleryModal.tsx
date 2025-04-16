import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import Image from "next/image";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRef } from "react";
import { GalleryProps } from "./Gallery";

type GalleryModalProps = GalleryProps & {
  onCloseModal: (value: boolean) => void;
  initialSlide: number;
};
function GalleryModal({
  images,
  onCloseModal,
  initialSlide,
}: GalleryModalProps) {
  const swiperRef = useRef(null);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 p-4">
      <div className="relative container">
        <Swiper
          ref={swiperRef}
          modules={[Navigation]}
          style={{
            zIndex: 1,
            width: "100%",
            height: "auto",
          }}
          loop={true}
          slidesPerView={1}
          spaceBetween={30}
          initialSlide={initialSlide}
        >
          {images?.map((image) => (
            <SwiperSlide key={image.id}>
              <div className="relative flex h-screen items-center justify-center">
                <Image
                  src={image.imageUrl || "/placeholder-image.jpg"}
                  alt={image.altText || "alt-text"}
                  fill
                  className="z-10 object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>
            </SwiperSlide>
          ))}
          <SwiperNavButtons />
        </Swiper>
        <X
          onClick={() => onCloseModal(false)}
          color="white"
          size={48}
          className="absolute top-8 right-0 z-40"
        />
      </div>
    </div>
  );
}

const SwiperNavButtons = () => {
  const swiper = useSwiper();
  return (
    <>
      <button
        onClick={() => swiper.slidePrev()}
        className="absolute top-1/2 left-4 z-20 -translate-y-1/2"
      >
        <ChevronLeft color={"white"} size={64} />
      </button>
      <button
        onClick={() => swiper.slideNext()}
        className="absolute top-1/2 right-4 z-20 -translate-y-1/2"
      >
        <ChevronRight color={"white"} size={64} />
      </button>
    </>
  );
};

export default GalleryModal;
