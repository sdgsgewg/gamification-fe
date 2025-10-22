"use client";

/**
 * app/page.tsx
 * Single-file Next.js page that contains BOTH:
 * 1) "Daftar Tugas" list view
 * 2) "Quiz Detail" view
 *
 * Click the first card (“Quiz Prep…”) to open the detail.
 * Use the “Kembali” button to return to the list.
 */

import { useMemo, useState } from "react";

type Task = {
  id: string;
  title: string;
  subtitle: string;
  status: "Turned In" | "Missing" | "Assigned";
};

export default function Page() {
  const [view, setView] = useState<"list" | "detail">("list");

  const tasks: Task[] = useMemo(
    () => [
      {
        id: "quiz-prep",
        title: "Quiz Prep Ujian Program Linear Lanjutan",
        subtitle: "Exam Preparation",
        status: "Turned In",
      },
      {
        id: "review-quiz",
        title: "Review Quiz Statistika Inferensial",
        subtitle: "Review Quiz",
        status: "Turned In",
      },
      {
        id: "live-quiz",
        title: "Live Quiz Peluang Bersyarat",
        subtitle: "Live Quiz",
        status: "Turned In",
      },
      {
        id: "tugas-fungsi",
        title: "Tugas Fungsi dan Grafik",
        subtitle: "Assignment",
        status: "Turned In",
      },
    ],
    []
  );

  return (
    <div className="page">
      {view === "list" ? (
        <TaskList tasks={tasks} onOpenDetail={() => setView("detail")} />
      ) : (
        <QuizDetail onBack={() => setView("list")} />
      )}

      {/* Global styles */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

        :root {
          --bg: #efecf6;
          --surface: #ffffff;
          --cardSoft: #e0ddf8;
          --ink: #111827;
          --muted: #6b7280;
          --primary: #4b5ab7;
          --primaryTint: #5f6cd4;
          --success: #42c372;
          --danger: #ef4444;
          --divider: #e5e7eb;
          --shadow-1: 0 4px 14px rgba(0, 0, 0, 0.08);
          --shadow-2: 0 6px 18px rgba(0, 0, 0, 0.09);
          --radius: 12px;
        }
        * {
          box-sizing: border-box;
        }
        html,
        body {
          height: 100%;
        }
        body {
          margin: 0;
          font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto,
            Helvetica, Arial;
          background: var(--bg);
          color: var(--ink);
        }
        .page {
          max-width: 980px;
          margin: 0 auto;
          padding: 36px 20px 80px;
        }
        h1 {
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 12px;
        }
        hr.hr {
          border: 0;
          height: 1px;
          width: 100%;
          background: var(--divider);
          margin: 22px 0;
        }

        /* Buttons & pills (shared) */
        .btn {
          appearance: none;
          border: 0;
          border-radius: 999px;
          padding: 8px 14px;
          font-weight: 600;
          line-height: 1;
          cursor: pointer;
          background: var(--primary);
          color: #fff;
          box-shadow: var(--shadow-1);
        }
        .btn.soft {
          background: #d8d8f4;
          color: #1f2937;
        }
        .btn.icon {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .pill {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 13px;
          color: #fff;
          background: var(--success);
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}

/* ------------------------ LIST VIEW ------------------------ */
function TaskList({
  tasks,
  onOpenDetail,
}: {
  tasks: Task[];
  onOpenDetail: () => void;
}) {
  return (
    <>
      <h1>Daftar Tugas</h1>

      <div className="toolbar">
        <div className="tabs">
          <button className="tab active">Upcoming</button>
          <button className="tab">Past Due</button>
          <button className="tab">Completed</button>
        </div>
        <div className="search">
          <input
            placeholder="Cari berdasarkan nama..."
            aria-label="Cari"
            className="input"
          />
          <button className="iconBtn" title="Cari">
            🔎
          </button>
          <button className="iconBtn" title="Filter">
            ⚗️
          </button>
        </div>
      </div>

      <p className="date">Jan 8, 2024 – Monday</p>

      <div className="list">
        {tasks.map((t, i) => (
          <div
            className="card"
            key={t.id}
            role="button"
            onClick={i === 0 ? onOpenDetail : undefined}
            title={i === 0 ? "Buka detail" : t.title}
          >
            <div className="left">
              <div className="title">{t.title}</div>
              <div className="sub">{t.subtitle}</div>
            </div>
            <div className="right">
              <span className="pill">{t.status}</span>
              <div className="meta">Submitted At....</div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button className="pageBtn">‹</button>
        <button className="pageBtn active">1</button>
        <button className="pageBtn">2</button>
        <button className="pageBtn">›</button>
      </div>

      <style jsx>{`
        .toolbar {
          display: flex;
          gap: 12px;
          align-items: center;
          border-bottom: 1px solid var(--divider);
          padding-bottom: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .tabs {
          display: flex;
          gap: 14px;
        }
        .tab {
          background: none;
          border: 0;
          padding: 6px 0;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
        }
        .tab.active {
          color: var(--primary);
          border-bottom: 2px solid var(--primary);
        }
        .search {
          margin-left: auto;
          display: flex;
          align-items: center;
          background: #fff;
          border-radius: 999px;
          box-shadow: var(--shadow-1);
          padding: 4px 6px;
          max-width: 420px;
          flex: 1;
        }
        .input {
          flex: 1;
          border: 0;
          outline: none;
          padding: 10px 12px;
          font-size: 14px;
        }
        .iconBtn {
          border: 0;
          background: var(--primary);
          color: #fff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          margin-left: 6px;
          cursor: pointer;
          box-shadow: var(--shadow-1);
        }
        .date {
          font-weight: 500;
          margin: 18px 0;
        }
        .list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .card {
          background: var(--cardSoft);
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: var(--shadow-1);
          transition: transform 0.05s ease;
        }
        .card[role="button"]:hover {
          transform: translateY(-1px);
          cursor: pointer;
        }
        .left .title {
          font-weight: 600;
          margin-bottom: 4px;
        }
        .left .sub {
          color: #6b7280;
          font-size: 14px;
        }
        .right {
          text-align: right;
        }
        .right .meta {
          margin-top: 6px;
          font-size: 13px;
          color: #6b7280;
        }

        .pagination {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 30px;
        }
        .pageBtn {
          border: 1px solid #cbd5e1;
          background: #eef2ff;
          color: #1f2937;
          border-radius: 8px;
          padding: 8px 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .pageBtn.active {
          background: var(--primary);
          color: #fff;
          border-color: var(--primary);
        }

        @media (max-width: 640px) {
          .card {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .right {
            text-align: left;
          }
        }
      `}</style>
    </>
  );
}

/* ------------------------ DETAIL VIEW ------------------------ */
function QuizDetail({ onBack }: { onBack: () => void }) {
  return (
    <>
      <div className="topbar">
        <button className="btn soft icon" onClick={onBack}>
          ← Kembali
        </button>
        <button className="btn soft icon">🔗 Bagikan</button>
      </div>

      <div className="hero">
        <div className="hero-left">
          <h1 className="hero-title">Quiz Prep Ujian Program Linear Lanjutan</h1>
          <div className="hero-illustration" />
        </div>

        <div className="hero-right">
          <section className="panel">
            <header>
              <span>ℹ️</span> Informasi Detail
            </header>
            <ul className="info">
              <li>
                <span>📘</span>
                <div>
                  <strong>Mata Pelajaran</strong>
                  <div>Matematika Wajib</div>
                </div>
              </li>
              <li>
                <span>📚</span>
                <div>
                  <strong>Materi</strong>
                  <div>Program Linear Lanjutan</div>
                </div>
              </li>
              <li>
                <span>📋</span>
                <div>
                  <strong>Tipe Tugas</strong>
                  <div>Scheduled Quiz</div>
                </div>
              </li>
              <li>
                <span>🔢</span>
                <div>
                  <strong>Jumlah Soal</strong>
                  <div>20</div>
                </div>
              </li>
              <li>
                <span>🎓</span>
                <div>
                  <strong>Ditujukan Untuk Kelas</strong>
                  <div>12</div>
                </div>
              </li>
            </ul>
          </section>

          <section className="panel">
            <header>
              <span>⏱️</span> Waktu Pengerjaan
            </header>
            <ul className="info">
              <li>
                <span>🕐</span>
                <div>
                  <strong>Waktu Mulai</strong>
                  <div>1 November 2025 (13:00 WIB)</div>
                </div>
              </li>
              <li>
                <span>🕑</span>
                <div>
                  <strong>Waktu Selesai</strong>
                  <div>1 November 2025 (14:00 WIB)</div>
                </div>
              </li>
              <li>
                <span>⏳</span>
                <div>
                  <strong>Jangka Waktu</strong>
                  <div>1 Jam</div>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <section className="desc">
        <h3>📝 Deskripsi</h3>
        <p>
          Kuis ini dirancang untuk membantu teman-teman memahami konsep dan
          penyelesaian soal-soal Program Linear Lanjutan. Tetap teliti, fokus,
          dan semangat dalam mengerjakannya!
        </p>
      </section>

      <hr className="hr" />

      <h2 className="section-title">Daftar Soal</h2>

      <div className="q-list">
        <QuestionCard
          number={1}
          points={1}
          image
          prompt={
            <>
              Seseorang ingin membeli dua jenis buah, apel dan jeruk. Harga apel
              Rp4.000/buah dan jeruk Rp3.000/buah. Ia hanya memiliki Rp30.000
              dan ingin membeli paling sedikit 3 buah jeruk. Jika <em>x</em>{" "}
              adalah jumlah apel dan <em>y</em> adalah jumlah jeruk, manakah
              sistem pertidaksamaan yang tepat?
            </>
          }
          options={[
            "4000x + 3000y ≥ 30000, y ≥ 3",
            "4000x + 3000y ≥ 30000, y ≥ 3",
            "4000x + 3000y ≤ 30000, y ≤ 3",
            "4000x + 3000y ≥ 30000, y ≤ 3",
            "x + y ≤ 30, y ≥ 3",
          ]}
        />

        <QuestionCard
          number={2}
          points={1}
          image
          prompt={
            <>
              Jika fungsi objektif maksimum Z=3x+4y memiliki nilai maksimum
              pada titik (2, 5), maka nilai maksimum dari Z adalah 26.{" "}
              <strong>Pernyataan ini Benar atau Salah?</strong>
            </>
          }
          options={["Benar", "Salah"]}
        />

        <QuestionCard
          number={3}
          points={3}
          image
          prompt={
            <>
              Diketahui sistem kendala: x+y ≤ 6, x ≥ 0, y ≥ 0. Jika fungsi
              objektif adalah Z=5x+2y, maka nilai maksimum dari Z adalah ___.
            </>
          }
          options={[""]}
        />

        <QuestionCard
          number={20}
          points={15}
          image
          prompt={
            <>
              Dina ingin memaksimalkan keuntungan dari menjual dua jenis produk:
              A dan B. Produk A memberikan keuntungan Rp10.000/unit dan produk
              B Rp15.000/unit. Ia hanya memiliki 40 jam kerja dan bahan baku
              untuk 30 unit. Produksi A membutuhkan 2 jam dan 1 bahan, B
              membutuhkan 1 jam dan 2 bahan. Tuliskan model matematika (fungsi
              objektif dan sistem kendala) dari masalah tersebut dan tentukan
              kombinasi produk yang memberikan keuntungan maksimum.
            </>
          }
          options={[""]}
        />
      </div>

      <style jsx>{`
        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        /* HERO */
        .hero {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 18px;
        }
        .hero-left {
          background: var(--surface);
          border-radius: var(--radius);
          padding: 18px 18px 6px;
          box-shadow: var(--shadow-2);
        }
        .hero-title {
          margin: 0 0 10px;
          line-height: 1.15;
        }
        .hero-illustration {
          width: 140px;
          height: 140px;
          border-radius: 8px;
          background: radial-gradient(
              circle at 45% 35%,
              rgba(255, 255, 255, 0.7),
              rgba(0, 0, 0, 0.06)
            ),
            conic-gradient(
              from 90deg,
              #d8d8f4,
              #bcd0ff,
              #c7d2fe,
              #d8b4fe,
              #d8d8f4
            );
          border: 3px solid #eef2ff;
          box-shadow: var(--shadow-1);
        }
        .hero-right {
          display: grid;
          gap: 12px;
        }
        .panel {
          background: var(--surface);
          border-radius: var(--radius);
          box-shadow: var(--shadow-2);
          overflow: hidden;
        }
        .panel header {
          background: var(--primaryTint);
          color: #fff;
          padding: 10px 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .info {
          list-style: none;
          margin: 0;
          padding: 12px 14px;
          display: grid;
          gap: 10px;
        }
        .info li {
          display: grid;
          grid-template-columns: 24px 1fr;
          gap: 10px;
          align-items: start;
        }
        .info strong {
          display: block;
          margin-bottom: 3px;
        }

        /* Description */
        .desc {
          background: var(--surface);
          border-radius: var(--radius);
          box-shadow: var(--shadow-1);
          padding: 14px 16px;
          margin-top: 14px;
        }
        .desc h3 {
          margin: 0 0 6px;
        }

        .section-title {
          margin: 22px 0 10px;
        }

        /* Question list */
        .q-list {
          display: grid;
          gap: 18px;
        }

        @media (max-width: 900px) {
          .hero {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

function QuestionCard({
  number,
  points,
  prompt,
  image,
  options,
}: {
  number: number;
  points: number;
  prompt: React.ReactNode;
  image?: boolean;
  options: string[];
}) {
  return (
    <article className="q">
      <header className="q-head">
        <div className="q-title">Soal {number}</div>
        <div className="q-point">{points} Poin</div>
      </header>

      <div className="q-body">
        {image && <div className="q-img" aria-hidden />}
        <div className="q-text">{prompt}</div>
      </div>

      {options.length > 0 && (
        <div className="q-options">
          {options.map((o, i) =>
            o ? (
              <button key={i} className="opt">
                {String.fromCharCode(65 + i)}. {o}
              </button>
            ) : (
              <div key={i} className="blank" />
            )
          )}
        </div>
      )}

      <style jsx>{`
        .q {
          background: var(--surface);
          border: 1px solid #e6e8f5;
          border-radius: 14px;
          box-shadow: var(--shadow-1);
          padding: 14px 16px 16px;
        }
        .q-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .q-title {
          font-weight: 700;
        }
        .q-point {
          color: #6b7280;
          font-weight: 700;
        }
        .q-body {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 16px;
          align-items: start;
        }
        .q-img {
          width: 120px;
          height: 90px;
          border-radius: 8px;
          background: linear-gradient(135deg, #e5e7eb, #cbd5e1);
          box-shadow: inset 0 0 0 2px #fff;
        }
        .q-text {
          color: #1f2937;
          line-height: 1.55;
        }
        .q-options {
          margin-top: 12px;
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .opt {
          text-align: left;
          background: #eef2ff;
          border: 1px solid #d8d8f4;
          border-radius: 10px;
          padding: 10px 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .opt:hover {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(75, 90, 183, 0.15);
        }
        .blank {
          height: 36px;
          background: #f3f4f6;
          border-radius: 8px;
          border: 1px dashed #e5e7eb;
        }

        @media (max-width: 720px) {
          .q-body {
            grid-template-columns: 1fr;
          }
          .q-options {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </article>
  );
}