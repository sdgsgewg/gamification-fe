"use client";

import React from "react";
import { Card, Tag, Image } from "antd";
import { TaskQuestionResponse } from "@/app/interface/tasks/responses/ITaskDetailResponse";
import { QuestionType, QuestionTypeLabels } from "@/app/enums/QuestionType";
import { CheckCircleTwoTone, ClockCircleOutlined } from "@ant-design/icons";
import { CreateTaskQuestionRequest } from "@/app/interface/tasks/requests/ICreateTaskRequest";
import { UpdateTaskQuestionRequest } from "@/app/interface/tasks/requests/IUpdateTaskRequest";
import { getImageSrc } from "@/app/utils/image";

type FromPage = "create" | "edit" | "detail";
type QuestionRequest =
  | CreateTaskQuestionRequest
  | UpdateTaskQuestionRequest
  | TaskQuestionResponse;
type ModifyQuestionRequest =
  | CreateTaskQuestionRequest
  | UpdateTaskQuestionRequest;

interface QuestionCardProps {
  index: number;
  question: QuestionRequest;
  fromPage: FromPage;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  index,
  question,
  fromPage,
}) => {
  // Tentukan sumber gambar
  let imageSrc: string | undefined;

  if (fromPage === "detail") {
    const image = (question as TaskQuestionResponse).image;
    if (image) imageSrc = getImageSrc(image);
  } else {
    // const file = (
    //   question as CreateTaskQuestionRequest | UpdateTaskQuestionRequest
    // ).imageFile;
    // console.log("Processing file...");
    // if (file) {
    //   console.log("Ada file gambar nih...");
    //   imageSrc = getImageSrc(file);
    // }

    const q = question as ModifyQuestionRequest;

    if (q.imageFile) {
      imageSrc = getImageSrc(q.imageFile);
    } else if ((q as any).image) {
      // fallback ke image string lama
      imageSrc = getImageSrc((q as any).image);
    }
  }

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-dark">{`Soal ${index + 1}`}</span>
            <Tag color="blue">
              {`${
                QuestionTypeLabels[question.type as QuestionType] ||
                question.type
              }`}
            </Tag>
          </div>
          <div className="flex items-center gap-2">
            <Tag color="blue">{`Poin: ${question.point}`}</Tag>
            {question.timeLimit && (
              <Tag color="purple" icon={<ClockCircleOutlined />}>
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
      {/* Gambar soal */}
      {imageSrc && (
        <div className="my-2">
          <Image src={imageSrc} alt={`Soal ${index + 1}`} width={200} />
        </div>
      )}

      {/* Teks soal */}
      <p className="text-dark text-base mb-2">{question.text}</p>

      {/* Opsi jawaban */}
      {question.options && question.options.length > 0 && (
        <div className="flex flex-wrap items-center gap-y-4 gap-x-8 mt-3">
          {question.options.map((opt, i) => (
            <div
              key={i}
              className="min-w-[10rem] bg-tertiary flex items-center justify-start rounded-lg px-4 py-2 text-sm font-semibold"
            >
              <span className="me-1">{String.fromCharCode(65 + i)}.</span>
              <span className="me-3">{opt.text}</span>
              {opt.isCorrect && <CheckCircleTwoTone twoToneColor="#52c41a" />}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default QuestionCard;
