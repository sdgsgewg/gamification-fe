"use client";

import React from "react";

type User = {
  id: string;
  name: string;
  role: { name: string };
};

const AdminDashboardPage: React.FC<{ user?: User }> = ({ user }) => {
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
      <h1 className="text-2xl font-bold text-black mb-6">Dashboard Admin</h1>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm"
          >
            <div className="text-3xl font-extrabold text-black mb-1">
              {s.value}
            </div>
            <div className="text-sm font-semibold text-black">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-black mb-4">
          Jumlah Siswa Per Kelas
        </h2>
        <BarChart data={kelasData} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;

const BarChart: React.FC<{ data: { label: string; value: number }[] }> = ({
  data,
}) => {
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

      {/* bars */}
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
              <div className="mt-3 text-xs text-gray-600 select-none">
                {d.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
