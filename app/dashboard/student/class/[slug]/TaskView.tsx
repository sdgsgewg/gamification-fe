export default function TaskView() {
  const tasks = [
    { title: "Quiz Program Linear", type: "Quiz", status: "Turned In" },
    { title: "Tugas Fungsi dan Grafik", type: "Assignment", status: "Turned In" },
  ];

  return (
    <div className="task-view">
      <h2 className="heading">📚 Daftar Tugas</h2>

      <div className="tasks">
        {tasks.map((t) => (
          <article key={t.title} className={`card ${slugify(t.type)} ${statusClass(t.status)}`}>
            {/* left: icon + title */}
            <div className="left">
              <div className="icon-wrap" aria-hidden>
                {t.type === "Quiz" ? "📝" : "📄"}
              </div>
              <div className="text">
                <div className="title">{t.title}</div>
                <div className="type">{t.type}</div>
              </div>
            </div>

            {/* right: status + action */}
            <div className="right">
              <span className="status">{t.status}</span>
              <button className="cta" type="button" aria-label={`Lihat ${t.title}`}>
                Lihat
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                  <path d="M8 5l8 7-8 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </article>
        ))}
      </div>

      <style jsx>{`
        :root {
          --ink: #0f172a;
          --muted: #64748b;
          --card: #ffffff;
          --quizA: #a5b4ff;      /* Quiz accent */
          --quizB: #7c91ff;
          --assA: #c7d2fe;       /* Assignment accent */
          --assB: #9db2ff;
          --ok: #43c271;
          --warn: #f59e0b;
          --danger: #ef4444;
          --ring: rgba(91, 104, 255, 0.18);
          --shadow-1: 0 10px 26px rgba(0,0,0,.08);
        }

        .task-view { color: var(--ink); }
        .heading {
          font-size: 22px;
          font-weight: 800;
          margin: 0 0 14px;
          letter-spacing: .2px;
        }

        .tasks {
          display: grid;
          gap: 14px;
        }

        .card {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 12px;
          background: var(--card);
          border: 1px solid rgba(110,117,255,.12);
          border-radius: 14px;
          padding: 14px 16px;
          box-shadow: var(--shadow-1);
          position: relative;
          overflow: hidden;
          transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease;
        }
        .card::before {
          /* accent ribbon on the left */
          content: "";
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 6px;
          background: linear-gradient(180deg, var(--quizA), var(--quizB));
        }
        .card.assignment::before {
          background: linear-gradient(180deg, var(--assA), var(--assB));
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 34px rgba(0,0,0,.12);
          border-color: var(--ring);
        }

        .left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0; /* allow truncation */
        }
        .icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          font-size: 20px;
          background: #eef2ff;
          border: 1px solid #e0e7ff;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.5);
        }
        .assignment .icon-wrap { background: #f1f5ff; }

        .text {
          display: grid;
          gap: 2px;
          min-width: 0;
        }
        .title {
          font-weight: 700;
          font-size: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .type {
          color: var(--muted);
          font-size: 13px;
          font-weight: 600;
        }

        .right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .status {
          display: inline-block;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: .2px;
          padding: 6px 10px;
          border-radius: 999px;
          color: #fff;
          background: var(--ok);
          border: 1px solid rgba(0,0,0,.06);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.3);
        }
        .status.warning { background: var(--warn); }
        .status.danger { background: var(--danger); }

        .cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: #3f51b5;
          background: #eef2ff;
          border: 1px solid #e0e7ff;
          padding: 8px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: transform 120ms ease, background 120ms ease;
        }
        .cta:hover { transform: translateX(2px); background: #e6eaff; }

        @media (max-width: 640px) {
          .card { grid-template-columns: 1fr; gap: 10px; }
          .right { justify-content: flex-start; }
        }
      `}</style>
    </div>
  );
}

/* helpers */
function slugify(s: string) {
  return s.toLowerCase() === "quiz" ? "quiz" : "assignment";
}
function statusClass(s: string) {
  if (s.toLowerCase().includes("missing")) return "missing";
  if (s.toLowerCase().includes("past")) return "past";
  return "turned-in";
}