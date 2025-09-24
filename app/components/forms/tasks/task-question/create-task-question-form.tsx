"use client";

import { Form } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useToast } from "@/app/hooks/use-toast";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  CreateTaskQuestionFormInputs,
  createTaskQuestionSchema,
} from "@/app/schemas/tasks/task-questions/createTaskQuestion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import TextAreaField from "../../../fields/TextAreaField";
import ImageField from "../../../fields/ImageField";
import FormLayout from "@/app/dashboard/form-layout";
import Loading from "../../../shared/Loading";
import SelectField from "../../../fields/SelectField";
import {
  faArrowLeft,
  faArrowRight,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { ModifyTaskNavigationBar } from "@/app/components/pages/Dashboard/Task/ModifyTaskNavigationBar";
import NumberField from "@/app/components/fields/NumberField";
import Button from "../../../shared/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  EssayField,
  FillInTheBlankField,
  MultipleChoiceField,
  TrueOrFalseField,
} from "@/app/components/fields/QuestionTypeField";
import { QuestionType, QuestionTypeLabels } from "@/app/enums/QuestionType";
import { fileToRcFile } from "@/app/utils/file";

interface CreateTaskQuestionFormProps {
  taskQuestions: CreateTaskQuestionFormInputs | null;
  onBack: () => void;
  onNext: (values: CreateTaskQuestionFormInputs) => void;
}

export default function CreateTaskQuestionForm({
  taskQuestions,
  onBack,
  onNext,
}: CreateTaskQuestionFormProps) {
  const { toast } = useToast();

  const defaultValues: CreateTaskQuestionFormInputs = {
    questions: [
      {
        text: "",
        point: 0,
        timeLimit: undefined,
        type: "",
        imageFile: null,
        options: [],
      },
    ],
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskQuestionFormInputs>({
    resolver: zodResolver(createTaskQuestionSchema),
    defaultValues,
  });

  const hasReset = useRef(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const [fileList, setFileList] = useState<Record<string, UploadFile[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Prepare options for select fields
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

  const handleBackWithSubmit = handleSubmit((data) => {
    onSubmit(data);
    onBack();
  });

  const onSubmit = async (data: CreateTaskQuestionFormInputs) => {
    setIsLoading(true);

    try {
      const transformed = {
        ...data,
        questions: data.questions.map((q) => {
          // multiple choice
          if (
            q.type === QuestionType.MULTIPLE_CHOICE &&
            q.correctAnswer !== undefined
          ) {
            const correctIndex = parseInt(q.correctAnswer as string, 10);

            return {
              ...q,
              options: q.options
                ? q.options.map((opt, i) => ({
                    ...opt,
                    isCorrect: i === correctIndex,
                  }))
                : [],
            };
          }

          // true/false
          if (q.type === QuestionType.TRUE_FALSE) {
            return {
              ...q,
              options: [
                { text: "Benar", isCorrect: q.correctAnswer === "true" },
                { text: "Salah", isCorrect: q.correctAnswer === "false" },
              ],
            };
          }

          // fill in the blank
          if (q.type === QuestionType.FILL_BLANK) {
            return {
              ...q,
              options: [
                {
                  text: String(q.correctAnswer),
                  isCorrect: true,
                },
              ],
            };
          }

          // essay biarkan default
          return q;
        }),
      };

      onNext(transformed);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Gagal menambahkan pertanyaan");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addNewQuestion = () => {
    append({
      text: "",
      point: 0,
      timeLimit: undefined,
      type: "",
      imageFile: null,
      options: [],
    });
  };

  // letakkan di atas return
  const watchedQuestionTypes = useWatch({
    control,
    name: "questions",
  });

  const handleFileListChange = (questionId: string, fileList: UploadFile[]) => {
    setFileList((prev) => ({
      ...prev,
      [questionId]: fileList,
    }));
  };

  useEffect(() => {
    if (taskQuestions) {
      // console.log("Task questions: ", JSON.stringify(taskQuestions, null, 2));

      reset(taskQuestions);
      hasReset.current = true;

      // Recreate blob URLs for each question's image
      const newFileList: Record<string, UploadFile[]> = {};

      taskQuestions.questions.forEach((question, index) => {
        if (question.imageFile instanceof File) {
          const url = URL.createObjectURL(question.imageFile);
          const rcFile = fileToRcFile(question.imageFile);

          newFileList[`question-${index}`] = [
            {
              uid: "-1",
              name: rcFile.name || "preview.jpg",
              status: "done",
              url: url,
              originFileObj: rcFile,
            },
          ];
        }
      });

      setFileList(newFileList);
    }
  }, [taskQuestions, reset]);

  useEffect(() => {
    // Simpan blob URLs saat komponen unmount
    return () => {
      Object.values(fileList).forEach((files) => {
        files.forEach((file) => {
          if (file.url && file.url.startsWith("blob:")) {
            URL.revokeObjectURL(file.url);
          }
        });
      });
    };
  }, [fileList]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Form
      name="create-task-question"
      onFinish={handleSubmit(onSubmit)}
      layout="vertical"
      requiredMark={false}
    >
      <div className="w-full flex flex-row justify-between mb-8">
        <ModifyTaskNavigationBar
          label="Masih Ingin merubah data mengenai tugas anda?"
          navigationType="back"
          buttonIcon={faArrowLeft}
          buttonText="Kembali"
          onBack={handleBackWithSubmit}
        />
        <ModifyTaskNavigationBar
          label="Lanjut Review?"
          navigationType="next"
          buttonIcon={faArrowRight}
          buttonText="Lanjut"
          onNext={handleSubmit(onSubmit)}
        />
      </div>

      <div className="mb-6">
        <Button variant="primary" onClick={addNewQuestion} className="mb-4">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Tambah Pertanyaan
        </Button>
      </div>

      {fields.map((field, index) => {
        const questionType = watchedQuestionTypes?.[index]?.type;

        return (
          <div
            key={field.id}
            className="mb-8 p-6 border rounded-lg bg-white relative"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Pertanyaan #{index + 1}</h3>
              <Button
                variant="danger"
                size="small"
                onClick={() => remove(index)}
                disabled={fields.length <= 1}
              >
                <FontAwesomeIcon icon={faTrash} className="mr-1" />
                Hapus
              </Button>
            </div>

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

                  {questionType &&
                    renderQuestionTypeFields(index, questionType)}
                </>
              }
              right={
                <ImageField
                  control={control}
                  name={`questions.${index}.imageFile`}
                  label="Upload Gambar"
                  fileList={fileList[`question-${index}`] || []}
                  setFileList={(fileList) =>
                    handleFileListChange(`question-${index}`, fileList)
                  }
                  errors={errors}
                  mode="file"
                />
              }
            />
          </div>
        );
      })}
    </Form>
  );
}
