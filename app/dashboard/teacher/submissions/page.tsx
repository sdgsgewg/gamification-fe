"use client";

import SubmissionPage from "@/app/components/pages/Dashboard/Submission/SubmissionsPageContainer";
import { TaskAttemptScope } from "@/app/enums/TaskAttemptScope";
import { useTaskAttemptsAnalytics } from "@/app/hooks/task-attempts/useTaskAttemptsAnalytics";
import { FilterTaskAttemptAnalyticsRequest } from "@/app/interface/task-attempts/requests/IFilterTaskAttemptAnalyticsRequest";
import { useState } from "react";

export default function TeacherSubmissionPage() {
  const [filters, setFilters] = useState<FilterTaskAttemptAnalyticsRequest>({
    searchText: "",
    scope: TaskAttemptScope.CLASS,
  });

  const classOverview = useTaskAttemptsAnalytics({
    ...filters,
    scope: TaskAttemptScope.CLASS,
  });

  const activityOverview = useTaskAttemptsAnalytics({
    ...filters,
    scope: TaskAttemptScope.ACTIVITY,
  });

  return (
    <SubmissionPage
      config={{
        scopes: [
          { value: "class", label: "Class Tasks" },
          { value: "activity", label: "Activity Tasks" },
        ],

        overview: {
          class: {
            data: classOverview.data ?? [],
            isLoading: classOverview.isLoading,
          },
          activity: {
            data: activityOverview.data ?? [],
            isLoading: activityOverview.isLoading,
          },
        },
      }}
    />
  );
}
