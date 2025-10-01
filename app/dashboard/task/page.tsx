"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  type: "Exam Preparation" | "Review Quiz" | "Live Quiz" | "Assignment";
  status: "Turned In" | "Due Soon" | "Overdue";
  dateLabel: string; // e.g., "Jan 8, 2024 – Monday"
};

const ALL_TASKS: Task[] = [
  {
    id: "prep-pll",
    title: "Quiz Prep Ujian Program Linear Lanjutan",
    type: "Exam Preparation",
    status: "Turned In",
    dateLabel: "Jan 8, 2024 – Monday",
  },
  {
    id: "review-stat-inferensial",
    title: "Review Quiz Statistika Inferensial",
    type: "Review Quiz",
    status: "Turned In",
    dateLabel: "Jan 8, 2024 – Monday",
  },
  {
    id: "live-quiz-peluang-bersyarat",
    title: "Live Quiz Peluang Bersyarat",
    type: "Live Quiz",
    status: "Turned In",
    dateLabel: "Jan 8, 2024 – Monday",
  },
  {
    id: "tugas-fungsi-grafik",
    title: "Tugas Fungsi dan Grafik",
    type: "Assignment",
    status: "Turned In",
    dateLabel: "Jan 8, 2024 – Monday",
  },
];

export default function TasksPage() {
  const [tab, setTab] = useState<"UPCOMING" | "PAST_DUE" | "COMPLETED">(
    "UPCOMING"
  );
  const [q, setQ] = useState("");

  const tasks = useMemo(() => {
    // In real app, filter based on `tab`; here all are "Turned In" for the mock
    const filtered = ALL_TASKS.filter((t) =>
      t.title.toLowerCase().includes(q.trim().toLowerCase())
    );
    return filtered;
  }, [q]);

  // group by date label to show date row like the screenshot
  const groups = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const t of tasks) {
      const arr = map.get(t.dateLabel) ?? [];
      arr.push(t);
      map.set(t.dateLabel, arr);
    }
    return Array.from(map.entries());
  }, [tasks]);

  return (
    <div className="min-h-screen bg-[#F0EDF9] text-black">
      {/* Top bar with brand only */}
      <div className="h-16 bg-[#626BD9] flex items-center">
        <div className="container mx-auto px-6">
          <h1 className="text-white font-extrabold tracking-wide">GAMIFICATION</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Page title + divider line like the screenshot */}
        <h2 className="text-3xl font-extrabold">Daftar Tugas</h2>
        <div className="mt-3 border-b border-indigo-200" />

        {/* Tabs + Search + actions row */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-6">
            {[
              { key: "UPCOMING", label: "Upcoming" },
              { key: "PAST_DUE", label: "Past Due" },
              { key: "COMPLETED", label: "Completed" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() =>
                  setTab(t.key as "UPCOMING" | "PAST_DUE" | "COMPLETED")
                }
                className={`pb-1 font-semibold ${
                  tab === (t.key as any)
                    ? "border-b-2 border-indigo-500"
                    : "opacity-70"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3 w-full max-w-xl">
            <input
              type="text"
              placeholder="Cari berdasarkan nama..."
              className="flex-1 px-4 py-2 rounded-lg bg-white border border-indigo-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="h-10 w-10 rounded-lg bg-[#6F78E9] text-white grid place-items-center">
              🔍
            </button>
            <button className="h-10 w-10 rounded-lg bg-[#6F78E9] text-white grid place-items-center">
              ⚙️
            </button>
          </div>
        </div>

        {/* List */}
        <div className="mt-6 space-y-6">
          {groups.map(([date, items]) => (
            <div key={date}>
              <div className="text-sm opacity-80 mb-3">{date}</div>
              <div className="space-y-4">
                {items.map((t) => (
                  <Link
                    key={t.id}
                    href={`/dashboard/task/${t.id}`}
                    className="block"
                  >
                    <div className="bg-[#DCD6FB]/70 hover:bg-[#DCD6FB] transition-colors rounded-xl border border-indigo-200 px-5 py-4 relative">
                      <div className="pr-44">
                        <div className="font-semibold">{t.title}</div>
                        <div className="text-sm opacity-80">{t.type}</div>
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <span className="inline-flex items-center rounded-full bg-[#65C37A] text-white text-sm px-4 py-1">
                          {t.status}
                        </span>
                        <div className="text-sm opacity-80 mt-2 text-right">
                          Submited At….
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-10">
          <button className="px-3 py-1 border rounded bg-white">◀</button>
          <button className="px-3 py-1 border rounded bg-[#626BD9] text-white">
            1
          </button>
          <button className="px-3 py-1 border rounded bg-white">2</button>
          <button className="px-3 py-1 border rounded bg-white">▶</button>
        </div>
      </div>
    </div>
  );
}
