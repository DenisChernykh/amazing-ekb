import quizData from '@/app/quiz/data.json'
import { Answer, QuizResult, QuizReturn } from '@/utils/types'
import { useState } from 'react'


export function useQuiz(): QuizReturn {
	const { questions } = quizData
	const [currentIndex, setCurrentIndex] = useState<number>(0)
	const [userAnswers, setUserAnswers] = useState<Answer[]>([])
	const [showResults, setShowResults] = useState<boolean>(false)
	const questionNumber = currentIndex + 1
	const currentQuestion = questions[currentIndex]
	const userAnswerForCurrentQuestion = userAnswers.find((answer) => answer.questionId === currentQuestion.id)
	const isLastQuestion = currentIndex === questions.length - 1
	const totalQuestions = questions.length
	const progress = currentIndex / totalQuestions * 100
	const allQuestionsAnswered = userAnswers.length === questions.length


	const calculateCorrectAnswers = () => {
		return userAnswers.reduce((totalPoints, userAnswer) => {
			const relatedAnswer = questions.find((question) => question.id === userAnswer.questionId)
			const isCorrect = relatedAnswer?.correctAnswer === userAnswer.selected
			return isCorrect ? totalPoints + 1 : totalPoints
		}, 0)
	}
	const getResults = (): QuizResult[] => {
		return questions.map((question) => {
			const relatedAnswer = userAnswers.find((userAnswer) => userAnswer.questionId === question.id)
			const isCorrect = relatedAnswer?.selected === question.correctAnswer
			return {
				id: question.id,
				question: question.question,
				selected: relatedAnswer?.selected,
				correctAnswer: question.correctAnswer,
				isCorrect
			}
		})
	}
	const handleNext = () => {
		if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1)
		if (allQuestionsAnswered) setShowResults(true)
	}
	const handleAnswer = (selected: string) => {
		setUserAnswers((prevAnswer) => {
			const filtered = prevAnswer.filter((a) => a.questionId !== currentQuestion.id)
			return [...filtered, { questionId: currentQuestion.id, selected }]
		})
	}
	const handleRepeatQuiz = () => {
		setCurrentIndex(0)
		setUserAnswers([])
		setShowResults(false)
	}
	return { currentQuestion, questionNumber, totalQuestions, handleAnswer, userAnswers, handleNext, userAnswerForCurrentQuestion, isLastQuestion, showResults, progress, calculateCorrectAnswers, getResults, handleRepeatQuiz }
}