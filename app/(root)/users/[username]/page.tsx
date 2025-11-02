"use client";

import { Role } from "@/app/enums/Role";
import { auth } from "@/app/functions/AuthProvider";
import React, { useEffect, useMemo, useState } from "react";

/** Normalize anything to a short label (never dump raw objects into JSX text) */
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

type EditableProfile = {
  name?: string;
  kelas?: any; // string | number | { gradeId, name } etc.
  email?: string;
  avatarUrl?: string;
  institution?: string;
  password?: string; // fake field for UI only
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

/** ===== Page ===== */
const ProfilePage = () => {
  const cachedUser = auth.getCachedUserProfile();

  const [userRole, setUserRole] = useState<Role>(Role.ADMIN);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

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
  });

  useEffect(() => {
    const user = auth.getCachedUserProfile();
    if (user?.role?.name) setUserRole(user.role.name);
  }, []);

  const userId =
    (cachedUser as any)?.id ?? (cachedUser as any)?.userId ?? "-";

  const roleLabel = useMemo(
    () => (typeof userRole === "string" ? userRole : Role[userRole] ?? "User"),
    [userRole]
  );

  if (!cachedUser) return null;

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(String(userId));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // TODO: Call your NestJS endpoint here (PUT /me).
    // This demo just simulates success:
    setTimeout(() => {
      setSaving(false);
      setIsEditing(false);
    }, 500);
  };

  /** ===== Role specific small helpers ===== */
  const isStudent = String(roleLabel).toLowerCase().includes("student") || userRole === Role.STUDENT;
  const isTeacher = String(roleLabel).toLowerCase().includes("teacher") || userRole === Role.TEACHER;
  const isAdmin = String(roleLabel).toLowerCase().includes("admin") || userRole === Role.ADMIN;

  const recentActivities =
    (cachedUser as any)?.activities ??
    (isTeacher
      ? [
          "Memberikan Tugas Tata Surya ke Kelas XII A",
          "Menilai Tugas Aritmatika untuk Kelas XII B",
          "Berhasil Meraih 20 Pencapaian",
          "Memberikan Tugas Listrik Statis ke Kelas XII C",
        ]
      : isAdmin
      ? [
          "Mengupdate Mata Pelajaran IPS",
          "Menambahkan Materi Bahasa Indonesia",
          "Membuat Materi Statistika",
          "Membuat Mata Pelajaran IPS",
        ]
      : [
          "Menyelesaikan Kuis Fisika",
          "Mengumpulkan Tugas Matematika",
          "Mendapat Lencana Ketekunan",
        ]);

  /** ===== UI ===== */
  return (
    <div className="min-h-[80vh] w-full bg-[var(--background)] p-6 text-[var(--text-primary)]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
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
                <Pill className="bg-[var(--color-secondary)] text-[var(--text-primary)]">
                  {toLabel(roleLabel)}
                </Pill>
                {!!profile.kelas && (isStudent || isTeacher) && (
                  <Pill className="bg-[var(--color-tertiary)] text-[var(--text-primary)]">
                    Kelas {toLabel(profile.kelas)}
                  </Pill>
                )}
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
                  Edit Profil
                </button>
                <button
                  onClick={handleCopyId}
                  className="rounded-lg bg-[var(--color-card)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] ring-1 ring-[var(--color-light-accent)] transition hover:bg-[var(--color-light-emphasis)]"
                  title="Copy User ID"
                >
                  {copied ? "Disalin!" : "Salin ID"}
                </button>
              </div>
            </div>
          </div>

          {/* Role-based quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {isTeacher && (
              <>
                <StatBox value="3" label="Kelas" />
                <StatBox value="100" label="Murid" />
                <StatBox value="24" label="Pencapaian" />
              </>
            )}
            {isAdmin && (
              <>
                <StatBox value="5" label="Mata Pelajaran" />
                <StatBox value="10" label="Materi" />
                <StatBox value="—" label=" " />
              </>
            )}
            {isStudent && (
              <>
                <StatBox value="12" label="Kelas" />
                <StatBox value="20" label="Jumlah Soal" />
                <StatBox value="4" label="Pencapaian" />
              </>
            )}
          </div>
        </div>

        {/* Content cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left: detail info */}
          <div className="overflow-hidden rounded-xl border border-[var(--color-br-secondary)] bg-[var(--color-card)] shadow-sm">
            <SectionHeader title="Informasi Detail" />
            <div className="px-5 py-4">
              <InfoRow icon={<span>🧑‍🎓</span>} label="Nama" value={toLabel(profile.name || cachedUser.name)} />
              {isStudent && (
                <>
                  <InfoRow icon={<span>🧭</span>} label="Kelas" value={toLabel(profile.kelas)} />
                  <InfoRow
                    icon={<span>📝</span>}
                    label="Tipe Tugas"
                    value={toLabel((cachedUser as any)?.metadata?.tipeTugas ?? "Scheduled Quiz")}
                  />
                  <InfoRow
                    icon={<span>🔢</span>}
                    label="Jumlah Soal"
                    value={toLabel((cachedUser as any)?.metadata?.jumlahSoal ?? 20)}
                  />
                  <InfoRow
                    icon={<span>🏫</span>}
                    label="Ditujukan Untuk Kelas"
                    value={toLabel((cachedUser as any)?.metadata?.ditujukanKelas ?? profile.kelas ?? "—")}
                  />
                </>
              )}

              {isTeacher && (
                <>
                  <InfoRow icon={<span>🏫</span>} label="Institusi" value={toLabel(profile.institution)} />
                  <InfoRow icon={<span>📚</span>} label="Mengelola Kelas" value="XII A • XII B • XII C" />
                  <InfoRow icon={<span>✉️</span>} label="Email" value={toLabel(profile.email)} />
                </>
              )}

              {isAdmin && (
                <>
                  <InfoRow icon={<span>🏫</span>} label="Institusi" value={toLabel(profile.institution)} />
                  <InfoRow icon={<span>✉️</span>} label="Email" value={toLabel(profile.email)} />
                </>
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
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                      <path d="M9 2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H9Zm-4 6H4a2 2 0 0 0-2 2v9a3 3 0 0 0 3 3h9a2 2 0 0 0 2-2v-1H8a3 3 0 0 1-3-3V8Z" />
                    </svg>
                  </button>
                }
              />
            </div>
          </div>

          {/* Right: security & activity */}
          <div className="overflow-hidden rounded-xl border border-[var(--color-br-secondary)] bg-[var(--color-card)] shadow-sm">
            <SectionHeader title={isStudent ? "Aktivitas & Keamanan" : "Keamanan & Aktivitas"} />
            <div className="px-5 py-4">
              {/* role summary card */}
              <div className="space-y-3 text-sm">
                <div className="flex items-start justify-between rounded-lg bg-[var(--color-surface)] p-3">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Peran Saat Ini</p>
                    <p className="text-[var(--text-tertiary)]">
                      Anda masuk sebagai{" "}
                      <span className="font-semibold">{toLabel(roleLabel)}</span>.
                    </p>
                  </div>
                  <Pill className="bg-[var(--color-secondary)] text-[var(--text-primary)]">
                    {toLabel(roleLabel)}
                  </Pill>
                </div>

                {/* last login */}
                <div className="flex items-start justify-between rounded-lg bg-[var(--color-surface)] p-3">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Sesi</p>
                    <p className="text-[var(--text-tertiary)]">
                      Terautentikasi menggunakan cache profil lokal.
                    </p>
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">
                    {(cachedUser as any)?.lastLoginAt
                      ? new Date((cachedUser as any).lastLoginAt).toLocaleString()
                      : "Waktu tidak tersedia"}
                  </span>
                </div>

                {/* recent activities */}
                <div className="rounded-lg border border-[var(--color-br-secondary)]">
                  <div className="border-b border-[var(--color-br-secondary)] bg-[var(--color-tertiary)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)]">
                    Aktivitas Terbaru
                  </div>
                  <ul className="space-y-2 p-3">
                    {recentActivities.map((a: string, i: number) => (
                      <li key={i} className="list-disc pl-4 text-[var(--text-secondary)]">
                        {a}
                        <div className="text-[10px] text-[var(--text-muted)]">
                          {i === 0 ? "2 Hari yang lalu" : i === 1 ? "4 Hari yang lalu" : "1 Minggu yang lalu"}
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
                    Muat Ulang Profil
                  </button>
                  <span className="text-xs text-[var(--text-muted)]">
                    Data diperbarui dari cache auth.
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
                <p className="text-sm font-semibold text-white">Edit Profil</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-md bg-white/20 px-2 py-1 text-xs text-white hover:bg-white/30"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 px-5 py-5">
              {/* Common */}
              <div>
                <label className="mb-1 block text-sm text-[var(--text-secondary)]">Nama Lengkap</label>
                <input
                  className="w-full rounded-lg border border-[var(--color-light-accent)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  value={toLabel(profile.name)}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[var(--text-secondary)]">Email</label>
                <input
                  className="w-full rounded-lg border border-[var(--color-light-accent)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  value={toLabel(profile.email)}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                />
              </div>

              {/* Student only */}
              {isStudent && (
                <div>
                  <label className="mb-1 block text-sm text-[var(--text-secondary)]">Kelas</label>
                  <input
                    className="w-full rounded-lg border border-[var(--color-light-accent)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    value={toLabel(profile.kelas)}
                    onChange={(e) => setProfile((p) => ({ ...p, kelas: e.target.value }))}
                  />
                </div>
              )}

              {/* Teacher & Admin */}
              {(isTeacher || isAdmin) && (
                <>
                  <div>
                    <label className="mb-1 block text-sm text-[var(--text-secondary)]">Password</label>
                    <input
                      type="password"
                      className="w-full rounded-lg border border-[var(--color-light-accent)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      value={profile.password ?? ""}
                      onChange={(e) => setProfile((p) => ({ ...p, password: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-[var(--text-secondary)]">Institusi</label>
                    <input
                      className="w-full rounded-lg border border-[var(--color-light-accent)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      value={toLabel(profile.institution)}
                      onChange={(e) => setProfile((p) => ({ ...p, institution: e.target.value }))}
                    />
                  </div>
                </>
              )}

              {/* Avatar URL */}
              <div>
                <label className="mb-1 block text-sm text-[var(--text-secondary)]">URL Avatar</label>
                <input
                  className="w-full rounded-lg border border-[var(--color-light-accent)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="https://…"
                  value={toLabel(profile.avatarUrl)}
                  onChange={(e) => setProfile((p) => ({ ...p, avatarUrl: e.target.value }))}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg bg-[var(--color-card)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] ring-1 ring-[var(--color-light-accent)] hover:bg-[var(--color-light-emphasis)]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
                >
                  {saving ? "Menyimpan…" : "Simpan"}
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