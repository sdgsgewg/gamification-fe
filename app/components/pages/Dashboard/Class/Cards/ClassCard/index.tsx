"use client";

import { IMAGES } from "@/app/constants/images";
import { ROUTES } from "@/app/constants/routes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface ClassCardProps {
  image?: string;
  name: string;
  slug: string;
}

const ClassCard = ({ image, name, slug }: ClassCardProps) => {
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.STUDENT.CLASS;

  const handleNavigateToClassDetailPage = () => {
    router.push(`${baseRoute}/${slug}`);
  };

  return (
    <div
      className="bg-background flex flex-col items-center justify-center gap-4 p-6 rounded-lg shadow-xs border border-br-primary hover:bg-background-hover transition duration-300 ease-in-out cursor-pointer"
      onClick={handleNavigateToClassDetailPage}
    >
      <div className="max-w-24 max-h-24">
        <Image
          src={image ?? IMAGES.DEFAULT_CLASS}
          alt={name}
          width={100}
          height={100}
        />
      </div>
      <p className="text-dark text-base font-semibold">{name}</p>
    </div>
  );
};

export default ClassCard;
