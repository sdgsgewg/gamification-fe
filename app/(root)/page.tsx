import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="font-sans text-gray-800">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <h1 className="text-xl font-bold text-indigo-600">GAMIFICATION</h1>
        <div className="flex gap-6">
          <a href="#" className="hover:text-indigo-600">Aktivitas</a>
          <a href="#" className="hover:text-indigo-600">Leaderboard</a>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg">Masuk</button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Daftar</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col md:flex-row items-center justify-between bg-indigo-50 px-8 py-16">
        <div className="max-w-lg">
          <h2 className="text-3xl font-bold mb-4">
            Buat Belajar Lebih Seru. <br /> Raih Nilai Lebih Tinggi.
          </h2>
          <p className="mb-6 text-gray-600">
            Sistem belajar berbasis game untuk kamu yang suka tantangan. 
            Kerjakan tugas, kumpulkan badge, dan dominasi leaderboard.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg">Mulai Sekarang</button>
            <button className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg">Lihat Fitur</button>
          </div>
        </div>
        <img
          src="/illustration-hero.svg"
          alt="Hero Illustration"
          className="mt-8 md:mt-0 md:w-1/2"
        />
      </section>

      {/* Cara Kerja */}
      <section className="px-8 py-16 text-center">
        <h3 className="text-2xl font-bold mb-6">Cara Kerja</h3>
        <p className="text-gray-600 mb-12">
          Kami senantiasa mendukung dan menyukseskan proses pembelajaran Anda. Berikut cara kerjanya.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {["Pilih pelajaran sesuai preferensi", "Kerjakan tugas yang tersedia", "Kumpulkan Poin & Badge", "Pantau progres & naik level"].map((text, i) => (
            <div key={i} className="p-6 bg-white rounded-xl shadow">
              <h4 className="text-lg font-bold mb-2">0{i + 1}</h4>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-16 bg-gray-50 text-center">
        <h3 className="text-2xl font-bold mb-6">Fitur Unggulan</h3>
        <p className="text-gray-600 mb-12">
          Kami berkomitmen untuk mendukung proses pembelajaran Anda melalui berbagai fitur unggulan.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Soal Lengkap & Relevan", "Leaderboard Global & Kelas", "Koleksi Badge", "Mini Game Edukatif", "Latihan Harian & Tantangan", "Kelas Interaktif"].map((title, i) => (
            <div key={i} className="p-6 bg-white rounded-xl shadow">
              <h4 className="font-bold text-lg mb-2">{title}</h4>
              <p className="text-gray-600">Deskripsi singkat fitur ini...</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="px-8 py-16 text-center">
        <h3 className="text-2xl font-bold mb-6">Leaderboard Terkini</h3>
        <p className="text-gray-600 mb-6">
          Jadikan proses belajar lebih seru dengan leaderboard!
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-xl shadow">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-2">Rank</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Poin</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rank: 1, name: "Dinda P.", points: 36700 },
                { rank: 2, name: "Arif W.", points: 34200 },
                { rank: 3, name: "Zahra I.", points: 33150 },
                { rank: 4, name: "Rafi A.", points: 32700 },
                { rank: 5, name: "Chika M.", points: 31800 },
              ].map((row) => (
                <tr key={row.rank} className="border-t">
                  <td className="px-4 py-2">{row.rank}</td>
                  <td className="px-4 py-2">{row.name}</td>
                  <td className="px-4 py-2">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
