import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";

interface FloatingButtonProps {
  title: string;
  icon?: ReactNode;
  onClick: () => void;
}

const FloatingButton = ({ title, icon, onClick }: FloatingButtonProps) => {
  const defaultIcon = <FontAwesomeIcon icon={faPlus} />;

  return (
    <button
      aria-label={title}
      className="
        fixed bottom-8 right-8 
        bg-primary hover:bg-primary-hover 
        text-white rounded-full 
        w-14 h-14 flex items-center justify-center 
        shadow-xl transition duration-300 ease-in-out 
        cursor-pointer
      "
      title={title}
      onClick={onClick}
    >
      <span className="text-lg w-5 h-5 flex items-center justify-center">
        {icon ?? defaultIcon}
      </span>
    </button>
  );
};

export default FloatingButton;
