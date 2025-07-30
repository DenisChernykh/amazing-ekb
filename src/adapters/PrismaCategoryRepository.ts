import { CategoryRepository } from "@/ports/CategoryRepository";
import { handleRepositoryError } from "@/utils/handleRepositoryError";
import { Result } from "@/utils/result";
import { AppErrorCode, Category, createCategoryInput, ResultType } from "@/utils/types";
import { Prisma, PrismaClient } from "@prisma/client";

type DbCategory = Prisma.CategoryGetPayload<{
	select: {
		id: true,
		name: true
	}
}>

function mapDbCategoryToCategory(category: DbCategory): Category {
	return {
		id: category.id,
		name: category.name
	}
}
export class PrismaCategoryRepository implements CategoryRepository {
	constructor(private readonly prisma: PrismaClient) { }
	async getAllCategories(): Promise<ResultType<Category[], AppErrorCode>> {
		try {
			const categoriesFromDb: DbCategory[] = await this.prisma.category.findMany({
				select: {
					id: true,
					name: true
				}
			})
			const categories = categoriesFromDb.map(mapDbCategoryToCategory)
			return Result.ok(categories)

		} catch (error) {
			return handleRepositoryError(error)
		}
	}
	async findCategoryByName(name: string): Promise<ResultType<Category, AppErrorCode>> {
		try {
			const category = await this.prisma.category.findFirst({
				where: {
					name: name
				},
				select: {
					id: true,
					name: true
				}
			})
			if (!category) {
				return Result.fail(AppErrorCode.CATEGORY_NOT_FOUND)
			}

			return Result.ok(mapDbCategoryToCategory(category))
		} catch (error) {
			return handleRepositoryError(error)
		}
	}
	async create(input: createCategoryInput): Promise<ResultType<{ id: string }, AppErrorCode>> {
		try {
			const category = await this.prisma.category.create({ data: input })
			return Result.ok({ id: category.id })
		} catch (error) {
			return handleRepositoryError(error)
		}
	}
}