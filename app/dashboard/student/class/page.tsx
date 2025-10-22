"use client";

import Link from "next/link";

export default function ClassPage() {
  const joinedClasses = [
    {
      slug: "12e-sman-1",
      name: "Kelas 12E SMAN 1",
      subjectCount: 6,
      members: 28,
      color: "#8aa2ff", // base hue for the card’s gradient
    },
  ];

  return (
    <div className="cls-page">
      <div className="title-row">
        <h1 className="title">Kelas Saya</h1>
        <span className="count-chip">{joinedClasses.length} Kelas</span>
      </div>

      <div className="class-grid">
        {joinedClasses.map((cls) => (
          <Link
            href={`/dashboard/student/class/${cls.slug}`}
            key={cls.slug}
            className="card"
            style={
              {
                // tailor gradient per class
                //@ts-ignore
                "--gradA": cls.color,
                "--gradB": "rgba(118,129,255,0.85)",
              } as React.CSSProperties
            }
          >
            {/* gradient banner */}
            <div className="banner">
              <div className="avatar">{getInitials(cls.name)}</div>
              <div className="name">{cls.name}</div>
            </div>

            {/* meta row */}
            <div className="meta">
              <span className="chip">{cls.subjectCount} Mata Pelajaran</span>
              <span className="dot">•</span>
              <span className="chip">{cls.members} Anggota</span>
              <span className="spacer" />
              <span className="cta">
                Masuk Kelas
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M8 5l8 7-8 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        :root {
          --ink: #0f172a;
          --muted: #64748b;
          --bg: #f3f4fb;
          --card: #ffffff;
          --ring: rgba(80, 102, 255, 0.18);
          --shadow-1: 0 10px 30px rgba(0, 0, 0, 0.08);
          --shadow-2: 0 18px 40px rgba(98, 106, 255, 0.18);
        }

        .cls-page {
          max-width: 1040px;
          margin: 0 auto;
          padding: 32px 20px 80px;
          color: var(--ink);
          background:
            radial-gradient(1200px 600px at -10% -10%, #e9eaff 0%, transparent 60%),
            radial-gradient(1200px 700px at 110% -20%, #f5ecff 0%, transparent 60%);
          border-radius: 16px;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }

        .title {
          font-size: 36px;
          font-weight: 800;
          margin: 0;
          letter-spacing: 0.2px;
        }

        .count-chip {
          background: #eef2ff;
          color: #3949ab;
          border: 1px solid #e0e7ff;
          font-weight: 700;
          font-size: 13px;
          padding: 6px 10px;
          border-radius: 999px;
        }

        .class-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .card {
          display: block;
          text-decoration: none;
          color: inherit;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(109, 117, 255, 0.12);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow-1);
          transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
          position: relative;
          isolation: isolate;
        }
        .card::after {
          /* subtle shine on hover */
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            600px 200px at -10% 0%,
            rgba(255, 255, 255, 0.65),
            transparent 60%
          );
          opacity: 0;
          transition: opacity 200ms ease;
          pointer-events: none;
          z-index: 0;
        }
        .card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-2);
          border-color: var(--ring);
        }
        .card:hover::after {
          opacity: 1;
        }

        .banner {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 22px 24px;
          color: #fff;
          background: linear-gradient(135deg, var(--gradA), var(--gradB));
        }

        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(2px);
          display: grid;
          place-items: center;
          font-weight: 800;
          letter-spacing: 0.5px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35),
            0 2px 10px rgba(0, 0, 0, 0.12);
        }
        .name {
          font-weight: 800;
          font-size: 20px;
          line-height: 1.15;
          text-shadow: 0 1px 0 rgba(0, 0, 0, 0.12);
        }

        .meta {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px 16px;
          background: linear-gradient(180deg, #ffffff 0%, #fafbff 100%);
        }
        .chip {
          background: #f1f5ff;
          color: #3949ab;
          border: 1px solid #e0e7ff;
          padding: 6px 10px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 13px;
        }
        .dot {
          color: var(--muted);
        }
        .spacer {
          flex: 1;
        }
        .cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: #3f51b5;
          background: #eef2ff;
          border: 1px solid #e0e7ff;
          padding: 6px 10px;
          border-radius: 999px;
          transition: transform 120ms ease, background 120ms ease;
        }
        .card:hover .cta {
          background: #e6eaff;
          transform: translateX(2px);
        }

        @media (max-width: 720px) {
          .title {
            font-size: 28px;
          }
          .banner {
            padding: 18px;
          }
          .name {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}

function getInitials(name: string) {
  const parts = name.split(" ");
  const first = parts[1]?.replace(/\D/g, "") || parts[0]?.[0] || "C";
  // For something like "Kelas 12E SMAN 1" we want "12E"
  const match = name.match(/\b(\d+\w?)\b/);
  return match ? match[1] : first.toUpperCase();
}