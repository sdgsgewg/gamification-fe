"use client";

import Button from "@/app/components/shared/Button";
import Loading from "@/app/components/shared/Loading";
import { IMAGES } from "@/app/constants/images";
import { ROUTES } from "@/app/constants/routes";
import { Gender, GenderLabels } from "@/app/enums/Gender";
import { Role, RoleLabels } from "@/app/enums/Role";
import { useUserClasses } from "@/app/hooks/classes/useUserClasses";
import { useMaterials } from "@/app/hooks/materials/useMaterials";
import { useSubjects } from "@/app/hooks/subjects/useSubjects";
import { useGetCachedUser } from "@/app/hooks/useGetCachedUser";
import { useUserRecentActivities } from "@/app/hooks/users/useUserRecentActivities";
import { UserDetailResponse } from "@/app/interface/users/responses/IUserDetailResponse";
import { getDate } from "@/app/utils/date";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const HeaderIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
    <path d="M12 2a7 7 0 0 0-7 7v2.268c0 .46-.158.907-.447 1.264L3.2 14.6A1.5 1.5 0 0 0 4.4 17h15.2a1.5 1.5 0 0 0 1.2-2.4l-1.353-1.868a2 2 0 0 1-.447-1.264V9a7 7 0 0 0-7-7Zm0 20a5.5 5.5 0 0 1-5.5-5.5h11A5.5 5.5 0 0 1 12 22Z" />
  </svg>
);

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center gap-2 bg-primary px-4 py-3">
    <HeaderIcon />
    <p className="text-sm font-semibold text-white">{title}</p>
  </div>
);

const Pill: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

const StatBox: React.FC<{ value: React.ReactNode; label: string }> = ({
  value,
  label,
}) => (
  <div className="rounded-lg border border-br-secondary bg-card px-6 py-4 text-center shadow-sm">
    <div className="text-2xl font-extrabold text-tx-primary">{value}</div>
    <div className="mt-1 text-xs font-medium tracking-wide text-tx-tertiary">
      {label}
    </div>
  </div>
);

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className="grid grid-cols-[28px_1fr_2fr] items-center gap-2 py-2">
    <div className="flex items-center justify-center">{icon}</div>
    <div className="text-sm text-tx-secondary">{label}</div>
    <div className="text-sm font-medium text-tx-primary">
      {value && value !== "" ? value : "-"}
    </div>
  </div>
);

const ProfilePage = () => {
  const params = useParams<{ username: string }>();
  const router = useRouter();
  const baseRoute = ROUTES.ROOT.PROFILE;

  const { user, role } = useGetCachedUser();
  const { data: userClasses = [] } = useUserClasses();
  const {
    data: recentActivityData = [],
    isLoading: isRecentActivityDataLoading,
  } = useUserRecentActivities();

  // Admin Stats Data
  const { data: subjectData } = useSubjects();
  const { data: materialdata } = useMaterials();

  const [profile, setProfile] = useState<UserDetailResponse | null>(null);

  useEffect(() => {
    if (!user) return;
    setProfile(user);
  }, [user]);

  const [copied, setCopied] = useState(false);

  if (!profile) {
    return <Loading />;
  }

  const handleNavigateToEditPage = () => {
    router.push(`${baseRoute}/edit/${params.username}`);
  };

  const handleCopyId = async () => {
    try {
      const { userId } = profile;
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  /** ===== Role helpers ===== */
  const isStudent = role === Role.STUDENT;
  const isTeacher = role === Role.TEACHER;
  const isAdmin = role === Role.ADMIN;

  const { userId, name, email, gender, dob, image } = profile;

  return (
    <div className="min-h-[80vh] w-full bg-[var(--background)] p-6 text-tx-primary">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <div className="flex items-center gap-8">
            <div className="h-40 w-40 overflow-hidden rounded-full bg-tertiary ring-6 ring-secondary">
              <Image
                src={image ?? IMAGES.DEFAULT_PROFILE}
                alt={name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-tx-primary">{name}</h1>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                {/* role pill (localized) */}
                <Pill className="bg-secondary text-tx-primary">
                  {RoleLabels[role]}
                </Pill>

                {/* kelas pill intentionally removed */}

                {email && (
                  <Pill className="bg-surface text-tx-primary ring-1 ring-light-accent">
                    {email}
                  </Pill>
                )}
              </div>

              <div className="mt-3 flex items-center gap-3">
                <Button
                  variant="primary"
                  onClick={handleNavigateToEditPage}
                  className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-hover"
                >
                  Edit Profile
                </Button>
                <Button
                  onClick={handleCopyId}
                  className="rounded-lg bg-card px-3 py-1.5 text-sm font-medium text-tx-secondary ring-1 ring-light-accent transition hover:bg-light-emphasis"
                  title="Copy User ID"
                >
                  {copied ? "Copied!" : "Copy ID"}
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT: stats (flush right) */}
          <div className="flex justify-start md:justify-end">
            <div
              className={`grid gap-3 ${
                isTeacher || isAdmin ? "grid-cols-3" : "grid-cols-2"
              }`}
            >
              {isTeacher && (
                <>
                  <StatBox value={userClasses.length} label="Class" />
                  <StatBox value="100" label="Students" />
                  {/* <StatBox value="24" label="Achievements" /> */}
                </>
              )}
              {isAdmin && (
                <>
                  <StatBox value={subjectData?.length} label="Subjects" />
                  <StatBox value={materialdata?.length} label="Materials" />
                </>
              )}
              {isStudent && (
                <>
                  <StatBox value={userClasses.length} label="Joined Class" />
                  {/* <StatBox value="4" label="Badges" /> */}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ===== Content cards ===== */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* LEFT: Profile Data */}
          <div className="overflow-hidden rounded-xl border border-br-sring-br-secondary bg-card shadow-sm">
            <SectionHeader title="Detailed Information" />
            <div className="px-5 py-4">
              <InfoRow icon={<span>🧑‍🎓</span>} label="Full Name" value={name} />
              <InfoRow icon={<span>✉️</span>} label="Email" value={email} />
              <InfoRow
                icon={<span>🎂</span>}
                label="Birth Date"
                value={getDate(dob)}
              />
              <InfoRow
                icon={<span>⚧️</span>}
                label="Gender"
                value={GenderLabels[gender as Gender]}
              />
              <InfoRow
                icon={<span>🆔</span>}
                label="User ID"
                value={
                  <button
                    onClick={handleCopyId}
                    className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-pribg-primary ring-1 ring-br-secondary hover:bg-tertiary"
                  >
                    <span className="truncate">{userId}</span>
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="currentColor"
                    >
                      <path d="M9 2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H9Zm-4 6H4a2 2 0 0 0-2 2v9a3 3 0 0 0 3 3h9a2 2 0 0 0 2-2v-1H8a3 3 0 0 1-3-3V8Z" />
                    </svg>
                  </button>
                }
              />
            </div>
          </div>

          {/* RIGHT: Security & Activity */}
          <div className="overflow-hidden rounded-xl border border-br-sring-br-secondary bg-card shadow-sm">
            <SectionHeader
              title={isStudent ? "Activity & Security" : "Security & Activity"}
            />
            <div className="px-5 py-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start justify-between rounded-lg bg-surface p-3">
                  <div>
                    <p className="font-medium text-tx-primary">Current Role</p>
                    <p className="text-tx-tertiary">
                      You are signed in as{" "}
                      <span className="font-semibold">{RoleLabels[role]}</span>.
                    </p>
                  </div>
                  <Pill className="bg-secondary text-tx-primary">
                    {RoleLabels[role]}
                  </Pill>
                </div>

                {/* <div className="flex items-start justify-between rounded-lg bg-surface p-3">
                  <div>
                    <p className="font-medium text-tx-primary">Session</p>
                    <p className="text-tx-tertiary">
                      Authenticated using local profile cache.
                    </p>
                  </div>
                  <span className="text-xs text-tx-muted">
                    {(cachedUser as any)?.lastLoginAt
                      ? new Date(
                          (cachedUser as any).lastLoginAt
                        ).toLocaleString()
                      : "Time not available"}
                  </span>
                </div> */}

                <div className="rounded-lg border border-br-sring-br-secondary">
                  <div className="border-b border-br-sring-br-secondary bg-tertiary px-3 py-2 text-xs font-semibold text-tx-primary">
                    Recent Activities
                  </div>
                  <ul className="max-h-[16rem] overflow-y-auto space-y-2 p-3">
                    {recentActivityData.map((act, i: number) => (
                      <li key={i} className="list-disc pl-4 text-tx-secondary">
                        {act.description}
                        <div className="text-[10px] text-tx-muted">
                          {act.createdAt}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* <div className="flex items-center justify-between">
                  <button
                    onClick={() => window.location.reload()}
                    className="rounded-lg bg-card px-3 py-1.5 text-sm font-medium text-tx-secondary ring-1 ring-light-accent transition hover:bg-light-emphasis"
                  >
                    Reload Profile
                  </button>
                  <span className="text-xs text-tx-muted">
                    Data updated from auth cache / local override.
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
