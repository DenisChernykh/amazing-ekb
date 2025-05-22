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
	photoPaths: { localPath: string; supabasePath: string }[]
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

export type Result<T = void> =
	| { success: true; data: T; message?: string }
	| { success: false; message: string }
	| { success: true, message: string }
