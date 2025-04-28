import { PrismaClient } from "@prisma/client";
import telegramPosts from '../../scripts/messages.json';

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

const getPhotoUrl = (filename: string, postId: string, targetDb: 'local' | 'supabase') => {
	if (targetDb === 'supabase') {
		return `https://hqajvfrvzozkuqhnxdyl.supabase.co/storage/v1/object/public/post-images/post-${postId}/${filename}`;
	} else {
		return `/images/${filename}`;
	}
};

async function seedDatabase(prisma: PrismaClient, dbName: 'local' | 'supabase') {
	try {
		console.log(`🚀 Начало заполнения базы: ${dbName}`);
		await prisma.$connect();
		console.log(`🟢 Подключено к базе данных: ${dbName}`);

		for (const telegramPost of telegramPosts) {
			const postId = telegramPost.id.toString();

			// Проверяем, существует ли уже пост
			const existingPost = await prisma.telegramPost.findUnique({
				where: { id: postId },
				include: { images: true }
			});

			if (existingPost) {
				console.log(`⏩ Пост ${postId} уже существует в ${dbName}, пропускаем`);
				continue;
			}

			console.log(`📦 Обработка поста ${postId} в ${dbName}`);

			const imageData = telegramPost.images.map((image) => ({
				filename: image,
				imageUrl: getPhotoUrl(image, postId, dbName)
			}));

			await prisma.telegramPost.create({
				data: {
					id: postId,
					text: telegramPost.text,
					date: new Date(telegramPost.date),
					postLink: telegramPost.postLink,
					images: {
						create: imageData
					}
				},
			});

			console.log(`✅ Пост ${postId} добавлен в ${dbName}`);
		}

		console.log(`🎉 Все новые посты успешно добавлены в ${dbName}`);
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