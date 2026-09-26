import { ZodIssue } from "zod";

export type Category = {
	id: string;
	name: string;
};
export type Post = {
	id: string;
	title: string;
	category: Category;
	telegramPost: TelegramPost;
	price: string;
	mapUrl: string;
}
export type ImageType = {
	id: string;
	path: string;
	altText: string | null;
	mainImage: boolean
};

export type GroupedMessage = {
	id: number,
	text: string,
	date: Date,
	channelId: string,
	postLink?: string,
	photoPaths: { localPath: string }[]
}

export type TelegramPost = {
	id: string;
	date: Date
	postLink: string
	images: ImageType[]
	text: string
};

export type Answer = {
	questionId: number
	selected: string
};

export type Question = {
	id: number
	question: string
	options: string[]
	correctAnswer: string
}
export type QuizResult = {
	id: number
	question: string
	selected: string | undefined
	isCorrect: boolean
	correctAnswer: string
}
export type QuizReturn = {
	currentQuestion: Question
	handleAnswer: (selected: string) => void
	userAnswers: Answer[]
	handleNext: () => void
	userAnswerForCurrentQuestion?: Answer
	isLastQuestion: boolean
	showResults: boolean
	progress: number
	calculateCorrectAnswers: () => number
	totalQuestions: number
	questionNumber: number
	getResults: () => QuizResult[]
	handleRepeatQuiz: () => void

}



export type ResultType<T, E = AppErrorCode> = | { success: true, data: T } | { success: false, error: E; meta?: Record<string, unknown>; }
export const AppErrorCode = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  ASSET_NOT_PUBLISHED: 'ASSET_NOT_PUBLISHED',
  READ_ONLY: 'READ_ONLY',

	CATEGORY_NOT_FOUND: "CATEGORY_NOT_FOUND",
	VALIDATION_ERROR: 'VALIDATION_ERROR',
	UNKNOWN_ERROR: 'UNKNOWN_ERROR',
	UNIQUE_CONSTRAINT_VIOLATION: 'UNIQUE_CONSTRAINT_VIOLATION',
	FOREIGN_KEY_VIOLATION: 'FOREIGN_KEY_VIOLATION',
	NOT_NULL_VIOLATION: 'NOT_NULL_VIOLATION',
	DATABASE_CONNECTION_ERROR: 'DATABASE_CONNECTION_ERROR',
	DATABASE_ERROR: 'DATABASE_ERROR',
	IMAGE_NOT_FOUND: 'IMAGE_NOT_FOUND',
	IMAGE_NOT_LINKED_TO_POST: 'IMAGE_NOT_LINKED_TO_POST',
	CATEGORY_ALREADY_EXISTS: 'CATEGORY_ALREADY_EXISTS'
} as const
export type AppErrorCode = typeof AppErrorCode[keyof typeof AppErrorCode]
export type CreatePostInput = {
	title: string
	price: string
	mapUrl: string
	categoryId: string
	telegramPostId: string
}
export type createCategoryInput = {
	name: string
}

export type ApiResponse<T = unknown, E = string> = | { success: true, data: T; message?: string } | { success: false; error: E; errors?: ZodIssue[]; message?: string }

export type DecodedError = {
	error: AppErrorCode;
	meta?: Record<string, unknown>
}
