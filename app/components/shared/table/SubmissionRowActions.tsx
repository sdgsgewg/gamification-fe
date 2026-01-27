import React from "react";
import { Space } from "antd";

import Button, { ButtonVariant } from "../Button";
import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";
import { StudentAttemptAnalyticsResponse } from "@/app/interface/task-attempts/responses/attempt-analytics/IStudentAttemptAnalyticsResponse";

interface AttemptRowActionButtonProps {
  variant?: ButtonVariant;
  onClick: () => void;
  children: React.ReactNode;
}

const AttemptRowActionButton: React.FC<AttemptRowActionButtonProps> = ({
  variant = "primary",
  onClick,
  children,
}) => {
  return (
    <Button variant={variant} onClick={onClick} className="p-3!">
      {children}
    </Button>
  );
};

interface SubmissionRowActionsProps {
  record: StudentAttemptAnalyticsResponse;
  onView?: (student: StudentAttemptAnalyticsResponse) => void;
  onGrade?: (submissionId: string) => void;
}

const SubmissionRowActions: React.FC<SubmissionRowActionsProps> = ({
  record,
  onView,
  onGrade,
}) => {
  const status = record.latestStatus;

  return (
    <Space>
      {onView &&
        [TaskAttemptStatus.COMPLETED, TaskAttemptStatus.PAST_DUE].includes(
          status,
        ) && (
          <AttemptRowActionButton variant="view" onClick={() => onView(record)}>
            View
          </AttemptRowActionButton>
        )}

      {onGrade && [TaskAttemptStatus.SUBMITTED].includes(status) && (
        <AttemptRowActionButton
          variant="warning"
          onClick={() => onGrade(record.latestSubmissionId)}
        >
          Grade
        </AttemptRowActionButton>
      )}
    </Space>
  );
};

export default SubmissionRowActions;
