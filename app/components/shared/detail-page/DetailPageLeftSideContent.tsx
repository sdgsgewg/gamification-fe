import { IMAGES } from "@/app/constants/images";
import Image from "next/image";
import React from "react";

interface DetailPageLeftSideContentProps {
  name: string;
  hasImage?: boolean;
  image?: string;
  description?: string;
}

const DetailPageLeftSideContent = ({
  name,
  hasImage = true,
  image,
  description,
}: DetailPageLeftSideContentProps) => {
  return (
    <div className="flex flex-col gap-4 text-dark">
      <h2 className="text-2xl font-semibold">{name}</h2>
      {hasImage && image && (
        <Image
          src={image || IMAGES.DEFAULT_IMAGE}
          alt={name}
          width={200}
          height={200}
          className="rounded-xl object-cover"
        />
      )}
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-row items-center gap-2">
          <Image
            src={IMAGES.DESCRIPTION}
            alt="description"
            width={24}
            height={24}
          />
          <p className="text-base font-medium">Deskripsi</p>
        </div>
        <p className="text-sm text-justify">{description}</p>
      </div>
    </div>
  );
};

export default DetailPageLeftSideContent;
