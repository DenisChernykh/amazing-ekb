'use server'

import { ConflictError, Errors, ValidationError } from "@/lib/errors";
import prisma from "@/utils/db";
import { revalidatePath } from 'next/cache';

export const createCategory = async (name: string) => {
	try {
		if (!name.trim()) throw Errors.Validation('Название категории обязательно');
		const existingCategory = await prisma.category.findFirst({
			where: { name },
		})
		if (existingCategory) throw Errors.Conflict('Такая категория уже существует');
		const newCategory = await prisma.category.create({
			data: { name }
		})
		revalidatePath('/test')
		return { data: newCategory }
	} catch (error) {
		console.error('Ошибка создания категории:', error);
		if (error instanceof ValidationError || error instanceof ConflictError) { return { error: error.message } }
		return { error: 'Не удалось создать категорию' }
	}
}