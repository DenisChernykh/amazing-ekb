import { PrismaClient } from "@prisma/client";
import telegramPosts from '../../scripts/messages.json';

// Создаем два экземпляра PrismaClient для разных БД
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
		// Для Supabase используем полный URL к хранилищу
		return `https://hqajvfrvzozkuqhnxdyl.supabase.co/storage/v1/object/public/post-images/post-${postId}/${filename}`;
	} else {
		// Для локальной БД используем относительный путь или локальный URL
		return `/images/${filename}`;
		// Или, если у вас есть локальный сервер для фото:
		// return `http://localhost:3000/photos/post-${postId}/${filename}`;
	}
};


async function seedDatabase(prisma: PrismaClient, dbName: 'local' | 'supabase') {
	try {
		console.log(`🚀 Начало заполнения базы: ${dbName}`);


		await prisma.$connect();
		console.log(`🟢 Подключено к базе данных: ${dbName}`);

		// Log the start of the seeding process
		// Очистка старых данных

		// Connect to the database
		await prisma.image.deleteMany();
		await prisma.telegramPost.deleteMany();
		console.log(`🧹 Очищены старые данные в ${dbName}`);

		// Clear old data from 'photo' and 'telegramPost' tables
		// Добавление новых данных
		for (const telegramPost of telegramPosts) {
			const postId = telegramPost.id.toString();

			console.log(`📦 Обработка поста ${postId} в ${dbName}`);
			// Iterate over telegramPosts array to insert new data
			const imageData = telegramPost.images.map((image) => ({
				filename: image,
				imageUrl: getPhotoUrl(image, postId, dbName)

			}));
			// Log the processing of each post

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

		console.log(`🎉 Все посты успешно добавлены в ${dbName}`);
	} catch (error) {
		console.error(`❌ Ошибка в ${dbName}:`, error);
	} finally {
		await prisma.$disconnect();
		console.log(`🔌 Соединение с ${dbName} закрыто`);
	}
}

async function main() {
	// Запускаем заполнение для обеих БД
	await Promise.all([
		seedDatabase(localPrisma, "local"),
		seedDatabase(supabasePrisma, "supabase")
	]);
}

// Запуск main
main().catch((e) => {
	console.error("Ошибка в main:", e);
	process.exit(1);
});