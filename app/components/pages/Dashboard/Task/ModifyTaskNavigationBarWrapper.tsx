import React from "react";
import { ModifyTaskNavigationBar } from "./ModifyTaskNavigationBar";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ViewState } from "@/app/types/task";

interface ModifyTaskNavigationBarWrapperProps {
  fromView: ViewState;
  onBack?: () => void;
  onNext?: () => void;
}

const ModifyTaskNavigationBarWrapper = ({
  fromView,
  onBack,
  onNext,
}: ModifyTaskNavigationBarWrapperProps) => {
  return (
    <>
      {fromView === "task-question" ? (
        <div className="w-full flex flex-row justify-between mb-8">
          <ModifyTaskNavigationBar
            label="Do you still want to modify the data about your task?"
            navigationType="back"
            buttonIcon={faArrowLeft}
            buttonText="Back"
            onBack={onBack}
          />
          <ModifyTaskNavigationBar
            label="Continue reviewing?"
            navigationType="next"
            buttonIcon={faArrowRight}
            buttonText="Continue"
            onNext={onNext}
          />
        </div>
      ) : (
        <div className="w-full flex flex-row justify-between mb-8">
          <ModifyTaskNavigationBar
            label="Do you still want to modify the data about your task?"
            navigationType="back"
            buttonIcon={faArrowLeft}
            buttonText="Back"
            onBack={onBack}
          />
        </div>
      )}
    </>
  );
};

export default ModifyTaskNavigationBarWrapper;
