import React from "react";
import { FeatureContentData } from "./FeatureCardWrapper";
import Image from "next/image";

interface FeatureCardProps {
  featureContent: FeatureContentData;
}

const FeatureCard = ({ featureContent }: FeatureCardProps) => {
  const { icon, title, description } = featureContent;

  return (
    <div className="max-w-[16rem] sm:max-w-[20rem] bg-white flex flex-col gap-4 rounded-xl shadow p-6">
      <div className="w-full flex items-center justify-center">
        <Image src={icon.src} alt={icon.alt} width={64} height={64} />
      </div>
      <h4 className="text-xl font-bold">{title}</h4>
      <p className="text-black text-base">{description}</p>
    </div>
  );
};

export default FeatureCard;
