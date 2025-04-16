import prisma from "@/utils/db";


export async function getImagesById(id: string) {
	try {
		const images = await prisma.image.findMany({
			where: {
				postId: id
			},
			select: {
				id: true,
				mainImage: true,
				imageUrl: true,
				altText: true
			}
		})
		return images
	} catch (error) {
		console.error("Ошибка получения изображений:", error);
	}
}