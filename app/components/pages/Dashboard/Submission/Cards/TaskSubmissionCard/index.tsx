"use client";

import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock } from "@fortawesome/free-solid-svg-icons";
import { Tag } from "antd";
import { IMAGES } from "@/app/constants/images";
import { TaskSubmissionOverviewResponse } from "@/app/interface/task-submissions/responses/ITaskSubmissionOverviewResponse";
import {
  TaskSubmissionStatus,
  TaskSubmissionStatusLabels,
} from "@/app/enums/TaskSubmissionStatus";
import { FaBookOpen, FaUser } from "react-icons/fa";

interface TaskSubmissionCardProps {
  submission: TaskSubmissionOverviewResponse;
  onClick: (submissionId: string) => void;
}

const TaskSubmissionCard = ({
  submission,
  onClick,
}: TaskSubmissionCardProps) => {
  const {
    id,
    title,
    image,
    className,
    studentName,
    status,
    submittedTime,
    gradedTime,
  } = submission;

  const getEventText = () => {
    switch (status) {
      case TaskSubmissionStatus.NOT_STARTED:
        return `Submitted at ${submittedTime}`;
      case TaskSubmissionStatus.ON_PROGRESS:
        return `Last graded at ${gradedTime}`;
      case TaskSubmissionStatus.COMPLETED:
        return `Graded at ${gradedTime}`;
      default:
        break;
    }
  };

  const getClassText = () => {
    return `From: ${className}`;
  };

  const getUserText = () => {
    return `By: ${studentName}`;
  };

  const getStatusTagColor = () => {
    switch (status) {
      case TaskSubmissionStatus.NOT_STARTED:
        return `gray`;
      case TaskSubmissionStatus.ON_PROGRESS:
        return `yellow`;
      case TaskSubmissionStatus.COMPLETED:
        return `green`;
      default:
        break;
    }
  };

  return (
    <div
      className={`min-h-24 max-h-24 sm:min-h-32 sm:max-h-32 xl:min-h-32 xl:max-h-32 bg-card flex gap-6 rounded-lg shadow-sm p-4 lg:p-6 cursor-pointer`}
      onClick={() => onClick(id)}
    >
      <div className="w-[15%] sm:w-[18%] xl:w-[8%]">
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
            <p className="text-dark text-sm font-medium">{getEventText()}</p>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-tx-tertiary text-xs font-medium flex items-center gap-1">
              <FaBookOpen className="w-3 h-3" />
              <span>{getClassText()}</span>
            </p>
            <p className="text-tx-tertiary text-xs font-medium flex items-center gap-1">
              <FaUser className="w-3 h-3" />
              <span>{getUserText()}</span>
            </p>
          </div>
        </div>
        <div className="flex items-start justify-start">
          <Tag color={getStatusTagColor()} className="!m-0">
            <FontAwesomeIcon icon={gradedTime ? faCheck : faClock} />
            <span className="ms-1">
              {TaskSubmissionStatusLabels[status as TaskSubmissionStatus]}
            </span>
          </Tag>
        </div>
      </div>
    </div>
  );
};

export default TaskSubmissionCard;
