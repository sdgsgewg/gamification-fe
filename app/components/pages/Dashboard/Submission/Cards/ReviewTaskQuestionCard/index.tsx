"use client";

import React from "react";
import { Card, Input, Tag } from "antd";
import {
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { QuestionType, QuestionTypeLabels } from "@/app/enums/QuestionType";
import { Question } from "@/app/interface/activities/responses/IActivityWithQuestionsResponse";
import { getImageSrc } from "@/app/utils/image";
import Image from "next/image";

interface ReviewTaskQuestionCardProps {
  index: number;
  question: Question;
  answerLog?: {
    isCorrect?: boolean | null;
    pointAwarded?: number | null;
    teacherNotes?: string | null;
  };
  onCorrectChange?: (isCorrect: boolean) => void;
  onPointChange?: (point: number) => void;
  onTeacherNotesChange?: (text: string) => void;
}

const ReviewTaskQuestionCard = ({
  index,
  question,
  answerLog,
  onCorrectChange,
  onPointChange,
  onTeacherNotesChange,
}: ReviewTaskQuestionCardProps) => {
  const imageSrc = question.image ? getImageSrc(question.image) : undefined;

  // Cek apakah soal ini auto-reviewed (MC / True-False)
  const isAutoReviewed =
    question.type === QuestionType.MULTIPLE_CHOICE ||
    question.type === QuestionType.TRUE_FALSE;

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-dark font-medium">{`Question ${
              index + 1
            }`}</span>
            <Tag color="blue">
              {QuestionTypeLabels[question.type as QuestionType] ||
                question.type}
            </Tag>
          </div>
          <div className="flex items-center gap-2">
            <Tag
              color="blue"
              className="!m-0"
            >{`Points: ${question.point}`}</Tag>
            {question.timeLimit && (
              <Tag
                color="purple"
                icon={<ClockCircleOutlined />}
                className="!m-0"
              >
                {`${question.timeLimit} seconds`}
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
          <Image
            src={imageSrc}
            alt={`Question ${index + 1}`}
            className="w-40"
          />
        </div>
      )}

      {/* Soal */}
      <p className="text-dark text-base mb-2">{question.text}</p>

      {/* Jawaban siswa */}
      <div className="mb-4 p-3 border rounded-lg bg-surface">
        <p className="font-semibold text-dark mb-1">Student Answer:</p>
        {question.userAnswer?.text ? (
          <p className="text-dark">{question.userAnswer.text}</p>
        ) : question.userAnswer?.optionId ? (
          <p className="text-dark">
            {question.options?.find(
              (o) => o.optionId === question.userAnswer?.optionId
            )?.text ?? "No option found"}
          </p>
        ) : (
          <p className="text-gray-500 italic">No answer provided</p>
        )}
      </div>

      {isAutoReviewed ? (
        // Pesan auto-review untuk MC / True-False
        <div className="mb-3 p-3 border rounded-lg bg-gray-100 text-gray-700 italic">
          This question has been automatically reviewed by the system.
        </div>
      ) : (
        <>
          {/* Pilihan guru: benar / salah */}
          <div className="flex items-center gap-3 mb-3">
            <button
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                answerLog?.isCorrect === true
                  ? "bg-green-100 border-green-500"
                  : "bg-surface border-light-accent text-dark"
              }`}
              onClick={() => onCorrectChange?.(true)}
            >
              <CheckOutlined className="text-green-600" />
              Correct
            </button>
            <button
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                answerLog?.isCorrect === false
                  ? "bg-red-100 border-red-500"
                  : "bg-surface border-light-accent text-dark"
              }`}
              onClick={() => onCorrectChange?.(false)}
            >
              <CloseOutlined className="text-red-600" />
              Incorrect
            </button>
          </div>

          {/* Nilai */}
          <div className="mb-3">
            <p className="text-sm text-dark mb-1 font-medium">Points Awarded</p>
            <Input
              type="number"
              min={0}
              max={question.point}
              value={answerLog?.pointAwarded ?? ""}
              onChange={(e) => onPointChange?.(parseInt(e.target.value || "0"))}
              placeholder={`0 - ${question.point}`}
            />
          </div>

          {/* Catatan guru */}
          <div>
            <p className="text-sm text-dark mb-1 font-medium">{`Notes`}</p>
            <Input.TextArea
              rows={3}
              placeholder="Add feedback for the student..."
              value={answerLog?.teacherNotes ?? ""}
              onChange={(e) => onTeacherNotesChange?.(e.target.value)}
            />
          </div>
        </>
      )}
    </Card>
  );
};

export default ReviewTaskQuestionCard;
