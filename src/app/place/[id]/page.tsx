import Gallery from "../../../components/features/gallery/Gallery";
import { getImagesById } from "@/repositories";

import "swiper/css";

async function PlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const images = (await getImagesById(id)) || [];
  if (!images) return null;
  return (
    <div className="container mx-auto grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <Gallery images={images} />
    </div>
  );
}

export default PlacePage;
