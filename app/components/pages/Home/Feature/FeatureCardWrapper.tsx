import React from "react";
import { IMAGES } from "@/app/constants/images";
import FeatureCard from "./FeatureCard";
import CardWrapper from "../CardWrapper";

interface IconData {
  src: string;
  alt: string;
}

export interface FeatureContentData {
  icon: IconData;
  title: string;
  description: string;
}

const features: FeatureContentData[] = [
  {
    icon: {
      src: IMAGES.RELEVANT_QUESTIONS,
      alt: "Comprehensive & Relevant Questions",
    },
    title: "Comprehensive & Relevant Questions",
    description:
      "A wide variety of high-quality questions aligned with learning materials, designed to strengthen understanding and learning skills.",
  },
  {
    icon: {
      src: IMAGES.LEADERBOARD,
      alt: "Global & Class Leaderboards",
    },
    title: "Global & Class Leaderboards",
    description:
      "Track your position on the global or class leaderboard and boost your motivation through healthy competition.",
  },
  {
    icon: {
      src: IMAGES.BADGE,
      alt: "Badge Collection",
    },
    title: "Badge Collection",
    description:
      "Earn exciting achievements and collect badges as a reward for your effort and consistency.",
  },
  {
    icon: {
      src: IMAGES.MINI_GAME,
      alt: "Educational Mini Games",
    },
    title: "Educational Mini Games",
    description:
      "Learn while playing through interactive mini games designed to enhance focus and concept understanding.",
  },
  {
    icon: {
      src: IMAGES.TASK,
      alt: "Daily Practice & Challenges",
    },
    title: "Daily Practice & Challenges",
    description:
      "Get daily questions and fun challenges that help you build a consistent and effective study habit.",
  },
  {
    icon: {
      src: IMAGES.CLASS,
      alt: "Interactive Classes",
    },
    title: "Interactive Classes",
    description:
      "Join virtual classes, complete assignments from teachers, and engage in a collaborative learning environment.",
  },
];

export const FeatureCardWrapper: React.FC = () => {
  return (
    <CardWrapper>
      {features.map((featureContent, index) => (
        <FeatureCard key={index} featureContent={featureContent} />
      ))}
    </CardWrapper>
  );
};