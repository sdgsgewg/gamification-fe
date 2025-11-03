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
  ActivityAttemptStatus,
  ActivityAttemptStatusLabels,
} from "@/app/enums/ActivityAttemptStatus";

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
      className={`bg-card flex gap-6 rounded-lg shadow-sm p-4 lg:p-6 cursor-pointer`}
      onClick={navigateToHistoryDetailPage}
    >
      <div className="w-[12%]">
        <Image
          src={image ?? ""}
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
              ? `Terakhir diakses: ${lastAccessedTime}`
              : `Dikumpul pada: ${completedTime}`}
          </p>
        </div>
        <div className="flex items-start justify-start">
          <Tag color={completedTime ? "green" : "yellow"} className="!m-0">
            <FontAwesomeIcon icon={completedTime ? faCheck : faClock} />
            <span>
              {ActivityAttemptStatusLabels[status as ActivityAttemptStatus]}
            </span>
          </Tag>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
