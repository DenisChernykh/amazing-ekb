import { AppErrorCode } from "./types";

export function getErrorMessage(error: AppErrorCode): string {
	switch (error) {
		case 'CATEGORY_NOT_FOUND':
			return 'Категория не найдена'
		case 'DATABASE_ERROR':
			return 'Ошибка на сервере. Попробуйте позже.'
		case 'VALIDATION_ERROR':
			return 'Ошибка валидации данных.'
		case 'CATEGORY_ALREADY_EXISTS':
			return 'Такая категория уже существует'
		default:
			return 'Что-то пошло не так'
	}
}