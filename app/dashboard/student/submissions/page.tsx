"use client";

import StudentSubmissionPage from "@/app/components/pages/Dashboard/Submission/StudentSubmissionPageContainer";
import { TaskAttemptScope } from "@/app/enums/TaskAttemptScope";
import { useStudentTaskAttemptsAnalytics } from "@/app/hooks/task-attempts/useStudentTaskAttemptAnalytics";
import { FilterTaskAttemptAnalyticsRequest } from "@/app/interface/task-attempts/requests/IFilterTaskAttemptAnalyticsRequest";
import { useState } from "react";

export default function StudSubmissionPage() {
  const [filters, setFilters] = useState<FilterTaskAttemptAnalyticsRequest>({
    searchText: "",
    scope: TaskAttemptScope.CLASS,
  });

  const classOverview = useStudentTaskAttemptsAnalytics({
    ...filters,
    scope: TaskAttemptScope.CLASS,
  });

  const activityOverview = useStudentTaskAttemptsAnalytics({
    ...filters,
    scope: TaskAttemptScope.ACTIVITY,
  });

  return (
    <StudentSubmissionPage
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
