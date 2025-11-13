import React from "react";
import { IMAGES } from "@/app/constants/images";
import CardWrapper from "../CardWrapper";
import BadgeCard from "./BadgeCard";

interface IconData {
  src: string;
  alt: string;
}

export interface BadgeData {
  icon: IconData;
  name: string;
  description: string;
  progressPercentage: number;
  progressText: string;
  notes: string;
}

const badges: BadgeData[] = [
  {
    icon: {
      src: IMAGES.BADGE,
      alt: "Consistency",
    },
    name: "Consistency",
    description: "Submit assignments for 3 consecutive days",
    progressPercentage: 100,
    progressText: "Achieved",
    notes: "Congratulations! You’ve earned the Consistency badge.",
  },
  {
    icon: {
      src: IMAGES.BADGE,
      alt: "Focus Learner",
    },
    name: "Focus Learner",
    description: "Complete 5 study sessions without skipping more than 1 day",
    progressPercentage: 40,
    progressText: "2/5 Sessions",
    notes: "Keep up your learning rhythm to reach this goal!",
  },
  {
    icon: {
      src: IMAGES.BADGE,
      alt: "Helper",
    },
    name: "Helper",
    description: "Help your friends by answering 3 questions in the forum",
    progressPercentage: 100,
    progressText: "Achieved",
    notes: "Awesome! You’ve earned the Helper badge.",
  },
  {
    icon: {
      src: IMAGES.BADGE,
      alt: "Explorer",
    },
    name: "Explorer",
    description: "Study at least 4 different topics in a week",
    progressPercentage: 50,
    progressText: "2/4 Completed",
    notes: "Try exploring new topics to broaden your knowledge!",
  },
];

const BadgeCardWrapper = () => {
  return (
    <CardWrapper>
      {badges.map((badge, index) => (
        <BadgeCard key={index} badge={badge} />
      ))}
    </CardWrapper>
  );
};

export default BadgeCardWrapper;