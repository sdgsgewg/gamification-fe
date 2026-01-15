"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import Loading from "@/app/components/shared/Loading";
import NotFound from "@/app/components/shared/not-found/NotFound";

import { useTaskSubmissions } from "@/app/hooks/task-submissions/useTaskSubmissions";
import { useTaskSubmissionsInClass } from "@/app/hooks/task-submissions/useTaskSubmissionsInClass";
import OverviewTaskList from "@/app/components/pages/Dashboard/Submission/sections/OverviewTaskList";
import ClassTaskAnalyticsView from "@/app/components/pages/Dashboard/Submission/sections/ClassTaskAnalyticsView";

export const dynamic = "force-dynamic";

const SubmissionsPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [classSlug, setClassSlug] = useState("");
  const [taskSlug, setTaskSlug] = useState("");

  useEffect(() => {
    setClassSlug(searchParams.get("class") ?? "");
    setTaskSlug(searchParams.get("task") ?? "");
  }, [searchParams]);

  const isDetailView = Boolean(classSlug && taskSlug);

  const { data: overviewData = [], isLoading: isOverviewLoading } =
    useTaskSubmissions();

  const {
    data: detailData,
    isLoading: isDetailLoading,
    isError,
  } = useTaskSubmissionsInClass(classSlug, taskSlug);

  return (
    <>
      <DashboardTitle
        title={isDetailView ? "Task Analytics" : "Submission Overview"}
        showBackButton={isDetailView}
      />

      {isDetailView ? (
        isDetailLoading ? (
          <Loading />
        ) : isError || !detailData ? (
          <NotFound text="Task analytics not found" />
        ) : (
          <ClassTaskAnalyticsView data={detailData} />
        )
      ) : isOverviewLoading ? (
        <Loading />
      ) : overviewData.length === 0 ? (
        <NotFound text="No task submissions found" />
      ) : (
        <OverviewTaskList data={overviewData} />
      )}
    </>
  );
};

export default function SubmissionsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SubmissionsPageContent />
    </Suspense>
  );
}
