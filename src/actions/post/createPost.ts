'use server'

import { ConflictError, Errors, ValidationError } from "@/lib/errors";
import { serverFormSchema } from "@/schemas";
import prisma from "@/utils/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";



export const createPost = async (formData: FormData): Promise<{ error?: string, message?: string }> => {
	try {

		const title = formData.get("title");
		const price = formData.get("price");
		const mapUrl = formData.get("mapUrl");
		const categoryName = formData.get("category");
		const telegramPost = formData.get("telegramPost");
		const images = formData.getAll("images");
		const data = {
			title,
			price,
			mapUrl,
			images,
			category: categoryName,
			telegramPost,
		};


		const validatedData = serverFormSchema.parse(data);
		if (validatedData.telegramPost) {
			const existingPost = await prisma.post.findFirst({
				where: {
					telegramPost: {
						id: validatedData.telegramPost
					}

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
		if (!category) {
			throw Errors.Validation(`Категория "${validatedData.category}" не найдена`)
		}
		await prisma.post.create({
			data: {
				title: validatedData.title,
				price: validatedData.price,
				mapUrl: validatedData.mapUrl,
				categoryId: category.id,
				telegramPostId: validatedData.telegramPost,

			}
		})


		revalidatePath('/')
		return { message: 'Пост успешно создан' };
	} catch (error: unknown) {
		console.error('Ошибка создания поста:', error);
		if (error instanceof ValidationError || error instanceof ConflictError) {
			return { error: error.message }
		}
		if (error instanceof PrismaClientKnownRequestError) {
			console.error('Ошибка призмы:', error.code, error.message);
			return { error: 'Не удалось создать пост' }

		}
		return { error: 'Не удалось создать пост' }
	}
}