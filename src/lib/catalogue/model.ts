import categories from "@/content/catalogue/categories.json";
import places from "@/content/catalogue/places.json";
import publications from "@/content/catalogue/publications.json";
import collections from "@/content/catalogue/collections.json";
import type { Post } from "@/utils/types";
import type { Catalogue, Place } from "./types";

export function safeExternalUrl(
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function normalizedName(value: string) {
  return value.trim().toLocaleLowerCase("ru");
}

/** Join on publication URL, never on a partial venue name or a photograph. */
export function buildCatalogue(posts: Post[] = []): Catalogue {
  const result: Catalogue = {
    categories: structuredClone(categories),
    places: structuredClone(places),
    publications: structuredClone(publications),
    collections: structuredClone(collections),
  };
  for (const post of posts) {
    const url = safeExternalUrl(post.telegramPost.postLink);
    let publication = result.publications.find((item) => item.url === url);
    if (!publication && url) {
      publication = {
        id: `live-${post.telegramPost.id}`,
        platform: "Telegram",
        type: "статья",
        url,
        title: post.title,
        subject: post.title,
        categories: [post.category.name],
        date: post.telegramPost.date.toISOString(),
      };
      result.publications.push(publication);
    }
    const existing =
      publication &&
      result.places.find((place) =>
        place.publicationIds.includes(publication.id),
      );
    const images = post.telegramPost.images.map((image) => image.path);
    const mainImage = post.telegramPost.images.find(
      (image) => image.mainImage,
    )?.path;
    if (existing) {
      const liveMap = safeExternalUrl(post.mapUrl);
      // Registry corrections must survive older API records for the same publication.
      const rejectedMap = existing.rejectedMapUrls?.some((rejected) => {
        if (!liveMap) return false;
        const candidate = new URL(liveMap);
        const known = new URL(rejected);
        return (
          candidate.origin === known.origin &&
          candidate.pathname === known.pathname
        );
      });
      if (liveMap && !rejectedMap) existing.mapsUrl = liveMap;
      existing.price = post.price;
      existing.images = [...new Set([...images, ...existing.images])];
      existing.cover = mainImage ?? existing.cover ?? images[0] ?? null;
      existing.legacyIds = [
        ...(existing.legacyIds ?? []),
        post.id,
        post.telegramPost.id,
      ];
      existing.editableImages = [
        ...(existing.editableImages ?? []),
        ...post.telegramPost.images,
      ];
      continue;
    }
    let category = result.categories.find((item) =>
      [item.title, ...item.aliases].some(
        (name) => normalizedName(name) === normalizedName(post.category.name),
      ),
    );
    if (!category) {
      category = {
        slug: `category-${post.category.id}`,
        title: post.category.name,
        description: "Места и публикации проекта.",
        image: "/guide/infrastruktura-otdyha.webp",
        aliases: [],
      };
      result.categories.push(category);
    }
    const place: Place = {
      slug: `place-${post.id}`,
      title: post.title,
      categorySlugs: [category.slug],
      description: post.category.name,
      publicationIds: publication ? [publication.id] : [],
      images,
      cover: mainImage ?? images[0] ?? null,
      mapsUrl: safeExternalUrl(post.mapUrl),
      price: post.price,
      legacyIds: [post.id, post.telegramPost.id],
      editableImages: post.telegramPost.images,
    };
    result.places.push(place);
  }
  return result;
}

export function parsePage(value: string | string[] | undefined): number | null {
  if (value === undefined) return 1;
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return null;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : null;
}

export function paginate<T>(items: T[], page: number, size = 20) {
  const pages = Math.max(1, Math.ceil(items.length / size));
  return {
    items: items.slice((page - 1) * size, page * size),
    pages,
    valid: page >= 1 && page <= pages,
  };
}

export function placeCount(count: number) {
  const last = count % 10;
  const teen = count % 100 >= 11 && count % 100 <= 14;
  return `${count} ${!teen && last === 1 ? "место" : !teen && last >= 2 && last <= 4 ? "места" : "мест"}`;
}
