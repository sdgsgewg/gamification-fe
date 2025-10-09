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
      alt: "Soal Lengkap & Relevan",
    },
    title: "Soal Lengkap & Relevan",
    description:
      "Beragam soal berkualitas sesuai materi pelajaran yang dirancang untuk mengasah pemahaman dan keterampilan belajar.",
  },
  {
    icon: {
      src: IMAGES.LEADERBOARD,
      alt: "Leaderboard Global & Kelas",
    },
    title: "Leaderboard Global & Kelas",
    description:
      "Pantau posisi kamu di leaderboard global atau dalam kelas dan tingkatkan motivasi belajar melalui persaingan sehat.",
  },
  {
    icon: {
      src: IMAGES.BADGE,
      alt: "Koleksi Badge",
    },
    title: "Koleksi Badge",
    description:
      "Raih pencapaian menarik dan kumpulkan badge sebagai bentuk penghargaan atas usaha dan konsistensimu.",
  },
  {
    icon: {
      src: IMAGES.MINI_GAME,
      alt: "Mini Game Edukatif",
    },
    title: "Mini Game Edukatif",
    description:
      "Belajar sambil bermain melalui mini game interaktif yang dirancang untuk melatih konsentrasi dan pemahaman konsep.",
  },
  {
    icon: {
      src: IMAGES.TASK,
      alt: "Latihan Harian & Tantangan",
    },
    title: "Latihan Harian & Tantangan",
    description:
      "Dapatkan soal-soal harian dan tantangan seru yang mendorong kebiasaan belajar rutin dan konsisten setiap hari.",
  },
  {
    icon: {
      src: IMAGES.CLASS,
      alt: "Kelas Interaktif",
    },
    title: "Kelas Interaktif",
    description:
      "Ikuti kelas virtual, dapatkan tugas dari guru, dan terlibat aktif dalam lingkungan belajar yang kolaboratif.",
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
