import { TaskAttemptOverviewResponse } from "@/app/interface/task-attempts/responses/ITaskAttemptOverviewResponse";
import React from "react";
import {
  PendingTaskCard,
  PendingTaskCardSkeleton,
  PendingTaskCardWrapper,
} from "../../Cards";
import EmptyText from "@/app/components/shared/not-found/EmptyText";

interface PendingTaskSectionProps {
  data: TaskAttemptOverviewResponse[];
  isLoading: boolean;
}

const PendingTaskSection = ({ data, isLoading }: PendingTaskSectionProps) => {
  return (
    <div className="col-span-2 bg-card p-5 rounded-2xl shadow-md border border-outline">
      <h2 className="text-lg font-semibold text-primary mb-3">Pending Tasks</h2>

      {isLoading ? (
        <PendingTaskCardWrapper>
          {Array.from({ length: 4 }).map((_, idx) => (
            <PendingTaskCardSkeleton key={idx} />
          ))}
        </PendingTaskCardWrapper>
      ) : data && data.length > 0 ? (
        <PendingTaskCardWrapper>
          {data.map((task) => {
            return <PendingTaskCard key={task.id} task={task} />;
          })}
        </PendingTaskCardWrapper>
      ) : (
        <EmptyText text={`No pending task`} />
      )}
    </div>
  );
};

export default PendingTaskSection;
