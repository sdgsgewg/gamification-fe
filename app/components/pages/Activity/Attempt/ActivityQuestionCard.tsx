"use client";

import React from "react";
import { Card, Image, Input, Tag } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { QuestionType, QuestionTypeLabels } from "@/app/enums/QuestionType";
import { Question } from "@/app/interface/activities/responses/IActivityWithQuestionsResponse";
import { getImageSrc } from "@/app/utils/image";

interface ActivityQuestionCardProps {
  index: number;
  question: Question;
  selectedOptionId?: string | null;
  answerText?: string;
  onOptionSelect?: (optionId: string) => void;
  onAnswerChange?: (text: string) => void;
}

const ActivityQuestionCard = ({
  index,
  question,
  selectedOptionId,
  answerText,
  onOptionSelect,
  onAnswerChange,
}: ActivityQuestionCardProps) => {
  const imageSrc = question.image ? getImageSrc(question.image) : undefined;

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-dark">{`Soal ${index + 1}`}</span>
            <Tag color="blue">
              {QuestionTypeLabels[question.type as QuestionType] ||
                question.type}
            </Tag>
          </div>
          <div className="flex items-center gap-2">
            <Tag color="blue" className="!m-0">{`Poin: ${question.point}`}</Tag>
            {question.timeLimit && (
              <Tag
                color="purple"
                icon={<ClockCircleOutlined />}
                className="!m-0"
              >
                {`${question.timeLimit} detik`}
              </Tag>
            )}
          </div>
        </div>
      }
      className="!bg-background !border !border-br-primary shadow-sm rounded-lg"
      headStyle={{
        backgroundColor: "var(--color-tertiary)",
        fontWeight: "bold",
        borderBottom: "1px solid var(--border-primary)",
        borderColor: "var(--border-primary)",
      }}
    >
      {imageSrc && (
        <div className="my-2">
          <Image src={imageSrc} alt={`Soal ${index + 1}`} width={200} />
        </div>
      )}

      <p className="text-dark text-base mb-2">{question.text}</p>

      {/* === PILIHAN GANDA === */}
      {question.type === "multiple_choice" && question.options && (
        <div className="flex flex-col gap-3 mt-3">
          {question.options.map((opt, optIndex) => {
            // Label opsi: A, B, C, D, E...
            const optionLabel = String.fromCharCode(65 + optIndex);

            return (
              <button
                key={opt.optionId}
                onClick={() => onOptionSelect?.(opt.optionId)}
                className={`bg-surface w-full flex items-center gap-3 text-left px-4 py-2 rounded-lg border ${
                  selectedOptionId === opt.optionId
                    ? "border-primary !bg-tertiary"
                    : "border-light-accent hover:bg-light-emphasis"
                } cursor-pointer`}
              >
                <span className="bg-secondary font-semibold text-dark py-1 px-3 rounded-full">
                  {optionLabel}
                </span>
                <span
                  className={`text-dark ${
                    selectedOptionId === opt.optionId
                      ? "font-semibold"
                      : "font-normal"
                  }`}
                >
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* === TRUE OR FALSE === */}
      {question.type === "true_false" && question.options && (
        <div className="flex flex-col gap-3 mt-3">
          {question.options.map((opt) => (
            <button
              key={opt.optionId}
              onClick={() => onOptionSelect?.(opt.optionId)}
              className={`bg-surface w-full text-left px-4 py-2 rounded-lg border ${
                selectedOptionId === opt.optionId
                  ? "border-primary !bg-blue-100"
                  : "border-light-accent hover:bg-light-emphasis"
              } cursor-pointer`}
            >
              <span className="text-dark">{opt.text}</span>
            </button>
          ))}
        </div>
      )}

      {/* === ISIAN / ESSAY === */}
      {(question.type === "fill_blank" || question.type === "essay") && (
        <Input.TextArea
          rows={4}
          value={answerText || ""}
          onChange={(e) => onAnswerChange?.(e.target.value)}
          placeholder="Tuliskan jawaban Anda..."
        />
      )}
    </Card>
  );
};

export default ActivityQuestionCard;
