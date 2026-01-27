"use client";

import SubmissionPage from "@/app/components/pages/Dashboard/Submission/SubmissionsPageContainer";
import { TaskAttemptScope } from "@/app/enums/TaskAttemptScope";
import { useTaskAttemptsAnalytics } from "@/app/hooks/task-attempts/useTaskAttemptsAnalytics";
import { FilterTaskAttemptAnalyticsRequest } from "@/app/interface/task-attempts/requests/IFilterTaskAttemptAnalyticsRequest";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function AdminAnalyticsPage() {
  const [filters, setFilters] = useState<FilterTaskAttemptAnalyticsRequest>({
    searchText: "",
    scope: TaskAttemptScope.CLASS,
  });

  const activityOverview = useTaskAttemptsAnalytics({
    ...filters,
    scope: TaskAttemptScope.ACTIVITY,
  });

  return (
    <SubmissionPage
      config={{
        scopes: [{ value: "activity", label: "Activity Tasks" }],

        overview: {
          activity: {
            data: activityOverview.data ?? [],
            isLoading: activityOverview.isLoading,
          },
        },
      }}
    />
  );
}
