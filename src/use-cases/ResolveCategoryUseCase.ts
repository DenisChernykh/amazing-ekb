
import { CategoryResolver } from "@/ports/CategoryResolver";


export class ResolveCategoryUseCase {
	constructor(private readonly resolver: CategoryResolver) { }
	async execute(categoryName: string) {
		return this.resolver.resolve(categoryName)
	}
}