import { Progress as ProgressBar } from "@/components/ui/progress";
import StepProgress from "./StepProgress";

type ProgressProps = {
  questionNumber: number;
  totalQuestions: number;
};
function Progress({ questionNumber, totalQuestions }: ProgressProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <ProgressBar />
      <StepProgress
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
      />
    </div>
  );
}

export default Progress;
