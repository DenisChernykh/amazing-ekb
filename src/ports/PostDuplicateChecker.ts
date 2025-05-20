export interface PostDuplicateChecker {
	existsById(telegramPostId: string): Promise<boolean>
}