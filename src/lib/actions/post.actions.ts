import prisma from "@/utils/db";

export async function getPosts() {
	try {
		const posts = await prisma.post.findMany({
			include: {

				images: {
					select: {
						id: true,
						url: true,
						altText: true,
						mainPhoto: true,
					}
				},
				category: {
					select: {
						id: true,
						name: true
					}
				}
			}
		});
		return posts
	} catch (error) {
		console.error("Ошибка получения постов:", error);
	}
}

