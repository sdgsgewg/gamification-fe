import React from "react";
import {
  PendingTaskCard,
  PendingTaskCardSkeleton,
  PendingTaskCardWrapper,
} from "../../Cards";
import EmptyText from "@/app/components/shared/not-found/EmptyText";
import { ClassTaskOverviewResponse } from "@/app/interface/class-tasks/responses/IClassTaskOverviewResponse";
import DashboardSectionWrapper from "../Wrapper";

interface PendingTaskSectionProps {
  data: ClassTaskOverviewResponse[];
  isLoading: boolean;
}

const PendingTaskSection = ({ data, isLoading }: PendingTaskSectionProps) => {
  return (
    <DashboardSectionWrapper
      title="Pending Tasks"
      subtitle="These are the tasks you haven’t started yet."
    >
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
    </DashboardSectionWrapper>
  );
};

export default PendingTaskSection;
