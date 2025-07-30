import { ResultType } from "@/utils/types";

export const Result = {
	ok: <T>(data: T): ResultType<T, never> => ({ success: true, data }),
	fail: <E>(error: E, meta?: Record<string, unknown>): ResultType<never, E> => meta ? { success: false, error, meta } : { success: false, error }
}