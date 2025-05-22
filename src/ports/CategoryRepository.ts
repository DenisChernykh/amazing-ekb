import { Category } from "@/utils/types";

export interface CategoryRepository {
	findCategoryByName(name: string): Promise<Category | null>
}