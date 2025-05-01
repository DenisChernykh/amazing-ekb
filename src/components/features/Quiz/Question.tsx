type QuestionProps = {
  question: string;
};
function Question({ question }: QuestionProps) {
  return <h3 className="mb-4 text-2xl font-bold">{question}</h3>;
}

export default Question;
