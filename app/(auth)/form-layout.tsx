import React from "react";
import Image from "next/image";
import { IMAGES } from "../constants/images";

interface FormLayoutProps {
  top?: React.ReactNode; // form
  bottom?: React.ReactNode; // navigasi
}

export default function FormLayout({ top, bottom }: FormLayoutProps) {
  return (
    <div className="bg-background w-[32rem] lg:w-[52rem] xl:w-[60rem] max-w-full flex rounded-2xl overflow-hidden">
      <div className="w-full lg:w-1/2">
        <div className="flex flex-col gap-8 p-8">{top}</div>
        {bottom && <div>{bottom}</div>}
      </div>
      <div className="w-0 lg:w-1/2">
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
