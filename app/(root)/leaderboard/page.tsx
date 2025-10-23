import React from "react";
import { withMetadata } from "@/app/utils/withMetadata";

export const metadata = withMetadata(
  "Leaderboard",
  "Halaman tentang leaderboard pengguna"
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
    { rank: 6, name: "Rizky Maulana", points: 10200, image: "/avatar6.png" },
    { rank: 7, name: "Lia Rahmawati", points: 9800, image: "/avatar7.png" },
    { rank: 8, name: "Hendra Gunawan", points: 9500, image: "/avatar8.png" },
    { rank: 9, name: "Putri Anjani", points: 9300, image: "/avatar9.png" },
    { rank: 10, name: "Fajar Setiawan", points: 9000, image: "/avatar10.png" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col">
      <main className="container mx-auto flex-1 py-12 px-6">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-10">
          🌟 Leaderboard Pengguna
        </h1>

        {/* Top 3 Section */}
        <div className="flex justify-center items-end space-x-6 mb-16">
          {topThree.map((person, index) => (
            <div
              key={index}
              className={`relative flex flex-col items-center transition-transform hover:scale-105 ${
                index === 0 ? "order-2" : index === 1 ? "order-1" : "order-3"
              }`}
            >
              {/* Podium */}
              <div
                className={`flex flex-col items-center justify-end rounded-2xl shadow-xl backdrop-blur-md bg-white/40 p-5 ${
                  index === 0
                    ? "h-64 w-40 border-4 border-yellow-400"
                    : index === 1
                    ? "h-56 w-36 border-4 border-gray-300"
                    : "h-52 w-32 border-4 border-amber-600"
                }`}
              >
                <span className="text-4xl mb-2">{person.medal}</span>
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg mb-2"
                />
                <p className="font-bold text-center text-sm text-gray-800">
                  {person.name}
                </p>
                <span className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-semibold">
                  {person.points.toLocaleString()} pts
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden">
          <table className="w-full border-collapse text-gray-800">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <th className="py-3 px-4 text-left font-semibold">🏅 Rank</th>
                <th className="py-3 px-4 text-left font-semibold">👤 Nama</th>
                <th className="py-3 px-4 text-left font-semibold">🔥 Poin</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-blue-700">{user.rank}</td>
                  <td className="py-3 px-4 flex items-center space-x-3">
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-blue-300"
                    />
                    <span>{user.name}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-blue-800">
                    {user.points.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;