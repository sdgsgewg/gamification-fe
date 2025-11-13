import { IMAGES } from "@/app/constants/images";
import Image from "next/image";
import React from "react";

interface MemberCardProps {
  image?: string;
  name: string;
}

const MemberCard = ({ image, name }: MemberCardProps) => {
  return (
    <div className="bg-background flex flex-col items-center justify-center gap-4 py-4 px-6 border border-br-primary hover:bg-background-hover transition duration-300 ease-in-out">
      <div className="w-36 h-36 overflow-hidden">
        <Image
          src={image ?? IMAGES.DEFAULT_PROFILE}
          alt={name}
          width={200}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-dark text-base font-semibold">{name}</p>
    </div>
  );
};

export default MemberCard;
