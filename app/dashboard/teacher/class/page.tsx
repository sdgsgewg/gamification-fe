"use client";

import React from "react";
import Link from "next/link";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useGetCachedUser } from "@/app/hooks/useGetCachedUser";

const TeacherDashboardPage = () => {
  const { user } = useGetCachedUser();

  const classes = [
    { name: "XII IPA 1", slug: "xii-ipa-1" },
    { name: "XII IPA 2", slug: "xii-ipa-2" },
    { name: "XII IPS 1", slug: "xii-ips-1" },
  ];

  return (
    <div className="p-6">
      <DashboardTitle title="Kelas Saya (Guru)" showBackButton={false} />

      <div className="mb-6 text-sm text-gray-600">
        Mengajar sebagai{" "}
        <span className="font-semibold text-black">{user?.name ?? "Guru"}</span>
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
    </div>
  );
};

export default TeacherDashboardPage;