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
import { IMAGES } from "@/app/constants/images";
import { ROUTES } from "@/app/constants/routes";
import { useTeacherClassTasks } from "@/app/hooks/class-tasks/useTeacherClassTasks";
import { useClassDetail } from "@/app/hooks/classes/useClassDetail";
import { useClassMember } from "@/app/hooks/classes/useClassMember";
import { ClassDetailView, MemberRole } from "@/app/types/class-detail";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

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
          <p className="text-center">Task not found.</p>
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
          <p className="text-center">Member not found.</p>
        )}
      </div>
    );
  };

  const LeaderboardView = () => {
    const podiumTop3 = [
      { name: "Susi Pudjianti", score: 12500, avatar: "/avatars/a1.png" },
      { name: "Angel Wicaksono", score: 12000, avatar: "/avatars/a2.png" },
      { name: "Siti Nurhalizah", score: 11500, avatar: "/avatars/a3.png" },
    ];

    const leaderboardRows = useMemo(
      () =>
        Array.from({ length: 15 }).map((_, i) => ({
          rank: i + 4,
          name: i % 2 ? "Kevin Wijaya" : "Caca Permata Sari",
          points: i % 2 ? 10500 : 11000,
          avatar: i % 2 ? "/avatars/a5.png" : "/avatars/a4.png",
        })),
      []
    );

    const PodiumPosition = ({
      place,
      name,
      score,
      avatar,
    }: {
      place: 1 | 2 | 3;
      name: string;
      score: number;
      avatar: string;
    }) => {
      const medalColors: Record<1 | 2 | 3, string> = {
        1: "#F7E08F", // gold
        2: "#D9DDE5", // silver
        3: "#E6C392", // bronze
      };

      return (
        <div
          className="relative flex flex-col items-center justify-end rounded-lg border-2 border-[var(--border-secondary)] pb-6 pt-12"
          style={{
            background: `linear-gradient(180deg, #ffffffaa 0%, #ffffff00 60%), ${medalColors[place]}`,
            height: "400px", // fixed height for nice balance
          }}
        >
          {/* Top Medal */}
          <div className="absolute -top-5 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--border-secondary)] bg-white/60">
            <span
              className="h-6 w-6 rounded-full border border-[var(--border-secondary)]"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #ffffffaa 0 35%, transparent 36%), #ffd54f",
              }}
            />
          </div>

          {/* Avatar */}
          <div className="absolute top-1/4 -translate-y-1/2 transform">
            <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-[var(--border-secondary)] bg-[var(--color-card)] shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatar}
                alt={name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Name & Score */}
          <div className="mt-32 text-center">
            <div className="font-extrabold text-[var(--text-primary)]">
              {name}
            </div>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--border-secondary)] bg-[var(--color-primary)] px-4 py-2 font-extrabold text-white">
              <span
                className="inline-block h-4 w-4 rounded-full border border-[var(--border-secondary)]"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #ffffffaa 0 35%, transparent 36%), #ffd54f",
                }}
              />
              {score}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="grid gap-6 pt-4 lg:grid-cols-[360px_1fr]">
        {/* Podium */}
        <div className="grid grid-cols-3 gap-6 items-end justify-center">
          {([1, 2, 3] as const).map((place) => {
            const user = podiumTop3[place - 1];
            return (
              <PodiumPosition
                key={user.name}
                place={place}
                name={user.name}
                score={user.score}
                avatar={user.avatar}
              />
            );
          })}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border-2 border-[var(--border-secondary)]">
          <div className="grid grid-cols-[120px_1fr_140px] bg-[var(--color-primary)] px-3 py-2 font-bold text-white">
            <div>Rank</div>
            <div>Nama</div>
            <div>Poin</div>
          </div>
          <div>
            {leaderboardRows.map((r, i) => (
              <div
                key={r.rank}
                className={`grid grid-cols-[120px_1fr_140px] items-center px-3 py-2 ${
                  i % 2 === 0
                    ? "bg-[var(--color-tertiary)]"
                    : "bg-[var(--background)]"
                } border-b-2 border-[var(--border-secondary)]`}
              >
                <div>{r.rank}</div>
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 overflow-hidden rounded-full border border-[var(--border-secondary)] bg-[var(--color-card)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.avatar}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </span>
                  {r.name}
                </div>
                <div>{r.points}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (!classDetailData) return;

  const { name, description, image } = classDetailData;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <Button
            type="primary"
            size="middle"
            variant="primary"
            onClick={handleBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
            <span className="text-base font-semibold">Kembali</span>
          </Button>
        </div>
        <div className="w-full sm:max-w-[60%] lg:max-w-[40%] flex items-center gap-4 sm:ms-auto">
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
