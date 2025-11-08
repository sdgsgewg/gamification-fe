import React from "react";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { TaskNavigationBar } from "./TaskNavigationBar";

interface TaskNavigationBarWrapperProps {
  onBack?: () => void;
  onNext?: () => void;
}

const TaskNavigationBarWrapper = ({
  onBack,
  onNext,
}: TaskNavigationBarWrapperProps) => {
  return (
    <div className="w-full flex flex-row justify-between mb-8">
      <TaskNavigationBar
        label="Ingin Kembali?"
        navigationType="back"
        buttonIcon={faArrowLeft}
        buttonText="Kembali"
        onBack={onBack}
      />
      <TaskNavigationBar
        label="Kumpul Sekarang?"
        navigationType="next"
        buttonIcon={faArrowRight}
        buttonText="Submit"
        onNext={onNext}
      />
    </div>
  );
};

export default TaskNavigationBarWrapper;
