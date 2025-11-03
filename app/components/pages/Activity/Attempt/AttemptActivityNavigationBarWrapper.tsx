import React from "react";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { AttemptActivityNavigationBar } from "./AttemptActivityNavigationBar";

interface AttemptActivityNavigationBarWrapperProps {
  onBack?: () => void;
  onNext?: () => void;
}

const AttemptActivityNavigationBarWrapper = ({
  onBack,
  onNext,
}: AttemptActivityNavigationBarWrapperProps) => {
  return (
    <div className="w-full flex flex-row justify-between mb-8">
      <AttemptActivityNavigationBar
        label="Ingin Kembali?"
        navigationType="back"
        buttonIcon={faArrowLeft}
        buttonText="Kembali"
        onBack={onBack}
      />
      <AttemptActivityNavigationBar
        label="Kumpul Sekarang?"
        navigationType="next"
        buttonIcon={faArrowRight}
        buttonText="Submit"
        onNext={onNext}
      />
    </div>
  );
};

export default AttemptActivityNavigationBarWrapper;
