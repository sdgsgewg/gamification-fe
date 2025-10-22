"use client";

// app/page.tsx — one file, client component, no external CSS files needed.

const rows = Array.from({ length: 15 }).map((_, i) => ({
  rank: i + 4,
  name: i % 2 === 0 ? "Kelas 12D SMAN 1" : "Kelas 12E SMAN 1",
  points: i % 2 === 0 ? 110000 : 105000,
}));

export default function Page() {
  return (
    <div>
      <main className="wrap">
        <h1 className="title">Leaderboard Antar Kelas</h1>

        <div className="content">
          {/* LEFT: Podiums */}
          <section className="podiums">
            <div className="podium gold">
              <div className="medal">🥇</div>
              <div className="class-photo" />
              <div className="class-name">
                Kelas 12A
                <br />
                SMAN 1
              </div>
              <div className="points">
                <span>🪙</span>125000
              </div>
            </div>

            <div className="podium silver">
              <div className="medal">🥈</div>
              <div className="class-photo" />
              <div className="class-name">
                Kelas 12B
                <br />
                SMAN 1
              </div>
              <div className="points">
                <span>🪙</span>120000
              </div>
            </div>

            <div className="podium bronze">
              <div className="medal">🥉</div>
              <div className="class-photo" />
              <div className="class-name">
                Kelas 12C
                <br />
                SMAN 1
              </div>
              <div className="points">
                <span>🪙</span>115000
              </div>
            </div>
          </section>

          {/* RIGHT: Table */}
          <section className="table-card">
            <div className="table-header">
              <div>Rank</div>
              <div>Nama</div>
              <div className="right">Poin</div>
            </div>

            <div className="table-body">
              {rows.map((r) => (
                <div className="row" key={r.rank}>
                  <div className="c-rank">{r.rank}</div>
                  <div className="c-name">
                    <div className="avatar" />
                    <span>{r.name}</span>
                  </div>
                  <div className="c-points">{r.points}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Global styles (Inter font via CSS import) */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

        :root {
          --bg: #efecf6;
          --card: #ffffff;
          --ink: #111827;
          --muted: #6b7280;
          --primary: #5361ff;
          --gold1: #ffe9a8;
          --gold2: #e6c26b;
          --silver1: #eef1f5;
          --silver2: #c9d0dc;
          --bronze1: #f4e0c8;
          --bronze2: #c48b56;
          --tableHead: #4b5ab7;
          --tableHeadInk: #fff;
          --row: #f6f7fb;
          --divider: #e5e7eb;
          --shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
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
            Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          color: var(--ink);
          background: var(--bg);
        }
        .wrap {
          max-width: 920px;
          margin: 0 auto;
          padding: 28px 20px 56px;
        }
        .title {
          font-size: 34px;
          line-height: 1.2;
          margin: 0 0 18px;
          font-weight: 800;
        }
        .content {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 24px;
          align-items: start;
        }

        /* Podiums */
        .podiums {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .podium {
          border-radius: 6px;
          padding: 18px 14px;
          min-height: 520px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          position: relative;
          box-shadow: var(--shadow);
          overflow: hidden;
        }
        .podium::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 120px;
          opacity: 0.75;
          background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.06));
        }
        .podium .medal {
          font-size: 56px;
          margin: 10px 0 24px;
        }
        .class-photo {
          width: 92px;
          height: 92px;
          border-radius: 50%;
          background: radial-gradient(
              circle at 60% 35%,
              rgba(255, 255, 255, 0.65),
              rgba(0, 0, 0, 0.08)
            ),
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='92' height='92'><rect width='92' height='92' rx='46' fill='%23d1d5db'/><text x='50%' y='54%' font-size='20' text-anchor='middle' fill='%236b7280' font-family='Inter, Arial'>IMG</text></svg>")
              center/cover no-repeat;
          border: 3px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
          margin-bottom: 18px;
        }
        .class-name {
          text-align: center;
          font-weight: 700;
          margin-bottom: auto;
          line-height: 1.3;
        }
        .points {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #5560df;
          color: #fff;
          padding: 8px 12px;
          border-radius: 18px;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }
        .points span {
          filter: drop-shadow(0 1px 0 rgba(0, 0, 0, 0.2));
        }
        .gold {
          background: linear-gradient(180deg, var(--gold1), var(--gold2));
        }
        .silver {
          background: linear-gradient(180deg, var(--silver1), var(--silver2));
        }
        .bronze {
          background: linear-gradient(180deg, var(--bronze1), var(--bronze2));
        }

        /* Table */
        .table-card {
          background: var(--card);
          border-radius: 8px;
          box-shadow: var(--shadow);
          overflow: hidden;
        }
        .table-header {
          display: grid;
          grid-template-columns: 100px 1fr 140px;
          background: var(--tableHead);
          color: var(--tableHeadInk);
          font-weight: 700;
          padding: 12px 16px;
        }
        .table-header .right {
          text-align: right;
        }
        .table-body .row {
          display: grid;
          grid-template-columns: 100px 1fr 140px;
          align-items: center;
          padding: 10px 16px;
          background: #fff;
          border-bottom: 1px solid var(--divider);
        }
        .table-body .row:nth-child(even) {
          background: var(--row);
        }
        .c-name {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #d1d5db;
          box-shadow: inset 0 0 0 2px #fff, 0 0 0 1px #d1d5db;
          flex-shrink: 0;
        }
        .c-points {
          text-align: right;
          font-weight: 600;
        }
        .c-rank {
          font-weight: 600;
        }

        /* Responsive */
        @media (max-width: 880px) {
          .content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}