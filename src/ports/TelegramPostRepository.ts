export interface TelegramPostRepository {
	upsertTelegramPost(date: UpsertTelegramPostInput): Promise<{ id: string }>
	createImages(images: ImageInput[]): Promise<void>
}

export type UpsertTelegramPostInput = {
	id: string;
	text: string;
	date: Date
	postLink: string

}
export type ImageInput = {
	telegramPostId: string
	path: string
}