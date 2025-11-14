import React from "react";
import Image from "next/image";
import { IMAGES } from "../constants/images";

interface FormLayoutProps {
  top?: React.ReactNode; // form
  bottom?: React.ReactNode; // navigasi
}

export default function FormLayout({ top, bottom }: FormLayoutProps) {
  return (
    <div className="bg-background min-w-[28rem] max-w-[32rem] sm:min-w-[36rem] sm:max-w-[36rem] md:max-w-[50rem] lg:max-w-[52rem] xl:max-w-[60rem] flex rounded-2xl overflow-hidden">
      <div className="w-full md:w-1/2">
        <div className="flex flex-col gap-8 p-8">{top}</div>
        {bottom && <div>{bottom}</div>}
      </div>
      <div className="w-0 md:w-1/2">
        <Image
          src={IMAGES.AUTH_BG}
          alt={"auth background"}
          width={500}
          height={500}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
