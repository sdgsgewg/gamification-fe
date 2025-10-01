"use client";

import { useEffect, useRef, useState } from "react";
import type { UploadFile } from "antd/es/upload/interface";
import { UseFormReset } from "react-hook-form";
import { QuestionType } from "@/app/enums/QuestionType";
import { fileToRcFile } from "@/app/utils/file";

interface QuestionBase {
  type: string | QuestionType;
  image?: string;
  imageFile?: File;
}

interface UseInitTaskQuestionsFormProps<
  T extends { questions: QuestionBase[] }
> {
  taskQuestions: T | null;
  reset: UseFormReset<T>;
  mode: "create" | "edit";
}

export function useInitTaskQuestionsForm<
  T extends { questions: QuestionBase[] }
>({ taskQuestions, reset, mode }: UseInitTaskQuestionsFormProps<T>) {
  const hasReset = useRef(false);
  const [fileList, setFileList] = useState<Record<string, UploadFile[]>>({});

  useEffect(() => {
    if (taskQuestions && !hasReset.current) {
      // ✅ reset form values
      reset({
        ...taskQuestions,
        questions: taskQuestions.questions.map((q) => ({
          ...q,
          type: q.type as QuestionType,
        })),
      });
      hasReset.current = true;

      // ✅ handle file list
      const newFileList: Record<string, UploadFile[]> = {};

      taskQuestions.questions.forEach((question, index) => {
        // --- khusus edit, load existing image
        if (mode === "edit" && question.image) {
          newFileList[`question-${index}`] = [
            {
              uid: "-1",
              name: "old-image.png",
              status: "done",
              url: question.image,
            } as UploadFile,
          ];
        }

        // --- handle imageFile (baru upload)
        if (question.imageFile instanceof File) {
          const url = URL.createObjectURL(question.imageFile);
          const rcFile = fileToRcFile(question.imageFile);

          newFileList[`question-${index}`] = [
            {
              uid: "-2",
              name: rcFile.name || "preview.jpg",
              status: "done",
              url,
              originFileObj: rcFile,
            },
          ];
        }
      });

      setFileList(newFileList);
    }
  }, [taskQuestions, reset, mode]);

  return { fileList, setFileList };
}
