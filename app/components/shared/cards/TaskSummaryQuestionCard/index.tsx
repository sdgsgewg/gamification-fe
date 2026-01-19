"use client";

import React from "react";
import { Card, Image, Input, Tag } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { QuestionType, QuestionTypeLabels } from "@/app/enums/QuestionType";
import { QuestionResponse } from "@/app/interface/task-questions/responses/IQuestionResponse";
import { getImageSrc } from "@/app/utils/image";

interface TaskSummaryQuestionCardProps {
  index: number;
  question: QuestionResponse;
  selectedOptionId?: string | null;
  answerText?: string;
}

const TaskSummaryQuestionCard = ({
  index,
  question,
  selectedOptionId,
  answerText,
}: TaskSummaryQuestionCardProps) => {
  const imageSrc = question.image ? getImageSrc(question.image) : undefined;

  // DATA DARI USER ANSWER (LOG)
  const answerLog = question.userAnswer;
  const pointAwarded = answerLog?.pointAwarded ?? null;
  const teacherNotes = answerLog?.teacherNotes ?? "";

  // Tentukan apakah jawaban user benar
  const selectedOption = question.options?.find(
    (opt) => opt.optionId === selectedOptionId
  );

  const correctAnswerText =
    question.options?.map((opt) => opt.text).join(",") ?? ""; // fallback kalau tidak ada
  const isCorrectAnswer =
    question.type === QuestionType.FILL_BLANK ||
    question.type === QuestionType.ESSAY
      ? answerText?.trim().toLowerCase() ===
        correctAnswerText?.trim().toLowerCase()
      : selectedOption?.isCorrect ?? false;

  const isAnswered = !!selectedOptionId || !!answerText;

  // Tentukan warna border card
  let cardBorderColor = "!border-br-primary";
  if (isAnswered) {
    cardBorderColor = isCorrectAnswer ? "border-green-500" : "border-red-500";
  }

  return (
    <Card
      title={
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-dark font-semibold">{`Question ${
              index + 1
            }`}</span>
            <Tag color="blue">
              {QuestionTypeLabels[question.type as QuestionType] ||
                question.type}
            </Tag>
          </div>

          <div className="flex items-center gap-2">
            {/* Time Limit */}
            {question.timeLimit && (
              <Tag
                color="purple"
                icon={<ClockCircleOutlined />}
                className="m-0!"
              >
                {`${question.timeLimit} detik`}
              </Tag>
            )}

            {/* Point */}
            <Tag color="blue" className="m-0!">{`Point: ${question.point}`}</Tag>

            {/* Status Benar/Salah */}
            {isAnswered && (
              <Tag
                color={isCorrectAnswer ? "green" : "red"}
                className="font-semibold flex items-center m-0!"
              >
                <FontAwesomeIcon
                  icon={isCorrectAnswer ? faCheckCircle : faTimesCircle}
                  size="1x"
                  className={`${
                    isCorrectAnswer ? "text-green-500" : "text-red-500"
                  } text-base`}
                />
                <span className="ms-1">
                  {isCorrectAnswer ? "Correct" : "Wrong"}
                </span>
              </Tag>
            )}
          </div>
        </div>
      }
      className={`bg-background! shadow-md rounded-lg transition-all duration-300 border-2 ${cardBorderColor}`}
      headStyle={{
        backgroundColor: "var(--color-tertiary)",
        fontWeight: "bold",
        borderBottom: "1px solid var(--border-primary)",
        borderColor: "var(--border-primary)",
      }}
    >
      {imageSrc && (
        <div className="my-3 flex justify-center">
          <Image src={imageSrc} alt={`Question ${index + 1}`} width={240} />
        </div>
      )}
      <p className="text-dark text-base mb-4">{question.text}</p>

      {/* === PILIHAN GANDA === */}
      {question.type === "multiple_choice" && question.options && (
        <div className="flex flex-col gap-3 mt-3">
          {question.options.map((opt, optIndex) => {
            const isSelected = selectedOptionId === opt.optionId;
            const isCorrect = opt.isCorrect;
            const isAnsweredWrong = isSelected && !isCorrect;

            // Label opsi: A, B, C, D, E...
            const optionLabel = String.fromCharCode(65 + optIndex);

            // Tentukan status visual opsi
            let bgColor = "bg-surface";
            let borderColor = "border-light-accent";
            let icon = null;

            if (isSelected && isCorrect) {
              bgColor = "bg-correct-answer";
              borderColor = "border-green-500";
              icon = (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-green-500 text-lg"
                />
              );
            } else if (isAnsweredWrong) {
              bgColor = "bg-incorrect-answer";
              borderColor = "border-red-500";
              icon = (
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  className="text-red-500 text-lg"
                />
              );
            } else if (!isSelected && isCorrect && selectedOptionId) {
              // Tampilkan jawaban benar kalau user salah
              bgColor = "bg-correct-option";
              borderColor = "border-green-400";
              icon = (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-green-500 text-lg"
                />
              );
            }

            return (
              <div
                key={opt.optionId}
                className={`transition-all duration-300 ${bgColor} ${borderColor} border rounded-lg px-4 py-2 flex justify-between items-center shadow-sm`}
              >
                <div className="flex items-center gap-3">
                  <span className="bg-secondary font-semibold text-dark py-1 px-3 rounded-full">
                    {optionLabel}.
                  </span>
                  <span
                    className={`text-dark ${
                      isSelected ? "font-semibold" : "font-normal"
                    }`}
                  >
                    {opt.text}
                  </span>
                </div>
                {icon}
              </div>
            );
          })}
        </div>
      )}

      {/* === TRUE OR FALSE === */}
      {question.type === QuestionType.TRUE_FALSE && question.options && (
        <div className="flex flex-col gap-3 mt-3">
          {question.options.map((opt) => {
            const isSelected = selectedOptionId === opt.optionId;
            const isCorrect = opt.isCorrect;
            const isAnsweredWrong = isSelected && !isCorrect;

            // Tentukan status visual opsi
            let bgColor = "bg-surface";
            let borderColor = "border-light-accent";
            let icon = null;

            if (isSelected && isCorrect) {
              bgColor = "bg-correct-answer";
              borderColor = "border-green-500";
              icon = (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-green-500 text-lg"
                />
              );
            } else if (isAnsweredWrong) {
              bgColor = "bg-incorrect-answer";
              borderColor = "border-red-500";
              icon = (
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  className="text-red-500 text-lg"
                />
              );
            } else if (!isSelected && isCorrect && selectedOptionId) {
              // Tampilkan jawaban benar kalau user salah
              bgColor = "bg-correct-option";
              borderColor = "border-green-400";
              icon = (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-green-500 text-lg"
                />
              );
            }

            return (
              <div
                key={opt.optionId}
                className={`transition-all duration-300 ${bgColor} ${borderColor} border rounded-lg px-4 py-2 flex justify-between items-center shadow-sm`}
              >
                <span
                  className={`text-dark ${
                    isSelected ? "font-semibold" : "font-normal"
                  }`}
                >
                  {opt.text}
                </span>
                {icon}
              </div>
            );
          })}
        </div>
      )}

      {/* === ISIAN / ESSAY === */}
      {(question.type === QuestionType.FILL_BLANK ||
        question.type === QuestionType.ESSAY) && (
        <div className="flex flex-col gap-3 mt-3">
          <Input.TextArea
            rows={3}
            value={answerText || ""}
            readOnly
            style={{
              backgroundColor: isCorrectAnswer ? "#e6ffed" : "#fff1f0",
              borderColor: isCorrectAnswer ? "#52c41a" : "#ff4d4f",
              color: "#333",
            }}
          />
          {!isCorrectAnswer && correctAnswerText && (
            <>
              <label className="text-dark font-medium">Correct Answer:</label>
              <div className="border border-green-400 bg-correct-answer p-2 rounded-md text-dark">
                {correctAnswerText}
              </div>
            </>
          )}
        </div>
      )}

      {/* === POINT AWARDED & CATATAN GURU === */}
      <div className="mt-4 flex flex-col gap-2">
        {pointAwarded !== null && (
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-dark">Points awarded:</span>
            <span className="font-semibold text-dark">{`${pointAwarded} / ${question.point}`}</span>
          </div>
        )}

        {teacherNotes && (
          <div className="mt-1">
            <div className="text-sm font-medium text-dark mb-1">Notes:</div>
            <div className="border border-light-accent bg-surface p-2 rounded-md text-sm text-dark whitespace-pre-line">
              {teacherNotes}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TaskSummaryQuestionCard;
