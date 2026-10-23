import type { ImageType } from "@/utils/types";

export interface Publication {
  id: string;
  platform: string;
  type: string;
  url: string;
  title: string;
  subject: string;
  categories: string[];
  date: string | null;
}

export interface GuideCategory {
  slug: string;
  title: string;
  image: string;
  description: string;
  aliases: string[];
}

export interface Place {
  slug: string;
  title: string;
  categorySlugs: string[];
  description: string;
  publicationIds: string[];
  images: string[];
  cover: string | null;
  mapsUrl: string | null;
  rejectedMapUrls?: string[];
  price?: string;
  legacyIds?: string[];
  editableImages?: ImageType[];
}

export interface Collection {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  intro: string;
  quote: string;
  placeSlugs: string[];
  cover: string | null;
}

export interface Catalogue {
  categories: GuideCategory[];
  places: Place[];
  publications: Publication[];
  collections: Collection[];
}
