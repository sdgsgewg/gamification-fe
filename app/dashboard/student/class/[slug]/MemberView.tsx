export default function MemberView() {
  const members = [
    { name: "Alya Ramadhani", role: "Siswa" },
    { name: "Dimas Arya", role: "Siswa" },
    { name: "Pak Andi", role: "Guru" },
  ];

  return (
    <div className="member-view">
      <h2 className="heading">👥 Anggota Kelas</h2>
      <ul className="list">
        {members.map((m) => (
          <li
            key={m.name}
            className={`item ${m.role === "Guru" ? "teacher" : "student"}`}
          >
            <div className="avatar">{getInitials(m.name)}</div>
            <div className="info">
              <div className="name">{m.name}</div>
              <div className="role">{m.role}</div>
            </div>
          </li>
        ))}
      </ul>

      <style jsx>{`
        :root {
          --card-bg: #ffffff;
          --bg-alt: #f6f7fb;
          --ink: #111827;
          --muted: #6b7280;
          --brandA: #7486ff;
          --brandB: #9a7bff;
          --guruA: #f59e0b;
          --guruB: #fbbf24;
          --radius: 14px;
          --shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
        }

        .member-view {
          color: var(--ink);
        }

        .heading {
          font-size: 22px;
          font-weight: 800;
          margin: 0 0 16px;
          letter-spacing: 0.2px;
        }

        .list {
          list-style: none;
          padding: 0;
          display: grid;
          gap: 12px;
        }

        .item {
          display: flex;
          align-items: center;
          gap: 14px;
          background: var(--card-bg);
          border: 1px solid rgba(100, 110, 255, 0.12);
          border-radius: var(--radius);
          padding: 12px 16px;
          box-shadow: var(--shadow);
          transition: transform 120ms ease, box-shadow 120ms ease;
        }
        .item:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
        }

        .avatar {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-weight: 800;
          font-size: 18px;
          color: #fff;
          background: linear-gradient(135deg, var(--brandA), var(--brandB));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4),
            0 3px 8px rgba(0, 0, 0, 0.15);
        }

        .teacher .avatar {
          background: linear-gradient(135deg, var(--guruA), var(--guruB));
        }

        .info {
          display: grid;
          gap: 2px;
        }

        .name {
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.1px;
        }

        .role {
          font-size: 14px;
          font-weight: 600;
          color: var(--muted);
        }

        .teacher .role {
          color: var(--guruA);
        }

        @media (max-width: 640px) {
          .avatar {
            width: 42px;
            height: 42px;
            font-size: 16px;
          }
          .name {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}

function getInitials(name: string) {
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return (first + last).toUpperCase();
}