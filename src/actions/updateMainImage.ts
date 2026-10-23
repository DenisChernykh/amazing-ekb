'use server'
import { isCurrentUserAdmin } from '@/lib/require-admin';
import { revalidatePath, revalidateTag } from 'next/cache';
import { CATALOGUE_CACHE_TAG } from '@/shared/catalogue-cache';
import { updateMainImageUseCase } from '@/di/useCases'
import { Result } from '@/utils/result'

import { ApiResponse, AppErrorCode } from '@/utils/types'

export async function updateMainImage(imageId: string): Promise<ApiResponse<{ id: true }, AppErrorCode>> {
  if (!await isCurrentUserAdmin()) return { success: false, error: 'FORBIDDEN', message: 'Недостаточно прав' };
	const result = await updateMainImageUseCase.execute(imageId)
	if (result.success) {
    revalidateTag(CATALOGUE_CACHE_TAG);
    revalidatePath('/');
    revalidatePath('/place/[id]', 'page');
		return { success: true, data: { id: true }, message: 'Главное изображение обновлено' }
	} else {
		return Result.fail(result.error)
	}
}
