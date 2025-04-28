import prisma from "@/utils/db";

export async function getTelegramPosts() {
	try {
		const telegramPosts = await prisma.telegramPost.findMany({
			select:
			{
				id: true,
				text: true,
				date: true,
				postLink: true,
				images:
				{
					select: {
						id: true,
						imageUrl: true,
						altText: true,
						mainImage: true
					}
				}
			},
			orderBy: {
				date: "desc"
			}
		});
		return telegramPosts
	} catch (error) {
		console.error("Ошибка получения категорий:", error);
	}
}