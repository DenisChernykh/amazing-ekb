export const CATALOGUE_CACHE_TAG = 'public-catalogue';

// Only public catalogue reads share this cache. Profiles and writes stay uncached.
export const catalogueCachePolicy = {
  cache: 'force-cache',
  next: { revalidate: 60, tags: [CATALOGUE_CACHE_TAG] },
} satisfies RequestInit;
