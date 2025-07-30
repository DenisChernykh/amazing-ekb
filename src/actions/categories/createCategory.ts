'use server'


import { getErrorMessage } from "@/utils/errorMessages";
import { revalidatePath } from 'next/cache';

import { ApiResponse } from '@/utils/types';
import { categoryRepo } from "@/di/adapters";



export const createCategory = async (name: string): Promise<ApiResponse<{ name: string }>> => {

	if (!name.trim()) {
		return {
			success: false,
			error: "CATEGORY_NOT_FOUND",
			message: getErrorMessage("CATEGORY_NOT_FOUND")

		}
	}
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
	revalidatePath('/test')

	return {
		success: true,
		data: { name },
		message: 'Категория успешно создана'
	}
}