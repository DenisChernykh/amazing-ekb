import { getImagesResult, getTelegramPostsResult } from '../cloudflare/repositories';

export async function getTelegramPosts() {
  const result = await getTelegramPostsResult();
  if (!result.success) throw new Error(result.error);
  return result.data;
}
export async function getImagesById(postId: string) {
  const result = await getImagesResult(postId);
  if (!result.success) throw new Error(result.error);
  return result.data;
}
