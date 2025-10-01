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
            label="Masih Ingin merubah data mengenai tugas anda?"
            navigationType="back"
            buttonIcon={faArrowLeft}
            buttonText="Kembali"
            onBack={onBack}
          />
          <ModifyTaskNavigationBar
            label="Lanjut Review?"
            navigationType="next"
            buttonIcon={faArrowRight}
            buttonText="Lanjut"
            onNext={onNext}
          />
        </div>
      ) : (
        <div className="w-full flex flex-row justify-between mb-8">
          <ModifyTaskNavigationBar
            label="Masih Ingin merubah data mengenai tugas anda?"
            navigationType="back"
            buttonIcon={faArrowLeft}
            buttonText="Kembali"
            onBack={onBack}
          />
        </div>
      )}
    </>
  );
};

export default ModifyTaskNavigationBarWrapper;
