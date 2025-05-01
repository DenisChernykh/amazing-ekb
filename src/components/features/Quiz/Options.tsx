import { Button } from "@/components/ui/button";

type OptionsProps = {
  options: string[];
  handleAnswer: (selected: string) => void;
  userAnswerForCurrentQuestion?: { selected: string };
};
function Options({
  options,
  handleAnswer,
  userAnswerForCurrentQuestion,
}: OptionsProps) {
  return (
    <ul className="mb-4 flex grow flex-col gap-4">
      {options.map((option) => {
        const isSelected = userAnswerForCurrentQuestion?.selected === option;
        return (
          <li onClick={() => handleAnswer(option)} key={option}>
            <Button
              className={`w-full ${isSelected ? "bg-primary hover:bg-primary text-white hover:text-white" : ""}`}
              variant="outline"
            >
              {option}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

export default Options;
