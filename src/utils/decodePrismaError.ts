import { Prisma } from "@prisma/client";
import { DecodedError } from "./types";

export function decodePrismaError(error: unknown): DecodedError {
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		switch (error.code) {
			case 'P2002':
				return {
					error: 'UNIQUE_CONSTRAINT_VIOLATION', meta: { targer: error.meta?.target }
				}
			case 'P2003':
				return {
					error: 'FOREIGN_KEY_VIOLATION', meta: { targer: error.meta?.target }
				}
			case 'P2011':
				return {
					error: 'NOT_NULL_VIOLATION', meta: { targer: error.meta?.target }
				}
			default: {
				return { error: 'DATABASE_ERROR', meta: { code: error.code, message: error.message } }
			}
		}
	}
	if (error instanceof Prisma.PrismaClientInitializationError) {
		return { error: 'DATABASE_CONNECTION_ERROR', meta: { message: error.message } }

	}
	return {
		error: 'DATABASE_ERROR',
		meta: { message: error instanceof Error ? error.message : String(error) }
	}
}
