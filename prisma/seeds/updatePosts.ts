import { PrismaClient } from "@prisma/client";

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

async function seedDatabase(prisma: PrismaClient, dbName: 'local' | 'supabase') {
	try {
		console.log(`🚀 Начало заполнения базы: ${dbName}`);
		await prisma.$connect();
		console.log(`🟢 Подключено к базе данных: ${dbName}`);
		const posts = await prisma.post.findMany({
			where: {
				tgPostUrl: {
					startsWith: 'https://t.me/c/1716498217/'
				}
			}
		})
		for (const post of posts) {
			if (!post.tgPostUrl) continue
			const newUrl = post.tgPostUrl.replace('https://t.me/c/1716498217/', 'https://t.me/tanya_strelchuk_blog/')
			await prisma.post.update({
				where: { id: post.id },
				data: {
					tgPostUrl: newUrl
				}
			})
			console.log(`Обновлен пост ${post.id}:${newUrl}`);
		}


	} catch (error) {
		console.error(`❌ Ошибка в ${dbName}:`, error);
	} finally {
		await prisma.$disconnect();
		console.log(`🔌 Соединение с ${dbName} закрыто`);
	}
}

async function main() {
	await Promise.all([
		seedDatabase(localPrisma, "local"),
		seedDatabase(supabasePrisma, "supabase")
	]);
}

main().catch((e) => {
	console.error("Ошибка в main:", e);
	process.exit(1);
});