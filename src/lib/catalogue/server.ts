import "server-only";
import { cache } from "react";
import { postRepo } from "@/di/adapters";
import { buildCatalogue } from "./model";

// The checked-in editorial registry remains available when the live API is offline.
// Live records extend it and retain their existing map URLs and admin image controls.
export const getCatalogue = cache(async () => {
  const posts = await postRepo.getAllPosts();
  return buildCatalogue(posts.success ? posts.data : []);
});
