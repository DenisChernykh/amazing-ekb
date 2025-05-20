import prisma from "@/utils/db";


export async function getImagesById(id: string) {
	try {
		const images = await prisma.image.findMany({
			where: {
				telegramPostId: id
			},
			select: {
				id: true,
				mainImage: true,
				path: true,
				altText: true
			}
		})
		return images
	} catch (error) {
		console.error("Ошибка получения изображений:", error);
	}
}