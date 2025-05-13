import prisma from "@/utils/db";

export async function getPosts() {
	try {
		const posts = await prisma.post.findMany({
			select: {
				id: true,
				title: true,
				price: true,
				mapUrl: true,
				telegramPost: {
					select: {
						postLink: true,
						id: true,
						text: true,
						date: true,
						images: {
							select: {
								path: true,
								altText: true,
								mainImage: true,
								id: true
							}
						}
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
				telegramPost: {
					date: "desc"
				}
			}
		});

		return posts
	} catch (error) {
		console.error("Ошибка получения постов:", error);
	}
}