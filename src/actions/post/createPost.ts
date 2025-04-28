'use server'

import { ConflictError, Errors, ValidationError } from "@/lib/errors";
import { serverFormSchema } from "@/schemas";
import prisma from "@/utils/db";
import { ImageType } from "@/utils/types";
import { revalidatePath } from "next/cache";


export const createPost = async (formData: FormData) => {
	try {

		const title = formData.get("title");
		const price = formData.get("price");
		const mapUrl = formData.get("mapUrl");
		const categoryName = formData.get("category");
		const telegramPost = formData.get("telegramPost"); 
		const images = formData.getAll("images");
		const tgImagesRaw = formData.get("tgImages");
		const publishedAt = formData.get("publishedAt");


		if (typeof tgImagesRaw !== 'string') {
			throw Errors.Validation('tgImages должен быть строкой')
		}
		const tgImages = JSON.parse(tgImagesRaw) as ImageType[]
		const data = {
			title,
			price,
			mapUrl,
			images,
			category: categoryName,
			telegramPost,
			tgImages,
			publishedAt,
		};


		const validatedData = serverFormSchema.parse(data);
		if (validatedData.telegramPost) {
			const existingPost = await prisma.post.findFirst({
				where: {
					tgPostUrl: validatedData.telegramPost
				}
			});

			if (existingPost) {
				throw Errors.Conflict('Пост с такой ссылкой на Telegram уже существует');
			}
		}
		const category = await prisma.category.findUnique({
			where: {
				name: validatedData.category
			}
		})
		if (!category) { throw new Error(`Категория "${validatedData.category}" не найдена`) }
		const newPost = await prisma.post.create({
			data: {
				title: validatedData.title,
				price: validatedData.price,
				mapUrl: validatedData.mapUrl,
				tgPostUrl: validatedData.telegramPost,
				categoryId: category.id,
				publishedAt: validatedData.publishedAt,
			}
		})
		if (tgImages && tgImages.length > 0) {
			await prisma.image.createMany({
				data: tgImages.map((url, index) => ({
					imageUrl: String(url),
					altText: validatedData.title,
					mainImage: index === 0,
					postId: newPost.id
				}))
			})
		}


		revalidatePath('/')
	} catch (error) {
		console.error('Ошибка создания поста:', error);
		if (error instanceof ValidationError || error instanceof ConflictError) { return { error: error.message } }
		return { error: 'Не удалось создать пост' }
	}
}