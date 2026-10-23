import type { Metadata } from "next";
import { getCatalogue } from "@/lib/catalogue/server";
import { CardGrid, CollectionCard } from "@/components/catalogue/cards";
import {
  ActionLink,
  Breadcrumbs,
  containerClass,
  Eyebrow,
  Photo,
} from "@/components/catalogue/primitives";
import { PageIntro } from "@/components/catalogue/sections";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Подборки мест" };
export default async function CollectionsPage() {
  const { collections, places } = await getCatalogue();
  const featured =
    collections.find((collection) => collection.slug === "den-dlya-sebya") ??
    collections[0];
  return (
    <>
      <Breadcrumbs items={[{ title: "Подборки" }]} />
      <PageIntro
        eyebrow="Готовые идеи"
        title={
          <>
            Хороший день
            <br />
            начинается с идеи.
          </>
        }
      >
        Короткие списки мест для разных настроений.
        <br />
        Выбери, как хочется провести время.
      </PageIntro>
      <section
        className={cn(
          containerClass,
          "grid items-center gap-10 pb-16 md:grid-cols-2 md:gap-16 md:pb-24",
        )}
      >
        <Photo
          src={featured.cover}
          alt={featured.title}
          priority
          className="h-[340px] md:h-[440px]"
        />
        <div>
          <Eyebrow>{featured.eyebrow}</Eyebrow>
          <h2 className="mt-7 text-[36px] leading-[1.16] tracking-[-.035em] md:text-[48px]">
            {featured.title}
          </h2>
          <p className="text-muted-foreground mt-7 text-[17px] leading-[1.55]">
            {featured.intro}
          </p>
          <p className="text-muted-foreground mt-7 text-[13px]">
            {featured.placeSlugs
              .slice(0, 3)
              .map((slug) => places.find((place) => place.slug === slug)?.title)
              .filter(Boolean)
              .join(" · ")}
          </p>
          <ActionLink className="mt-7" href={`/collections/${featured.slug}`}>
            Смотреть подборку
          </ActionLink>
        </div>
      </section>
      <section aria-label="Другие подборки" className={containerClass}>
        <CardGrid>
          {collections
            .filter((item) => item.slug !== featured.slug)
            .map((collection) => (
              <CollectionCard
                key={collection.slug}
                collection={collection}
                wide
              />
            ))}
        </CardGrid>
      </section>
      <section className={cn(containerClass, "py-20 text-center md:py-28")}>
        <h2 className="mb-8 text-[32px] leading-[1.2] tracking-[-.035em] md:text-[44px]">
          Хочется выбрать самому?
        </h2>
        <ActionLink href="/categories">Все категории</ActionLink>
      </section>
    </>
  );
}
