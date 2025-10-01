"use client";

import { useWatch, useFormContext } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { QuestionType } from "@/app/enums/QuestionType";
import TextAreaField from "@/app/components/fields/TextAreaField";
import NumberField from "@/app/components/fields/NumberField";
import SelectField from "@/app/components/fields/SelectField";
import ImageField from "@/app/components/fields/ImageField";
import FormLayout from "@/app/dashboard/form-layout";
import Button from "@/app/components/shared/Button";
import {
  EssayField,
  FillInTheBlankField,
  MultipleChoiceField,
  TrueOrFalseField,
} from "@/app/components/fields/QuestionTypeField";
import { QuestionTypeLabels } from "@/app/enums/QuestionType";
import type { UploadFile } from "antd/es/upload/interface";

interface ModifyTaskQuestionCardProps {
  index: number;
  fieldsLength: number;
  fileList: Record<string, UploadFile[]>;
  onFileListChange: (questionId: string, fileList: UploadFile[]) => void;
  showDeleteModal: (questionIdx: number) => void;
}

export default function ModifyTaskQuestionCard({
  index,
  fieldsLength,
  fileList,
  onFileListChange,
  showDeleteModal,
}: ModifyTaskQuestionCardProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const questionType = useWatch({
    control,
    name: `questions.${index}.type`,
  });

  const questionTypeOptions = Object.values(QuestionType).map((value) => ({
    value,
    label: QuestionTypeLabels[value],
  }));

  const renderQuestionTypeFields = (
    questionIndex: number,
    questionType: QuestionType
  ) => {
    switch (questionType) {
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <MultipleChoiceField
            control={control}
            errors={errors}
            questionIndex={questionIndex}
          />
        );
      case QuestionType.TRUE_FALSE:
        return (
          <TrueOrFalseField
            control={control}
            errors={errors}
            questionIndex={questionIndex}
          />
        );
      case QuestionType.FILL_BLANK:
        return (
          <FillInTheBlankField
            control={control}
            errors={errors}
            questionIndex={questionIndex}
          />
        );
      case QuestionType.ESSAY:
        return <EssayField />;
      default:
        return null;
    }
  };

  return (
    <div className="relative bg-[#F5F4FF] border border-[#BCB4FF] shadow-sm rounded-lg">
      <div className="bg-[#E9E8FF] border-b border-[#BCB4FF] flex justify-between items-center rounded-t-lg py-3 px-6">
        <h3 className="text-lg font-semibold">{`Soal #${index + 1}`}</h3>
        <Button
          variant="danger"
          size="small"
          onClick={() => showDeleteModal(index)}
          disabled={fieldsLength <= 1}
        >
          <FontAwesomeIcon icon={faTrash} className="mr-1" />
          Hapus
        </Button>
      </div>

      <div className="p-6 mb-4">
        <FormLayout
          left={
            <>
              <TextAreaField
                control={control}
                name={`questions.${index}.text`}
                label="Pertanyaan"
                placeholder="Masukkan pertanyaan"
                errors={errors}
                required
              />

              <NumberField
                control={control}
                name={`questions.${index}.point`}
                label="Jumlah poin"
                placeholder="Masukkan jumlah poin untuk pertanyaan"
                errors={errors}
                required
                min={0}
                step={1}
              />

              <NumberField
                control={control}
                name={`questions.${index}.timeLimit`}
                label="Batas Waktu (detik)"
                placeholder="Masukkan batas waktu untuk pertanyaan"
                errors={errors}
                min={0}
                step={1}
              />

              <SelectField
                control={control}
                name={`questions.${index}.type`}
                label="Tipe Pertanyaan"
                placeholder="Pilih tipe pertanyaan"
                options={questionTypeOptions}
                errors={errors}
                required
              />

              {questionType
                ? renderQuestionTypeFields(index, questionType as QuestionType)
                : null}
            </>
          }
          right={
            <ImageField
              control={control}
              name={`questions.${index}.imageFile`}
              label="Upload Gambar"
              fileList={fileList[`question-${index}`] || []}
              setFileList={(fileList) =>
                onFileListChange(`question-${index}`, fileList)
              }
              errors={errors}
              mode="file"
            />
          }
        />
      </div>
    </div>
  );
}
