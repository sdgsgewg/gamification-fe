"use client";

import BarChart from "@/app/components/pages/Dashboard/BarChart";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import StatsCard from "@/app/components/pages/Dashboard/StatsCard";
import React from "react";

const AdminDashboardPage = () => {
  const stats = [
    { label: "Teachers", value: 200 },
    { label: "Students", value: 300 },
    { label: "Subjects", value: 12 },
    { label: "Materials", value: 36 },
  ];

  const classData = [
    { label: "12A", value: 27 },
    { label: "12B", value: 38 },
    { label: "12C", value: 32 },
    { label: "12D", value: 13 },
    { label: "12E", value: 18 },
    { label: "12F", value: 39 },
  ];

  return (
    <>
      <DashboardTitle title="Dashboard" showBackButton={false} />

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, idx) => (
          <StatsCard key={idx} label={s.label} value={s.value} />
        ))}
      </div>

      {/* Chart */}
      <div className="bg-surface rounded-xl border border-light-muted p-6">
        <h2 className="text-sm font-semibold text-dark mb-4">
          Number of Students per Class
        </h2>
        <BarChart data={classData} />
      </div>
    </>
  );
};

export default AdminDashboardPage;