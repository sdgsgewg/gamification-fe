import React from "react";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { NavigationBar } from "@/app/components/shared/NavigationBar";

interface NavigationBarWrapperProps {
  onBack?: () => void;
  onNext?: () => void;
}

const NavigationBarWrapper = ({
  onBack,
  onNext,
}: NavigationBarWrapperProps) => {
  return (
    <div className="w-full flex flex-row justify-between mb-8">
      <NavigationBar
        // label="Ingin Kembali?"
        label="Go Back?"
        navigationType="back"
        buttonIcon={faArrowLeft}
        buttonText="Back"
        onBack={onBack}
      />
      <NavigationBar
        // label="Kumpul Sekarang?"
        label="Submit Now?"
        navigationType="next"
        buttonIcon={faArrowRight}
        buttonText="Submit"
        onNext={onNext}
      />
    </div>
  );
};

export default NavigationBarWrapper;
