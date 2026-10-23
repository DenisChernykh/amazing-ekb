import QuizClientComponent from "@/components/features/Quiz/QuizClientComponent";

function page() {
  return (
    <div className="mx-auto flex w-full max-w-[1160px] grow flex-col px-5 py-10">
      <QuizClientComponent />
    </div>
  );
}

export default page;
