import {
  TaskAttemptStatus,
  TaskAttemptStatusLabels,
} from "@/app/enums/TaskAttemptStatus";
import { ClassTaskOverviewResponse } from "@/app/interface/class-tasks/responses/IClassTaskOverviewResponse";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { FaBookOpen, FaCalendarAlt } from "react-icons/fa";

interface PendingTaskCardProps {
  task: ClassTaskOverviewResponse;
}

const PendingTaskCard = ({ task }: PendingTaskCardProps) => {
  const getClassText = () => {
    return `From: ${task.class.name}`;
  };

  return (
    <div
      key={task.id}
      className="flex justify-between items-center bg-tertiary hover:bg-tertiary-hover transition p-4 rounded-xl border border-br-tertiary"
    >
      <div className="flex flex-col justify-between gap-1">
        <div className="flex flex-col">
          <p className="font-medium text-tx-primary">{task.title}</p>
        </div>
        <div className="flex flex-col gap-0.5">
          {task.deadline && (
            <p className="text-tx-tertiary text-xs font-medium flex items-center gap-1">
              <FaCalendarAlt className="w-3 h-3" />
              <span>Deadline: {task.deadline}</span>
            </p>
          )}
          <p className="text-tx-tertiary text-xs font-medium flex items-center gap-1">
            <FaBookOpen className="w-3 h-3" />
            <span>{getClassText()}</span>
          </p>
        </div>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium "bg-danger/20 text-danger`}
      >
        {TaskAttemptStatusLabels[task.status as TaskAttemptStatus]}
      </span>
    </div>
  );
};

export default PendingTaskCard;
