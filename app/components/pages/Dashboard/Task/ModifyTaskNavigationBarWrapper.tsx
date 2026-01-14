import React from "react";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ViewState } from "@/app/types/task";
import { NavigationBar } from "@/app/components/shared/NavigationBar";

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
          <NavigationBar
            label="Do you still want to modify the data about your task?"
            navigationType="back"
            buttonIcon={faArrowLeft}
            buttonText="Back"
            onBack={onBack}
          />
          <NavigationBar
            label="Continue reviewing?"
            navigationType="next"
            buttonIcon={faArrowRight}
            buttonText="Continue"
            onNext={onNext}
          />
        </div>
      ) : (
        <div className="w-full flex flex-row justify-between">
          <NavigationBar
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
