import { AppErrorCode, ResultType } from "@/utils/types"

export interface ImageRepository {

	findImageById(id: string): Promise<ResultType<{ id: string, telegramPostId: string }, AppErrorCode>>
	resetMainImage(telegramPostId: string): Promise<ResultType<{ id: string }, AppErrorCode>>
	setMainImage(imageId: string): Promise<ResultType<{ id: string }, AppErrorCode>>
	updateMainImageAtomic(imageId: string): Promise<ResultType<{ id: string }, AppErrorCode>>
}