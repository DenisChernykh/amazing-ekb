import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Collection, GuideCategory, Place } from "@/lib/catalogue/types";
import { Photo, Eyebrow } from "./primitives";
import { cn } from "@/lib/utils";

export function CategoryCard({ category }: { category: GuideCategory }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      prefetch={true}
      className="group flex min-h-[148px] items-stretch overflow-hidden rounded-[24px] bg-white transition-shadow hover:shadow-[0_8px_30px_-15px_#4980cc30] md:min-h-[156px]"
    >
      <div className="relative w-[86px] shrink-0 md:w-[110px]">
        <Photo
          src={category.image}
          alt=""
          className="h-full rounded-none"
          sizes="110px"
        />
        <span className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 py-6 pr-5 pl-2 md:pl-[18px]">
        <h3 className="text-[19px] leading-[1.2] tracking-[-.025em] md:text-2xl">
          {category.title}
        </h3>
        <p className="text-muted-foreground text-xs leading-[1.55] md:text-[15px]">
          {category.description}
        </p>
      </div>
    </Link>
  );
}

export function EditorialCard({
  title,
  eyebrow,
  description,
  cover,
  href,
  wide = false,
}: {
  title: string;
  eyebrow: string;
  description: string;
  cover: string | null;
  href: string;
  wide?: boolean;
}) {
  return (
    <Link href={href} prefetch={true} className="group block h-full">
      <Photo
        src={cover}
        alt={title}
        className="h-[245px] md:h-[270px]"
        sizes={
          wide
            ? "(max-width: 767px) calc(100vw - 40px), 544px"
            : "(max-width: 767px) calc(100vw - 40px), 352px"
        }
      />
      <div className="mt-[18px]">
        <Eyebrow plain>{eyebrow}</Eyebrow>
      </div>
      <h3 className="mt-[18px] text-[25px] leading-[1.2] tracking-[-.025em] md:text-[28px]">
        {title}
      </h3>
      <p className="text-muted-foreground mt-[18px] text-[15px] leading-[1.55]">
        {description}
      </p>
      <span className="text-guide-link mt-[18px] inline-flex min-h-8 items-center gap-1 text-[13px]">
        Подробнее{" "}
        <ArrowUpRight
          size={14}
          className="transition-transform group-hover:translate-x-px group-hover:-translate-y-px"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}

export function CollectionCard({
  collection,
  wide,
}: {
  collection: Collection;
  wide?: boolean;
}) {
  return (
    <EditorialCard
      title={collection.title}
      eyebrow={collection.eyebrow}
      description={collection.description}
      cover={collection.cover}
      href={`/collections/${collection.slug}`}
      wide={wide}
    />
  );
}

export function PlaceCard({
  place,
  categories,
}: {
  place: Place;
  categories: GuideCategory[];
}) {
  return (
    <EditorialCard
      title={place.title}
      eyebrow={
        categories.find((category) => category.slug === place.categorySlugs[0])
          ?.title ?? "Место"
      }
      description={place.description}
      cover={place.cover}
      href={`/places/${place.slug}`}
      wide
    />
  );
}

export function CardGrid({
  children,
  three = false,
}: {
  children: React.ReactNode;
  three?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2",
        three && "lg:grid-cols-3",
      )}
    >
      {children}
    </div>
  );
}
