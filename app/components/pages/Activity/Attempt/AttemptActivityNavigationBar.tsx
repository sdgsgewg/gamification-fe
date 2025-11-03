import Button from "@/app/components/shared/Button";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type NavigationType = "back" | "next";

interface AttemptActivityNavigationBarProps {
  label: string;
  navigationType: NavigationType;
  buttonIcon: IconDefinition;
  buttonText: string;
  onBack?: () => void;
  onNext?: () => void;
}

export const AttemptActivityNavigationBar = ({
  label,
  navigationType,
  buttonIcon,
  buttonText,
  onBack,
  onNext,
}: AttemptActivityNavigationBarProps) => {
  const handleClick = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (onNext) onNext();
  };

  return (
    <div>
      <p className="text-sm text-black mb-2">{label}</p>
      <Button
        type="primary"
        htmlType={navigationType === "next" ? "submit" : "button"}
        size="middle"
        variant="primary"
        className={`flex ${
          navigationType === "back" ? "flex-row" : "flex-row-reverse"
        } items-center gap-2`}
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={buttonIcon} />
        <span className="text-base font-semibold">{buttonText}</span>
      </Button>
    </div>
  );
};
