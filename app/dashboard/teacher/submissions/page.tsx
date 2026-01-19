"use client";

import SubmissionPage from "@/app/components/pages/Dashboard/Submission/SubmissionsPageContainer";
import { useTaskAttemptsFromClass } from "@/app/hooks/task-attempts/useTaskAttemptsFromClass";
import { useTaskAttemptsFromActivityPage } from "@/app/hooks/task-attempts/useTaskAttemptsFromActivityPage";

export default function TeacherSubmissionPage() {
  const classOverview = useTaskAttemptsFromClass();
  const activityOverview = useTaskAttemptsFromActivityPage();

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
