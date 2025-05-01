export type Category = {
	id: string;
	name: string;
};
export type Post = {
	id: string;
	createdAt: Date;
	title: string;
	tgPostUrl: string;
	category: Category;
	images: ImageType[];
	price: string;
	mapUrl: string;

}
export type ImageType = {
	id: string;
	imageUrl: string | null;
	altText: string | null;
	mainImage: boolean | null;
};



export type TelegramPost = {
	id: string
	text: string
	date: Date
	postLink: string
	images: ImageType[]
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
export type Result = {
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
	getResults: () => Result[]
	handleRepeatQuiz: () => void

}