"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import DashboardTitle from "../components/pages/Dashboard/DashboardTitle";
import Loading from "../components/shared/Loading";

const DashboardHomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("access_token", token);
    }
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, [token]);

  if (isLoading) return <Loading />;

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

export default DashboardHomePage;