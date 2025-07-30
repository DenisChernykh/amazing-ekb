'use server'
import { createPostUseCase } from '@/di/useCases';
import { serverFormSchema } from '@/schemas';
import { getErrorMessage } from '@/utils/errorMessages';
import { ApiResponse } from '@/utils/types';
import { revalidatePath } from 'next/cache';

import { z } from 'zod';

export type CreatePostDTO = z.infer<typeof serverFormSchema>
export async function createPost(formData: FormData): Promise<ApiResponse<{ id: string }>> {
	const raw: Record<string, unknown> = {
		title: formData.get("title"),
		price: formData.get("price"),
		mapUrl: formData.get("mapUrl"),
		category: formData.get("category"),
		telegramPost: formData.get("telegramPost"),
		images: formData.getAll("images"),
	}
	const parseResult = serverFormSchema.safeParse(raw)
	if (!parseResult.success) {
		return {
			success: false, error: 'VALIDATION_ERROR',
			errors: parseResult.error.issues,
			message: getErrorMessage('VALIDATION_ERROR')
		}

	}
	const dto: CreatePostDTO = parseResult.data
	const result = await createPostUseCase.execute(dto)
	if (result.success) {
		revalidatePath('/')
		return { success: true, data: { id: result.data.id }, message: 'Пост успешно создан' }
	} else {

		return { success: false, error: result.error, message: getErrorMessage(result.error) }
	}







}