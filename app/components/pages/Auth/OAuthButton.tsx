import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import React from "react";
import { IMAGES } from "@/app/constants/images";

interface OAuthButtonProps {
  message: string;
  onClick: () => void;
}

const OAuthButton = ({ message, onClick }: OAuthButtonProps) => {
  return (
    <div
      className="w-full flex items-center justify-between gap-2 border border-oauth rounded-lg shadow-xs px-4 py-2 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Image src={IMAGES.GOOGLE} alt="Google" width={30} height={30} />
        <span className="text-dark text-base font-medium">{message}</span>
      </div>
      <div>
        <FontAwesomeIcon icon={faArrowRight} className="text-oauth text-xs" />
      </div>
    </div>
  );
};

export default OAuthButton;
