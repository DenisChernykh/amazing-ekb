import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient({
	log: ["query", "info", "warn", "error"],
});
const url = "/images/";

async function main() {
	try {
		console.log("Скрипт начал выполнение");

		// Проверка переменных окружения
		// if (!process.env.SUPABASE_URL || !process.env.DATABASE_URL) {
		// 	console.error(
		// 		"Ошибка: SUPABASE_URL или DATABASE_URL не заданы в .env файле",
		// 	);
		// 	process.exit(1);
		// }

		console.log("URL:", url);

		// Проверка подключения к базе данных
		try {
			await prisma.$connect();
			await prisma.image.deleteMany();
			await prisma.post.deleteMany();
			await prisma.category.deleteMany();
			console.log("Все старые данные удалены");
			console.log("Подключение к базе данных успешно");
		} catch (error) {
			console.error("Ошибка подключения к базе данных:", error);
			process.exit(1);
		}

		// Проверка выполнения запроса
		try {
			const categories = await Promise.all([
				prisma.category.upsert({
					where: { name: 'SPA' },
					update: {},
					create: { name: 'SPA' }
				}),
				prisma.category.upsert({
					where: { name: 'Отели' },
					update: {},
					create: { name: 'Отели' }
				}),
				prisma.category.upsert({
					where: { name: 'Мастерклассы' },
					update: {},
					create: { name: 'Мастерклассы' }
				}),
				prisma.category.upsert({
					where: { name: 'Кафе и рестораны' },
					update: {},
					create: { name: 'Кафе и рестораны' }
				}),
			])
			const posts = await Promise.all([
				prisma.post.create({
					data: {
						title: 'Люкc в Hyatt REGENCY',
						description: 'Эстетичный отель с вдохновляющим видом на вечерний Екатеринбург',
						category: {
							connect: { id: categories[1].id }
						},
						images: {
							create: [
								{
									url: '/images/hyatt/1.jpg',
									altText: 'Раковина',
								},
								{
									url: '/images/hyatt/2.jpg',
									altText: 'Бассейн',
								},
								{
									url: '/images/hyatt/3.jpg',
									altText: 'Обед',
								},
								{
									url: '/images/hyatt/4.jpg',
									altText: 'Номер',
									mainPhoto: true
								},
								{
									url: '/images/hyatt/5.jpg',
									altText: 'Вид на ночной город',
								},
								{
									url: '/images/hyatt/6.jpg',
									altText: 'Ванна',
								},
								{
									url: '/images/hyatt/7.jpg',
									altText: 'Расслабление',
								},
								{
									url: '/images/hyatt/8.jpg',
									altText: 'Фото',
								},
								{
									url: '/images/hyatt/9.jpg',
									altText: 'Сюрприз',
								},
							]
						},
						postUrl: '152'
					}
				}),
				prisma.post.create({
					data: {
						title: 'Термы Вода',
						description: 'Термы с отелем для релакса',
						category: {
							connect: { id: categories[0].id }
						},
						images: {
							create: [
								{
									url: '/images/voda/1.jpg',
									altText: 'Бассейн>',
								},
								{
									url: '/images/voda/2.jpg',
									altText: 'Номер',
									mainPhoto: true
								},
								{
									url: '/images/voda/3.jpg',
									altText: 'Ванна',
								},
								{
									url: '/images/voda/4.jpg',
									altText: 'Еда',

								},
								{
									url: '/images/voda/5.jpg',
									altText: 'Бассейн',
								},
								{
									url: '/images/voda/6.jpg',
									altText: 'Расслабление',
								},

							]
						},
						postUrl: '204'
					}
				}),
				prisma.post.create({
					data: {
						title: 'Мастер-класс по картине акрилом',
						description: 'МАСТЕР-КЛАСС ПО КАРТИНЕ АКРИЛОМ: КОГДА ИСКУССТВО РАЗГОВАРИВАЕТ С ТВОИМ ПОДСОЗНАНИЕМ 🎨🌀',
						category: {
							connect: { id: categories[2].id }
						},
						images: {
							create: [
								{
									url: `${url}mk-acryl/1.jpg`,
									altText: 'Мальберт',
									mainPhoto: true
								},
								{
									url: `${url}mk-acryl/2.jpg`,
									altText: 'Художник',

								},
								{
									url: `${url}mk-acryl/3.jpg`,
									altText: 'Пространство',
								},
								{
									url: `${url}mk-acryl/4.jpg`,
									altText: 'Картина',

								},
								{
									url: `${url}mk-acryl/5.jpg`,
									altText: 'Пространство',
								},


							]
						},
						postUrl: '233'
					}
				}),
			])
			console.log("Добавлена категорий:", categories.length);
			console.log("Добавлена постов:", posts.length);
		} catch (error) {
			console.error("Ошибка при добавлении записей:", error);
		}

		console.log("Скрипт завершил выполнение");
	} finally {
		await prisma.$disconnect();
	}
}

// Запуск main
main().catch((e) => {
	console.error("Ошибка в main:", e);
	process.exit(1);
});
