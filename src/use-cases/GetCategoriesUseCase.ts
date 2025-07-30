import { CategoryRepository } from "@/ports/CategoryRepository";

export class GetCategoriesUseCase {
	constructor(private readonly categoryRepo: CategoryRepository) { }
	async execute() {
		return this.categoryRepo.getAllCategories
	}
}