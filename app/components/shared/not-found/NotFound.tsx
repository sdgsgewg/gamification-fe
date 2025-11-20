import { IMAGES } from "@/app/constants/images";
import Image from "next/image";
import React from "react";

interface NotFoundProps {
  text: string;
}

const NotFound = ({ text }: NotFoundProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="max-w-lg">
        <Image
          src={IMAGES.NOT_FOUND}
          alt="Not Found"
          width={200}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <span className="text-lg font-semibold">{text}</span>
      </div>
    </div>
  );
};

export default NotFound;
