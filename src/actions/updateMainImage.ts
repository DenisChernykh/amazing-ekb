'use server'
import { updateMainImageUseCase } from '@/di/useCases'
import { Result } from '@/utils/result'

import { ApiResponse, AppErrorCode } from '@/utils/types'

export async function updateMainImage(imageId: string): Promise<ApiResponse<{ id: true }, AppErrorCode>> {
	const result = await updateMainImageUseCase.execute(imageId)
	if (result.success) {
		return { success: true, data: { id: true }, message: 'Главное изображение обновлено' }
	} else {
		return Result.fail(result.error)
	}
}