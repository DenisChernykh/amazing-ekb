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