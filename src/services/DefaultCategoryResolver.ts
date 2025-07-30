
import { CategoryRepository } from "@/ports/CategoryRepository";
import { CategoryResolver } from "@/ports/CategoryResolver";
import { AppErrorCode, ResultType } from "@/utils/types";

export class DefaultCategoryResolver implements CategoryResolver {
	constructor(private readonly categoryRepo: CategoryRepository) { }
	async resolve(name: string): Promise<ResultType<string, AppErrorCode>> {
		const result = await this.categoryRepo.findCategoryByName(name)
		if (!result.success) {
			return { success: false, error: result.error }
		}
		return { success: true, data: result.data.id }
	}
}