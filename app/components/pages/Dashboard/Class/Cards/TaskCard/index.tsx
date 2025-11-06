import React from "react";
import Image from "next/image";
import { IMAGES } from "@/app/constants/images";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TaskCardProps {
  image?: string;
  title: string;
  slug: string;
  type: string;
  difficulty?: string;
  subject: string;
  questionCount: number;
  status?: string;
  deadline?: string;
  onClick: (slug: string) => void;
}

const TaskCard = ({
  image,
  title,
  slug,
  type,
  difficulty,
  subject,
  questionCount,
  deadline,
  onClick,
}: TaskCardProps) => {
  return (
    <div
      className="bg-background flex gap-6 rounded-xl shadow-xs p-6 border border-br-primary hover:bg-background-hover transition duration-300 ease-in-out cursor-pointer"
      onClick={() => onClick(slug)}
    >
      <div className="max-w-[35%]">
        <Image
          src={image ?? IMAGES.ACTIVITY}
          alt={title}
          width={200}
          height={200}
          className="rounded-lg object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-semibold">{title}</h2>
          <span className="w-fit bg-primary text-white text-[0.55rem] font-semibold px-4 py-1 rounded-full">
            {type}
          </span>
          <p className="text-[0.75rem] text-muted-foreground font-medium">
            Mata Pelajaran: {subject}
          </p>
          <p className="text-[0.75rem] text-muted-foreground font-medium">
            Jumlah Soal: {questionCount}
          </p>
        </div>

        {deadline && (
          <div className="max-w-40 flex gap-2 text-[0.75rem] text-muted-foreground mt-2">
            <FontAwesomeIcon
              icon={faCalendar}
              className="text-primary mt-[0.2rem]"
            />
            <span>Deadline: {deadline}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
