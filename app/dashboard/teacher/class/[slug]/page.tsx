"use client";

import {
  MemberCard,
  MemberCardSkeleton,
  MemberCardWrapper,
  TeacherTaskCard,
  TeacherTaskCardSkeleton,
  TeacherTaskCardWrapper,
} from "@/app/components/pages/Dashboard/Class/Cards";
import Button from "@/app/components/shared/Button";
import NotFound from "@/app/components/shared/not-found/NotFound";
import { IMAGES } from "@/app/constants/images";
import { ROUTES } from "@/app/constants/routes";
import { useTeacherClassTasks } from "@/app/hooks/class-tasks/useTeacherClassTasks";
import { useClassDetail } from "@/app/hooks/classes/useClassDetail";
import { useClassMember } from "@/app/hooks/classes/useClassMember";
import { useClassStudentsLeaderboard } from "@/app/hooks/leaderboards/useClassStudentsLeaderboard";
import { ClassDetailView, MemberRole } from "@/app/types/class-detail";
import { faArrowLeft, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import LeaderboardViewComponent, {
  LeaderboardRow,
} from "@/app/components/shared/leaderboard/LeaderboardView";

const TeacherClassDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const { data: classDetailData } = useClassDetail(params.slug, "detail");

  const [view, setView] = useState<ClassDetailView>("tasks");
  // Buat daftar tab dinamis
  const tabs: { key: ClassDetailView; label: string }[] = [
    { key: "tasks" as const, label: "Tasks" },
    { key: "members" as const, label: "Member" },
    { key: "leaderboard" as const, label: "Leaderboard" },
  ];

  const handleBack = () => {
    router.back();
  };

  const handleNavigateToEditPage = () => {
    router.push(
      `${ROUTES.DASHBOARD.TEACHER.CLASS}/edit/${classDetailData?.slug}`
    );
  };

  const TaskView = () => {
    const { data: classTasks, isLoading } = useTeacherClassTasks(params.slug);

    const handleNavigateToSubmissionPage = (taskSlug: string) => {
      const query = new URLSearchParams({
        class: params.slug,
        task: taskSlug,
      });

      router.push(`${ROUTES.DASHBOARD.TEACHER.SUBMISSIONS}?${query}`);
    };

    if (!classTasks) return;

    return (
      <div>
        {/* Task Grid */}
        {isLoading ? (
          <TeacherTaskCardWrapper>
            {Array.from({ length: 4 }).map((_, idx) => (
              <TeacherTaskCardSkeleton key={idx} />
            ))}
          </TeacherTaskCardWrapper>
        ) : classTasks.length > 0 ? (
          <TeacherTaskCardWrapper>
            {classTasks.map((ct) => (
              <TeacherTaskCard
                key={ct.slug}
                task={ct}
                onClick={handleNavigateToSubmissionPage}
              />
            ))}
          </TeacherTaskCardWrapper>
        ) : (
          <NotFound text="Task Not Found" />
        )}
      </div>
    );
  };

  const MemberView = () => {
    const { data: classMember, isLoading } = useClassMember(params.slug);

    const [view, setView] = useState<MemberRole>("students");
    // Buat daftar tab dinamis
    const tabs: { key: MemberRole; label: string }[] = [
      { key: "students" as const, label: "Student" },
      { key: "teacher" as const, label: "Teacher" },
    ];

    if (!classMember) return;

    const members =
      view === "students" ? classMember.students : classMember.teacher;

    return (
      <div>
        {/* Navigation tab */}
        <div className="w-full flex items-center">
          <div className="flex overflow-x-auto custom-thin-scrollbar max-w-full">
            {tabs.map((tab) => {
              const count =
                tab.key === "students"
                  ? classMember.students.length
                  : classMember.teacher.length;

              return (
                <Button
                  key={tab.key}
                  size="middle"
                  onClick={() => setView(tab.key)}
                  className={`relative flex items-center gap-2 !px-7 !py-6 !border-none !rounded-t-lg !rounded-b-none text-sm transition-all duration-150 ${
                    view === tab.key
                      ? "!bg-primary !text-white"
                      : "!bg-tertiary hover:!bg-tertiary-hover !text-dark"
                  }`}
                >
                  <span
                    className={`flex flex-col text-sm ${
                      view === tab.key ? "font-semibold" : "font-medium"
                    }`}
                  >
                    <p>{count}</p>
                    <p>{tab.label}</p>
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Member Grid */}
        {isLoading ? (
          <MemberCardWrapper>
            {Array.from({ length: 4 }).map((_, idx) => (
              <MemberCardSkeleton key={idx} />
            ))}
          </MemberCardWrapper>
        ) : members.length > 0 ? (
          <MemberCardWrapper>
            {members.map((m, idx) => (
              <MemberCard key={idx} image={m.image} name={m.name} />
            ))}
          </MemberCardWrapper>
        ) : (
          <div className="mt-8">
            <NotFound
              text={`${view === "students" ? "Student" : "Teacher"} not found.`}
            />
          </div>
        )}
      </div>
    );
  };

  const LeaderboardView = () => {
    const { data: leaderboardData, isLoading } = useClassStudentsLeaderboard(
      classDetailData!.id
    );

    // ubah data ke format LeaderboardRow jika perlu
    const leaderboardRows: LeaderboardRow[] =
      leaderboardData?.map((u) => ({
        id: u.key,
        name: u.name,
        image: u.image,
        point: u.point,
      })) || [];

    const defaultImage = IMAGES.DEFAULT_PROFILE;

    return (
      <LeaderboardViewComponent
        leaderboardData={leaderboardRows}
        isLoading={isLoading}
        defaultImage={defaultImage}
      />
    );
  };

  if (!classDetailData) return;

  const { name, description, image } = classDetailData;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="flex flex-row sm:flex-col gap-4">
          <Button
            type="primary"
            size="middle"
            variant="primary"
            onClick={handleBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
            <span className="text-base font-semibold">Kembali</span>
          </Button>
          <Button
            size="middle"
            variant="warning"
            onClick={handleNavigateToEditPage}
          >
            <FontAwesomeIcon icon={faPenToSquare} className="mr-1" />
            <span className="text-base font-semibold">Edit</span>
          </Button>
        </div>
        <div className="w-full sm:max-w-[60%] lg:max-w-[40%] flex items-center justify-end gap-4 sm:ms-auto">
          <div className="flex flex-col text-end gap-2">
            <h3 className="text-dark text-2xl md:text-3xl font-bold">{name}</h3>
            <p className="text-sm font-medium">{description}</p>
          </div>
          {/* Class Image */}
          <div className="max-w-32">
            <Image
              src={image ?? IMAGES.DEFAULT_CLASS}
              alt={name}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Navigation tab antar view */}
      <div className="w-full flex items-center mt-4 mb-8 border-y border-y-br-primary">
        <div className="flex overflow-x-auto custom-thin-scrollbar max-w-full">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              size="middle"
              onClick={() => setView(tab.key)}
              className={`relative flex items-center gap-2 !px-10 !py-5 !border-none text-sm transition-all duration-150 !bg-background hover:!bg-background-hover !text-dark`}
            >
              <span className="text-base font-semibold">{tab.label}</span>
              {view === tab.key && (
                <span className="absolute -bottom-0 left-0 w-full h-[2px] bg-primary" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Render View */}
      {view === "tasks" ? (
        <TaskView />
      ) : view === "members" ? (
        <MemberView />
      ) : (
        <LeaderboardView />
      )}
    </div>
  );
};

export default TeacherClassDetailPage;
