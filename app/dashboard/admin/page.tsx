"use client";

import BarChart from "@/app/components/pages/Dashboard/BarChart";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import StatsCard from "@/app/components/pages/Dashboard/StatsCard";
import React from "react";

const AdminDashboardPage = () => {
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
    <>
      <DashboardTitle title="Dashboard" showBackButton={false} />

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, idx) => (
          <StatsCard key={idx} label={s.label} value={s.value} />
        ))}
      </div>

      {/* Chart */}
      <div className="bg-surface rounded-xl border border-light-muted p-6">
        <h2 className="text-sm font-semibold text-dark mb-4">
          Jumlah Siswa Per Kelas
        </h2>
        <BarChart data={kelasData} />
      </div>
    </>
  );
};

export default AdminDashboardPage;
