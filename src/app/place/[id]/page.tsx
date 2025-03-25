import { getImagesById } from '@/lib/actions/post.actions';
import Image from 'next/image';

async function PlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const images = await getImagesById(id);
  console.log(images);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {images?.map((image) => (
        <div
          key={image.id}
          className="aspect-square relative rounded-lg overflow-hidden shadow-lg"
        >
          <Image
            src={image.url}
            alt={image.altText}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  );
}

export default PlacePage;
