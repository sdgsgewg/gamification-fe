import React, { RefObject } from "react";
import Button from "../../../shared/Button";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";

interface Props {
  fields: { id: string }[];
  selectedQuestionIndex: number;
  setSelectedQuestionIndex: (idx: number) => void;
  setDeleteQuestionIndex: (idx: number) => void;
  showDeleteModal: (idx: number) => void;
  addNewQuestion: () => void;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}

const ModifyTaskQuestionNavigationBar = ({
  fields,
  selectedQuestionIndex,
  setSelectedQuestionIndex,
  setDeleteQuestionIndex,
  showDeleteModal,
  addNewQuestion,
  scrollContainerRef,
}: Props) => {
  return (
    <div className="w-full flex items-center mb-6 border-b border-b-primary">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto custom-thin-scrollbar max-w-full"
      >
        {fields.map((field, idx) => (
          <Button
            key={field.id}
            size="middle"
            onClick={() => setSelectedQuestionIndex(idx)}
            className={`relative flex items-center gap-3 !px-10 !py-1 !border-none !rounded-t-lg !rounded-b-none text-sm ${
              selectedQuestionIndex === idx
                ? "!bg-primary !text-light"
                : "!bg-background hover:!bg-background-hover !text-dark"
            }`}
          >
            <span>Soal {idx + 1}</span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                setDeleteQuestionIndex(idx);
                showDeleteModal(idx);
              }}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-muted hover:text-red-500 cursor-pointer"
            >
              <CloseOutlined className="text-xs" />
            </span>
          </Button>
        ))}
      </div>

      <div className="m-0 p-0">
        <Button
          size="middle"
          className="!bg-background hover:!bg-background-hover !text-dark !hover:text-none !border-0"
          onClick={addNewQuestion}
        >
          <PlusOutlined />
        </Button>
      </div>
    </div>
  );
};

export default ModifyTaskQuestionNavigationBar;
