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
import { FaClock } from "react-icons/fa";
import {
  getDeadlineText,
  getProgressText,
  getStatusIcon,
  getStatusTagColor,
} from "@/app/utils/taskAttemptHelper";

interface TaskHistoryCardProps {
  attempt: TaskAttemptOverviewResponse;
  onClick: (classSlug: string, taskSlug: string) => void;
}

const TaskHistoryCard = ({ attempt, onClick }: TaskHistoryCardProps) => {
  const { title, image, status, classSlug, taskSlug } = attempt;

  const modifiedStatus = status as TaskAttemptStatus;

  const getStatusText = () => {
    if (TaskAttemptStatusLabels[modifiedStatus] === "Completed")
      return "Graded";
    return TaskAttemptStatusLabels[modifiedStatus];
  };

  return (
    <div
      className={`h-24 sm:h-28 xl:h-32 bg-card flex gap-6 rounded-lg shadow-sm p-4 lg:p-6 cursor-pointer`}
      onClick={() => onClick(classSlug, taskSlug)}
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
        <div className="flex flex-col justify-between gap-1">
          <div className="flex flex-col gap-0.5">
            <h4 className="text-lg font-bold text-start">{title}</h4>
            <p className="text-dark text-sm font-medium">
              {getProgressText(attempt)}
            </p>
          </div>
          {getDeadlineText(attempt) !== "" && (
            <div className="flex flex-col gap-0.5">
              <p className="text-tx-tertiary text-xs font-medium flex items-center gap-1">
                <FaClock className="w-3 h-3" />
                <span>{getDeadlineText(attempt)}</span>
              </p>
            </div>
          )}
        </div>
        <div className="flex items-start justify-start">
          <Tag color={getStatusTagColor(modifiedStatus)} className="!m-0">
            <FontAwesomeIcon icon={getStatusIcon(modifiedStatus)} />
            <span className="ms-1">{getStatusText()}</span>
          </Tag>
        </div>
      </div>
    </div>
  );
};

export default TaskHistoryCard;
