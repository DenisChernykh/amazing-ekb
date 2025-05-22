import { Errors } from "@/lib/errors";
import { CategoryRepository } from "@/ports/CategoryRepository";
import { CategoryResolver } from "@/ports/CategoryResolver";

export class DefaultCategoryResolver implements CategoryResolver {
	constructor(private readonly categoryRepo: CategoryRepository) { }
	async resolve(name: string): Promise<string> {
		const category = await this.categoryRepo.findCategoryByName(name)
		if (!category) throw Errors.Validation(`Категория "${name}" не найдена`)
		return category.id
	}
}