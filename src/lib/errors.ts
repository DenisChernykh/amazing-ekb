export class AppError extends Error {
	public readonly isOperational: boolean

	constructor(message: string, isOperational = true) {
		super(message)
		this.isOperational = isOperational
		Object.setPrototypeOf(this, new.target.prototype)
	}
}

export class ValidationError extends AppError { }
export class ConflictError extends AppError { }

export const Errors = {
	Validation: (message: string) => new ValidationError(message),
	Conflict: (message: string) => new ConflictError(message),
}

export function handleError(error: unknown): { success: false, message: string } {
	if (error instanceof AppError) {
		if (error.isOperational) {
			return { success: false, message: error.message }
		} else {
			console.error('Внутренняя ошибка:', error)
			return { success: false, message: 'Внутренняя ошибка сервера' }
		}
	}
	console.error('Неизвестная ошибка:', error)
	return { success: false, message: 'Внутренняя ошибка сервера' }
}