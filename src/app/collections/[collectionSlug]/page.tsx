import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalogue } from "@/lib/catalogue/server";
import { paginate, parsePage, placeCount } from "@/lib/catalogue/model";
import { CardGrid, PlaceCard } from "@/components/catalogue/cards";
import {
  ActionLink,
  Breadcrumbs,
  containerClass,
  EmptyState,
  SectionHeading,
} from "@/components/catalogue/primitives";
import { Hero, Pagination, Quote } from "@/components/catalogue/sections";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ collectionSlug: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collectionSlug } = await params;
  const { collections } = await getCatalogue();
  const collection = collections.find((item) => item.slug === collectionSlug);
  return {
    title: collection?.title ?? "Подборка не найдена",
    description: collection?.description,
  };
}
export default async function CollectionPage({ params, searchParams }: Props) {
  const [{ collectionSlug }, query, catalogue] = await Promise.all([
    params,
    searchParams,
    getCatalogue(),
  ]);
  const collection = catalogue.collections.find(
    (item) => item.slug === collectionSlug,
  );
  const page = parsePage(query.page);
  if (!collection || page === null) notFound();
  const places = collection.placeSlugs.flatMap((slug) =>
    catalogue.places.filter((place) => place.slug === slug),
  );
  const list = paginate(places, page);
  if (!list.valid) notFound();
  return (
    <>
      <Breadcrumbs
        items={[
          { title: "Подборки", href: "/collections" },
          { title: collection.title },
        ]}
      />
      <Hero
        eyebrow={collection.eyebrow}
        title={
          collection.slug === "den-dlya-sebya" ? (
            <>
              День
              <br />
              для себя.
            </>
          ) : (
            collection.title
          )
        }
        description={collection.intro}
        image={collection.cover}
        imageAlt={collection.title}
      >
        <div className="text-guide-link w-full text-[13px]">
          {placeCount(places.length)} в подборке
        </div>
        <ActionLink href="#places">Посмотреть места</ActionLink>
      </Hero>
      <Quote>{collection.quote}</Quote>
      <section
        id="places"
        className={cn(containerClass, "pt-20 pb-16 md:pt-28 md:pb-24")}
      >
        <SectionHeading
          eyebrow="В этой подборке"
          title={
            collection.slug === "den-dlya-sebya"
              ? "Есть время выдохнуть."
              : "Места, с которых можно начать."
          }
        />
        {places.length ? (
          <CardGrid>
            {list.items.map((place) => (
              <PlaceCard
                key={place.slug}
                place={place}
                categories={catalogue.categories}
              />
            ))}
          </CardGrid>
        ) : (
          <EmptyState />
        )}
        <Pagination
          page={page}
          pages={list.pages}
          basePath={`/collections/${collection.slug}`}
        />
      </section>
      <section
        className={cn(
          containerClass,
          "flex flex-col items-start justify-between gap-6 pb-16 md:flex-row md:items-center md:pb-24",
        )}
      >
        <h2 className="text-[32px] leading-[1.2] tracking-[-.035em] md:text-[44px]">
          Ещё один свободный день?
        </h2>
        <ActionLink href="/collections">Все подборки</ActionLink>
      </section>
    </>
  );
}
