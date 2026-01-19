"use client";

import SubmissionPage from "@/app/components/pages/Dashboard/Submission/SubmissionsPageContainer";
import { useTaskAttemptsFromActivityPage } from "@/app/hooks/task-attempts/useTaskAttemptsFromActivityPage";
import { useStudentAttemptsFromActivityTask } from "@/app/hooks/task-attempts/useStudentAttemptsFromActivityTask";

export const dynamic = "force-dynamic";

export default function AdminSubmissionPage() {
  const activityOverview = useTaskAttemptsFromActivityPage();
  const activityDetail = useStudentAttemptsFromActivityTask("");

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

        detail: {
          activity: {
            data: activityDetail.data,
            isLoading: activityDetail.isLoading,
          },
        },

        resolveIsDetailView: ({ taskSlug }) => Boolean(taskSlug),
      }}
    />
  );
}
