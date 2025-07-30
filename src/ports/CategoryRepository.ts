
import { AppErrorCode, Category, createCategoryInput, ResultType } from "@/utils/types";

export interface CategoryRepository {
	getAllCategories(): Promise<ResultType<Category[], AppErrorCode>>
	findCategoryByName(name: string): Promise<ResultType<Category, AppErrorCode>>
	create(input: createCategoryInput): Promise<ResultType<{ id: string }, AppErrorCode>>
}