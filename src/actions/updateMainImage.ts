'use server'
import { handleError } from '@/lib/errors'
import { updateMainImage as updateMainImageImpl } from '@/lib/updateMainImage'
import { Result } from '@/utils/types'

export async function updateMainImage(imageId: string): Promise<Result> {
	try {
		await updateMainImageImpl(imageId)

		return { success: true, message: 'Главное изображение успешно обновлено' }
	} catch (error: unknown) {
		return handleError(error)

	}
}