'use server'
import { createPost as createPostImpl } from '@/lib/createPost'
import { revalidatePath } from 'next/cache';
export async function createPost(formData: FormData): Promise<{ error?: string; message?: string }> {
	try {
		await createPostImpl(formData)
		revalidatePath('/')
		return { message: 'Пост успешно создан' }

	} catch (error) {
		console.error('Ошибка при создании поста:', error)
		return { error: 'Не удалось создать пост' }
	}
}