"use client";

import React from "react";
import Image from "next/image";
import { TaskAttemptOverviewResponse } from "@/app/interface/task-attempts/responses/ITaskAttemptOverviewResponse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tag } from "antd";
import {
  TaskAttemptStatus,
  TaskAttemptStatusLabels,
} from "@/app/enums/TaskAttemptStatus";
import { IMAGES } from "@/app/constants/images";
import {
  getProgressText,
  getStatusIcon,
  getStatusTagColor,
} from "@/app/utils/taskAttemptHelper";

interface HistoryCardProps {
  attempt: TaskAttemptOverviewResponse;
  onClick: (id: string) => void;
}

const HistoryCard = ({ attempt, onClick }: HistoryCardProps) => {
  const { id, title, image, status } = attempt;

  const modifiedStatus = status as TaskAttemptStatus;

  return (
    <div
      className={`h-24 sm:h-28 xl:h-32 bg-card flex gap-6 rounded-lg shadow-sm p-4 lg:p-6 cursor-pointer`}
      onClick={() => onClick(id)}
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
          <h4 className="text-base md:text-lg font-bold text-start line-clamp-1">{title}</h4>
          <p className="text-dark text-sm font-medium">
            {getProgressText(attempt)}
          </p>
        </div>
        <div className="flex items-start justify-start">
          <Tag color={getStatusTagColor(modifiedStatus)} className="!m-0">
            <FontAwesomeIcon icon={getStatusIcon(modifiedStatus)} />
            <span className="ms-1">
              {TaskAttemptStatusLabels[modifiedStatus]}
            </span>
          </Tag>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
