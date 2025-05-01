import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type ResultsButtonsProps = {
  handleRepeatQuiz: () => void;
  className?: string;
};

const ResultsButtons = ({
  className,
  handleRepeatQuiz,
}: ResultsButtonsProps) => {
  return (
    <div className={cn("flex justify-between gap-2", className)}>
      <Button asChild>
        <Link href="/">На главную</Link>
      </Button>

      <Button onClick={handleRepeatQuiz} variant="outline">
        Повторить квиз
      </Button>
    </div>
  );
};

export default ResultsButtons;
