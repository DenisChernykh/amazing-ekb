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
};

const PostImageGallery = ({
  images,
  isAdmin,

  altText,
}: PostImageGalleryProps) => {
  const initialMainImage = images.find((image) => image.mainImage);
  const [mainImageId, setMainImageId] = useState<string | null>(
    initialMainImage?.id ?? null,
  );

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const handleMainImageChange = async (newId: string) => {
    if (saving) return;
    const previousId = mainImageId;
    setSaving(true);
    setSaveError(null);
    setMainImageId(newId);
    try {
      const result = await updateMainImage(newId);
      if (!result.success) throw new Error(result.error);
    } catch {
      setMainImageId(previousId);
      setSaveError('Не удалось сохранить обложку. Попробуйте ещё раз.');
    } finally { setSaving(false); }
  };

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
      {saveError && <p role="alert" className="absolute bottom-0 z-20 bg-white p-2 text-sm text-red-700">{saveError}</p>}
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
