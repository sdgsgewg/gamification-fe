"use client";

import React from "react";
import {
  UserActivityCard,
  UserActivityCardSkeleton,
} from "@/app/components/pages/Dashboard/Cards";
import { ActivityLogOverviewResponse } from "@/app/interface/activity-logs/responses/IActivityLogOverviewResponse";
import { MasterHistoryOverviewResponse } from "@/app/interface/master-histories/responses/IMasterHistoryOverviewResponse";
import EmptyText from "@/app/components/shared/not-found/EmptyText";
import DashboardSectionWrapper from "./Wrapper";

interface RecentActivitiesSectionProps {
  title?: string;
  noDataText?: string;
  data: MasterHistoryOverviewResponse[] | ActivityLogOverviewResponse[];
  isLoading: boolean;
}

export default function RecentActivitiesSection({
  title = "Recent Activities",
  noDataText = "No activty yet",
  data,
  isLoading,
}: RecentActivitiesSectionProps) {
  return (
    <DashboardSectionWrapper title={title}>
      <div className="py-2 overflow-y-auto max-h-[16rem]">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <UserActivityCardSkeleton key={i} />
          ))
        ) : data.length === 0 ? (
          <EmptyText text={noDataText} />
        ) : (
          data.map((data) => (
            <UserActivityCard
              key={data.id}
              description={data.description}
              createdAt={data.createdAt}
            />
          ))
        )}
      </div>
    </DashboardSectionWrapper>
  );
}
