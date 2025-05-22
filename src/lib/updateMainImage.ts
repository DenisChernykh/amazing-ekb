import { updateMainImageUseCase } from "@/di/useCases";




export async function updateMainImage(imageId: string) {
	return updateMainImageUseCase.execute(imageId)
}