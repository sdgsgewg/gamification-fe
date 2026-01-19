import { useState } from "react";

export const useAttemptAnswers = () => {
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const selectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { optionId, answerText: null },
    }));
  };

  const changeText = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { optionId: null, answerText: text },
    }));
  };

  const answeredCount = Object.values(answers).filter(
    (a) => a.optionId || a.answerText,
  ).length;

  const hasAnsweredAtLeastOne = answeredCount > 0;

  return {
    answers,
    setAnswers,
    selectOption,
    changeText,
    answeredCount,
    hasAnsweredAtLeastOne,
  };
};
