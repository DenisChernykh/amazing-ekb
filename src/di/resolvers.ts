import { CategoryResolver } from "@/ports/CategoryResolver";
import { DefaultCategoryResolver } from "@/services/DefaultCategoryResolver";
import { categoryRepo } from "./adapters";

export const categoryResolver: CategoryResolver = new DefaultCategoryResolver(categoryRepo);