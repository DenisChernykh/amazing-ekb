import { Result } from "@/utils/types";
import WrongItem from "./WrongItem";
import RightItem from "./RightItem";
import { cn } from "@/lib/utils";
import ResultsButtons from "./ResultsButtons";

type ResultsProps = {
  calculateCorrectAnswers: () => number;
  totalQuestions: number;
  getResults: () => Result[];
  handleRepeatQuiz: () => void;
};
function Results({
  calculateCorrectAnswers,
  getResults,
  totalQuestions,
  handleRepeatQuiz,
}: ResultsProps) {
  const results = getResults();
  return (
    <>
      <h3 className="mb-4 text-2xl font-bold">Ты прошел квиз!</h3>
      <p className="mb-4">
        Правильных ответов: {calculateCorrectAnswers()} из {totalQuestions}
      </p>
      <p className="mb-4 font-bold">Твои ответы:</p>
      <ul className="mb-8 flex grow flex-col gap-4">
        {results.map((res) => (
          <li
            key={res.id}
            className={cn(
              "flex flex-wrap justify-between rounded-2xl border-1 p-2",
              res.isCorrect && "flex-nowrap",
            )}
          >
            {res.isCorrect ? (
              <RightItem question={res.question} />
            ) : (
              <WrongItem
                question={res.question}
                correctAnswer={res.correctAnswer}
              />
            )}
          </li>
        ))}
      </ul>
      <ResultsButtons handleRepeatQuiz={handleRepeatQuiz} />
    </>
  );
}

export default Results;
