// app/dashboard/task/prep-pll/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

type DetailInfo = {
  subject: string;
  material: string;
  type: string;
  totalQuestions: number;
  gradeFor: string | number;
};
type TimeInfo = {
  start: string;
  end: string;
  duration: string;
};

const DETAIL: DetailInfo = {
  subject: "Matematika Wajib",
  material: "Program Linear Lanjutan",
  type: "Scheduled Quiz",
  totalQuestions: 20,
  gradeFor: 12,
};

const TIME: TimeInfo = {
  start: "1 November 2025 (13:00 WIB)",
  end: "1 November 2025 (14:00 WIB)",
  duration: "1 Jam",
};

const QUESTIONS = [
  {
    id: 1,
    point: 1,
    statement:
      "Seseorang ingin membeli dua jenis buah, apel dan jeruk. Harga apel Rp4.000/buah dan jeruk Rp3.000/buah. Ia hanya memiliki Rp30.000 dan ingin membeli paling sedikit 3 buah jeruk. Jika x adalah jumlah apel dan y adalah jumlah jeruk, manakah sistem pertidaksamaan yang tepat?",
    choices: [
      "4000x + 3000y ≥ 30000, y ≥ 3",
      "4000x + 3000y ≤ 30000, y ≥ 3",
      "4000x + 3000y ≤ 30000, y ≤ 3",
      "4000x + 3000y ≥ 30000, y ≤ 3",
      "x + y ≤ 30, y ≥ 3",
    ],
  },
  {
    id: 2,
    point: 1,
    statement:
      "Jika fungsi objektif maksimum Z = 3x + 4y memiliki nilai maksimum pada titik (2, 5), maka nilai maksimum dari Z adalah 26. Pernyataan ini Benar atau Salah?",
    choices: ["Benar", "Salah"],
  },
  {
    id: 3,
    point: 3,
    statement:
      "Diketahui sistem kendala: x + y ≤ 6, x ≥ 0, y ≥ 0. Jika fungsi objektif adalah Z = 5x + 2y, maka nilai maksimum dari Z adalah …",
    choices: [],
  },
  {
    id: 20,
    point: 15,
    statement:
      "Dina ingin memaksimalkan keuntungan dari menjual dua jenis produk A dan B. Produk A memberikan keuntungan Rp10.000/unit dan produk B Rp15.000/unit. Ia hanya memiliki 40 jam kerja dan bahan baku untuk 30 unit. Produksi A membutuhkan 2 jam dan 1 bahan, B membutuhkan 1 jam dan 2 bahan. Tuliskan model matematika (fungsi objektif dan sistem kendala) dari masalah tersebut dan tentukan kombinasi produk yang memberikan keuntungan maksimum.",
    choices: [],
  },
];

export default function PrepPLLPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F0EDF9] text-black">
      {/* Header brand only (no username / sidebar) */}
      <div className="h-16 bg-[#626BD9] flex items-center">
        <div className="container mx-auto px-6">
          <h1 className="text-white font-extrabold tracking-wide">GAMIFICATION</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Back + Share */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E6E2FB] hover:bg-[#dad5fb] border border-indigo-200"
          >
            ← Kembali
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6F78E9] text-white">
            ↗ Bagikan
          </button>
        </div>

        {/* Title */}
        <h2 className="mt-4 text-3xl font-extrabold">
          Quiz Prep Ujian Program Linear Lanjutan
        </h2>

        {/* Top section */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-[240px_1fr_360px] gap-6 items-start">
          {/* Illustration */}
          <div className="rounded-xl bg-white border border-indigo-200 h-48 grid place-items-center">
            <span className="text-5xl select-none">📈</span>
          </div>

          {/* Description */}
          <div className="rounded-xl bg-white border border-indigo-200 p-4">
            <div className="font-semibold mb-2">📝 Deskripsi</div>
            <p className="text-sm leading-relaxed">
              Kuis ini dirancang untuk membantu teman-teman memahami konsep dan
              penyelesaian soal-soal Program Linear Lanjutan. Tetap teliti, fokus,
              dan semangat dalam mengerjakannya!
            </p>
          </div>

          {/* Info cards */}
          <div className="space-y-4">
            <div className="rounded-xl bg-white border border-indigo-200 overflow-hidden">
              <div className="bg-[#6F78E9] text-white px-4 py-2 font-semibold">
                ℹ️ Informasi Detail
              </div>
              <div className="p-4 text-sm">
                <InfoRow label="Mata Pelajaran" value={DETAIL.subject} />
                <InfoRow label="Materi" value={DETAIL.material} />
                <InfoRow label="Tipe Tugas" value={DETAIL.type} />
                <InfoRow label="Jumlah Soal" value={`${DETAIL.totalQuestions}`} />
                <InfoRow label="Ditujukan Untuk Kelas" value={`${DETAIL.gradeFor}`} />
              </div>
            </div>

            <div className="rounded-xl bg-white border border-indigo-200 overflow-hidden">
              <div className="bg-[#6F78E9] text-white px-4 py-2 font-semibold">
                ⏱️ Waktu Pengerjaan
              </div>
              <div className="p-4 text-sm">
                <InfoRow label="Waktu Mulai" value={TIME.start} />
                <InfoRow label="Waktu Selesai" value={TIME.end} />
                <InfoRow label="Jangka Waktu" value={TIME.duration} />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-6 border-b border-indigo-200" />

        {/* Question list */}
        <h3 className="mt-6 text-xl font-bold">Daftar Soal</h3>
        <div className="mt-4 space-y-6">
          {QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="rounded-2xl bg-white border border-indigo-200 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="font-semibold">Soal {q.id}</div>
                <div className="text-sm opacity-80">{q.point} Poin</div>
              </div>

              <div className="mt-3 flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg bg-indigo-50 grid place-items-center">
                  📐
                </div>
                <p className="text-sm leading-relaxed flex-1">{q.statement}</p>
              </div>

              {q.choices.length > 0 && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.choices.map((c, i) => (
                    <button
                      key={i}
                      className="text-left px-4 py-3 rounded-lg bg-[#ECEAFC] hover:bg-[#E1DFFF] border border-indigo-200"
                    >
                      {String.fromCharCode(65 + i)}. {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-2">
      <div className="opacity-80">{label}</div>
      <div className="font-semibold text-right max-w-[60%]">{value}</div>
    </div>
  );
}