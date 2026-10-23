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
import { FinalCTA, Hero, Pagination } from "@/components/catalogue/sections";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const catalogue = await getCatalogue();
  return {
    title:
      catalogue.categories.find((category) => category.slug === categorySlug)
        ?.title ?? "Категория не найдена",
  };
}
export default async function CategoryPage({ params, searchParams }: Props) {
  const [{ categorySlug }, query, catalogue] = await Promise.all([
    params,
    searchParams,
    getCatalogue(),
  ]);
  const category = catalogue.categories.find(
    (item) => item.slug === categorySlug,
  );
  const page = parsePage(query.page);
  if (!category || page === null) notFound();
  const places = catalogue.places.filter((place) =>
    place.categorySlugs.includes(category.slug),
  );
  const list = paginate(places, page);
  if (!list.valid) notFound();
  const restaurant = category.slug === "restaurants";
  return (
    <>
      <Breadcrumbs
        items={[
          { title: "Категории", href: "/categories" },
          { title: category.title },
        ]}
      />
      <Hero
        compact
        eyebrow={category.title}
        title={
          restaurant ? (
            <>
              За столом
              <br />
              всегда есть повод.
            </>
          ) : (
            category.title
          )
        }
        description={
          restaurant ? (
            <>
              Для долгого ужина, встречи с друзьями
              <br />
              или вечера без особого повода.
            </>
          ) : (
            category.description
          )
        }
        image={category.image}
        imageAlt={`Иллюстрация категории «${category.title}»`}
      >
        <ActionLink secondary href="/categories">
          Все категории
        </ActionLink>
      </Hero>
      <section
        id="places"
        className={cn(containerClass, "pt-8 pb-16 md:pt-8 md:pb-24")}
      >
        <SectionHeading
          eyebrow="Есть повод заглянуть"
          title={restaurant ? "Выбери свой столик." : "Найди своё место."}
        />
        {places.length ? (
          <>
            <CardGrid>
              {list.items.map((place) => (
                <PlaceCard
                  key={place.slug}
                  place={place}
                  categories={catalogue.categories}
                />
              ))}
            </CardGrid>
            <p className="border-border text-muted-foreground mt-12 border-t pt-7 text-center text-sm">
              {placeCount(places.length)} в этой категории
            </p>
            <Pagination
              page={page}
              pages={list.pages}
              basePath={`/categories/${category.slug}`}
            />
          </>
        ) : (
          <EmptyState />
        )}
      </section>
      <FinalCTA />
    </>
  );
}
