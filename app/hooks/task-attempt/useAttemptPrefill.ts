import { useEffect } from "react";

export const useAttemptPrefill = (
  data: any,
  setAnswers: (value: Record<string, any>) => void,
) => {
  useEffect(() => {
    if (!data?.lastAttemptId) return;

    const prefilled: Record<string, any> = {};

    data.questions.forEach((q: any) => {
      if (q.userAnswer) {
        prefilled[q.questionId] = {
          optionId: q.userAnswer.optionId,
          answerText: q.userAnswer.text,
        };
      }
    });

    setAnswers(prefilled);
  }, [data, setAnswers]);
};
