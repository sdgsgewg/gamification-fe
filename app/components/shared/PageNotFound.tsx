import React from "react";
import Image from "next/image";

interface PageNotFoundProps {
  image_url: string;
  message: string;
}

const PageNotFound: React.FC<PageNotFoundProps> = ({ image_url, message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[50dvh]">
      <Image src={image_url} alt={message} width={350} height={350} />
      <p className="text-2xl text-slate-400 font-semibold text-center">
        {message}
      </p>
    </div>
  );
};

export default PageNotFound;
