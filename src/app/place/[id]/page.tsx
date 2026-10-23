import Gallery from "../../../components/features/gallery/Gallery";
import { getImagesById } from "@/adapters";
import { getCatalogue } from "@/lib/catalogue/server";
import { notFound, redirect } from "next/navigation";

import "swiper/css";

async function PlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalogue = await getCatalogue();
  const place = catalogue.places.find((item) => item.legacyIds?.includes(id));
  if (place) redirect(`/places/${place.slug}`);
  const images = (await getImagesById(id)) || [];
  if (!images.length) notFound();
  return (
    <div className="container mx-auto grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <Gallery images={images} />
    </div>
  );
}

export default PlacePage;
