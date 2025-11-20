import {
  TaskAttemptStatus,
  TaskAttemptStatusLabels,
} from "@/app/enums/TaskAttemptStatus";
import { TaskAttemptOverviewResponse } from "@/app/interface/task-attempts/responses/ITaskAttemptOverviewResponse";
import React from "react";

interface PendingTaskCardProps {
  task: TaskAttemptOverviewResponse;
}

const PendingTaskCard = ({ task }: PendingTaskCardProps) => {
  return (
    <div
      key={task.id}
      className="flex justify-between items-center bg-tertiary hover:bg-[var(--color-tertiary-hover)] transition p-4 rounded-xl border border-br-tertiary"
    >
      <div>
        <p className="font-medium text-tx-primary">{task.title}</p>
        <p className="text-sm text-tx-tertiary">Deadline: {task.deadline}</p>
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
