'use server'
import { isCurrentUserAdmin } from '@/lib/require-admin';


import { getErrorMessage } from "@/utils/errorMessages";
import { revalidatePath } from 'next/cache';

import { ApiResponse } from '@/utils/types';
import { categoryRepo } from "@/di/adapters";
import { createCategorySchema } from '@/shared/data-contracts';



export const createCategory = async (inputName: string): Promise<ApiResponse<{ name: string }>> => {
  if (!await isCurrentUserAdmin()) return { success: false, error: 'FORBIDDEN', message: 'Недостаточно прав' };
  const parsed = createCategorySchema.safeParse({ name: inputName });
	if (!parsed.success) {
		return {
			success: false,
			error: "VALIDATION_ERROR",
			message: getErrorMessage("VALIDATION_ERROR")

		}
	}
  const { name } = parsed.data;
	const existingResult = await categoryRepo.findCategoryByName(name)
	if (existingResult.success) {
		return {
			success: false,
			error: "CATEGORY_ALREADY_EXISTS",
			message: getErrorMessage("CATEGORY_ALREADY_EXISTS")
		}
	}
	if (existingResult.error && existingResult.error !== "CATEGORY_NOT_FOUND") {
		return {
			success: false,
			error: existingResult.error,
			message: getErrorMessage(existingResult.error)
		}
	}
	const createResult = await categoryRepo.create({ name })
	if (!createResult.success)
		return {
			success: false,
			error: createResult.error,
			message: getErrorMessage(createResult.error)
		}
	revalidatePath('/', 'layout')

	return {
		success: true,
		data: { name },
		message: 'Категория успешно создана'
	}
}
