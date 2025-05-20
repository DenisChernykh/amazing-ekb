'use server'
import { updateMainImage as updateMainImageImpl } from '@/lib/updateMainImage'

export async function updateMainImage(imageId: string) {
	try {
		await updateMainImageImpl(imageId)

		return { message: 'Главное изображение успешно обновлено' }
	} catch (error: unknown) {
		console.error('Ошибка при обновлении главного изображения:', error)
		if (error instanceof Error) {
			return { error: error.message }
		}
		return { error: 'Не удалось обновить главное изображение' }
	}

}