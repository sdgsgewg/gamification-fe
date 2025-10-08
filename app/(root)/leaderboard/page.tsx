import { withMetadata } from "@/app/utils/withMetadata";
import React from "react";

export const metadata = withMetadata(
  "Leaderboard",
  "Halaman tentang leaderboard pegguna"
);

const LeaderboardPage = () => {
  const topThree = [
    { name: "Susi Pudjianti", points: 12500, medal: "🥇", image: "/avatar1.png" },
    { name: "Angel Wicaksono", points: 12000, medal: "🥈", image: "/avatar2.png" },
    { name: "Siti Nurhalizah", points: 11500, medal: "🥉", image: "/avatar3.png" },
  ];

  const leaderboard = [
    { rank: 4, name: "Caca Permata Sari", points: 11000, image: "/avatar4.png" },
    { rank: 5, name: "Kevin Wijaya", points: 10500, image: "/avatar5.png" },
    { rank: 6, name: "Caca Permata Sari", points: 11000, image: "/avatar4.png" },
    { rank: 7, name: "Kevin Wijaya", points: 10500, image: "/avatar5.png" },
    { rank: 8, name: "Caca Permata Sari", points: 11000, image: "/avatar4.png" },
    { rank: 9, name: "Kevin Wijaya", points: 10500, image: "/avatar5.png" },
    { rank: 10, name: "Caca Permata Sari", points: 11000, image: "/avatar4.png" },
    { rank: 11, name: "Kevin Wijaya", points: 10500, image: "/avatar5.png" },
    { rank: 12, name: "Caca Permata Sari", points: 11000, image: "/avatar4.png" },
    { rank: 13, name: "Kevin Wijaya", points: 10500, image: "/avatar5.png" },
    { rank: 14, name: "Caca Permata Sari", points: 11000, image: "/avatar4.png" },
    { rank: 15, name: "Kevin Wijaya", points: 10500, image: "/avatar5.png" },
    { rank: 16, name: "Caca Permata Sari", points: 11000, image: "/avatar4.png" },
    { rank: 17, name: "Kevin Wijaya", points: 10500, image: "/avatar5.png" },
    { rank: 18, name: "Caca Permata Sari", points: 11000, image: "/avatar4.png" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <nav className="flex space-x-8">
          <a href="#" className="font-bold text-blue-600">GAMIFICATION</a>
          <a href="#">Aktivitas</a>
          <a href="#">Leaderboard</a>
          <a href="#">Kelas Saya</a>
        </nav>
        <div className="flex items-center space-x-3">
          <img
            src="/avatar-user.png"
            alt="User"
            className="w-10 h-10 rounded-full border"
          />
          <div>
            <p className="text-sm font-semibold">Halo, Jessen</p>
            <p className="text-xs text-gray-500">20000 / 38000 XP</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto flex-1 py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Top 3 */}
          <div className="flex justify-center items-end space-x-6">
            {topThree.map((person, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-end ${
                  index === 0 ? "order-2" : index === 1 ? "order-1" : "order-3"
                }`}
              >
                <div className="w-32 h-52 bg-gradient-to-t from-yellow-400 to-yellow-100 rounded-lg flex flex-col items-center justify-end p-3 shadow">
                  <span className="text-3xl">{person.medal}</span>
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-16 h-16 rounded-full my-2"
                  />
                  <p className="font-bold text-center text-sm text-black">{person.name}</p>
                  <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 mt-2 text-xs font-semibold">
                    {person.points}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Leaderboard Table */}
          <div>
            <table className="w-full border-collapse text-black">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="py-2 px-3 text-left">Rank</th>
                  <th className="py-2 px-3 text-left">Nama</th>
                  <th className="py-2 px-3 text-left">Poin</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-0 hover:bg-gray-100"
                  >
                    <td className="py-2 px-3">{user.rank}</td>
                    <td className="py-2 px-3 flex items-center space-x-2">
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{user.name}</span>
                    </td>
                    <td className="py-2 px-3">{user.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;