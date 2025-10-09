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
    description: "Pilih pelajaran sesuai dengan preferensimu",
  },
  {
    title: "02",
    description: "Kerjakan berbagai tugas yang tersedia",
  },
  {
    title: "03",
    description: "Kumpulkan Poin & Badge dari setiap tugas",
  },
  {
    title: "04",
    description: "Pantau progres anda & naik level",
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
