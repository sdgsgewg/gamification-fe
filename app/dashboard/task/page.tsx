"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { auth } from "@/app/functions/AuthProvider"; // sudah ada di project-mu

// ========================
// Shared types (Student/Teacher list)
// ========================
type Task = {
  id: string;
  title: string;
  type:
    | "Exam Preparation"
    | "Review Quiz"
    | "Live Quiz"
    | "Assignment"
    | "Grading"
    | "Management";
  status:
    | "Turned In"
    | "Due Soon"
    | "Overdue"
    | "Open"
    | "Needs Grading"
    | "Closed";
  dateLabel: string; // e.g., "Jan 8, 2024 – Monday"
};

type User = { id: string; name: string; role: { name: string } };

enum Role {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  GUEST = "GUEST",
}

// ========================
// Seed data per role (mock untuk Student/Teacher/Admin-simple)
// ========================
const STUDENT_TASKS: Task[] = [
  {
    id: "prep-pll",
    title: "Quiz Prep Ujian Program Linear Lanjutan",
    type: "Exam Preparation",
    status: "Turned In",
    dateLabel: "Jan 8, 2024 – Monday",
  },
  {
    id: "review-stat-inferensial",
    title: "Review Quiz Statistika Inferensial",
    type: "Review Quiz",
    status: "Turned In",
    dateLabel: "Jan 8, 2024 – Monday",
  },
  {
    id: "live-quiz-peluang-bersyarat",
    title: "Live Quiz Peluang Bersyarat",
    type: "Live Quiz",
    status: "Turned In",
    dateLabel: "Jan 8, 2024 – Monday",
  },
  {
    id: "tugas-fungsi-grafik",
    title: "Tugas Fungsi dan Grafik",
    type: "Assignment",
    status: "Turned In",
    dateLabel: "Jan 8, 2024 – Monday",
  },
];

const TEACHER_TASKS: Task[] = [
  {
    id: "open-quiz-trigonometri",
    title: "Live Quiz Trigonometri (XII IPA 1)",
    type: "Live Quiz",
    status: "Open",
    dateLabel: "Jan 8, 2024 – Monday",
  },
  {
    id: "grading-statistika",
    title: "Penilaian: Review Quiz Statistika",
    type: "Grading",
    status: "Needs Grading",
    dateLabel: "Jan 8, 2024 – Monday",
  },
  {
    id: "tugas-vektor",
    title: "Tugas Vektor Bab 2 (Semua Kelas)",
    type: "Assignment",
    status: "Open",
    dateLabel: "Jan 8, 2024 – Monday",
  },
];

// ========================
// Base List (dipakai Student/Teacher – ADA top brand bar, sesuai kode kamu)
// ========================
function TasksList({
  initialTab = "UPCOMING",
  tasksSeed,
  title = "Daftar Tugas",
}: {
  initialTab?: "UPCOMING" | "PAST_DUE" | "COMPLETED";
  tasksSeed: Task[];
  title?: string;
}) {
  const [tab, setTab] = useState<"UPCOMING" | "PAST_DUE" | "COMPLETED">(
    initialTab
  );
  const [q, setQ] = useState("");

  const tasks = useMemo(() => {
    return tasksSeed.filter((t) =>
      t.title.toLowerCase().includes(q.trim().toLowerCase())
    );
  }, [q, tasksSeed]);

  // group by date
  const groups = useMemo(() => {
    const m = new Map<string, Task[]>();
    for (const t of tasks) {
      const arr = m.get(t.dateLabel) ?? [];
      arr.push(t);
      m.set(t.dateLabel, arr);
    }
    return Array.from(m.entries());
  }, [tasks]);

  const chipClass = (status: Task["status"]) => {
    switch (status) {
      case "Turned In":
        return "bg-[#65C37A]";
      case "Due Soon":
        return "bg-amber-500";
      case "Overdue":
        return "bg-rose-500";
      case "Open":
        return "bg-indigo-500";
      case "Needs Grading":
        return "bg-purple-500";
      case "Closed":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EDF9] text-black">
      {/* Top brand bar */}
      <div className="h-16 bg-[#626BD9] flex items-center">
        <div className="container mx-auto px-6">
          <h1 className="text-white font-extrabold tracking-wide">
            GAMIFICATION
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Title + divider */}
        <h2 className="text-3xl font-extrabold">{title}</h2>
        <div className="mt-3 border-b border-indigo-200" />

        {/* Tabs + Search */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-6">
            {[
              { key: "UPCOMING", label: "Upcoming" },
              { key: "PAST_DUE", label: "Past Due" },
              { key: "COMPLETED", label: "Completed" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as any)}
                className={`pb-1 font-semibold ${
                  tab === (t.key as any)
                    ? "border-b-2 border-indigo-500"
                    : "opacity-70"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3 w-full max-w-xl">
            <input
              type="text"
              placeholder="Cari berdasarkan nama..."
              className="flex-1 px-4 py-2 rounded-lg bg-white border border-indigo-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="h-10 w-10 rounded-lg bg-[#6F78E9] text-white grid place-items-center">
              🔍
            </button>
            <button className="h-10 w-10 rounded-lg bg-[#6F78E9] text-white grid place-items-center">
              ⚙️
            </button>
          </div>
        </div>

        {/* List */}
        <div className="mt-6 space-y-6">
          {groups.map(([date, items]) => (
            <div key={date}>
              <div className="text-sm opacity-80 mb-3">{date}</div>
              <div className="space-y-4">
                {items.map((t) => (
                  <Link key={t.id} href={`/dashboard/task/${t.id}`} className="block">
                    <div className="bg-[#DCD6FB]/70 hover:bg-[#DCD6FB] transition-colors rounded-xl border border-indigo-200 px-5 py-4 relative">
                      <div className="pr-44">
                        <div className="font-semibold">{t.title}</div>
                        <div className="text-sm opacity-80">{t.type}</div>
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <span
                          className={`inline-flex items-center rounded-full ${chipClass(
                            t.status
                          )} text-white text-sm px-4 py-1`}
                        >
                          {t.status}
                        </span>
                        <div className="text-sm opacity-80 mt-2 text-right">
                          Submited At….
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination (mock) */}
        <div className="flex justify-center items-center gap-2 mt-10">
          <button className="px-3 py-1 border rounded bg-white">◀</button>
          <button className="px-3 py-1 border rounded bg-[#626BD9] text-white">
            1
          </button>
          <button className="px-3 py-1 border rounded bg-white">2</button>
          <button className="px-3 py-1 border rounded bg-white">▶</button>
        </div>
      </div>
    </div>
  );
}

// ========================
// ADMIN VIEW (LIST + CREATE + BUILDER SOAL) – TANPA header/sidebar, sesuai layout global kamu
// ========================
type AdminTask = {
  id: string;
  title: string;
  subject: string;
  material?: string;
  type: "Tryout" | "Live Quiz" | "Assignment";
  questions: Question[];
};
type Question = {
  id: string;
  text: string;
  a: string;
  b: string;
  c: string;
  d: string;
  answer: "A" | "B" | "C" | "D";
  imageFile?: File | null;
};

const SUBJECT_OPTIONS = [
  "Matematika Wajib",
  "Matematika Peminatan",
  "Fisika",
  "Kimia",
];
const MATERIAL_OPTIONS = [
  "Trigonometri",
  "Statistika",
  "Peluang",
  "Program Linear",
];
const TYPE_OPTIONS: AdminTask["type"][] = ["Tryout", "Live Quiz", "Assignment"];

const AdminTasksView: React.FC = () => {
  const [mode, setMode] = useState<"LIST" | "CREATE">("LIST");
  const [q, setQ] = useState("");
  const [tasks, setTasks] = useState<AdminTask[]>([
    {
      id: "1",
      title: "Prep UTS MTK 2025",
      subject: "Matematika Wajib",
      type: "Tryout",
      questions: Array.from({ length: 50 }).map((_, i) => ({
        id: `q1-${i + 1}`,
        text: `Contoh soal ${i + 1}`,
        a: "Pilihan A",
        b: "Pilihan B",
        c: "Pilihan C",
        d: "Pilihan D",
        answer: "A",
      })),
    },
    {
      id: "2",
      title: "Prep UAS MTK 2025",
      subject: "Matematika Wajib",
      type: "Tryout",
      questions: Array.from({ length: 50 }).map((_, i) => ({
        id: `q2-${i + 1}`,
        text: `Contoh soal ${i + 1}`,
        a: "Pilihan A",
        b: "Pilihan B",
        c: "Pilihan C",
        d: "Pilihan D",
        answer: "B",
      })),
    },
  ]);

  // ===== LIST =====
  if (mode === "LIST") {
    const filtered = tasks.filter((t) =>
      t.title.toLowerCase().includes(q.trim().toLowerCase())
    );

    return (
      <div className="p-6 text-black">
        <h2 className="text-3xl font-extrabold">Daftar Tugas</h2>
        <div className="mt-3 border-b border-indigo-200" />

        {/* actions */}
        <div className="mt-5 flex items-center gap-4">
          <button
            onClick={() => setMode("CREATE")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6F78E9] text-white hover:brightness-110"
          >
            <span className="text-lg leading-none">＋</span> Tambah
          </button>

          <div className="ml-auto flex items-center gap-3 w-full max-w-2xl">
            <input
              type="text"
              placeholder="Cari berdasarkan nama..."
              className="flex-1 px-4 py-2 rounded-lg bg-white border border-indigo-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="h-10 w-10 rounded-lg bg-[#6F78E9] text-white grid place-items-center">
              🔍
            </button>
          </div>
        </div>

        {/* table */}
        <div className="mt-6 bg-white rounded-xl border border-indigo-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-indigo-50 text-sm">
              <tr>
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">Tipe</th>
                <th className="py-3 px-4">Mata Pelajaran</th>
                <th className="py-3 px-4">Jumlah Soal</th>
                <th className="py-3 px-4 w-40">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, idx) => (
                <tr
                  key={t.id}
                  className="border-t border-indigo-100 hover:bg-indigo-50/40"
                >
                  <td className="py-3 px-4">{idx + 1}</td>
                  <td className="py-3 px-4">{t.title}</td>
                  <td className="py-3 px-4">{t.type}</td>
                  <td className="py-3 px-4">{t.subject}</td>
                  <td className="py-3 px-4">{t.questions.length}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        title="Lihat"
                        className="h-8 w-8 grid place-items-center rounded bg-blue-500 text-white"
                        onClick={() => alert(`Preview: ${t.title}`)}
                      >
                        👁️
                      </button>
                      <button
                        title="Edit"
                        className="h-8 w-8 grid place-items-center rounded bg-amber-400 text-white"
                        onClick={() =>
                          alert("Implement edit page/flow sesuai kebutuhan")
                        }
                      >
                        ✏️
                      </button>
                      <button
                        title="Hapus"
                        className="h-8 w-8 grid place-items-center rounded bg-rose-500 text-white"
                        onClick={() =>
                          setTasks((prev) => prev.filter((x) => x.id !== t.id))
                        }
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* pagination mock */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button className="px-3 py-1 rounded border bg-white">◀</button>
          <button className="px-3 py-1 rounded border bg-[#626BD9] text-white">
            1
          </button>
          <button className="px-3 py-1 rounded border bg-white">2</button>
          <button className="px-3 py-1 rounded border bg-white">▶</button>
        </div>
      </div>
    );
  }

  // ===== CREATE =====
  return (
    <CreateTaskView
      onCancel={() => setMode("LIST")}
      onCreate={(payload) => {
        setTasks((prev) => [
          ...prev,
          {
            id: `${Date.now()}`,
            title: payload.title,
            subject: payload.subject,
            material: payload.material,
            type: payload.type,
            questions: payload.questions,
          },
        ]);
        setMode("LIST");
      }}
    />
  );
};

const CreateTaskView: React.FC<{
  onCancel: () => void;
  onCreate: (task: {
    title: string;
    description?: string;
    subject: string;
    material?: string;
    type: AdminTask["type"];
    cover?: File | null;
    questions: Question[];
  }) => void;
}> = ({ onCancel, onCreate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0] || "");
  const [material, setMaterial] = useState<string>("");
  const [type, setType] = useState<AdminTask["type"]>("Tryout");
  const [cover, setCover] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: "",
        a: "",
        b: "",
        c: "",
        d: "",
        answer: "A",
        imageFile: null,
      },
    ]);
  };
  const updateQuestion = (id: string, patch: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...patch } : q))
    );
  };
  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Judul wajib diisi");
    if (!subject) return alert("Mata pelajaran wajib diisi");
    onCreate({ title, description, subject, material, type, cover, questions });
  };

  return (
    <div className="p-6 text-black">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-100 text-[#4C5BD4] hover:bg-indigo-200"
        >
          ← Kembali
        </button>
        <h2 className="text-3xl font-extrabold">Buat Tugas Baru</h2>
      </div>
      <div className="border-b border-indigo-200 mb-6" />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* left fields */}
        <div className="lg:col-span-2 space-y-5">
          <div>
            <label className="block mb-1 font-semibold">
              Judul <span className="text-rose-600">*</span>
            </label>
            <input
              className="w-full px-4 py-2 rounded-lg bg-white border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Masukkan judul tugas"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">
              Deskripsi <span className="text-rose-600">*</span>
            </label>
            <textarea
              className="w-full px-4 py-2 h-28 rounded-lg bg-white border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Masukkan deskripsi tugas"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">
              Mata Pelajaran <span className="text-rose-600">*</span>
            </label>
            <select
              className="w-full px-4 py-2 rounded-lg bg-white border border-indigo-200 focus:outline-none"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {SUBJECT_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Materi</label>
            <select
              className="w-full px-4 py-2 rounded-lg bg-white border border-indigo-200 focus:outline-none"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            >
              <option value="">Pilih Materi Pelajaran</option>
              {MATERIAL_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">
              Tipe Tugas <span className="text-rose-600">*</span>
            </label>
            <select
              className="w-full px-4 py-2 rounded-lg bg-white border border-indigo-200 focus:outline-none"
              value={type}
              onChange={(e) => setType(e.target.value as AdminTask["type"])}
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Question Builder */}
          <div className="mt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                Soal ({questions.length})
              </h3>
              <button
                type="button"
                onClick={addQuestion}
                className="px-3 py-1.5 rounded-lg bg-[#6F78E9] text-white hover:brightness-110"
              >
                + Tambah Soal
              </button>
            </div>

            <div className="mt-3 space-y-4">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="rounded-xl border border-indigo-200 bg-white p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-semibold pt-2">Q.</span>
                    <textarea
                      className="flex-1 px-3 py-2 h-24 rounded-lg bg-white border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="Tulis pertanyaan"
                      value={q.text}
                      onChange={(e) =>
                        updateQuestion(q.id, { text: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <InputOpt
                      label="A"
                      value={q.a}
                      onChange={(v) => updateQuestion(q.id, { a: v })}
                    />
                    <InputOpt
                      label="B"
                      value={q.b}
                      onChange={(v) => updateQuestion(q.id, { b: v })}
                    />
                    <InputOpt
                      label="C"
                      value={q.c}
                      onChange={(v) => updateQuestion(q.id, { c: v })}
                    />
                    <InputOpt
                      label="D"
                      value={q.d}
                      onChange={(v) => updateQuestion(q.id, { d: v })}
                    />
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <label className="font-semibold">Kunci:</label>
                    {(["A", "B", "C", "D"] as const).map((k) => (
                      <label key={k} className="inline-flex items-center gap-2 mr-3">
                        <input
                          type="radio"
                          name={`ans-${q.id}`}
                          checked={q.answer === k}
                          onChange={() => updateQuestion(q.id, { answer: k })}
                        />
                        <span>{k}</span>
                      </label>
                    ))}

                    <div className="ml-auto">
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-100 text-[#4C5BD4] cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) =>
                            updateQuestion(q.id, {
                              imageFile: e.target.files?.[0] ?? null,
                            })
                          }
                        />
                        Gambar Soal
                      </label>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeQuestion(q.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500 text-white"
                    >
                      Hapus Soal
                    </button>
                  </div>
                </div>
              ))}

              {questions.length === 0 && (
                <div className="text-gray-500 text-sm">
                  Belum ada soal. Klik{" "}
                  <span className="font-semibold">“Tambah Soal”</span>.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* right column */}
        <div className="space-y-5">
          <div>
            <label className="block mb-1 font-semibold">Gambar Tugas</label>
            <label className="w-full h-10 inline-flex items-center gap-3 px-3 rounded-lg bg-indigo-100 text-[#4C5BD4] cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => setCover(e.target.files?.[0] ?? null)}
              />
              Pilih File
              <span className="text-gray-600">
                {cover ? cover.name : "Tidak ada file yang dipilih"}
              </span>
            </label>
          </div>
        </div>

        {/* actions */}
        <div className="lg:col-span-3 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-indigo-200 bg-white"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#6F78E9] text-white hover:brightness-110"
          >
            Simpan Tugas
          </button>
        </div>
      </form>
    </div>
  );
};

const InputOpt: React.FC<{
  label: "A" | "B" | "C" | "D";
  value: string;
  onChange: (v: string) => void;
}> = ({ label, value, onChange }) => (
  <div>
    <label className="block mb-1 font-semibold">Pilihan {label}</label>
    <input
      className="w-full px-3 py-2 rounded-lg bg-white border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      placeholder={`Teks pilihan ${label}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

// ========================
// Role Views
// ========================
const StudentTasksView = () => (
  <TasksList tasksSeed={STUDENT_TASKS} title="Daftar Tugas" />
);
const TeacherTasksView = () => (
  <TasksList tasksSeed={TEACHER_TASKS} title="Daftar Tugas (Guru)" />
);

// Admin pakai view khusus (list + create)
const AdminWrapper = () => <AdminTasksView />;

const GuestTasksView = () => (
  <div className="p-6">
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow">
      <p className="text-black font-medium mb-2">Kamu belum login.</p>
      <p className="text-gray-600 mb-4">
        Silakan login untuk melihat daftar tugas sesuai peran kamu.
      </p>
      <div className="flex gap-3">
        <Link
          href="/auth/login"
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
        >
          Login
        </Link>
        <Link
          href="/auth/register"
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-black"
        >
          Register
        </Link>
      </div>
    </div>
  </div>
);

// ========================
// Page wrapper: pilih view berdasarkan role
// ========================
export default function TasksPage() {
  const u = auth.getCachedUserProfile() as User | null;
  const roleName = (u?.role?.name || "").toUpperCase();

  const role: Role =
    roleName === Role.ADMIN || roleName === Role.TEACHER || roleName === Role.STUDENT
      ? (roleName as Role)
      : Role.GUEST;

  switch (role) {
    case Role.ADMIN:
      return <AdminWrapper />;
    case Role.TEACHER:
      return <TeacherTasksView />;
    case Role.STUDENT:
      return <StudentTasksView />;
    default:
      return <GuestTasksView />;
  }
}