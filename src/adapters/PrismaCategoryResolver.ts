import { CategoryResolver } from "@/ports/CategoryResolver";
import { PrismaClient } from "@prisma/client";

export class PrismaCategoryResolver implements CategoryResolver {
	constructor(private readonly prisma: PrismaClient) { }
	async resolve(categoryName: string): Promise<string> {
		const category = await this.prisma.category.findFirst({
			where: { name: categoryName }

		})
		if (!category) throw new Error(`Категория "${categoryName}" не найдена`)
		return category.id
	}
}