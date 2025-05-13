import { TelegramClient } from 'telegram'
import { StoreSession } from 'telegram/sessions'
import prompts from 'prompts'
import path from 'path'
import * as fs from 'node:fs'



const apiId = +process.env.TG_API_ID!
const apiHash = process.env.TG_API_HASH!
const storeSession = new StoreSession('user_session');

(async () => {
	console.log('Подключение к Telegram...')
	const client = new TelegramClient(storeSession, apiId, apiHash, {
		connectionRetries: 5
	})
	const outputDir = path.join(process.cwd(), 'scripts')
	const outputFile = path.join(outputDir, 'messages.json')
	const imagesDir = path.join(process.cwd(), 'public', 'images')


	if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })
	if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true })

	await client.start({
		phoneNumber: async () => (await prompts({ type: 'text', name: 'phone', message: 'Пожалуйста, введите номер телефона' })).phone,
		password: async () => (await prompts({ type: 'password', name: 'password', message: 'Пожалуйста, введите пароль' })).password,
		phoneCode: async () => (await prompts({ type: 'text', name: 'code', message: 'Пожалуйста, введите код' })).code,
		onError: (err) => console.log('ERROR', err)
	})
	console.log('Подключение к Telegram установлено')
	client.session.save()
	await client.sendMessage('me', { message: 'Привет, Денис' })
	console.log("Вы авторизованы как Денис")

	const channel = await client.getEntity("tanya_strelchuk_blog")
	const messages = await client.getMessages(channel, {
		limit: 500
	})
	const simplifiedMessages = messages.map((mes) => {
		const message = {
			id: mes.id,
			text: mes.message || null,
			channelId: mes.peerId.className === 'PeerChannel' ? mes.peerId.channelId : null,
			date: mes.date,
			media: mes.media,
			views: mes.views,
			groupedId: mes.groupedId,
			reactions: mes.reactions,

		}

		return message
	})

	fs.writeFileSync(outputFile, JSON.stringify(simplifiedMessages, null, 2))
	console.log(`Сохранено ${messages.length} сообщений`)
	client.disconnect()

})()