export default function ClassLeaderboardView() {
  const data = [
    { rank: 1, name: "Alya Ramadhani", points: 125000 },
    { rank: 2, name: "Dimas Arya", points: 120000 },
    { rank: 3, name: "Siti Nurhaliza", points: 115000 },
    { rank: 4, name: "Rafi Maulana", points: 110000 },
    { rank: 5, name: "Nadia Putri", points: 108000 },
  ];

  return (
    <div className="leaderboard">
      <h2 className="heading">🏆 Leaderboard Kelas</h2>

      {/* Top 3 Highlight */}
      <div className="podium">
        {data.slice(0, 3).map((d) => (
          <div
            key={d.rank}
            className={`podium-card rank-${d.rank}`}
            title={`Rank ${d.rank}`}
          >
            <div className="avatar">{getInitials(d.name)}</div>
            <div className="p-name">{d.name}</div>
            <div className="p-points">{d.points.toLocaleString()} pts</div>
            <div className="medal">{getMedal(d.rank)}</div>
          </div>
        ))}
      </div>

      {/* Table for the rest */}
      <div className="table">
        <div className="head">
          <div>#</div>
          <div>Nama</div>
          <div>Poin</div>
        </div>
        {data.slice(3).map((d) => (
          <div className="row" key={d.rank}>
            <div>{d.rank}</div>
            <div>{d.name}</div>
            <div>{d.points.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <style jsx>{`
        :root {
          --ink: #0f172a;
          --muted: #64748b;
          --bg: #f6f7fb;
          --goldA: #ffefb0;
          --goldB: #e6c45e;
          --silverA: #e6e9ef;
          --silverB: #cfd5de;
          --bronzeA: #f4d3b0;
          --bronzeB: #c98b4f;
          --brandA: #7486ff;
          --brandB: #9a7bff;
          --shadow-1: 0 10px 26px rgba(0, 0, 0, 0.08);
        }

        .leaderboard {
          color: var(--ink);
        }

        .heading {
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* PODIUM */
        .podium {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }
        .podium-card {
          background: #fff;
          border-radius: 14px;
          text-align: center;
          padding: 16px 10px 18px;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-1);
          transition: transform 150ms ease, box-shadow 150ms ease;
        }
        .podium-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.12);
        }
        .avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin: 0 auto 10px;
          display: grid;
          place-items: center;
          font-weight: 800;
          color: #fff;
          font-size: 20px;
          background: linear-gradient(135deg, var(--brandA), var(--brandB));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5),
            0 3px 8px rgba(0, 0, 0, 0.15);
        }
        .p-name {
          font-weight: 700;
          margin-bottom: 4px;
        }
        .p-points {
          color: var(--muted);
          font-size: 14px;
          font-weight: 600;
        }
        .medal {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 24px;
          text-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
        }
        .rank-1 .avatar {
          background: linear-gradient(135deg, var(--goldA), var(--goldB));
          color: #7a6300;
        }
        .rank-2 .avatar {
          background: linear-gradient(135deg, var(--silverA), var(--silverB));
          color: #334155;
        }
        .rank-3 .avatar {
          background: linear-gradient(135deg, var(--bronzeA), var(--bronzeB));
          color: #5c3b00;
        }

        /* TABLE */
        .table {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: var(--shadow-1);
        }
        .head {
          display: grid;
          grid-template-columns: 80px 1fr 120px;
          padding: 12px 16px;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(90deg, var(--brandA), var(--brandB));
        }
        .row {
          display: grid;
          grid-template-columns: 80px 1fr 120px;
          padding: 12px 16px;
          align-items: center;
          border-top: 1px solid #e5e7eb;
          font-weight: 600;
          color: var(--ink);
        }
        .row:nth-child(even) {
          background: var(--bg);
        }
        .row:hover {
          background: #eef2ff;
        }

        @media (max-width: 640px) {
          .podium {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

/* --- helpers --- */
function getInitials(name: string) {
  const parts = name.split(" ");
  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return (first + last).toUpperCase();
}

function getMedal(rank: number) {
  switch (rank) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return "";
  }
}