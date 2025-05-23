import { TelegramPostRepository } from "@/ports/TelegramPostRepository";
import { GroupedMessage } from "@/utils/types";

export class UpsertTelegramPostUseCase {
	constructor(private readonly telegramPostRepository: TelegramPostRepository,
		private readonly pathSelector: 'local' | 'supabase'
	) { }
	async execute(telegramPost: GroupedMessage) {

		const upserted = await this.telegramPostRepository.upsertTelegramPost({
			id: telegramPost.id.toString(),
			text: telegramPost.text,
			date: telegramPost.date,
			postLink: telegramPost.postLink ?? ''
		});
		if (telegramPost.photoPaths.length > 0) {
			const imageInputs = telegramPost.photoPaths.map((path, index) => ({
				telegramPostId: upserted.id,
				path: this.pathSelector === "local" ? path.localPath : path.supabasePath,
				mainImage: index === 0

			}))
			await this.telegramPostRepository.createImages(imageInputs)
		}
	}

}