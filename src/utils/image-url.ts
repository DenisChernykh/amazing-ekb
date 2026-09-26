import { normalizeImagePath } from '@/shared/data-contracts';

export function getImageUrl(path: string): string {
  const key = normalizeImagePath(path);
  const base = process.env.NEXT_PUBLIC_ASSET_BASE_URL;
  return base ? new URL(key, base).href : key;
}
