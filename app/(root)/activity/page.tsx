import { withMetadata } from "@/app/utils/withMetadata";
import React from "react";

export const metadata = withMetadata(
  "Aktivitas",
  "Halaman tentang aktivitas dalam website"
);

const ActivityPage = () => {
  const topActivities = [
    { id: 1, title: "Lat Mandiri: Bab 3", type: "SELF PRACTICE", subject: "Fisika", questions: 15, button: "Mulai" },
    { id: 2, title: "Quiz Bab 3", type: "QUIZ", subject: "Biologi", questions: 30, button: "Mulai" },
    { id: 3, title: "Tryout Akhir Tahun", type: "TRYOUT", subject: "Matematika Wajib", questions: 40, button: "Kerjakan" },
    { id: 4, title: "Tebak Gambar", type: "MINI GAME", subject: "Kimia", questions: 20, button: "Main" },
  ];

  const latestActivities = [
    { id: 5, title: "Lat Mandiri: Bab 4", type: "SELF PRACTICE", subject: "Matematika Wajib", questions: 15, button: "Mulai" },
    { id: 6, title: "Quiz Bab 4", type: "QUIZ", subject: "Matematika Peminatan", questions: 30, button: "Mulai" },
    { id: 7, title: "Tryout Akhir Tahun", type: "TRYOUT", subject: "Fisika", questions: 40, button: "Kerjakan" },
    { id: 8, title: "Tebak Gambar", type: "MINI GAME", subject: "Biologi", questions: 20, button: "Main" },
    { id: 9, title: "Lat Mandiri: Bab 4", type: "SELF PRACTICE", subject: "Kimia", questions: 16, button: "Mulai" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <nav className="flex space-x-8">
          <a href="#" className="font-bold text-blue-600">GAMIFICATION</a>
          <a href="#">Aktivitas</a>
          <a href="#">Leaderboard</a>
        </nav>
        <div className="flex space-x-3">
          <button className="px-4 py-1 text-sm rounded text-blue-600 border border-blue-600">
            Masuk
          </button>
          <button className="px-4 py-1 text-sm rounded bg-blue-600 text-white">
            Daftar
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-64 flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-bold">Aktivitas Belajar</h1>
          <p className="mt-2">Temukan berbagai tugas, quiz, dan game seru!</p>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <select className="px-3 py-2 rounded border text-black">
              <option>Mata Pelajaran</option>
            </select>
            <select className="px-3 py-2 rounded border text-black">
              <option>Tipe Aktivitas</option>
            </select>
            <select className="px-3 py-2 rounded border text-black">
              <option>Kelas</option>
            </select>
            <div className="flex">
              <input
                type="text"
                placeholder="Cari aktivitas..."
                className="px-3 py-2 rounded-l border text-black"
              />
              <button className="bg-blue-600 text-white px-3 rounded-r">
                🔍
              </button>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Terapkan Filter
            </button>
          </div>
        </div>
      </section>

      {/* Top 10 Aktivitas */}
      <main className="container mx-auto py-10 px-6 flex-1">
        <h2 className="text-xl font-bold mb-6">Top 10 Aktivitas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {topActivities.map((activity, index) => (
            <div
              key={activity.id}
              className="relative bg-white p-4 rounded-lg shadow text-black"
            >
              <span className="absolute -top-3 -left-3 text-4xl font-bold text-gray-400">
                {index + 1}
              </span>
              <span className="text-xs font-bold text-blue-600">
                {activity.type}
              </span>
              <div className="mt-2">
                <img
                  src="/activity-placeholder.png"
                  alt={activity.title}
                  className="w-full h-32 object-cover rounded"
                />
              </div>
              <h3 className="mt-3 font-semibold">{activity.title}</h3>
              <p className="text-sm text-gray-600">{activity.subject}</p>
              <p className="text-sm text-gray-600">{activity.questions} Soal</p>
              <button className="mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded">
                {activity.button}
              </button>
            </div>
          ))}
        </div>

        {/* Aktivitas Terbaru */}
        <h2 className="text-xl font-bold mt-10 mb-6">Aktivitas Terbaru</h2>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {latestActivities.map((activity) => (
            <div
              key={activity.id}
              className="min-w-[200px] bg-white p-4 rounded-lg shadow text-black"
            >
              <span className="text-xs font-bold text-blue-600">
                {activity.type}
              </span>
              <div className="mt-2">
                <img
                  src="/activity-placeholder.png"
                  alt={activity.title}
                  className="w-full h-28 object-cover rounded"
                />
              </div>
              <h3 className="mt-3 font-semibold">{activity.title}</h3>
              <p className="text-sm text-gray-600">{activity.subject}</p>
              <p className="text-sm text-gray-600">{activity.questions} Soal</p>
              <button className="mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded">
                {activity.button}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ActivityPage;