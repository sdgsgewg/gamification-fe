"use client";

import React from "react";
import {
  TaskAttemptStatus,
  TaskAttemptStatusLabels,
} from "@/app/enums/TaskAttemptStatus";
import Button from "../../Button";

interface AttemptCardProps {
  index: number;
  id: string;
  startedAt: string;
  completedAt: string;
  duration: string;
  status: TaskAttemptStatus;
  onClick: (attemptId: string) => void;
}

const AttemptCard: React.FC<AttemptCardProps> = ({
  index,
  id,
  startedAt,
  completedAt,
  duration,
  status,
  onClick,
}) => {
  return (
    <div className="bg-card border border-br-secondary shadow-sm rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md transition-all">
      <div>{`Attempt ${index + 1}`}</div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-600">Status</span>
        <span className="text-sm font-bold text-primary">
          {TaskAttemptStatusLabels[status]}
        </span>
      </div>

      <div className="flex flex-col text-sm text-gray-700 gap-1">
        <div>
          <span className="font-medium">Started:</span> {startedAt}
        </div>
        <div>
          <span className="font-medium">Completed:</span> {completedAt}
        </div>
        <div>
          <span className="font-medium">Duration:</span> {duration}
        </div>
      </div>

      {status !== TaskAttemptStatus.PAST_DUE && (
        <Button variant="primary" size="middle" onClick={() => onClick(id)}>
          Review
        </Button>
      )}
    </div>
  );
};

export default AttemptCard;
