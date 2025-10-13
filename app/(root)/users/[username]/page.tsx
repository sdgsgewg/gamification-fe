"use client";

import { Role } from "@/app/enums/Role";
import { auth } from "@/app/functions/AuthProvider";
import React, { useEffect, useMemo, useState } from "react";

/** Ensure nothing object-like is sent straight to JSX text nodes */
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
  kelas?: any; // can be string | number | { gradeId, name } etc.
  email?: string;
  avatarUrl?: string;
};

const HeaderIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
    <path d="M12 2a7 7 0 0 0-7 7v2.268c0 .46-.158.907-.447 1.264L3.2 14.6A1.5 1.5 0 0 0 4.4 17h15.2a1.5 1.5 0 0 0 1.2-2.4l-1.353-1.868a2 2 0 0 1-.447-1.264V9a7 7 0 0 0-7-7Zm0 20a5.5 5.5 0 0 1-5.5-5.5h11A5.5 5.5 0 0 1 12 22Z" />
  </svg>
);

const ProfilePage = () => {
  const cachedUser = auth.getCachedUserProfile();
  const [userRole, setUserRole] = useState<Role>(Role.ADMIN);
  const [profile, setProfile] = useState<EditableProfile>({
    name: cachedUser?.name,
    // kelas might be an object like { gradeId, name }, keep raw then format with toLabel()
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
  });
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = auth.getCachedUserProfile();
    if (user?.role?.name) setUserRole(user.role.name);
  }, []);

  const userId = (cachedUser as any)?.id ?? (cachedUser as any)?.userId ?? "-";
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
    } catch {}
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setIsEditing(false);
    }, 500);
  };

  const InfoRow: React.FC<{
    icon: React.ReactNode;
    label: string;
    value?: React.ReactNode;
  }> = ({ icon, label, value }) => (
    <div className="grid grid-cols-[28px_1fr_2fr] items-center gap-2 py-2">
      <div className="flex items-center justify-center">{icon}</div>
      <div className="text-sm text-gray-700">{label}</div>
      <div className="text-sm font-medium text-gray-900">
        {/* Ensure only string/number/nodes, never plain object */}
        {typeof value === "object" && !React.isValidElement(value)
          ? toLabel(value)
          : value ?? "—"}
      </div>
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

  return (
    <div className="min-h-[80vh] w-full bg-[#efeff7] p-6 text-black">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-40 w-40 overflow-hidden rounded-full bg-[#e8e6ff] ring-8 ring-[#e8e6ff]">
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
              <h1 className="text-2xl font-bold text-gray-900">
                {toLabel(profile.name || cachedUser.name || "User")}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Pill className="bg-indigo-100 text-indigo-700">
                  {toLabel(roleLabel)}
                </Pill>
                {profile.kelas && (
                  <Pill className="bg-amber-100 text-amber-700">
                    Kelas {toLabel(profile.kelas)}
                  </Pill>
                )}
                {profile.email && (
                  <Pill className="bg-emerald-100 text-emerald-700">
                    {toLabel(profile.email)}
                  </Pill>
                )}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
                >
                  Edit Profil
                </button>
                <button
                  onClick={handleCopyId}
                  className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 ring-1 ring-gray-300 transition hover:bg-gray-50"
                  title="Copy User ID"
                >
                  {copied ? "Disalin!" : "Salin ID"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-indigo-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 bg-indigo-600 px-4 py-3">
              <HeaderIcon />
              <p className="text-sm font-semibold text-white">
                Informasi Detail
              </p>
            </div>
            <div className="px-5 py-4">
              <InfoRow
                icon={<span className="text-lg">🧑‍🎓</span>}
                label="Nama"
                value={toLabel(profile.name || cachedUser.name)}
              />
              <InfoRow
                icon={<span className="text-lg">🧭</span>}
                label="Kelas"
                value={toLabel(profile.kelas)}
              />
              <InfoRow
                icon={<span className="text-lg">📝</span>}
                label="Tipe Tugas"
                value={toLabel(
                  (cachedUser as any)?.metadata?.tipeTugas ?? "Scheduled Quiz"
                )}
              />
              <InfoRow
                icon={<span className="text-lg">🔢</span>}
                label="Jumlah Soal"
                value={toLabel(
                  (cachedUser as any)?.metadata?.jumlahSoal ?? 20
                )}
              />
              <InfoRow
                icon={<span className="text-lg">🏫</span>}
                label="Ditujukan Untuk Kelas"
                value={toLabel(
                  (cachedUser as any)?.metadata?.ditujukanKelas ??
                    profile.kelas ??
                    "—"
                )}
              />
              <InfoRow
                icon={<span className="text-lg">🆔</span>}
                label="User ID"
                value={
                  <button
                    onClick={handleCopyId}
                    className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50"
                    title="Copy"
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

          <div className="overflow-hidden rounded-xl border border-indigo-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 bg-indigo-600 px-4 py-3">
              <HeaderIcon />
              <p className="text-sm font-semibold text-white">
                Keamanan & Aktivitas
              </p>
            </div>
            <div className="px-5 py-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start justify-between rounded-lg bg-gray-100 p-3">
                  <div>
                    <p className="font-medium text-gray-900">Peran Saat Ini</p>
                    <p className="text-gray-600">
                      Anda masuk sebagai{" "}
                      <span className="font-semibold">{toLabel(roleLabel)}</span>.
                    </p>
                  </div>
                  <Pill className="bg-indigo-100 text-indigo-700">
                    {toLabel(roleLabel)}
                  </Pill>
                </div>

                <div className="flex items-start justify-between rounded-lg bg-gray-100 p-3">
                  <div>
                    <p className="font-medium text-gray-900">Sesi</p>
                    <p className="text-gray-600">
                      Terautentikasi menggunakan cache profil lokal.
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {(cachedUser as any)?.lastLoginAt
                      ? new Date((cachedUser as any).lastLoginAt).toLocaleString()
                      : "Waktu tidak tersedia"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => window.location.reload()}
                    className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 ring-1 ring-gray-300 transition hover:bg-gray-50"
                  >
                    Muat Ulang Profil
                  </button>
                  <span className="text-xs text-gray-500">
                    Data diperbarui dari cache auth.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 

      {isEditing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between bg-indigo-600 px-4 py-3">
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
              <div>
                <label className="mb-1 block text-sm text-gray-700">Nama</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  value={toLabel(profile.name)}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-700">Kelas</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  value={toLabel(profile.kelas)}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, kelas: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-700">
                  URL Avatar
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
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