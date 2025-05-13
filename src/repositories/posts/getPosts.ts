import prisma from "@/utils/db";

export async function getPosts() {
	try {
		const posts = await prisma.post.findMany({
			include: {
				images: {
					select: {
						id: true,
						altText: true,
						mainImage: true,
						path: true
					}
				},
				category: {
					select: {
						id: true,
						name: true
					}
				}
			},
			orderBy: {
				publishedAt: "desc"
			}
		});

		return posts
	} catch (error) {
		console.error("Ошибка получения постов:", error);
	}
}