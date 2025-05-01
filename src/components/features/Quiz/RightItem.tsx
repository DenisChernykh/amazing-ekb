import { Check } from "lucide-react";
type RightItemProps = {
  question: string;
};

function RightItem({ question }: RightItemProps) {
  return (
    <>
      <div>{question}</div>
      <Check />
    </>
  );
}

export default RightItem;
