"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import DashboardTitle from "../components/pages/Dashboard/DashboardTitle";
import Loading from "../components/shared/Loading";

import { auth } from "@/app/functions/AuthProvider";

type User = {
  id: string;
  name: string;
  role: { name: string };
};

enum Role {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  GUEST = "GUEST",
}

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<Role>(Role.GUEST);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("access_token", token);
    }

    const updateUser = () => {
      const u = auth.getCachedUserProfile() as User | null;
      if (u) {
        setUser(u);
        const name = (u.role?.name || "").toUpperCase();
        if (name === Role.ADMIN || name === Role.TEACHER || name === Role.STUDENT) {
          setUserRole(name as Role);
        } else {
          setUserRole(Role.GUEST);
        }
      } else {
        setUser(null);
        setUserRole(Role.GUEST);
      }
    };

    updateUser();

    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [token]);

  if (isLoading) return <Loading />;

  switch (userRole) {
    case Role.ADMIN:
      return <AdminView user={user} />;
    case Role.TEACHER:
      return <TeacherView user={user} />;
    case Role.STUDENT:
      return <StudentView />;
    default:
      return <GuestView />;
  }
};

export default Page;

/* =========================
 *      ROLE VIEWS
 * ========================= */

const AdminView: React.FC<{ user: User | null }> = ({ user }) => {
  // data dummy sementara
  const stats = [
    { label: "Guru", value: 200 },
    { label: "Siswa", value: 300 },
    { label: "Mata Pelajaran", value: 12 },
    { label: "Materi", value: 36 },
  ];

  const kelasData = [
    { label: "XII A", value: 27 },
    { label: "XII B", value: 38 },
    { label: "XII C", value: 32 },
    { label: "XII D", value: 13 },
    { label: "XII E", value: 18 },
    { label: "XII F", value: 39 },
  ];

  return (
    <div className="p-6">
      {/* Judul Dashboard */}
      <h1 className="text-2xl font-bold text-black mb-6">Dashboard</h1>

      {/* Kotak Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm"
          >
            <div className="text-3xl font-extrabold text-black mb-1">{s.value}</div>
            <div className="text-sm font-semibold text-black">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart Jumlah Siswa per Kelas */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-black mb-4">
          Jumlah Siswa Per Kelas
        </h2>
        <BarChart data={kelasData} />
      </div>
    </div>
  );
};

/* ===== Chart Bar sederhana pakai Tailwind ===== */
const BarChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
  const max = Math.max(...data.map((d) => d.value)) || 1;

  return (
    <div className="relative h-64 w-full">
      {/* gridlines */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-gray-100"
            style={{ top: `${i * 20}%` }}
          />
        ))}
      </div>

      {/* bars (pakai padding bawah buat area label X) */}
      <div className="absolute inset-0 px-2 pb-8 flex items-end gap-6">
        {data.map((d) => {
          const h = (d.value / max) * 100;
          return (
            <div
              key={d.label}
              className="flex-1 h-full flex flex-col items-center justify-end"
            >
              <div className="mb-2 text-sm font-semibold text-black select-none">
                {d.value}
              </div>
              <div
                className="w-full max-w-[60px] rounded-md bg-indigo-500"
                style={{ height: `${h}%` }}
                aria-label={`${d.label} ${d.value}`}
              />
              <div className="mt-3 text-xs text-gray-600 select-none">{d.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TeacherView: React.FC<{ user: User | null }> = ({ user }) => {
  const classes = [
    { name: "XII IPA 1", slug: "xii-ipa-1" },
    { name: "XII IPA 2", slug: "xii-ipa-2" },
    { name: "XII IPS 1", slug: "xii-ips-1" },
  ];

  return (
    <>
      <DashboardTitle title="Kelas Saya (Guru)" showBackButton={false} />

      <div className="mb-6 text-sm text-gray-600">
        Mengajar sebagai{" "}
        <span className="font-semibold text-black">
          {user?.name ?? "Guru"}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Cari kelas atau siswa..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
          🔍
        </button>
        <Link
          href="/dashboard/classes/create"
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          + Buat Kelas
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {classes.map(({ name, slug }) => (
          <Link
            key={slug}
            href={`/dashboard/class/${slug}`}
            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-md transition"
          >
            <div className="w-16 h-16 mb-4 bg-indigo-100 flex items-center justify-center rounded-lg">
              🧑‍🏫
            </div>
            <p className="font-semibold text-center text-black">{name}</p>
          </Link>
        ))}
      </div>
    </>
  );
};

const StudentView: React.FC = () => {
  const classes = [
    { name: "Kelas 12A SMAN 1", slug: "12A" },
    { name: "Kelas 12B SMAN 1", slug: "12B" },
    { name: "Kelas 12C SMAN 1", slug: "12C" },
    { name: "Kelas 12D SMAN 1", slug: "12D" },
    { name: "Kelas 12E SMAN 1", slug: "12E" },
  ];

  return (
    <>
      <DashboardTitle title="Kelas Saya" showBackButton={false} />

      {/* Search bar */}
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
          🔍
        </button>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {classes.map(({ name, slug }) => (
          <Link
            key={slug}
            href={`/dashboard/class/${slug}`}
            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-md transition"
          >
            <div className="w-16 h-16 mb-4 bg-indigo-100 flex items-center justify-center rounded-lg">
              📚
            </div>
            <p className="font-semibold text-center text-black">{name}</p>
          </Link>
        ))}
      </div>

      {/* Pagination (static for now) */}
      <div className="flex justify-center items-center gap-2 mt-8">
        <button className="px-3 py-1 border rounded hover:bg-gray-100 text-black">◀</button>
        <button className="px-3 py-1 border rounded bg-indigo-500 text-white">1</button>
        <button className="px-3 py-1 border rounded hover:bg-gray-100 text-black">2</button>
        <button className="px-3 py-1 border rounded hover:bg-gray-100 text-black">▶</button>
      </div>
    </>
  );
};

const GuestView: React.FC = () => {
  return (
    <>
      <DashboardTitle title="Welcome" showBackButton={false} />
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow">
        <p className="text-black font-medium mb-2">Kamu belum login.</p>
        <p className="text-gray-600 mb-4">
          Silakan login untuk melihat dashboard sesuai peran kamu.
        </p>
        <div className="flex gap-3">
          <Link
            href="/auth/login"
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-black"
          >
            Register
          </Link>
        </div>
      </div>
    </>
  );
};
