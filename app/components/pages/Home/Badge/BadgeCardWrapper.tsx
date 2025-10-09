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
      alt: "Konsisten",
    },
    name: "Konsisten",
    description: "Kumpulkan tugas 3 hari berturut-turut",
    progressPercentage: 100,
    progressText: "Tercapai",
    notes: "Selamat kamu sudah mendapatkan badge Konsisten",
  },
  {
    icon: {
      src: IMAGES.BADGE,
      alt: "Fokus Belajar",
    },
    name: "Fokus Belajar",
    description: "Selesaikan 5 sesi belajar tanpa jeda lebih dari 1 hari",
    progressPercentage: 40,
    progressText: "2/5 Sesi",
    notes: "Pertahankan ritme belajarmu untuk capai target ini!",
  },
  {
    icon: {
      src: IMAGES.BADGE,
      alt: "Penolong",
    },
    name: "Penolong",
    description: "Bantu teman dengan menjawab 3 pertanyaan di forum",
    progressPercentage: 100,
    progressText: "Tercapai",
    notes: "Selamat! Kamu sudah mendapatkan badge Penolong",
  },
  {
    icon: {
      src: IMAGES.BADGE,
      alt: "Eksplorer",
    },
    name: "Eksplorer",
    description: "Pelajari minimal 4 topik berbeda dalam seminggu",
    progressPercentage: 50,
    progressText: "2/4 Tercapai",
    notes: "Coba topik baru untuk meningkatkan wawasanmu!",
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
