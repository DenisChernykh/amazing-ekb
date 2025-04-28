import {  z } from "zod";

export const formSchema = z.object({
	title: z.string().min(1, {
		message: 'Место обязательно',
	}),
	price: z.string().min(1, { message: 'Введите цену' }),
	mapUrl: z.string().url({ message: 'Вставье ссылку на карту' }),
	images: z.array(
		validateFile(),
		{ message: "Выберите фото" }
	).optional(),
	category: z.string().min(1, {
		message: 'Выберите категорию из списка или создайте новую'
	}),
	telegramPost: z.string().min(1, {
		message: 'Выберите ссылку на пост'
	}),
	tgImages: z.array(z.string()),
	publishedAt: z.string().datetime()
});

function validateFile() {
	const maxUploadSize = 1024 * 1024 * 5;
	const acceptedFileTypes = [
		'image/jpeg',
		'image/png',
		'image/webp',
		'image/svg+xml',
	];
	return z.instanceof(File)
		.refine((file) => !file || file.size <= maxUploadSize, 'Размер файла должен быть меньше 5 мегабайт')
		.refine((file) => !file || acceptedFileTypes.includes(file.type), 'Файл должен быть изображением');
}

export const serverFormSchema = z.object({
	title: z.string().min(1, {
		message: 'Место обязательно',
	}),
	price: z.string().min(1, { message: 'Введите цену' }),
	mapUrl: z.string().url({ message: 'Вставье ссылку на карту' }),
	images: z.array(
		validateFile(),
		{ message: "Выберите фото" }
	).optional(),
	category: z.string().min(1, {
		message: 'Выберите категорию из списка или создайте новую'
	}),
	telegramPost: z.string().min(1, {
		message: 'Выберите ссылку на пост'
	}),
	tgImages: z.array(z.string()),
	publishedAt: z.string().datetime()
})