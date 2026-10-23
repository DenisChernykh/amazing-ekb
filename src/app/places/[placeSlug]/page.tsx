import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowUpRight, Play } from "lucide-react";
import { getCatalogue } from "@/lib/catalogue/server";
import { safeExternalUrl } from "@/lib/catalogue/model";
import {
  ActionLink,
  Breadcrumbs,
  containerClass,
  Eyebrow,
  Photo,
  SectionHeading,
} from "@/components/catalogue/primitives";
import { Hero } from "@/components/catalogue/sections";
import { PlaceGallery } from "@/components/catalogue/PlaceGallery";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ placeSlug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { placeSlug } = await params;
  const { places } = await getCatalogue();
  const place = places.find((item) => item.slug === placeSlug);
  return {
    title: place?.title ?? "Место не найдено",
    description: place?.description,
  };
}
export default async function PlacePage({ params }: Props) {
  const [{ placeSlug }, catalogue] = await Promise.all([
    params,
    getCatalogue(),
  ]);
  const place = catalogue.places.find((item) => item.slug === placeSlug);
  if (!place) notFound();
  const category = catalogue.categories.find(
    (item) => item.slug === place.categorySlugs[0],
  );
  const publications = place.publicationIds.flatMap((id) =>
    catalogue.publications.filter(
      (item) => item.id === id && safeExternalUrl(item.url),
    ),
  );
  const review =
    publications.find((item) => item.type === "видео") ?? publications[0];
  const platforms = [...new Set(publications.map((item) => item.platform))];
  const collection = catalogue.collections.find((item) =>
    item.placeSlugs.includes(place.slug),
  );
  const mapsUrl = safeExternalUrl(place.mapsUrl);
  return (
    <>
      <Breadcrumbs
        items={[
          ...(category
            ? [{ title: category.title, href: `/categories/${category.slug}` }]
            : []),
          { title: place.title },
        ]}
      />
      <Hero
        eyebrow={category?.title ?? "Место в городе"}
        title={place.title}
        description={
          <>
            {place.description}
            {place.price && <p className="mt-3 text-sm">{place.price}</p>}
          </>
        }
        image={place.cover}
        imageAlt={place.title}
      >
        {mapsUrl && (
          <ActionLink href={mapsUrl} external>
            На карте
          </ActionLink>
        )}
        {publications.length > 0 && (
          <a
            href="#publications"
            className="text-guide-link inline-flex min-h-11 items-center gap-1 text-sm"
          >
            Публикации <ArrowDown size={15} aria-hidden="true" />
          </a>
        )}
      </Hero>
      {review && (
        <section className={cn(containerClass, "pt-8 pb-16 md:pb-24")}>
          <SectionHeading eyebrow="Обзор места" title="Сначала — посмотреть." />
          <div className="grid items-center gap-8 md:grid-cols-[616fr_456fr] md:gap-12">
            <a
              href={review.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block"
              aria-label={`Открыть обзор: ${review.title}`}
            >
              <Photo
                src={place.cover}
                alt={place.title}
                className="h-[245px] md:h-[356px]"
              />
              {review.type === "видео" && (
                <span className="text-guide-link absolute top-1/2 left-1/2 flex size-14 -translate-1/2 items-center justify-center rounded-full bg-white">
                  <Play size={24} strokeWidth={1.5} aria-hidden="true" />
                </span>
              )}
            </a>
            <div>
              <Eyebrow>
                {review.platform} · {review.type}
              </Eyebrow>
              <h3 className="mt-6 text-[28px] leading-[1.25] tracking-[-.025em] md:text-[36px]">
                {review.title}
              </h3>
              <p className="text-muted-foreground mt-6 text-base leading-[1.55]">
                Фото, впечатления и детали посещения — в публикации проекта.
              </p>
              <ActionLink secondary external href={review.url} className="mt-5">
                Смотреть обзор
              </ActionLink>
            </div>
          </div>
        </section>
      )}
      {publications.length > 0 && (
        <section
          id="publications"
          className={cn(containerClass, "pt-8 pb-16 md:pb-24")}
        >
          <SectionHeading
            eyebrow="Материалы о месте"
            title="Всё в одном месте."
          />
          <nav
            aria-label="Площадки публикаций"
            className="border-border text-guide-link mb-10 flex gap-8 border-b pb-4 text-base"
          >
            {platforms.map((platform, index) => (
              <a key={platform} href={`#platform-${index}`} className="py-2">
                {platform}
              </a>
            ))}
          </nav>
          {platforms.map((platform, index) => (
            <section
              key={platform}
              id={`platform-${index}`}
              className="mb-12 last:mb-0"
            >
              <h3 className="mb-3 text-[28px] tracking-[-.025em] md:text-[34px]">
                {platform}
              </h3>
              <ol>
                {publications
                  .filter((item) => item.platform === platform)
                  .map((publication, number) => (
                    <li key={publication.id} className="border-border border-b">
                      <a
                        href={publication.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-5 py-7 md:gap-6"
                      >
                        <span className="text-guide-link w-8 shrink-0 text-2xl md:w-12 md:text-[30px]">
                          {String(number + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 grow">
                          <h4 className="group-hover:text-guide-link text-xl leading-[1.3] tracking-[-.02em] md:text-[26px]">
                            {publication.title}
                          </h4>
                          <p className="text-muted-foreground mt-2 text-[13px]">
                            {publication.type === "видео"
                              ? "Видео"
                              : "Фото и заметки"}
                            {publication.date && (
                              <>
                                {" "}
                                ·{" "}
                                <time dateTime={publication.date}>
                                  {new Intl.DateTimeFormat("ru-RU", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    timeZone: "Asia/Yekaterinburg",
                                  }).format(new Date(publication.date))}
                                </time>
                              </>
                            )}
                          </p>
                        </div>
                        <ArrowUpRight
                          size={20}
                          className="text-guide-link shrink-0 transition-transform group-hover:translate-x-px group-hover:-translate-y-px"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
              </ol>
            </section>
          ))}
        </section>
      )}
      {place.images.length > 0 && (
        <section className={cn(containerClass, "pb-16 md:pb-24")}>
          <SectionHeading eyebrow="В деталях" title="Ещё немного атмосферы." />
          <PlaceGallery
            images={place.images}
            title={place.title}
            editableImages={place.editableImages}
          />
        </section>
      )}
      {collection && (
        <section className={cn(containerClass, "pb-16 md:pb-24")}>
          <div className="bg-secondary flex flex-col items-start justify-between gap-6 rounded-[24px] p-7 md:flex-row md:items-center md:p-10">
            <div>
              <Eyebrow>Есть в подборке</Eyebrow>
              <h2 className="mt-5 text-[30px] leading-[1.2] tracking-[-.025em] md:text-[38px]">
                {collection.title}
              </h2>
            </div>
            <ActionLink href={`/collections/${collection.slug}`}>
              Открыть подборку
            </ActionLink>
          </div>
        </section>
      )}
    </>
  );
}
