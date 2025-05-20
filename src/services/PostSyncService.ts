
import { UpsertTelegramPostUseCase } from "@/use-cases/UpsertTelegramPostUseCase";
import { TelegramClientService } from "./TelegramClientService";

export class PostSyncService {
	constructor(
		private readonly tgClient: TelegramClientService,
		private readonly upsertPosts: UpsertTelegramPostUseCase[]) { }
	async sync(channelUsername: string) {
		await this.tgClient.init()
		const rawMessages = await this.tgClient.fetchMessages(channelUsername)
		const groupedMessages = this.tgClient.groupMessages(rawMessages)
		const simplifiedMessages = await this.tgClient.simplifyMessages(groupedMessages, channelUsername)
		for (const post of simplifiedMessages) {
			for (const useCase of this.upsertPosts) {
				await useCase.execute(post)
			}
		}
		await this.tgClient.stop()
		return simplifiedMessages
	}
}