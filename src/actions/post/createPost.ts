'use server'
import { createPost as createPostImpl } from '@/lib/createPost'
import { handleError } from '@/lib/errors';
import { Result } from '@/utils/types';
import { revalidatePath } from 'next/cache';
export async function createPost(formData: FormData): Promise<Result> {
	try {
		await createPostImpl(formData)
		revalidatePath('/')
		return { success: true, message: 'Пост успешно создан' }

	} catch (error) {
		return handleError(error)
	}
}