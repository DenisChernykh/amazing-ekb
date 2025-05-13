import prisma from "@/utils/db";

export async function getTelegramPosts() {
	try {
		const telegramPosts = await prisma.telegramPost.findMany({
			where: {
				isHidden: false
			},
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
						path: true,
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