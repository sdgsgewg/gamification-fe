import React from "react";
import { HowItWorksContentData } from "./HowItWorksCardWrapper";

interface HowItWorksCardProps {
  howItWorkContent: HowItWorksContentData;
}

const HowItWorksCard = ({ howItWorkContent }: HowItWorksCardProps) => {
  const { title, description } = howItWorkContent;

  return (
    <div className="max-w-[16rem] bg-card flex flex-col gap-4 rounded-xl shadow-lg p-6">
      <h4 className="text-4xl font-bold">{title}</h4>
      <p className="text-dark text-base font-semibold">{description}</p>
    </div>
  );
};

export default HowItWorksCard;
