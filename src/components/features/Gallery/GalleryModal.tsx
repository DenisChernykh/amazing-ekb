import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import Image from 'next/image';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useRef } from 'react';
import { GalleryProps } from './Gallery';

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
    <div className=" fixed inset-0 bg-black/90 flex items-center justify-center p-4">
      <div className="container relative">
        <Swiper
          ref={swiperRef}
          modules={[Navigation]}
          style={{
            zIndex: 1,
            width: '100%',
            height: 'auto',
          }}
          loop={true}
          slidesPerView={1}
          spaceBetween={30}
          initialSlide={initialSlide}
        >
          {images?.map((image) => (
            <SwiperSlide key={image.id}>
              <div className="relative h-screen flex items-center justify-center">
                <Image
                  src={image.url}
                  alt={image.altText}
                  fill
                  className=" z-10 object-contain hover:scale-105 transition-transform duration-300"
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
          className=" absolute top-8 z-40 right-0 "
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
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20"
      >
        <ChevronLeft color={'white'} size={64} />
      </button>
      <button
        onClick={() => swiper.slideNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20"
      >
        <ChevronRight color={'white'} size={64} />
      </button>
    </>
  );
};

export default GalleryModal;
