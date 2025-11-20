import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";

interface FloatingButtonProps {
  title: string;
  icon?: ReactElement<FontAwesomeIconProps>;
  onClick: () => void;
}

const FloatingButton = ({ title, icon, onClick }: FloatingButtonProps) => {
  const renderedIcon = icon ? (
    React.cloneElement(icon, {
      className: "!text-lg w-5 h-5",
    })
  ) : (
    <FontAwesomeIcon icon={faPlus} className="!text-lg w-5 h-5" />
  );

  return (
    <button
      className="fixed bottom-8 right-8 bg-primary hover:bg-primary-hover text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl text-2xl transition duration-300 ease-in-out cursor-pointer"
      title={title}
      onClick={onClick}
    >
      {renderedIcon}
    </button>
  );
};

export default FloatingButton;
