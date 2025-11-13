import Button from "@/app/components/shared/Button";
import React from "react";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonLabel: string;
  onClick: () => void;
}

const QuickActionCard = ({
  title,
  description,
  icon,
  buttonLabel,
  onClick,
}: QuickActionCardProps) => {
  return (
    <div className="p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 bg-card border-br-tertiary">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-tertiary mb-4">
          {icon}
        </div>
        <h3 className="text-tx-primary text-lg font-semibold mb-2">{title}</h3>
        <p className="text-tx-secondary text-sm mb-4">{description}</p>
        <Button
          variant="primary"
          size="large"
          className="!px-5 !rounded-xl"
          onClick={onClick}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};

export default QuickActionCard;
