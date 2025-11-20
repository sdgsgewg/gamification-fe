"use client";

import { IMAGES } from "@/app/constants/images";
import { ClassOverviewResponse } from "@/app/interface/classes/responses/IClassOverviewResponse";
import Image from "next/image";
import React from "react";

interface ClassCardProps {
  data: ClassOverviewResponse;
  onClick: (slug: string) => void;
}

const ClassCard = ({ data, onClick }: ClassCardProps) => {
  const { name, slug, image } = data;

  return (
    <div
      className="bg-background flex flex-col items-center justify-center gap-4 p-6 rounded-lg shadow-xs border border-br-primary hover:bg-background-hover transition duration-300 ease-in-out cursor-pointer"
      onClick={() => onClick(slug)}
    >
      <div className="max-w-24 min-h-24 max-h-24 flex items-center justify-center">
        <Image
          src={image ?? IMAGES.DEFAULT_CLASS}
          alt={name}
          width={100}
          height={100}
          className="w-full h-full object-center"
        />
      </div>
      <p className="text-dark text-base font-semibold">{name}</p>
    </div>
  );
};

export default ClassCard;
