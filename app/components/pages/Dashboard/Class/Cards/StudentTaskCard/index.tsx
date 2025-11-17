import React from "react";
import Image from "next/image";
import { IMAGES } from "@/app/constants/images";
import {
  faBook,
  faCalendar,
  faCalendarAlt,
  faCheckCircle,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  TaskAttemptStatus,
  TaskAttemptStatusLabels,
} from "@/app/enums/TaskAttemptStatus";
import { StudentClassTaskResponse } from "@/app/interface/class-tasks/responses/IStudentClassTaskResponse";
import Button from "@/app/components/shared/Button";
import { Tag } from "antd";
import {
  getStatusIcon,
  getStatusTagColor,
} from "@/app/utils/taskAttemptHelper";

interface StudentTaskCardProps {
  task: StudentClassTaskResponse;
  onClick: (slug: string) => void;
}

const StudentTaskCard = ({ task, onClick }: StudentTaskCardProps) => {
  const { questionCount, status } = task;

  const answeredPercentage = Math.round(
    (task.answeredCount / questionCount) * 100
  );

  const modifiedStatus = status as TaskAttemptStatus;

  const getStatusText = () => {
    if (TaskAttemptStatusLabels[modifiedStatus] === "Completed")
      return "Graded";
    return TaskAttemptStatusLabels[modifiedStatus];
  };

  return (
    <div className="p-4 bg-background rounded-xl shadow-sm border border-br-primary hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-dark">{task.title}</h3>
        {/* <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadgeClass}`}
        >
          {TaskAttemptStatusLabels[task.status]}
        </span> */}
        <Tag color={getStatusTagColor(modifiedStatus)} className="!m-0">
          <FontAwesomeIcon icon={getStatusIcon(modifiedStatus)} />
          <span className="ms-1">{getStatusText()}</span>
        </Tag>
      </div>

      {/* Progress bar submission rate */}
      <div className="w-full bg-light-muted h-2 rounded-full mb-4">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${answeredPercentage}%` }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 text-sm text-tx-secondary mb-3">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCheckCircle} className="text-tx-tertiary" />
          <span>
            {task.answeredCount} answered,{" "}
            {task.questionCount - task.answeredCount} remaining
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faBook} className="text-tx-tertiary" />
          <span>{task.subject}</span>
        </div>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faFileAlt} className="text-tx-tertiary" />
          <span>{task.type}</span>
        </div>

        {task.deadline && (
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="text-tx-tertiary"
            />
            <span>Deadline: {task.deadline}</span>
          </div>
        )}
      </div>

      {/* Button */}
      <div className="flex justify-end" onClick={() => onClick(task.slug)}>
        <Button variant="primary" size="middle">
          View Detail
        </Button>
      </div>
    </div>
  );
};

export default StudentTaskCard;
