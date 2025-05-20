// import { PrismaClient } from "@prisma/client"
// import { TelegramClientService } from "../src/services/TelegramClientService"
// import * as fs from 'node:fs'
// import path from "node:path"
// import { PrismaTelegramPostRepository } from "@/repositories/PrismaTelegramPostRepository"
// import { UpsertTelegramPostUseCase } from "@/use-cases/UpsertTelegramPostUseCase"
// import { PostSyncService } from "@/services/PostSyncService"
// const outputDir = path.join(process.cwd(), 'scripts')
// const outputFile = path.join(outputDir, 'dev-messages.json')
// const main = async () => {
// 	const client = new TelegramClientService({
// 		apiId: +process.env.TG_API_ID!,
// 		apiHash: process.env.TG_API_HASH!,
// 		sessionName: process.env.TG_SESSION_NAME!
// 	})
// 	await client.init()
// 	const messages = await client.fetchMessages('tanya_strelchuk_blog')
// 	const grouped = client.groupMessages(messages)
// 	const simplified = await client.simplifyMessages(grouped, 'tanya_strelchuk_blog')
// 	const localPrisma = new PrismaClient({
// 		log: ["query", "info", "warn", "error"],
// 		datasources: {
// 			db: {
// 				url: process.env.LOCAL_DB_URL
// 			}
// 		}
// 	});
// 	const supabasePrisma = new PrismaClient({
// 		log: ["query", "info", "warn", "error"],
// 		datasources: {
// 			db: {
// 				url: process.env.SUPABASE_DB_URL
// 			}
// 		}
// 	});
// 	for (const msg of simplified) {
// 		const tgPostInLocal = await localPrisma.telegramPost.upsert({
// 			where: { id: msg.id.toString() },
// 			update: {
// 				id: msg.id.toString(),
// 				text: msg.text,
// 				date: msg.date,
// 				postLink: msg.postLink || '',
// 			}, create: {
// 				id: msg.id.toString(),
// 				text: msg.text,
// 				date: msg.date,
// 				postLink: msg.postLink || '',
// 			}
// 		})
// 		// const tgPostInSupabase = await supabasePrisma.telegramPost.upsert({
// 		// 	where: { id: msg.id.toString() },
// 		// 	update: {
// 		// 		id: msg.id.toString(),
// 		// 		text: msg.text,
// 		// 		date: msg.date,
// 		// 		postLink: msg.postLink || '',
// 		// 	}, create: {
// 		// 		id: msg.id.toString(),
// 		// 		text: msg.text,
// 		// 		date: msg.date,
// 		// 		postLink: msg.postLink || '',
// 		// 	}
// 		// })
// 		if (msg.photoPaths?.length) {
// 			const localPaths = msg.photoPaths
// 			const fileNames = msg.photoPaths.map(p => path.basename(p))
// 			await localPrisma.image.createMany({
// 				data: localPaths.map((p) => ({
// 					path: p,
// 					telegramPostId: tgPostInLocal.id,
// 				})),
// 				skipDuplicates: true
// 			})
// 			// await supabasePrisma.image.createMany({
// 			// 	data: fileNames.map(name => ({
// 			// 		path: name, // 'post-123-0.jpg'
// 			// 		telegramPostId: tgPostInSupabase.id,
// 			// 	})),
// 			// 	skipDuplicates: true
// 			// })

// 		}
// 	}

// 	fs.writeFileSync(outputFile, JSON.stringify(simplified, null, 2))
// 	console.log(`Сохранено ${messages.length} сообщений`)
// 	client.stop()
// }

// main()
