"use client";

import { Form } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useToast } from "@/app/hooks/use-toast";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import {
  createTaskQuestionDefaultValues,
  CreateTaskQuestionFormInputs,
  createTaskQuestionSchema,
} from "@/app/schemas/tasks/task-questions/createTaskQuestion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import Loading from "../../../shared/Loading";
import { QuestionType } from "@/app/enums/QuestionType";
import ModifyTaskNavigationBarWrapper from "@/app/components/pages/Dashboard/Task/ModifyTaskNavigationBarWrapper";
import ModifyTaskQuestionNavigationBar from "@/app/components/pages/Dashboard/Task/ModifyTaskQuestionNavigationBar";
import ModifyTaskQuestionCard from "@/app/components/pages/Dashboard/Task/ModifyTaskQuestionCard";
import { ConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { useScrollToEnd } from "@/app/hooks/form/useScrollToEnd";
import { useInitTaskQuestionsForm } from "@/app/hooks/form/useInitTaskQuestionsForm";
import { CreateTaskOverviewFormInputs } from "@/app/schemas/tasks/task-overview/createTaskOverview";
import { getDefaultOptionsByType } from "@/app/utils/tasks/getDefaultOptionsByQuestionType";

interface CreateTaskQuestionFormProps {
  taskOverview: CreateTaskOverviewFormInputs;
  taskQuestions: CreateTaskQuestionFormInputs | null;
  onBack: (values: CreateTaskQuestionFormInputs) => void;
  onNext: (values: CreateTaskQuestionFormInputs) => void;
}

export default function CreateTaskQuestionForm({
  taskOverview,
  taskQuestions,
  onBack,
  onNext,
}: CreateTaskQuestionFormProps) {
  const { toast } = useToast();

  const methods = useForm<CreateTaskQuestionFormInputs>({
    resolver: zodResolver(createTaskQuestionSchema),
    defaultValues: createTaskQuestionDefaultValues,
  });

  const { control, handleSubmit, reset } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const { fileList, setFileList } =
    useInitTaskQuestionsForm<CreateTaskQuestionFormInputs>({
      taskQuestions,
      reset,
      mode: "create",
    });

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [deleteQuestionIndex, setDeleteQuestionIndex] = useState<number>(0);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState({
    visible: false,
    text: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useScrollToEnd(scrollContainerRef, [selectedQuestionIndex, fields.length]);

  const addNewQuestion = () => {
    const defaultType = QuestionType.MULTIPLE_CHOICE;

    append({
      text: "",
      point: 0,
      timeLimit: undefined,
      type: defaultType,
      imageFile: "",
      options: getDefaultOptionsByType(defaultType),
      correctAnswer: "", // default kosong
    });

    setSelectedQuestionIndex(fields.length); // langsung pindah ke soal baru
  };

  const showDeleteModal = (questionIdx: number) => {
    setDeleteQuestionIndex(questionIdx);
    setDeleteConfirmationModal((prev) => ({ ...prev, visible: true }));
  };

  const confirmDeleteQuestion = () => {
    if (!deleteQuestionIndex) return;
    remove(deleteQuestionIndex);
    setSelectedQuestionIndex(deleteQuestionIndex - 1);
    setDeleteConfirmationModal((prev) => ({ ...prev, visible: false }));
    toast.success("Soal berhasil dihapus!");
  };

  const cancelDelete = () => {
    setDeleteConfirmationModal((prev) => ({ ...prev, visible: false }));
  };

  const handleFileListChange = (questionId: string, fileList: UploadFile[]) => {
    setFileList((prev) => ({
      ...prev,
      [questionId]: fileList,
    }));
  };

  const getTransformedData = (data: CreateTaskQuestionFormInputs) => {
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
            options: q.options
              ? q.options.map((opt) => ({
                  ...opt,
                  isCorrect:
                    opt.text === "True"
                      ? q.correctAnswer === "true"
                      : q.correctAnswer === "false",
                }))
              : [],
          };
        }

        // fill in the blank
        // if (q.type === QuestionType.FILL_BLANK) {
        //   return {
        //     ...q,
        //     options: q.options
        //       ? q.options.map(() => ({
        //           text: String(q.correctAnswer),
        //           isCorrect: true,
        //         }))
        //       : [],
        //   };
        // }

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

    return transformed;
  };

  const handleBackWithSubmit = handleSubmit((data) => {
    setIsLoading(true);
    const transformed = getTransformedData(data);
    onBack(transformed);
    setIsLoading(false);
  });

  const onSubmit = async (data: CreateTaskQuestionFormInputs) => {
    setIsLoading(true);
    const transformed = getTransformedData(data);
    onNext(transformed);
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <Loading />}

      <FormProvider {...methods}>
        <Form
          name="create-task-question"
          onFinish={handleSubmit(onSubmit)}
          layout="vertical"
          requiredMark={false}
        >
          {/* Navigation atas */}
          <ModifyTaskNavigationBarWrapper
            fromView="task-question"
            onBack={handleBackWithSubmit}
            onNext={handleSubmit(onSubmit)}
          />

          {/* Bar soal */}
          <ModifyTaskQuestionNavigationBar
            fields={fields}
            selectedQuestionIndex={selectedQuestionIndex}
            setSelectedQuestionIndex={setSelectedQuestionIndex}
            setDeleteQuestionIndex={setDeleteQuestionIndex}
            showDeleteModal={showDeleteModal}
            addNewQuestion={addNewQuestion}
            scrollContainerRef={scrollContainerRef}
          />

          {/* Question Card */}
          {fields.map((field, idx) => (
            <div
              key={field.id}
              style={{
                display: idx === selectedQuestionIndex ? "block" : "none",
              }}
            >
              <ModifyTaskQuestionCard
                index={idx}
                fieldsLength={fields.length}
                fileList={fileList}
                taskOverview={taskOverview}
                onFileListChange={handleFileListChange}
                showDeleteModal={showDeleteModal}
              />
            </div>
          ))}
        </Form>
      </FormProvider>

      <ConfirmationModal
        visible={deleteConfirmationModal.visible}
        text={`Are you sure you want to delete 'Question #${
          deleteQuestionIndex + 1
        }'?`}
        type="delete"
        onConfirm={confirmDeleteQuestion}
        onCancel={cancelDelete}
      />
    </>
  );
}
