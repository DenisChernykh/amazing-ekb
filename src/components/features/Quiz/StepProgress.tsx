type StepProgressProps = {
  questionNumber: number;
  totalQuestions: number;
};
function StepProgress({
  questionNumber,
  totalQuestions,
}: StepProgressProps) {
  return (
    <div>
      <span>{questionNumber}</span>
      <span>/</span>
      <span>{totalQuestions}</span>
    </div>
  );
}

export default StepProgress;
