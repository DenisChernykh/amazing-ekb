import prompts from "prompts"
import { Api, TelegramClient } from "telegram"
import { StoreSession } from "telegram/sessions"
import { ImageStorageService } from "./ImageStorageService"
import { GroupedMessage } from "@/utils/types"



type AuthParams = {
	apiId: number
	apiHash: string
	sessionName?: string
}


export class TelegramClientService {
	private client: TelegramClient
	private imageStorage: ImageStorageService
	private getMainMessage(group: Api.Message[]): Api.Message | undefined {
		return group.find(msg => msg.text) || group[0]
	}

	constructor(private auth: AuthParams) {
		const session = new StoreSession(auth.sessionName || 'user_session')
		this.client = new TelegramClient(session, auth.apiId, auth.apiHash, {
			connectionRetries: 5
		})
		this.imageStorage = new ImageStorageService()
	}

	async init(): Promise<void> {
		console.log('🔌 Подключение к Telegram...');
		await this.client.start({
			phoneNumber: async () => (await prompts({ type: 'text', name: 'phone', message: 'Пожалуйста, введите номер телефона' })).phone,
			password: async () => (await prompts({ type: 'password', name: 'password', message: 'Пожалуйста, введите пароль' })).password,
			phoneCode: async () => (await prompts({ type: 'text', name: 'code', message: 'Пожалуйста, введите код' })).code,
			onError: (err) => console.log('ERROR', err)
		})
		console.log('Подключение к Telegram установлено')
		this.client.session.save()
		console.log('✅ Авторизация Telegram завершена');
	}

	async fetchMessages(channelUsername: string, limit = 500): Promise<Api.Message[]> {
		await this.client.sendMessage('me', { message: 'Привет, Денис' })
		console.log('Вы авторизованы как Денис');

		const channel = await this.client.getEntity(channelUsername)
		const messages = await this.client.getMessages(channel, {
			limit
		})
		const onlyMessages = messages.filter((msg): msg is Api.Message => msg instanceof Api.Message)
		return onlyMessages
	}
	groupMessages(messages: Api.Message[]): Map<string, Api.Message[]> {
		const groups = new Map<string, Api.Message[]>()
		for (const msg of messages) {
			const key = msg.groupedId?.toString() || msg.id.toString()
			const group = groups.get(key) ?? []
			group.push(msg)
			groups.set(key, group)
		}
		return groups
	}
	async simplifyMessages(groups: Map<string, Api.Message[]>, channelUsername: string): Promise<GroupedMessage[]> {

		const simplifiedMessages: GroupedMessage[] = []
		for (const group of groups.values()) {
			const mainMsg = this.getMainMessage(group)
			if (!mainMsg) continue
			const groupId = mainMsg.id
			const photoPaths: string[] = []
			for (const [index, msg] of group.entries()) {
				if (msg.media instanceof Api.MessageMediaPhoto) {
					const path = await this.downloadImage(msg.media, groupId.toString(), index)
					if (path) photoPaths.push(path)
				}
			}
			simplifiedMessages.push({
				id: groupId,
				text: mainMsg.text || '',
				date: new Date(mainMsg.date * 1000),
				channelId: mainMsg.peerId.className === 'PeerChannel' ? mainMsg.peerId.channelId.toString() : '',
				postLink: `https://t.me/${channelUsername}/${groupId}`,
				photoPaths
			})
		}
		return simplifiedMessages
	}
	async downloadImage(media: Api.MessageMediaPhoto, messageId: string, index: number): Promise<string | undefined> {
		try {
			if (!media.photo) return undefined

			const buffer = await this.client.downloadMedia(media)
			if (!buffer) return undefined
			const fileName = `post-${messageId}-${index}.jpg`
			if (Buffer.isBuffer(buffer)) {
				await this.imageStorage.saveToSupabase(buffer, fileName)
			} else {
				console.error(`Ошибка: Ожидался Buffer, но получен ${typeof buffer}`)
				return undefined
			}
			if (Buffer.isBuffer(buffer)) {
				return await this.imageStorage.saveLocally(buffer, fileName)
			} else {
				console.error(`Ошибка: Ожидался Buffer, но получен ${typeof buffer}`)
				return undefined
			}
		} catch (error) {
			console.error(`Ошибка при скачивании изображения ${messageId}:`, error)
			return undefined
		}
	}
	async stop() {
		await this.client.disconnect()
	}

}