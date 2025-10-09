"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const CLASS_TITLE = "Kelas 12B SMAN 1";
const CLASS_DESC =
  "Kelas dengan semangat belajar tinggi dan komitmen terhadap keunggulan.";

/* ----------------------------- MOCKED DATA ----------------------------- */
// Tugas
type Task = {
  id: string;
  title: string;
  badge: "Tryout" | "Live Quiz" | "Review Quiz" | "Assignment";
  subject: string;
  questions: number;
  due?: string; // only shown on Aktif page
};
const ACTIVE_TASKS: Task[] = [
  {
    id: "t1",
    title: "Prep UTS MTK 2025",
    badge: "Tryout",
    subject: "Matematika",
    questions: 50,
    due: "10 November 2025 (23:59 WIB)",
  },
];
const DONE_TASKS: Task[] = [
  {
    id: "d1",
    title: "Live Quiz Peluang Bersyarat",
    badge: "Live Quiz",
    subject: "Matematika",
    questions: 20,
  },
  {
    id: "d2",
    title: "Review Quiz Statistika Inferensial",
    badge: "Review Quiz",
    subject: "Matematika",
    questions: 25,
  },
  {
    id: "d3",
    title: "Tugas Fungsi dan Grafik",
    badge: "Assignment",
    subject: "Matematika",
    questions: 30,
  },
];

// Anggota
type Member = { id: string; name: string; avatar: string };
const STUDENTS: Member[] = [
  { id: "m1", name: "Susi Pudjianti", avatar: "/avatars/a1.png" },
  { id: "m2", name: "Angel Wicaksono", avatar: "/avatars/a2.png" },
  { id: "m3", name: "Siti Nurhalizah", avatar: "/avatars/a3.png" },
  { id: "m4", name: "Caca Permarta Sari", avatar: "/avatars/a4.png" },
  { id: "m5", name: "Kevin Wijaya", avatar: "/avatars/a5.png" },
  { id: "m6", name: "Denis", avatar: "/avatars/a6.png" },
  { id: "m7", name: "Sarah", avatar: "/avatars/a7.png" },
  { id: "m8", name: "Adit", avatar: "/avatars/a8.png" },
];
const TEACHERS: Member[] = [
  { id: "g1", name: "Herman Hidayat", avatar: "/avatars/teacher1.png" },
];

// Leaderboard
type ScoreRow = { id: string; name: string; points: number; avatar: string };
const LEADERBOARD_ROWS: ScoreRow[] = [
  { id: "r1", name: "Caca Permarta Sari", points: 11000, avatar: "/avatars/a4.png" },
  { id: "r2", name: "Kevin Wijaya", points: 10500, avatar: "/avatars/a5.png" },
  { id: "r3", name: "Caca Permarta Sari", points: 11000, avatar: "/avatars/a4.png" },
  { id: "r4", name: "Kevin Wijaya", points: 10500, avatar: "/avatars/a5.png" },
  { id: "r5", name: "Caca Permarta Sari", points: 11000, avatar: "/avatars/a4.png" },
  { id: "r6", name: "Kevin Wijaya", points: 10500, avatar: "/avatars/a5.png" },
  { id: "r7", name: "Caca Permarta Sari", points: 11000, avatar: "/avatars/a4.png" },
  { id: "r8", name: "Kevin Wijaya", points: 10500, avatar: "/avatars/a5.png" },
  { id: "r9", name: "Caca Permarta Sari", points: 11000, avatar: "/avatars/a4.png" },
  { id: "r10", name: "Kevin Wijaya", points: 10500, avatar: "/avatars/a5.png" },
];

function Badge({ label }: { label: Task["badge"] }) {
  return (
    <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white bg-indigo-500">
      {label}
    </span>
  );
}

function TaskCard({ task, showDue }: { task: Task; showDue?: boolean }) {
  return (
    <div className="border border-indigo-200 rounded-2xl p-5 flex gap-5 items-center bg-white shadow-sm">
      <div className="w-32 h-24 rounded-xl bg-indigo-50 flex items-center justify-center select-none">
        {/* replace with real image if you have it */}
        <span className="text-3xl">📝</span>
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-black leading-snug">{task.title}</h3>
        <div className="mt-2 mb-1">
          <Badge label={task.badge} />
        </div>
        <p className="text-black text-sm">Mata Pelajaran: {task.subject}</p>
        <p className="text-black text-sm">Jumlah Soal: {task.questions}</p>
        {showDue && task.due && (
          <p className="text-black text-sm mt-1">🗓️ Deadline: {task.due}</p>
        )}
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  return (
    <div className="border border-indigo-200 rounded-xl p-6 flex flex-col items-center bg-white">
      <div className="w-32 h-32 rounded-full bg-indigo-50 overflow-hidden flex items-center justify-center select-none">
        {/* replace src with <Image> if using next/image */}
        <span className="text-5xl">🧑‍🎓</span>
      </div>
      <div className="mt-4 font-semibold text-black text-center">{member.name}</div>
    </div>
  );
}

/* --------------------------------- PAGE -------------------------------- */
export default function ClassPage() {
  const router = useRouter();

  const [tab, setTab] = useState<"TUGAS" | "ANGGOTA" | "LEADERBOARD">("TUGAS");
  const [taskSub, setTaskSub] = useState<"AKTIF" | "SELESAI">("AKTIF");
  const [memberSub, setMemberSub] = useState<"MURID" | "GURU">("MURID");

  // simple pagination demo (shared pagination UI)
  const [page, setPage] = useState(1);
  const totalPages = 2;

  const tasksToShow = useMemo(
    () => (taskSub === "AKTIF" ? ACTIVE_TASKS : DONE_TASKS),
    [taskSub]
  );
  const membersToShow = useMemo(
    () => (memberSub === "MURID" ? STUDENTS : TEACHERS),
    [memberSub]
  );

  return (
    <div className="min-h-screen bg-[#F0EDF9] text-black">
      {/* Top header (no username) */}
      <div className="h-16 bg-[#626BD9] flex items-center">
        <div className="container mx-auto px-6">
          <h1 className="text-white font-extrabold tracking-wide">GAMIFICATION</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E6E2FB] text-black hover:bg-[#dad5fb] border border-indigo-200"
        >
          <span className="text-lg">←</span> Kembali
        </button>

        {/* Title row */}
        <div className="mt-4 flex items-center gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold">{CLASS_TITLE}</h2>
            <p className="mt-1 max-w-xl">{CLASS_DESC}</p>
          </div>
          <div className="w-16 h-16 rounded-lg bg-indigo-100 flex items-center justify-center select-none">
            <span className="text-3xl">🧑‍🏫</span>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-4 border-b border-indigo-200" />

        {/* Tabs */}
        <div className="mt-3 flex gap-8 text-black">
          {(["TUGAS", "ANGGOTA", "LEADERBOARD"] as const).map((t) => (
            <button
              key={t}
              className={`pb-2 font-semibold ${
                tab === t ? "border-b-2 border-indigo-500" : "opacity-70"
              }`}
              onClick={() => setTab(t)}
            >
              {t[0] + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6">
          {/* ------------------------------- TUGAS ------------------------------ */}
          {tab === "TUGAS" && (
            <>
              {/* sub-tabs */}
              <div className="flex gap-3">
                <button
                  className={`px-4 py-2 rounded-full border border-indigo-200 ${
                    taskSub === "AKTIF" ? "bg-[#626BD9] text-white" : "bg-white"
                  }`}
                  onClick={() => setTaskSub("AKTIF")}
                >
                  Aktif
                </button>
                <button
                  className={`px-4 py-2 rounded-full border border-indigo-200 ${
                    taskSub === "SELESAI" ? "bg-[#626BD9] text-white" : "bg-white"
                  }`}
                  onClick={() => setTaskSub("SELESAI")}
                >
                  Selesai
                </button>
              </div>

              {/* list */}
              {taskSub === "AKTIF" ? (
                <div className="mt-6">
                  {tasksToShow.map((t) => (
                    <div key={t.id} className="mb-5">
                      <TaskCard task={t} showDue />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tasksToShow.map((t) => (
                    <TaskCard key={t.id} task={t} />
                  ))}
                </div>
              )}

              {/* pagination */}
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  className="px-3 py-1 border rounded bg-white"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  ◀
                </button>
                {[...Array(totalPages)].map((_, i) => {
                  const n = i + 1;
                  return (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`px-3 py-1 border rounded ${
                        page === n ? "bg-[#626BD9] text-white" : "bg-white"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
                <button
                  className="px-3 py-1 border rounded bg-white"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  ▶
                </button>
              </div>
            </>
          )}

          {/* ------------------------------ ANGGOTA ----------------------------- */}
          {tab === "ANGGOTA" && (
            <>
              {/* member sub tabs */}
              <div className="flex gap-2">
                <div className="relative">
                  <button
                    className={`px-4 py-2 rounded-t-lg border border-indigo-200 ${
                      memberSub === "MURID"
                        ? "bg-[#626BD9] text-white"
                        : "bg-white"
                    }`}
                    onClick={() => setMemberSub("MURID")}
                  >
                    {STUDENTS.length} Murid
                  </button>
                </div>
                <div className="relative">
                  <button
                    className={`px-4 py-2 rounded-t-lg border border-indigo-200 ${
                      memberSub === "GURU"
                        ? "bg-[#626BD9] text-white"
                        : "bg-white"
                    }`}
                    onClick={() => setMemberSub("GURU")}
                  >
                    {TEACHERS.length} Guru
                  </button>
                </div>
              </div>

              {/* grid */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {membersToShow.map((m) => (
                  <MemberCard key={m.id} member={m} />
                ))}
              </div>

              {/* pagination */}
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  className="px-3 py-1 border rounded bg-white"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  ◀
                </button>
                {[...Array(totalPages)].map((_, i) => {
                  const n = i + 1;
                  return (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`px-3 py-1 border rounded ${
                        page === n ? "bg-[#626BD9] text-white" : "bg-white"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
                <button
                  className="px-3 py-1 border rounded bg-white"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  ▶
                </button>
              </div>
            </>
          )}

          {/* ----------------------------- LEADERBOARD -------------------------- */}
          {tab === "LEADERBOARD" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Podium */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { place: 1, name: "Susi Pudjianti", coin: 12500, avatar: "/avatars/a1.png" },
                  { place: 2, name: "Angel Wicaksono", coin: 12000, avatar: "/avatars/a2.png" },
                  { place: 3, name: "Siti Nurhalizah", coin: 11500, avatar: "/avatars/a3.png" },
                ].map((p) => (
                  <div
                    key={p.place}
                    className={`rounded-xl overflow-hidden border border-indigo-200 bg-white`}
                  >
                    <div
                      className={`h-56 flex flex-col items-center justify-end p-4 ${
                        p.place === 1
                          ? "bg-gradient-to-b from-yellow-200 to-yellow-100"
                          : p.place === 2
                          ? "bg-gradient-to-b from-gray-200 to-gray-100"
                          : "bg-gradient-to-b from-amber-200 to-amber-100"
                      }`}
                    >
                      <div className="w-24 h-24 rounded-full bg-white/70 flex items-center justify-center select-none">
                        <span className="text-4xl">🏅</span>
                      </div>
                      <div className="mt-3 font-bold text-black text-center">{p.name}</div>
                      <div className="mt-2 mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm">
                        <span>🪙</span>
                        <span className="font-semibold">{p.coin}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="bg-white border border-indigo-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#626BD9] text-white text-left">
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Nama</th>
                      <th className="py-3 px-4">Poin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LEADERBOARD_ROWS.map((row, i) => (
                      <tr
                        key={row.id}
                        className={i % 2 === 0 ? "bg-indigo-50/50" : "bg-white"}
                      >
                        <td className="py-3 px-4">{i + 4}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-indigo-100 grid place-items-center select-none">
                              👤
                            </span>
                            {row.name}
                          </div>
                        </td>
                        <td className="py-3 px-4">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}