"use client";

import { Role } from "@/app/enums/Role";
import { useAuth } from "@/app/hooks/useAuth";
import { UserDetailResponse } from "@/app/interface/users/responses/IUserDetailResponse";

import React, { useEffect, useMemo, useState } from "react";

/** Normalize any value for safe display */
const toLabel = (v: any): string => {
  if (v === undefined || v === null) return "—";
  if (typeof v === "object") {
    return (
      v.name ??
      v.title ??
      v.label ??
      v.gradeName ??
      v.grade ??
      v.gradeId ??
      v.id ??
      JSON.stringify(v)
    );
  }
  return String(v);
};

const formatDate = (d: any) => {
  if (!d) return "—";
  const date = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
  if (isNaN(date?.getTime?.())) return toLabel(d);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

type EditableProfile = {
  name?: string;
  kelas?: any;
  email?: string;
  avatarUrl?: string;
  institution?: string;
  password?: string;
  birthDate?: string;
  gender?: string;
};

/** ---- lightweight local persistence (per user) ---- */
const LS_KEY = "profile_overrides";
type OverridesMap = Record<string, Partial<EditableProfile>>;
const loadOverrides = (userId: string): Partial<EditableProfile> => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const map = JSON.parse(raw) as OverridesMap;
    return map?.[userId] ?? {};
  } catch {
    return {};
  }
};
const saveOverrides = (userId: string, data: Partial<EditableProfile>) => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const map: OverridesMap = raw ? JSON.parse(raw) : {};
    map[userId] = { ...(map[userId] ?? {}), ...data };
    localStorage.setItem(LS_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
};

const HeaderIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
    <path d="M12 2a7 7 0 0 0-7 7v2.268c0 .46-.158.907-.447 1.264L3.2 14.6A1.5 1.5 0 0 0 4.4 17h15.2a1.5 1.5 0 0 0 1.2-2.4l-1.353-1.868a2 2 0 0 1-.447-1.264V9a7 7 0 0 0-7-7Zm0 20a5.5 5.5 0 0 1-5.5-5.5h11A5.5 5.5 0 0 1 12 22Z" />
  </svg>
);

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center gap-2 bg-[var(--color-primary)] px-4 py-3">
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
  <div className="rounded-lg border border-[var(--color-br-secondary)] bg-[var(--color-card)] px-6 py-4 text-center shadow-sm">
    <div className="text-2xl font-extrabold text-[var(--text-primary)]">
      {value}
    </div>
    <div className="mt-1 text-xs font-medium tracking-wide text-[var(--text-tertiary)]">
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
    <div className="text-sm text-[var(--text-secondary)]">{label}</div>
    <div className="text-sm font-medium text-[var(--text-primary)]">
      {typeof value === "object" && !React.isValidElement(value)
        ? toLabel(value)
        : value ?? "—"}
    </div>
  </div>
);

const ProfilePage = () => {
  const { getCachedUserProfile } = useAuth();

  const [userRole, setUserRole] = useState<Role>(Role.ADMIN);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const cachedUser: UserDetailResponse | null = getCachedUserProfile();

  const userId = cachedUser?.userId ?? "-";

  const [profile, setProfile] = useState<EditableProfile>({
    name: cachedUser?.name,
    kelas:
      (cachedUser as any)?.kelas ??
      (cachedUser as any)?.grade ??
      (cachedUser as any)?.metadata?.kelas ??
      "",
    email:
      (cachedUser as any)?.email ??
      (cachedUser as any)?.username ??
      (cachedUser as any)?.metadata?.email ??
      "",
    avatarUrl:
      (cachedUser as any)?.avatarUrl ??
      (cachedUser as any)?.picture ??
      "/placeholder-avatar.png",
    institution:
      (cachedUser as any)?.institution ??
      (cachedUser as any)?.metadata?.institution ??
      "SMAN 70 Jakarta",
    password: "",
    birthDate:
      (cachedUser as any)?.birthDate ??
      (cachedUser as any)?.metadata?.birthDate ??
      "",
    gender:
      (cachedUser as any)?.gender ??
      (cachedUser as any)?.metadata?.gender ??
      "",
  });

  /** merge local overrides on mount / when user changes */
  useEffect(() => {
    const user = getCachedUserProfile();
    if (user?.role?.name) setUserRole(user.role.name);
    const o = loadOverrides(String(userId));
    if (o && Object.keys(o).length) {
      setProfile((p) => ({ ...p, ...o }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const roleLabel = useMemo(
    () => (typeof userRole === "string" ? userRole : Role[userRole] ?? "User"),
    [userRole]
  );

  // Localized display label
  const displayRole =
    userRole === Role.STUDENT
      ? "Student"
      : userRole === Role.TEACHER
      ? "Teacher"
      : "Admin";

  if (!cachedUser) return null;

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(String(userId));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: profile.name,
      email: profile.email,
      kelas: profile.kelas,
      avatarUrl: profile.avatarUrl,
      institution: profile.institution,
      birthDate: profile.birthDate,
      gender: profile.gender,
    };

    // Optional: persist to your NestJS API
    try {
      await fetch("/api/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    } catch {}

    // Persist locally so refresh keeps the data
    saveOverrides(String(userId), payload);

    // Update any in-memory cache if available
    try {
      (auth as any)?.setCachedUserProfile?.({
        ...(cachedUser as any),
        ...payload,
      });
    } catch {}

    setSaving(false);
    setIsEditing(false);
  };

  /** ===== Role helpers ===== */
  const isStudent = userRole === Role.STUDENT;
  const isTeacher = userRole === Role.TEACHER;
  const isAdmin = userRole === Role.ADMIN;

  const recentActivities =
    (cachedUser as any)?.activities ??
    (isTeacher
      ? [
          "Assigned Solar System homework to Class XII A",
          "Graded Arithmetic assignments for Class XII B",
          "Achieved 20 milestones",
          "Assigned Static Electricity homework to Class XII C",
        ]
      : isAdmin
      ? [
          "Updated Social Studies subject",
          "Added Indonesian Language material",
          "Created Statistics material",
          "Created Social Studies subject",
        ]
      : [
          "Completed Physics Quiz",
          "Submitted Math Assignment",
          "Earned Persistence Badge",
        ]);

  /** ===== UI ===== */
  return (
    <div className="min-h-[80vh] w-full bg-[var(--background)] p-6 text-[var(--text-primary)]">
      <div className="mx-auto max-w-6xl">
        {/* ===== Header (2-col grid so stats align to right column) ===== */}
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          {/* LEFT: avatar + name */}
          <div className="flex items-center gap-4">
            <div className="h-40 w-40 overflow-hidden rounded-full bg-[var(--color-tertiary)] ring-8 ring-[var(--color-tertiary)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  profile.avatarUrl ||
                  "https://avatars.githubusercontent.com/u/1?v=4"
                }
                alt={toLabel(profile.name) || "Avatar"}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                {toLabel(profile.name || cachedUser.name || "User")}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                {/* role pill (localized) */}
                <Pill className="bg-[var(--color-secondary)] text-[var(--text-primary)]">
                  {displayRole}
                </Pill>

                {/* kelas pill intentionally removed */}

                {!!profile.email && (
                  <Pill className="bg-[var(--color-surface)] text-[var(--text-primary)] ring-1 ring-[var(--color-light-accent)]">
                    {toLabel(profile.email)}
                  </Pill>
                )}
              </div>

              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-[var(--color-primary-hover)]"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleCopyId}
                  className="rounded-lg bg-[var(--color-card)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] ring-1 ring-[var(--color-light-accent)] transition hover:bg-[var(--color-light-emphasis)]"
                  title="Copy User ID"
                >
                  {copied ? "Copied!" : "Copy ID"}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: stats (flush right) */}
          <div className="flex justify-end">
            <div
              className={`grid gap-3 ${
                isTeacher || isAdmin ? "grid-cols-3" : "grid-cols-2"
              }`}
            >
              {isTeacher && (
                <>
                  <StatBox value="3" label="Class" />
                  <StatBox value="100" label="Students" />
                  <StatBox value="24" label="Achievements" />
                </>
              )}
              {isAdmin && (
                <>
                  <StatBox value="5" label="Subjects" />
                  <StatBox value="10" label="Materials" />
                  <StatBox value="—" label=" " />
                </>
              )}
              {isStudent && (
                <>
                  <StatBox value="12" label="Class" />
                  <StatBox value="4" label="Badges" />
                </>
              )}
            </div>
          </div>
        </div>

        {/* ===== Content cards ===== */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* LEFT: Profile Data */}
          <div className="overflow-hidden rounded-xl border border-[var(--color-br-secondary)] bg-[var(--color-card)] shadow-sm">
            <SectionHeader title="Detailed Information" />
            <div className="px-5 py-4">
              <InfoRow
                icon={<span>🧑‍🎓</span>}
                label="Full Name"
                value={toLabel(profile.name || cachedUser.name)}
              />
              <InfoRow
                icon={<span>✉️</span>}
                label="Email"
                value={toLabel(profile.email)}
              />
              <InfoRow
                icon={<span>🎂</span>}
                label="Birth Date"
                value={formatDate(profile.birthDate)}
              />
              <InfoRow
                icon={<span>⚧️</span>}
                label="Gender"
                value={
                  profile.gender
                    ? toLabel(profile.gender)
                    : toLabel((cachedUser as any)?.gender)
                }
              />
              {(isStudent || isTeacher) && (
                <InfoRow
                  icon={<span>🏷️</span>}
                  label="Class"
                  value={toLabel(profile.kelas)}
                />
              )}
              <InfoRow
                icon={<span>🆔</span>}
                label="User ID"
                value={
                  <button
                    onClick={handleCopyId}
                    className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-[var(--color-primary)] ring-1 ring-[var(--color-br-secondary)] hover:bg-[var(--color-tertiary)]"
                  >
                    <span className="truncate">{toLabel(userId)}</span>
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
          <div className="overflow-hidden rounded-xl border border-[var(--color-br-secondary)] bg-[var(--color-card)] shadow-sm">
            <SectionHeader
              title={isStudent ? "Activity & Security" : "Security & Activity"}
            />
            <div className="px-5 py-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start justify-between rounded-lg bg-[var(--color-surface)] p-3">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">
                      Current Role
                    </p>
                    <p className="text-[var(--text-tertiary)]">
                      You are signed in as{" "}
                      <span className="font-semibold">{displayRole}</span>.
                    </p>
                  </div>
                  <Pill className="bg-[var(--color-secondary)] text-[var(--text-primary)]">
                    {displayRole}
                  </Pill>
                </div>

                <div className="flex items-start justify-between rounded-lg bg-[var(--color-surface)] p-3">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">
                      Session
                    </p>
                    <p className="text-[var(--text-tertiary)]">
                      Authenticated using local profile cache.
                    </p>
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">
                    {(cachedUser as any)?.lastLoginAt
                      ? new Date(
                          (cachedUser as any).lastLoginAt
                        ).toLocaleString()
                      : "Time not available"}
                  </span>
                </div>

                <div className="rounded-lg border border-[var(--color-br-secondary)]">
                  <div className="border-b border-[var(--color-br-secondary)] bg-[var(--color-tertiary)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)]">
                    Recent Activity
                  </div>
                  <ul className="space-y-2 p-3">
                    {recentActivities.map((a: string, i: number) => (
                      <li
                        key={i}
                        className="list-disc pl-4 text-[var(--text-secondary)]"
                      >
                        {a}
                        <div className="text-[10px] text-[var(--text-muted)]">
                          {i === 0
                            ? "2 days ago"
                            : i === 1
                            ? "4 days ago"
                            : "1 week ago"}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => window.location.reload()}
                    className="rounded-lg bg-[var(--color-card)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] ring-1 ring-[var(--color-light-accent)] transition hover:bg-[var(--color-light-emphasis)]"
                  >
                    Reload Profile
                  </button>
                  <span className="text-xs text-[var(--text-muted)]">
                    Data updated from auth cache / local override.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Edit Modal ===== */}
      {isEditing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-[var(--color-card)] shadow-xl">
            <div className="flex items-center justify-between bg-[var(--color-primary)] px-4 py-3">
              <div className="flex items-center gap-2">
                <HeaderIcon />
                <p className="text-sm font-semibold text-white">Edit Profile</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-md bg-white/20 px-2 py-1 text-xs text-white hover:bg-white/30"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 px-5 py-5">
              {/* Common */}
              <div>
                <label className="mb-1 block text-sm text-[var(--text-secondary)]">
                  Full Name
                </label>
                <input
                  className="w-full rounded-lg border border-[var(--color-light-accent)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  value={toLabel(profile.name)}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-[var(--text-secondary)]">
                    Email
                  </label>
                  <input
                    className="w-full rounded-lg border border-[var(--color-light-accent)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    value={toLabel(profile.email)}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-[var(--text-secondary)]">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-[var(--color-light-accent)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    value={profile.birthDate ?? ""}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, birthDate: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-[var(--text-secondary)]">
                    Gender
                  </label>
                  <select
                    className="w-full rounded-lg border border-[var(--color-light-accent)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    value={profile.gender ?? ""}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, gender: e.target.value }))
                    }
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Student only */}
                {isStudent && (
                  <div>
                    <label className="mb-1 block text-sm text-[var(--text-secondary)]">
                      Class
                    </label>
                    <input
                      className="w-full rounded-lg border border-[var(--color-light-accent)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      value={toLabel(profile.kelas)}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, kelas: e.target.value }))
                      }
                    />
                  </div>
                )}
              </div>

              {/* Teacher/Admin extras */}
              {(userRole === Role.TEACHER || userRole === Role.ADMIN) && (
                <>
                  <div>
                    <label className="mb-1 block text-sm text-[var(--text-secondary)]">
                      Institution
                    </label>
                    <input
                      className="w-full rounded-lg border border-[var(--color-light-accent)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      value={toLabel(profile.institution)}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          institution: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-[var(--text-secondary)]">
                      Password
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-lg border border-[var(--color-light-accent)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      value={profile.password ?? ""}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, password: e.target.value }))
                      }
                    />
                  </div>
                </>
              )}

              <div>
                <label className="mb-1 block text-sm text-[var(--text-secondary)]">
                  Avatar URL
                </label>
                <input
                  className="w-full rounded-lg border border-[var(--color-light-accent)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="https://…"
                  value={toLabel(profile.avatarUrl)}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, avatarUrl: e.target.value }))
                  }
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg bg-[var(--color-card)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] ring-1 ring-[var(--color-light-accent)] hover:bg-[var(--color-light-emphasis)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;