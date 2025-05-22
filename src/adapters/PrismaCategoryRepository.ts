import { Category } from "@/utils/types";
import { PrismaClient } from "@prisma/client";

export class PrismaCategoryRepository {
	constructor(private readonly prisma: PrismaClient) { }
	async findCategoryByName(name: string): Promise<Category | null> {
		return this.prisma.category.findFirst({
			where: { name },
			select: {
				id: true,
				name: true
			}
		})
	}
}