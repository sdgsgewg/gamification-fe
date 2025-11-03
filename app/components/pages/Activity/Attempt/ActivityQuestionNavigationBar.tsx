"use client";

import React, { RefObject } from "react";
import Button from "@/app/components/shared/Button";

interface Props {
  questions: { questionId: string }[];
  selectedQuestionIndex: number;
  setSelectedQuestionIndex: (idx: number) => void;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  answers: Record<
    string,
    { optionId?: string | null; answerText?: string | null }
  >; // ✅ tambahkan prop ini
}

const ActivityQuestionNavigationBar = ({
  questions,
  selectedQuestionIndex,
  setSelectedQuestionIndex,
  scrollContainerRef,
  answers,
}: Props) => {
  return (
    <div className="w-full flex items-center mb-6 border-b border-b-primary">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto custom-thin-scrollbar max-w-full"
      >
        {questions.map((q, idx) => {
          const answer = answers[q.questionId];
          const isAnswered = !!(answer?.optionId || answer?.answerText);

          return (
            <div key={q.questionId} className="relative">
              <Button
                size="middle"
                onClick={() => setSelectedQuestionIndex(idx)}
                className={`relative flex items-center gap-3 !px-10 !py-1 !border-none !rounded-t-lg !rounded-b-none text-sm transition-all duration-150
                  ${
                    selectedQuestionIndex === idx
                      ? "!bg-primary !text-light"
                      : "!bg-background hover:!bg-background-hover !text-dark"
                  }
                  ${isAnswered ? "border-b-4 border-green-500" : ""}
                `}
              >
                Soal {idx + 1}
                {isAnswered && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityQuestionNavigationBar;
