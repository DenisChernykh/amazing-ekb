import { TelegramClient, Api } from 'telegram'
import { StoreSession } from 'telegram/sessions'
import prompts from 'prompts'
import path from 'path'
import * as fs from 'node:fs'
import { PrismaClient } from '@prisma/client'

import supabase from '@/utils/supabase'

const localPrisma = new PrismaClient({
	log: ["query", "info", "warn", "error"],
	datasources: {
		db: {
			url: process.env.LOCAL_DB_URL
		}
	}
});
const supabasePrisma = new PrismaClient({
	log: ["query", "info", "warn", "error"],
	datasources: {
		db: {
			url: process.env.SUPABASE_DB_URL
		}
	}
});
type GroupedMessage = {
	id: number,
	text: string,
	date: Date,
	channelId: string,
	postLink?: string,
	photoPaths: string[]
}
const apiId = +process.env.TG_API_ID!
const apiHash = process.env.TG_API_HASH!
const storeSession = new StoreSession('user_session');

(async () => {
	console.log('Подключение к Telegram...')
	const client = new TelegramClient(storeSession, apiId, apiHash, {
		connectionRetries: 5
	})
	const outputDir = path.join(process.cwd(), 'scripts')
	const outputFile = path.join(outputDir, 'dev-messages.json')
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
	const groups = new Map<string, Api.Message[]>()
	async function downloadImage(media: Api.MessageMediaPhoto, messageId: string, index: number): Promise<string | undefined> {
		try {
			if (!media.photo) return undefined
			const buffer = await client.downloadMedia(media)
			if (!buffer) return undefined
			const bucketName = "post-images"
			const fileName = `post-${messageId}-${index}.jpg`
			const filePath = path.join(imagesDir, fileName)
			const { data: existingFiles, error: listError } = await supabase.storage.from(bucketName).list()
			const alreadyExists = existingFiles?.some(file => file.name === fileName)
			if (alreadyExists) {
				console.log(`Фото ${fileName} уже существует в Supabase, пропускаем сохранение`);

			} else {
				const { error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, buffer, {
					contentType: 'image/jpeg',
					upsert: false
				})
				if (uploadError && uploadError.message !== 'The resource already exists') {
					throw new Error(`Ошибка при загрузке фото ${fileName} в Supabase: ${uploadError.message}`);
				}
			}
			if (!fs.existsSync(filePath)) {
				await fs.promises.writeFile(filePath, buffer)
			} else {
				console.log(`Фото ${fileName} уже существует на диске, пропускаем сохранение`);

			}
			return `/images/${fileName}`
		}
		catch (error) {
			console.error(`Ошибка при скачивании фото для сообщения ${messageId}:`, error);
		}
	}
	for (const msg of messages) {
		const key = msg.groupedId?.toString() || msg.id.toString()

		if (!groups.has(key)) {
			groups.set(key, [])
		}
		groups.get(key)?.push(
			msg
		)
	}

	const simplifiedMessages: GroupedMessage[] = []
	for (const group of groups.values()) {

		const mainMsg = group.find(msg => msg.text) || group[0]
		const groupId = mainMsg?.id
		const photoPaths: string[] = []
		for (const [index, msg] of group.entries()) {
			if (msg.media) {
				const path = await downloadImage(msg.media as Api.MessageMediaPhoto, groupId.toString(), index)
				if (path) photoPaths.push(path)

			}
		}

		simplifiedMessages.push({
			id: groupId,
			text: mainMsg?.text || '',
			date: new Date(mainMsg.date * 1000),
			channelId: mainMsg?.peerId.className === 'PeerChannel' ? mainMsg.peerId.channelId.toString() : '',
			postLink: `https://t.me/tanya_strelchuk_blog/${groupId}`,
			photoPaths

		})
	}



	for (const msg of simplifiedMessages) {
		const tgPostInLocal = await localPrisma.telegramPost.upsert({
			where: { id: msg.id.toString() },
			update: {
				id: msg.id.toString(),
				text: msg.text,
				date: msg.date,
				postLink: msg.postLink || '',
			}, create: {
				id: msg.id.toString(),
				text: msg.text,
				date: msg.date,
				postLink: msg.postLink || '',
			}
		})
		const tgPostInSupabase = await supabasePrisma.telegramPost.upsert({
			where: { id: msg.id.toString() },
			update: {
				id: msg.id.toString(),
				text: msg.text,
				date: msg.date,
				postLink: msg.postLink || '',
			}, create: {
				id: msg.id.toString(),
				text: msg.text,
				date: msg.date,
				postLink: msg.postLink || '',
			}
		})
		if (msg.photoPaths?.length) {

			await localPrisma.image.createMany({
				data: msg.photoPaths.map((path) => ({
					path,
					telegramPostId: tgPostInLocal.id,
				})),
				skipDuplicates: true
			})
			await supabasePrisma.image.createMany({
				data: msg.photoPaths.map((path, index) => ({
					path: path.split('/').pop() || `unknown-image-${index}`,
					telegramPostId: tgPostInSupabase.id,
				})),
				skipDuplicates: true
			})

		}
	}

	fs.writeFileSync(outputFile, JSON.stringify(simplifiedMessages, null, 2))
	console.log(`Сохранено ${messages.length} сообщений`)
	client.disconnect()

})()