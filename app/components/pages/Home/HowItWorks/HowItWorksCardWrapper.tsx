import React from "react";
import HowItWorksCard from "./HowItWorksCard";
import CardWrapper from "../CardWrapper";

export interface HowItWorksContentData {
  title: string;
  description: string;
}

const howItWorksContent: HowItWorksContentData[] = [
  {
    title: "01",
    description: "Choose a subject that matches your interests",
  },
  {
    title: "02",
    description: "Complete the various assignments available",
  },
  {
    title: "03",
    description: "Earn Points & Badges from each task",
  },
  {
    title: "04",
    description: "Track your progress & level up",
  },
];

export const HowItWorksCardWrapper: React.FC = () => {
  return (
    <CardWrapper>
      {howItWorksContent.map((howItWorkContent, index) => (
        <HowItWorksCard key={index} howItWorkContent={howItWorkContent} />
      ))}
    </CardWrapper>
  );
};