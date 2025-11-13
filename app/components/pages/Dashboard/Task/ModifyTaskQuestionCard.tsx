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
import { useEffect, useState } from "react";
import { getDefaultOptionsByType } from "@/app/utils/tasks/getDefaultOptionsByQuestionType";
import { EditTaskOverviewFormInputs } from "@/app/schemas/tasks/task-overview/editTaskOverview";
import { TaskTypeScope } from "@/app/enums/TaskTypeScope";
import { useTaskTypeById } from "@/app/hooks/task-types/useTaskTypeById";
import { CreateTaskOverviewFormInputs } from "@/app/schemas/tasks/task-overview/createTaskOverview";

interface ModifyTaskQuestionCardProps {
  index: number;
  fieldsLength: number;
  fileList: Record<string, UploadFile[]>;
  taskOverview: CreateTaskOverviewFormInputs | EditTaskOverviewFormInputs;
  onFileListChange: (questionId: string, fileList: UploadFile[]) => void;
  showDeleteModal: (questionIdx: number) => void;
}

export default function ModifyTaskQuestionCard({
  index,
  fieldsLength,
  fileList,
  taskOverview,
  onFileListChange,
  showDeleteModal,
}: ModifyTaskQuestionCardProps) {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext();

  const taskType = useTaskTypeById(taskOverview.taskTypeId);
  const [taskTypeScope, setTaskTypeScope] = useState<TaskTypeScope | null>(
    null
  );

  const questionType = useWatch({
    control,
    name: `questions.${index}.type`,
  });

  const [availableQuestionTypes, setAvailableQuestionTypes] = useState<
    { value: QuestionType; label: string }[]
  >([]);

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
      //       case QuestionType.FILL_BLANK:
      // return <FillInTheBlankField />;
      case QuestionType.ESSAY:
        return <EssayField />;
      default:
        return null;
    }
  };

  // Ambil scope taskType dari data API
  useEffect(() => {
    if (taskType?.data?.scope) {
      setTaskTypeScope(taskType.data.scope as TaskTypeScope);
    }
  }, [taskType]);

  // Tentukan tipe pertanyaan yang boleh digunakan berdasarkan scope
  useEffect(() => {
    if (!taskTypeScope) return;

    let allowedTypes: QuestionType[] = [];

    switch (taskTypeScope) {
      case TaskTypeScope.ACTIVITY:
        allowedTypes = [QuestionType.MULTIPLE_CHOICE, QuestionType.TRUE_FALSE];
        break;
      case TaskTypeScope.CLASS:
        allowedTypes = [
          QuestionType.MULTIPLE_CHOICE,
          QuestionType.TRUE_FALSE,
          QuestionType.FILL_BLANK,
          QuestionType.ESSAY,
        ];
        break;
      case TaskTypeScope.GLOBAL:
        allowedTypes = [QuestionType.MULTIPLE_CHOICE, QuestionType.TRUE_FALSE];
        break;
      default:
        allowedTypes = Object.values(QuestionType);
        break;
    }

    // Simpan question type yang tersedia di state
    const filteredOptions = allowedTypes.map((value) => ({
      value,
      label: QuestionTypeLabels[value],
    }));
    setAvailableQuestionTypes(filteredOptions);

    // Jika question type saat ini tidak cocok dengan scope, reset ke tipe pertama
    if (questionType && !allowedTypes.includes(questionType)) {
      setValue(`questions.${index}.type`, allowedTypes[0]);
    }
  }, [taskTypeScope, questionType, setValue, index]);

  // Render dari data DB atau hasil edit user
  useEffect(() => {
    if (!questionType) return;

    const optionsPath = `questions.${index}.options`;
    const correctAnswerPath = `questions.${index}.correctAnswer`;

    const currentOptions = (control._formValues?.questions?.[index]?.options ??
      []) as any[];
    const currentCorrectAnswer =
      control._formValues?.questions?.[index]?.correctAnswer;

    const isFromDatabase =
      !!control._formValues?.questions?.[index]?.questionId;

    const hasValidOptions =
      isFromDatabase ||
      (currentOptions.length > 0 &&
        currentOptions.some((o) => o.text && o.text.trim() !== ""));

    // Kalau dari DB atau user udah edit opsi, render seperti biasa tanpa reset
    if (hasValidOptions) {
      if (questionType === QuestionType.TRUE_FALSE && currentCorrectAnswer) {
        setValue(optionsPath, [
          { text: "True", isCorrect: currentCorrectAnswer === "true" },
          { text: "False", isCorrect: currentCorrectAnswer === "false" },
        ]);
      } else if (
        questionType === QuestionType.MULTIPLE_CHOICE &&
        currentCorrectAnswer !== undefined
      ) {
        const correctIndex = parseInt(currentCorrectAnswer as string, 10);
        setValue(
          optionsPath,
          currentOptions.map((opt, i) => ({
            ...opt,
            isCorrect: i === correctIndex,
          }))
        );
      }
    }
  }, [control, index, questionType, setValue]);

  // Handle perubahan tipe soal (reset & isi default baru)
  // useEffect(() => {
  //   if (!questionType) return;

  //   const optionsPath = `questions.${index}.options`;
  //   const correctAnswerPath = `questions.${index}.correctAnswer`;

  //   // Ambil opsi lama
  //   const prevOptions = control._formValues?.questions?.[index]?.options ?? [];

  //   // Kalau user ganti tipe soal dan tipe sebelumnya berbeda, reset semua opsi
  //   if (prevOptions.length > 0) {
  //     const newOptions = getDefaultOptionsByType(questionType);
  //     setValue(optionsPath, newOptions, { shouldDirty: true });

  //     // Reset correctAnswer agar gak bentrok sama struktur baru
  //     if (
  //       questionType === QuestionType.TRUE_FALSE ||
  //       questionType === QuestionType.FILL_BLANK
  //     ) {
  //       setValue(correctAnswerPath, "");
  //     } else {
  //       setValue(correctAnswerPath, null);
  //     }
  //   }
  // }, [questionType, index, setValue]);

  // Yang udah pasti aman buat render question, options, tapi masih bug pas ubah tipe soal
  // useEffect(() => {
  //   if (!questionType) return;

  //   const optionsPath = `questions.${index}.options`;
  //   const correctAnswerPath = `questions.${index}.correctAnswer`;

  //   const currentOptions = (control._formValues?.questions?.[index]?.options ??
  //     []) as any[];
  //   const currentCorrectAnswer =
  //     control._formValues?.questions?.[index]?.correctAnswer;

  //   // Cek apakah ini adalah pertanyaan baru atau pertanyaan dari database
  //   const isFromDatabase =
  //     !!control._formValues?.questions?.[index]?.questionId;

  //   // Cek apakah opsi sudah ada & valid (baik dari DB maupun hasil edit user)
  //   const hasValidOptions =
  //     isFromDatabase ||
  //     (currentOptions.length > 0 &&
  //       currentOptions.some((o) => o.text && o.text.trim() !== ""));

  //   // Jika dari database dan opsi sudah ada, jangan overwrite
  //   if (hasValidOptions) {
  //     // Sinkronisasi correct answer jika perlu, tapi jangan reset opsi
  //     if (questionType === QuestionType.TRUE_FALSE && currentCorrectAnswer) {
  //       setValue(optionsPath, [
  //         { text: "True", isCorrect: currentCorrectAnswer === "true" },
  //         { text: "False", isCorrect: currentCorrectAnswer === "false" },
  //       ]);
  //     } else if (
  //       questionType === QuestionType.MULTIPLE_CHOICE &&
  //       currentCorrectAnswer !== undefined
  //     ) {
  //       const correctIndex = parseInt(currentCorrectAnswer as string, 10);
  //       setValue(
  //         optionsPath,
  //         currentOptions.map((opt, i) => ({
  //           ...opt,
  //           isCorrect: i === correctIndex,
  //         }))
  //       );
  //     }
  //     return;
  //   }

  //   // Jika tidak ada opsi valid, baru set default
  //   const newOptions = getDefaultOptionsByType(questionType);
  //   setValue(optionsPath, newOptions);

  //   if (questionType === QuestionType.TRUE_FALSE) {
  //     setValue(correctAnswerPath, ""); // Kosongkan dulu
  //   } else {
  //     setValue(correctAnswerPath, null);
  //   }
  // }, [questionType, index, setValue]);

  // CHATGPT -> reset opsi setiap kali ganti tipe soal
  // useEffect(() => {
  //   if (!questionType) return;

  //   const optionsPath = `questions.${index}.options`;
  //   const correctAnswerPath = `questions.${index}.correctAnswer`;

  //   // Set default options baru setiap kali tipe soal berubah
  //   const newOptions = getDefaultOptionsByType(questionType);
  //   setValue(optionsPath, newOptions, { shouldDirty: true });

  //   // Reset correctAnswer agar tidak pakai jawaban lama
  //   if (questionType === QuestionType.TRUE_FALSE) {
  //     setValue(correctAnswerPath, "");
  //   } else if (questionType === QuestionType.FILL_BLANK) {
  //     setValue(correctAnswerPath, "");
  //   } else {
  //     setValue(correctAnswerPath, null);
  //   }
  // }, [questionType, index, setValue]);

  return (
    <div className="relative bg-outline border border-br-primary shadow-sm rounded-lg">
      <div className="bg-tertiary border-b border-br-primary flex justify-between items-center rounded-t-lg py-3 px-6">
        <h3 className="text-lg font-semibold">{`Question #${index + 1}`}</h3>
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
                label="Question"
                placeholder="Enter question"
                errors={errors}
                required
              />

              <NumberField
                control={control}
                name={`questions.${index}.point`}
                label="Points"
                placeholder="Enter the number of points for the question."
                errors={errors}
                required
                min={0}
                step={1}
              />

              {/* <NumberField
                control={control}
                name={`questions.${index}.timeLimit`}
                label="Batas Waktu (detik)"
                placeholder="Masukkan batas waktu untuk pertanyaan"
                errors={errors}
                min={0}
                step={1}
              /> */}

              <SelectField
                control={control}
                name={`questions.${index}.type`}
                label="Question Type"
                placeholder="Choose question type"
                options={availableQuestionTypes}
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
              label="Upload Image"
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
