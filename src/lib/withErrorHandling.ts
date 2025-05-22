import { Result } from "@/utils/types";
import { handleError } from "./errors";

export async function withErrorHandling<T>(fn: () => Promise<T>): Promise<Result<T>> {
	try {
		const data = await fn()
		return { success: true, data }

	} catch (error) {
		return handleError(error)
	}
}