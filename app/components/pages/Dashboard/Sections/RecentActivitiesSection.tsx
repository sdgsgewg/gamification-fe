"use client";

import React from "react";
import {
  UserActivityCard,
  UserActivityCardSkeleton,
  UserActivityCardWrapper,
} from "@/app/components/pages/Dashboard/Cards";
import { ActivityLogOverviewResponse } from "@/app/interface/activity-logs/responses/IActivityLogOverviewResponse";
import { MasterHistoryOverviewResponse } from "@/app/interface/master-histories/responses/IMasterHistoryOverviewResponse";

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
    <UserActivityCardWrapper title={title}>
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <UserActivityCardSkeleton key={i} />
        ))
      ) : data.length === 0 ? (
        <p className="text-tx-tertiary text-sm">{noDataText}</p>
      ) : (
        data.map((data) => (
          <UserActivityCard
            key={data.id}
            description={data.description}
            createdAt={data.createdAt}
          />
        ))
      )}
    </UserActivityCardWrapper>
  );
}
