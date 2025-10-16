"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ROUTES } from "@/app/constants/routes";
import { useGetCachedUser } from "@/app/hooks/useGetCachedUser";
import { useActivities } from "@/app/hooks/activities/useActivities";
import Loading from "@/app/components/shared/Loading";
import {
  ActivitySectionLabels,
  ActivitySectionType,
} from "@/app/enums/ActivitySectionType";
import ActivityCard from "@/app/components/pages/Activity/ActivityCard";

const ActivitySectionPage = () => {
  const params = useParams<{ section: string }>();
  const router = useRouter();
  const baseRoute = ROUTES.ROOT.ACTIVITY;
  const { user } = useGetCachedUser();

  const { data: activities = [], isLoading } = useActivities({
    section: params.section,
    userId: user?.userId,
  });

  const showAnsweredCount = params.section === ActivitySectionType.CONTINUE;
  const showNewBadge = params.section === ActivitySectionType.LATEST;

  const sectionLabel =
    ActivitySectionLabels[params.section as ActivitySectionType] ?? "Aktivitas";

  return (
    <>
      {isLoading && <Loading />}

      <div className="w-full flex flex-col gap-8 pt-8 pb-16 px-4 sm:px-8 md:px-12 xl:px-20">
        <h1 className="text-2xl sm:text-3xl font-bold">{sectionLabel}</h1>

        <div className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 sm:gap-y-8 lg:gap-y-12 gap-x-0 xxs:gap-x-4 sm:gap-x-8 md:gap-x-12">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              type={activity.type}
              image={activity.image ?? ""}
              title={activity.title}
              slug={activity.slug}
              subject={activity.subject}
              grade={activity.grade}
              questionCount={activity.questionCount}
              answeredCount={
                showAnsweredCount ? activity.answeredCount : undefined
              }
              isNewActivity={showNewBadge}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ActivitySectionPage;
