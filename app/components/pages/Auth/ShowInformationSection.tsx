import Image from "next/image";
import React from "react";

interface ShowInformationSectionProps {
  imageUrl: string;
  imageAlt: string;
  title: string;
  subtitle1: React.ReactNode;
  subtitle2?: React.ReactNode;
  onButtonClick?: () => void;
  buttonText: string;
}
const ShowInformationSection = ({
  imageUrl,
  imageAlt,
  title,
  subtitle1,
  subtitle2,
  onButtonClick,
  buttonText,
}: ShowInformationSectionProps) => {
  return (
    <div className="bg-white w-[32rem] lg:w-[52rem] max-w-full flex flex-col items-center justify-center rounded-2xl shadow-2xl text-black text-center px-20 py-16">
      <Image
        src={imageUrl}
        alt={imageAlt}
        width={500}
        height={500}
        className="w-[12rem] h-[12rem] object-cover"
      />
      <h1 className="text-3xl font-bold my-6">{title}</h1>
      <div className="flex flex-col gap-2">
        <div className="text-lg font-medium">{subtitle1}</div>
        {subtitle2 && <div className="text-lg font-medium">{subtitle2}</div>}
      </div>
      <button
        onClick={onButtonClick}
        className="bg-[#556FD7] text-white text-lg font-semibold px-12 py-3 rounded-lg hover:bg-[#3A53C1] mt-12 cursor-pointer transition duration-300 ease-in-out"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ShowInformationSection;
