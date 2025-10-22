"use client";

import { useState } from "react";
import Link from "next/link";
import MemberView from "./MemberView";
import ClassLeaderboardView from "./ClassLeaderboardView";
import TaskView from "./TaskView";

export default function ClassDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [tab, setTab] =
    useState<"members" | "leaderboard" | "tasks">("members");

  // You can map slug -> name from your data source later
  const className = "Kelas 12E SMAN 1";

  return (
    <div className="cls-detail">
      {/* Top / hero */}
      <div className="hero">
        <Link href="/dashboard/student/class" className="back">
          <span className="icon">←</span> Kembali
        </Link>

        <div className="hero-main">
          <div className="badge">{getInitials(className)}</div>
          <div className="titles">
            <h1 className="name">{className}</h1>
            <p className="sub">Dashboard Kelas • Tahun Ajaran 2025/2026</p>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <span className="k">28</span>
            <span className="l">Anggota</span>
          </div>
          <div className="stat">
            <span className="k">6</span>
            <span className="l">Mata Pelajaran</span>
          </div>
          <div className="stat">
            <span className="k">125k</span>
            <span className="l">Total Poin</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" role="tablist" aria-label="Navigasi Kelas">
        <TabButton
          active={tab === "members"}
          onClick={() => setTab("members")}
          icon="👥"
          label="Anggota"
        />
        <TabButton
          active={tab === "leaderboard"}
          onClick={() => setTab("leaderboard")}
          icon="🏆"
          label="Leaderboard"
        />
        <TabButton
          active={tab === "tasks"}
          onClick={() => setTab("tasks")}
          icon="📚"
          label="Tugas"
        />
      </div>

      {/* Content */}
      <div className="content">
        {tab === "members" && <MemberView />}
        {tab === "leaderboard" && <ClassLeaderboardView />}
        {tab === "tasks" && <TaskView />}
      </div>

      <style jsx>{`
        :root {
          --ink: #0f172a;
          --muted: #64748b;
          --ring: rgba(91, 104, 255, 0.18);
          --card: #ffffff;
          --bg1: #f6f7ff;
          --bg2: #f4ecff;
          --brandA: #7486ff;
          --brandB: #9a7bff;
          --shadow-1: 0 10px 26px rgba(0, 0, 0, 0.08);
          --shadow-2: 0 18px 40px rgba(122, 115, 255, 0.18);
          --radius: 16px;
        }

        .cls-detail {
          max-width: 1040px;
          margin: 0 auto;
          padding: 24px 20px 80px;
          color: var(--ink);
        }

        /* HERO */
        .hero {
          position: relative;
          background: linear-gradient(135deg, var(--brandA), var(--brandB));
          border-radius: var(--radius);
          padding: 18px 18px 16px;
          box-shadow: var(--shadow-2);
          overflow: hidden;
          color: #fff;
          isolation: isolate;
        }
        .hero::after {
          /* soft shine */
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
              800px 220px at -10% 0%,
              rgba(255, 255, 255, 0.42),
              transparent 60%
            ),
            radial-gradient(
              1000px 260px at 120% -10%,
              rgba(255, 255, 255, 0.22),
              transparent 65%
            );
          z-index: 0;
          pointer-events: none;
        }

        .back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: #eef2ff;
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 6px 12px;
          border-radius: 999px;
          text-decoration: none;
          position: relative;
          z-index: 1;
          transition: transform 120ms ease, background 120ms ease;
        }
        .back:hover {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.2);
        }
        .icon {
          font-size: 14px;
          line-height: 1;
        }

        .hero-main {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 10px;
        }
        .badge {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          font-weight: 900;
          letter-spacing: 0.3px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6),
            0 2px 10px rgba(0, 0, 0, 0.18);
        }
        .titles {
          display: grid;
        }
        .name {
          margin: 0;
          line-height: 1.1;
          font-size: 28px;
          font-weight: 900;
          text-shadow: 0 1px 0 rgba(0, 0, 0, 0.12);
        }
        .sub {
          margin: 2px 0 0;
          color: #eef2ff;
          opacity: 0.95;
          font-weight: 600;
        }

        .hero-stats {
          position: relative;
          z-index: 1;
          margin-top: 14px;
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
        }
        .stat {
          display: grid;
          background: rgba(255, 255, 255, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.4);
          padding: 8px 12px;
          border-radius: 12px;
          min-width: 120px;
        }
        .k {
          font-weight: 900;
          letter-spacing: 0.2px;
        }
        .l {
          font-size: 12px;
          opacity: 0.95;
        }

        /* TABS */
        .tabs {
          display: flex;
          gap: 10px;
          padding: 10px;
          margin-top: 14px;
          background: linear-gradient(180deg, #ffffff, #fafbff);
          border: 1px solid rgba(110, 117, 255, 0.12);
          border-radius: 14px;
          box-shadow: var(--shadow-1);
        }
        .tab-btn {
          position: relative;
          background: #f2f4ff;
          border: 1px solid #e0e7ff;
          color: #475569;
          padding: 10px 14px;
          border-radius: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: transform 120ms ease, background 120ms ease;
        }
        .tab-btn:hover {
          background: #e8ebff;
          transform: translateY(-1px);
        }
        .tab-btn.active {
          color: #3f51b5;
          background: #e6eaff;
          border-color: #c7d2fe;
          box-shadow: 0 0 0 3px var(--ring);
        }

        /* CONTENT */
        .content {
          margin-top: 18px;
          background: var(--card);
          border: 1px solid rgba(110, 117, 255, 0.1);
          border-radius: 16px;
          padding: 16px;
          box-shadow: var(--shadow-1);
        }

        @media (max-width: 720px) {
          .name {
            font-size: 22px;
          }
          .hero-stats {
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={`tab-btn ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span aria-hidden>{icon}</span>
      {label}
    </button>
  );
}

function getInitials(name: string) {
  // For "Kelas 12E SMAN 1" -> "12E"
  const match = name.match(/\b(\d+\w?)\b/);
  if (match) return match[1];
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}