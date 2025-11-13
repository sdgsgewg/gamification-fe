"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/constants/routes";
import { IMAGES } from "@/app/constants/images";
import StatusBar from "../../shared/StatusBar";

interface ActivityCardProps {
  type: string;
  isNewActivity?: boolean;
  image: string;
  title: string;
  slug: string;
  subject: string;
  grade: string;
  questionCount: number;
  answeredCount?: number;
}

const ActivityCard = ({
  type,
  isNewActivity = false,
  image,
  title,
  slug,
  subject,
  grade,
  questionCount,
  answeredCount,
}: ActivityCardProps) => {
  const router = useRouter();

  const navigateToActivityDetailPage = (slug: string) => {
    router.push(`${ROUTES.ROOT.ACTIVITY}/${slug}`);
  };

  return (
    <div
      className={`relative bg-card w-full h-full flex flex-col gap-2 rounded-lg shadow-md p-3 cursor-pointer`}
      onClick={() => navigateToActivityDetailPage(slug)}
    >
      <div className="flex items-center justify-between text-white font-semibold">
        {/* Type */}
        <span className="bg-activity-type py-[0.15rem] px-2 rounded-4xl text-[0.5rem] uppercase">
          {type}
        </span>

        {/* Tag New Activity */}
        {isNewActivity && (
          <span className="bg-activity-new py-[0.15rem] px-2 rounded-sm text-[0.5rem] uppercase">
            Baru
          </span>
        )}
      </div>

      {/* Gambar Aktivitas */}
      <div className="w-2/3">
        <Image
          src={image !== "" ? image : IMAGES.CTA}
          alt={title}
          width={100}
          height={100}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Status Pengerjaan (untuk section "Lanjut Mengerjakan") */}
      {answeredCount && (
        <StatusBar
          current={answeredCount}
          total={questionCount}
          labelClassName="text-[0.625rem] font-medium"
          height={"h-2"}
        />
      )}

      <div className="flex flex-col gap-2 mt-auto">
        {/* Judul */}
        <h4 className="text-lg font-bold">{title}</h4>

        {/* Mata Pelajaran */}
        <span className="flex items-center gap-2">
          <Image src={IMAGES.SUBJECT} alt={subject} width={20} height={20} />
          <p className="text-xs font-medium">{subject}</p>
        </span>

        {/* Jumlah Soal */}
        <span className="flex items-center gap-2">
          <Image
            src={IMAGES.GRADE}
            alt={`Kelas ${grade}`}
            width={20}
            height={20}
          />
          <p className="text-xs font-medium">{`Kelas ${grade}`}</p>
        </span>
      </div>
    </div>
  );
};

export default ActivityCard;
