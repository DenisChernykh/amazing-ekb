import { PrismaTelegramPostRepository } from "@/adapters/PrismaTelegramPostRepository"
import { PostSyncService } from "@/services/PostSyncService"
import { TelegramClientService } from "@/services/TelegramClientService"
import { UpsertTelegramPostUseCase } from "@/use-cases/UpsertTelegramPostUseCase"
import { PrismaClient } from "@prisma/client"

const main = async () => {
	const localDb = new PrismaClient({
		datasources: {
			db: {
				url: process.env.LOCAL_DB_URL
			}
		}
	})

	const supabaseDb = new PrismaClient({
		datasources: {
			db: {
				url: process.env.SUPABASE_DB_URL
			}
		}
	})

	const localRepo = new PrismaTelegramPostRepository(localDb)
	const supabaseRepo = new PrismaTelegramPostRepository(supabaseDb)
	const upsertLocal = new UpsertTelegramPostUseCase(localRepo)
	const upsertSupabase = new UpsertTelegramPostUseCase(supabaseRepo)

	const tgClient = new TelegramClientService({
		apiId: +process.env.TG_API_ID!,
		apiHash: process.env.TG_API_HASH!,
		sessionName: process.env.TG_SESSION_NAME!
	})
	const syncService = new PostSyncService(tgClient, [upsertLocal, upsertSupabase])
	const posts = await syncService.sync('tanya_strelchuk_blog')
	console.log(`Сохранено ${posts.length} сообщений`)
}

main()