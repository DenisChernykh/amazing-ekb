import prisma from "@/utils/db";

export async function getCategories() {
	try {
		const categories = await prisma.category.findMany({
			select: { id: true, name: true },
		});
		return categories
	} catch (error) {
		console.error("Ошибка получения категорий:", error);
	}
}