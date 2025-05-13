// import telegramPosts from "../../scripts/messages.json";
// import { uploadToStorage } from "./uploadToStorage";

// async function main() {
// 	try {
// 		console.log("🚀 Начало загрузки изображений");

// 		for (const telegramPost of telegramPosts) {
// 			const postId = telegramPost.id.toString();
// 			console.log(`📦 Пост ${postId}: загрузка ${telegramPost.images.length} изображений`);

// 			// Загружаем все изображения для поста
// 			for (const filename of telegramPost.images) {
// 				try {
// 					await uploadToStorage(postId, filename);
// 					console.log(`✅ Загружено: ${filename}`);
// 				} catch (err) {
// 					if (err instanceof Error) {
// 						console.error(`❌ Ошибка при загрузке ${filename}:`, err.message);
// 					} else {
// 						console.error(`❌ Ошибка при загрузке ${filename}:`, err);
// 					}
// 				}
// 			}
// 		}

// 		console.log("🎉 Все изображения успешно загружены");
// 	} catch (error) {
// 		console.error("❌ Ошибка в процессе загрузки:", error);
// 	}
// }

// main().catch((e) => {
// 	console.error("Ошибка в main:", e);
// 	process.exit(1);
// });