"use client";

import { useState } from "react";
import { useClassLeaderboard } from "@/app/hooks/leaderboards/useClassLeaderboard";
import { useStudentLeaderboard } from "@/app/hooks/leaderboards/useStudentLeaderboard";
import { IMAGES } from "@/app/constants/images";

type LeaderboardRow = {
  id?: string;
  name?: string;
  image?: string;
  point?: number;
};

export default function Page() {
  const [filter, setFilter] = useState<"class" | "student">("class");

  const { data: classLeaderboard = [], isLoading: isClassLeaderboardLoading } =
    useClassLeaderboard();
  const {
    data: studentLeaderboard = [],
    isLoading: isStudentLeaderboardLoading,
  } = useStudentLeaderboard();

  const isLoading =
    filter === "class"
      ? isClassLeaderboardLoading
      : isStudentLeaderboardLoading;

  const leaderboard =
    filter === "class" ? classLeaderboard : studentLeaderboard;

  // top 3 for podium banners
  const top3 = leaderboard.slice(0, 3);

  // skip top 3 for table
  const tableRows: LeaderboardRow[] = leaderboard.slice(3);

  const minRows = 10;
  const filledRows: LeaderboardRow[] = [
    ...tableRows,
    ...Array.from(
      { length: Math.max(0, minRows - tableRows.length) },
      () => ({})
    ),
  ];

  // di dalam component Page sebelum return
  const defaultImage =
    filter === "class" ? IMAGES.DEFAULT_CLASS : IMAGES.DEFAULT_PROFILE;

  return (
    <div className="bg-background text-tx-primary">
      <main className="mx-auto max-w-[1100px] px-6 pb-16 pt-7">
        <h1 className="mb-4 border-b-2 border-outline pb-3 text-[36px] font-extrabold">
          Leaderboard
        </h1>

        {/* FILTER BUTTONS */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setFilter("class")}
            className={`px-4 py-2 font-bold rounded ${
              filter === "class"
                ? "bg-primary text-white"
                : "bg-card text-tx-primary border"
            }`}
          >
            Class
          </button>
          <button
            onClick={() => setFilter("student")}
            className={`px-4 py-2 font-bold rounded ${
              filter === "student"
                ? "bg-primary text-white"
                : "bg-card text-tx-primary border"
            }`}
          >
            Student
          </button>
        </div>

        <div className="grid grid-cols-[360px_1fr] gap-6 max-[980px]:grid-cols-1">
          {/* LEFT — podium banners */}
          <div className="grid grid-cols-3 gap-4">
            {top3.map((cl, idx) => (
              <Banner
                key={cl.id ?? idx}
                tone={idx === 0 ? "gold" : idx === 1 ? "silver" : "bronze"}
                title1={cl.name?.split(" ")[0] ?? ""}
                title2={cl.name?.split(" ").slice(1).join(" ") ?? ""}
                points={cl.point ?? 0}
                image={cl.image ?? defaultImage}
              />
            ))}
          </div>

          {/* RIGHT — table */}
          <section className="overflow-hidden rounded-lg border-2 border-br-secondary bg-card">
            <div className="grid grid-cols-[120px_1fr_160px] bg-primary px-4 py-3 font-bold text-white">
              <div>Rank</div>
              <div>Name</div>
              <div className="text-right">Points</div>
            </div>

            <div>
              {isLoading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[120px_1fr_160px] items-center border-b-2 border-br-secondary px-4 py-3 bg-tertiary animate-pulse"
                    >
                      <div className="h-5 w-5 rounded bg-gray-300" />
                      <div className="h-5 w-full rounded bg-gray-300" />
                      <div className="h-5 w-16 rounded bg-gray-300 ml-auto" />
                    </div>
                  ))
                : filledRows.map((cl, i) => {
                    const rank = i + 4; // ranks start from 4
                    return (
                      <div
                        key={cl.id ?? i}
                        className={`grid grid-cols-[120px_1fr_160px] items-center border-b-2 border-br-secondary px-4 py-3 ${
                          i % 2 === 0 ? "bg-tertiary" : "bg-background"
                        }`}
                      >
                        <div className="font-bold">{rank}</div>
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className="h-7 w-7 flex-shrink-0 rounded-full border border-br-secondary bg-card"
                            style={{
                              backgroundImage: `url("${
                                cl.image ?? defaultImage
                              }")`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                          <span className="truncate">{cl.name || ""}</span>
                        </div>
                        <div className="text-right font-bold">
                          {cl.point ?? ""}
                        </div>
                      </div>
                    );
                  })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Banner({
  tone,
  title1,
  title2,
  points,
  image,
}: {
  tone: "gold" | "silver" | "bronze";
  title1: string;
  title2: string;
  points: string | number;
  image?: string;
}) {
  const bg =
    tone === "gold"
      ? "linear-gradient(180deg,#FFE9A8 0%,#E6C26B 55%,#CFAB57 82%,#B88944 100%)"
      : tone === "silver"
      ? "linear-gradient(180deg,#EEF1F5 0%,#C9D0DC 55%,#BFC6D3 82%,#AAB1BF 100%)"
      : "linear-gradient(180deg,#F4E0C8 0%,#C48B56 55%,#B27B49 82%,#99683C 100%)";

  const medalBg =
    tone === "gold"
      ? "radial-gradient(circle at 40% 35%,#ffffffaa 0 35%,transparent 36%),#FFEF9B"
      : tone === "silver"
      ? "radial-gradient(circle at 40% 35%,#ffffffaa 0 35%,transparent 36%),#E6EBF2"
      : "radial-gradient(circle at 40% 35%,#ffffffaa 0 35%,transparent 36%),#E8C39F";

  return (
    <section
      className="relative overflow-hidden rounded-xl border-2 border-br-secondary px-4"
      style={{ background: bg, height: 560 }}
    >
      {/* MEDAL */}
      <div
        className="absolute left-1/2 top-[72px] grid h-[68px] w-[68px] -translate-x-1/2 place-items-center rounded-full border-[3px] border-br-secondary shadow"
        style={{ background: medalBg }}
      />

      {/* PHOTO */}
      <div
        className="absolute left-1/2 top-[170px] h-[110px] w-[110px] -translate-x-1/2 rounded-full border-[3px] border-br-secondary bg-card shadow-sm"
        style={{
          backgroundImage: `url("${image || IMAGES.DEFAULT_CLASS}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* TITLE */}
      <div className="absolute left-1/2 top-[310px] w-[86%] -translate-x-1/2 text-center text-[18px] font-bold leading-tight text-tx-primary">
        {title1}
        <br />
        {title2}
      </div>

      {/* SCORE */}
      <div className="absolute left-1/2 bottom-28 -translate-x-1/2">
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-br-secondary bg-primary px-3 py-2 text-[16px] font-bold text-white shadow-sm">
          <span
            className="inline-block h-[16px] w-[16px] rounded-full border border-br-secondary"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,.65) 0 40%, transparent 41%), #FFD54F",
            }}
          />
          <span className="tabular-nums">{points}</span>
        </div>
      </div>

      {/* Soft bottom highlight */}
      <div className="absolute inset-x-0 bottom-6 h-[64px] rounded-b-xl bg-black/10 mix-blend-multiply opacity-[.08]" />
    </section>
  );
}
