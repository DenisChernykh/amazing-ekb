import { X } from "lucide-react";

type WrongItemProps = {
  correctAnswer: string;
  question: string;
};
function WrongItem({ correctAnswer, question }: WrongItemProps) {
  return (
    <>
      <div className="mb-4 flex basis-full items-center justify-between gap-4">
        <div>{question}</div>
        <X />
      </div>
      <div className="bg-muted flex w-full items-center justify-between gap-2 rounded-2xl p-2">
        <span>Правильный ответ:</span>
        <span className="bg-primary inline-block rounded-2xl pt-2 pr-4 pb-2 pl-4 text-white">
          {correctAnswer}
        </span>
      </div>
    </>
  );
}

export default WrongItem;
