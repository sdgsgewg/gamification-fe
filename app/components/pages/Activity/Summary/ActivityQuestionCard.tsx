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
import { Question } from "@/app/interface/activities/responses/IActivityWithQuestionsResponse";
import { getImageSrc } from "@/app/utils/image";

interface ActivityQuestionCardProps {
  index: number;
  question: Question;
  selectedOptionId?: string | null;
  answerText?: string;
}

const ActivityQuestionCard = ({
  index,
  question,
  selectedOptionId,
  answerText,
}: ActivityQuestionCardProps) => {
  const imageSrc = question.image ? getImageSrc(question.image) : undefined;

  // Tentukan apakah jawaban user benar
  const selectedOption = question.options?.find(
    (opt) => opt.optionId === selectedOptionId
  );

  const correctAnswerText =
    question.options?.map((opt) => opt.text).join(",") ?? ""; // fallback kalau tidak ada
  const isCorrectAnswer =
    question.type === "fill_blank" || question.type === "essay"
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
            <span className="text-dark font-semibold">{`Soal ${
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
                className="!m-0"
              >
                {`${question.timeLimit} detik`}
              </Tag>
            )}

            {/* Point */}
            <Tag color="blue" className="!m-0">{`Poin: ${question.point}`}</Tag>

            {/* Status Benar/Salah */}
            {isAnswered && (
              <Tag
                color={isCorrectAnswer ? "green" : "red"}
                className="font-semibold flex items-center !m-0"
              >
                <FontAwesomeIcon
                  icon={isCorrectAnswer ? faCheckCircle : faTimesCircle}
                  size="1x"
                  className={`${
                    isCorrectAnswer ? "text-green-500" : "text-red-500"
                  } text-base`}
                />
                <span className="ms-1">
                  {isCorrectAnswer ? "Benar" : "Salah"}
                </span>
              </Tag>
            )}
          </div>
        </div>
      }
      className={`!bg-background shadow-md rounded-lg transition-all duration-300 border-2 ${cardBorderColor}`}
      headStyle={{
        backgroundColor: "var(--color-tertiary)",
        fontWeight: "bold",
        borderBottom: "1px solid var(--border-primary)",
        borderColor: "var(--border-primary)",
      }}
    >
      {imageSrc && (
        <div className="my-3 flex justify-center">
          <Image src={imageSrc} alt={`Soal ${index + 1}`} width={240} />
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
      {question.type === "true_false" && question.options && (
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
      {(question.type === "fill_blank" || question.type === "essay") && (
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
              <label className="text-dark font-medium">
                Jawaban yang Tepat:
              </label>
              <div className="border border-green-400 bg-correct-answer p-2 rounded-md text-dark">
                {correctAnswerText}
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  );
};

export default ActivityQuestionCard;
