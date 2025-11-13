"use client";

import React from "react";
import Image from "next/image";
import { TaskAttemptOverviewResponse } from "@/app/interface/task-attempts/responses/ITaskAttemptOverviewResponse";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock } from "@fortawesome/free-solid-svg-icons";
import { ROUTES } from "@/app/constants/routes";
import { Tag } from "antd";
import {
  TaskAttemptStatus,
  TaskAttemptStatusLabels,
} from "@/app/enums/TaskAttemptStatus";
import { IMAGES } from "@/app/constants/images";

interface HistoryCardProps {
  attempt: TaskAttemptOverviewResponse;
}

const HistoryCard = ({ attempt }: HistoryCardProps) => {
  const { id, title, image, status, lastAccessedTime, completedTime } = attempt;
  const router = useRouter();

  const navigateToHistoryDetailPage = () => {
    router.push(`${ROUTES.ROOT.HISTORY}/${id}`);
  };

  return (
    <div
      className={`h-24 sm:h-28 xl:h-32 bg-card flex gap-6 rounded-lg shadow-sm p-4 lg:p-6 cursor-pointer`}
      onClick={navigateToHistoryDetailPage}
    >
      <div className="w-[15%] md:w-[12%] xl:w-[8%]">
        <Image
          src={image ?? IMAGES.ACTIVITY}
          alt={title}
          width={200}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex justify-between">
        <div className="flex flex-col gap-1">
          <h4 className="text-lg font-bold text-start">{title}</h4>
          <p className="text-dark text-sm font-medium">
            {completedTime
              ? `Submitted on: ${completedTime}`
              : `Last accessed: ${lastAccessedTime}`}
          </p>
        </div>
        <div className="flex items-start justify-start">
          <Tag color={completedTime ? "green" : "yellow"} className="!m-0">
            <FontAwesomeIcon icon={completedTime ? faCheck : faClock} />
            <span className="ms-1">
              {TaskAttemptStatusLabels[status as TaskAttemptStatus]}
            </span>
          </Tag>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
