"use client";

import { useQuiz } from "@/hooks/useQuiz";
import Question from "./Question";
import Options from "./Options";
import { Button } from "@/components/ui/button";
import Progress from "./Progress";
import Results from "./Results";

function QuizClientComponent() {
  const {
    currentQuestion,
    handleAnswer,
    handleNext,
    userAnswerForCurrentQuestion,
    isLastQuestion,
    showResults,
    calculateCorrectAnswers,
    questionNumber,
    totalQuestions,
    getResults,
    handleRepeatQuiz,
  } = useQuiz();

  if (showResults)
    return (
      <Results
        calculateCorrectAnswers={calculateCorrectAnswers}
        totalQuestions={totalQuestions}
        handleRepeatQuiz={handleRepeatQuiz}
        getResults={getResults}
      />
    );
  return (
    <>
      <Progress
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
      />
      <Question question={currentQuestion.question} />
      <Options
        options={currentQuestion.options}
        handleAnswer={handleAnswer}
        userAnswerForCurrentQuestion={userAnswerForCurrentQuestion}
      />
      <Button disabled={!userAnswerForCurrentQuestion} onClick={handleNext}>
        {isLastQuestion ? "Показать результат" : "Следующий вопрос"}
      </Button>
    </>
  );
}

export default QuizClientComponent;
