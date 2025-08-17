import React from "react";
import Image from "next/image";

export default function FormLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-white w-[32rem] lg:w-[52rem] max-w-full flex rounded-2xl overflow-hidden">
      <div className="w-full lg:w-1/2">{children}</div>
      <div className="w-0 lg:w-1/2">
        <Image
          src={"/img/auth-bg.jpg"}
          alt={"auth background"}
          width={500}
          height={500}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
