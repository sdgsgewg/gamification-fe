import QuestionNavigationBar from "@/app/components/shared/navigation-bar/QuestionNavigationBar";
import { AttemptTaskQuestionCard } from "@/app/components/shared/cards";

export const AttemptQuestionView = ({
  questions,
  selectedIndex,
  setSelectedIndex,
  answers,
  onSelectOption,
  onChangeText,
  scrollRef,
}: any) => {
  const current = questions[selectedIndex];

  return (
    <>
      <QuestionNavigationBar
        questions={questions}
        selectedQuestionIndex={selectedIndex}
        setSelectedQuestionIndex={setSelectedIndex}
        answers={answers}
        scrollContainerRef={scrollRef}
      />

      <AttemptTaskQuestionCard
        index={selectedIndex}
        question={current}
        selectedOptionId={answers[current.questionId]?.optionId}
        answerText={answers[current.questionId]?.answerText}
        onOptionSelect={(id) => onSelectOption(current.questionId, id)}
        onAnswerChange={(text) => onChangeText(current.questionId, text)}
      />
    </>
  );
};
