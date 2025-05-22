export interface ImageRepository {
	
	findImageById(id: string): Promise<{ id: string; telegramPostId: string | null } | null>
	resetMainImage(telegramPostId: string): Promise<void>
	setMainImage(imageId: string): Promise<void>
}