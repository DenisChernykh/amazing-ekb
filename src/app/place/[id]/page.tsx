import Gallery from '@/components/Gallery';
import { getImagesById } from '@/lib/actions/post.actions';
import 'swiper/css';

async function PlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const images = await getImagesById(id);
  if (!images) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      <Gallery images={images} />
    </div>
  );
}

export default PlacePage;
