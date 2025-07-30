import { decodePrismaError } from "./decodePrismaError"
import { AppErrorCode, ResultType } from "./types"

export function handleRepositoryError(error: unknown): ResultType<never, AppErrorCode> {
	console.error('Repository error:', error)
	const decoded = decodePrismaError(error)
	const isDev = process.env.NODE_ENV !== 'production'
	if (isDev) {
		return { success: false, error: decoded.error, meta: decoded.meta }
	} else {
		return { success: false, error: decoded.error }
	}
}