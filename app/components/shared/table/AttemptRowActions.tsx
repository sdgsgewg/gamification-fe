import React from "react";
import { Space } from "antd";
import Button, { ButtonVariant } from "../Button";
import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";
import { StudentAttemptDetailResponse } from "@/app/interface/task-attempts/responses/attempt-analytics/IStudentAttemptDetailResponse";

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

interface AttemptRowActionsProps {
  record: StudentAttemptDetailResponse;
  onView?: (attemptId: string) => void;
  onAttempt?: (taskSlug: string, classSlug?: string) => void;
  onGrade?: (attemptId: string) => void;
}

const AttemptRowActions: React.FC<AttemptRowActionsProps> = ({
  record,
  onView,
  onAttempt,
  onGrade,
}) => {
  const status = record.status;

  const getText = () => {
    switch (status) {
      case TaskAttemptStatus.NOT_STARTED:
        return "Start";
      case TaskAttemptStatus.ON_PROGRESS:
        return "Continue";
      case TaskAttemptStatus.SUBMITTED:
        return "View";
      case TaskAttemptStatus.COMPLETED:
        return "View";
      case TaskAttemptStatus.PAST_DUE:
        return "View";
      default:
        return "";
    }
  };

  return (
    <Space>
      {onView &&
        [
          TaskAttemptStatus.SUBMITTED,
          TaskAttemptStatus.COMPLETED,
          TaskAttemptStatus.PAST_DUE,
        ].includes(status) && (
          <AttemptRowActionButton
            variant="view"
            onClick={() => onView(record.attemptId)}
          >
            View
          </AttemptRowActionButton>
        )}
      {onAttempt &&
        [TaskAttemptStatus.NOT_STARTED, TaskAttemptStatus.ON_PROGRESS].includes(
          status,
        ) && (
          <AttemptRowActionButton
            variant="view"
            onClick={() =>
              onAttempt(record.class?.slug ?? "", record.task.slug)
            }
          >
            {getText()}
          </AttemptRowActionButton>
        )}

      {onGrade && [TaskAttemptStatus.SUBMITTED].includes(status) && (
        <AttemptRowActionButton
          variant="warning"
          onClick={() => onGrade(record.attemptId)}
        >
          Grade
        </AttemptRowActionButton>
      )}
    </Space>
  );
};

export default AttemptRowActions;
