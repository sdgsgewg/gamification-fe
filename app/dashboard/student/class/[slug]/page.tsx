// "use client";

// import Link from "next/link";
// import { useMemo, useState } from "react";

// /* ----------------------------- Types & mocks ----------------------------- */

// type WorkKind = "Tryout" | "Live Quiz" | "Review Quiz" | "Assignment";

// type Work = {
//   id: string;
//   title: string;
//   kind: WorkKind;
//   subject: string;
//   questions: number;
//   deadline?: string;
// };

// type Person = { id: string; name: string; avatar: string };

// const MOCK_ACTIVE: Work[] = [
//   {
//     id: "w1",
//     title: "Prep UTS MTK 2025",
//     kind: "Tryout",
//     subject: "Matematika",
//     questions: 50,
//     deadline: "10 November 2025 (23:59 WIB)",
//   },
// ];

// const MOCK_FINISHED: Work[] = [
//   {
//     id: "w2",
//     title: "Live Quiz Peluang Bersyarat",
//     kind: "Live Quiz",
//     subject: "Matematika",
//     questions: 20,
//   },
//   {
//     id: "w3",
//     title: "Review Quiz Statistika Inferensial",
//     kind: "Review Quiz",
//     subject: "Matematika",
//     questions: 25,
//   },
//   {
//     id: "w4",
//     title: "Tugas Fungsi dan Grafik",
//     kind: "Assignment",
//     subject: "Matematika",
//     questions: 30,
//   },
// ];

// const MOCK_STUDENTS: Person[] = [
//   { id: "s1", name: "Susi Pudjianti", avatar: "/avatars/a1.png" },
//   { id: "s2", name: "Angel Wicaksono", avatar: "/avatars/a2.png" },
//   { id: "s3", name: "Siti Nurhalizah", avatar: "/avatars/a3.png" },
//   { id: "s4", name: "Caca Permarta Sari", avatar: "/avatars/a4.png" },
//   { id: "s5", name: "Kevin Wijaya", avatar: "/avatars/a5.png" },
//   { id: "s6", name: "Denis", avatar: "/avatars/a6.png" },
//   { id: "s7", name: "Sarah", avatar: "/avatars/a7.png" },
//   { id: "s8", name: "Adit", avatar: "/avatars/a8.png" },
// ];

// const MOCK_TEACHERS: Person[] = [
//   { id: "t1", name: "Herman Hidayat", avatar: "/avatars/teacher.png" },
// ];

// /* --------------------------------- Page --------------------------------- */

// const StudentClassDetailPage = () => {
//   const [tab, setTab] = useState<"tasks" | "people" | "leaderboard">("tasks");
//   const [taskState, setTaskState] = useState<"active" | "done">("active");
//   const [who, setWho] = useState<"students" | "teachers">("students");
//   const [page, setPage] = useState(1);

//   const className = "Kelas 12E SMAN 1";
//   const classTagline =
//     "Kelas dengan semangat belajar tinggi dan komitmen terhadap keunggulan.";

//   const dataWorks = taskState === "active" ? MOCK_ACTIVE : MOCK_FINISHED;
//   const dataPeople = who === "students" ? MOCK_STUDENTS : MOCK_TEACHERS;

//   const podiumTop3 = [
//     { name: "Susi Pudjianti", score: 12500, avatar: "/avatars/a1.png" },
//     { name: "Angel Wicaksono", score: 12000, avatar: "/avatars/a2.png" },
//     { name: "Siti Nurhalizah", score: 11500, avatar: "/avatars/a3.png" },
//   ];

//   const leaderboardRows = useMemo(
//     () =>
//       Array.from({ length: 15 }).map((_, i) => ({
//         rank: i + 4,
//         name: i % 2 ? "Kevin Wijaya" : "Caca Permata Sari",
//         points: i % 2 ? 10500 : 11000,
//         avatar: i % 2 ? "/avatars/a5.png" : "/avatars/a4.png",
//       })),
//     []
//   );

//   return (
//     <div className="px-7 pb-16 pt-6 text-[var(--text-primary)] bg-[var(--background)]">
//       {/* Header row */}
//       <div className="mb-4 grid gap-4">
//         <div className="flex items-start justify-between border-b-2 border-[var(--color-outline)] pb-2">
//           <div>
//             <h1 className="text-3xl font-extrabold leading-tight">
//               {className}
//             </h1>
//             <p className="mt-1 max-w-[560px] text-[var(--text-secondary)]">
//               {classTagline}
//             </p>
//           </div>
//           <div
//             className="h-14 w-20 rounded-lg border border-[var(--border-secondary)]"
//             style={{
//               background:
//                 "linear-gradient(135deg, var(--color-secondary), var(--color-tertiary))",
//             }}
//             aria-hidden
//           />
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="mb-4 flex gap-8 border-b-2 border-[var(--color-outline)]">
//         <TabButton active={tab === "tasks"} onClick={() => setTab("tasks")}>
//           Tugas
//         </TabButton>
//         <TabButton active={tab === "people"} onClick={() => setTab("people")}>
//           Anggota
//         </TabButton>
//         <TabButton
//           active={tab === "leaderboard"}
//           onClick={() => setTab("leaderboard")}
//         >
//           Leaderboard
//         </TabButton>
//       </div>

//       {/* TAB: TUGAS */}
//       {tab === "tasks" && (
//         <>
//           <div className="mb-3 flex gap-3">
//             <Pill
//               active={taskState === "active"}
//               onClick={() => setTaskState("active")}
//             >
//               Aktif
//             </Pill>
//             <Pill
//               active={taskState === "done"}
//               onClick={() => setTaskState("done")}
//             >
//               Selesai
//             </Pill>
//           </div>

//           <div
//             className={
//               taskState === "active"
//                 ? "grid max-w-[680px] grid-cols-1 gap-6"
//                 : "grid grid-cols-1 gap-6 lg:grid-cols-2"
//             }
//           >
//             {dataWorks.map((w) => (
//               <TaskCard
//                 key={w.id}
//                 work={w}
//                 showDeadline={taskState === "active"}
//               />
//             ))}
//           </div>

//           <Pager page={page} pages={2} onChange={setPage} />
//         </>
//       )}

//       {/* TAB: ANGGOTA */}
//       {tab === "people" && (
//         <>
//           <div className="mb-3 flex gap-2">
//             <CountToggle
//               label="Murid"
//               count={MOCK_STUDENTS.length}
//               active={who === "students"}
//               onClick={() => setWho("students")}
//             />
//             <CountToggle
//               label="Guru"
//               count={MOCK_TEACHERS.length}
//               active={who === "teachers"}
//               onClick={() => setWho("teachers")}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
//             {dataPeople.map((p) => (
//               <div
//                 key={p.id}
//                 className="grid place-items-center gap-3 rounded-xl border-2 border-[var(--border-secondary)] bg-[var(--color-card)] p-5"
//               >
//                 <div className="h-40 w-40 overflow-hidden rounded-full border border-[var(--border-secondary)] bg-[var(--color-tertiary)]">
//                   {/* eslint-disable-next-line @next/next/no-img-element */}
//                   <img
//                     src={p.avatar}
//                     alt={p.name}
//                     className="h-full w-full object-cover"
//                   />
//                 </div>
//                 <div className="font-extrabold">{p.name}</div>
//               </div>
//             ))}
//           </div>

//           <Pager page={page} pages={2} onChange={setPage} />
//         </>
//       )}

//       {/* TAB: LEADERBOARD */}
//       {tab === "leaderboard" && (
//         <div className="grid gap-6 pt-4 lg:grid-cols-[360px_1fr]">
//           {/* Podium */}
//           <div className="grid grid-cols-3 gap-6 items-end justify-center">
//             {([1, 2, 3] as const).map((place) => {
//               const user = podiumTop3[place - 1];
//               return (
//                 <PodiumPosition
//                   key={user.name}
//                   place={place}
//                   name={user.name}
//                   score={user.score}
//                   avatar={user.avatar}
//                 />
//               );
//             })}
//           </div>

//           {/* Table */}
//           <div className="overflow-hidden rounded-lg border-2 border-[var(--border-secondary)]">
//             <div className="grid grid-cols-[120px_1fr_140px] bg-[var(--color-primary)] px-3 py-2 font-bold text-white">
//               <div>Rank</div>
//               <div>Nama</div>
//               <div>Poin</div>
//             </div>
//             <div>
//               {leaderboardRows.map((r, i) => (
//                 <div
//                   key={r.rank}
//                   className={`grid grid-cols-[120px_1fr_140px] items-center px-3 py-2 ${
//                     i % 2 === 0
//                       ? "bg-[var(--color-tertiary)]"
//                       : "bg-[var(--background)]"
//                   } border-b-2 border-[var(--border-secondary)]`}
//                 >
//                   <div>{r.rank}</div>
//                   <div className="flex items-center gap-2">
//                     <span className="h-6 w-6 overflow-hidden rounded-full border border-[var(--border-secondary)] bg-[var(--color-card)]">
//                       {/* eslint-disable-next-line @next/next/no-img-element */}
//                       <img
//                         src={r.avatar}
//                         alt=""
//                         className="h-full w-full object-cover"
//                       />
//                     </span>
//                     {r.name}
//                   </div>
//                   <div>{r.points}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentClassDetailPage;

// /* ------------------------------- Components ------------------------------ */

// function TabButton({
//   active,
//   children,
//   onClick,
// }: {
//   active?: boolean;
//   children: React.ReactNode;
//   onClick?: () => void;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`relative -mb-[2px] border-none bg-transparent px-1 py-3 font-bold text-[var(--text-secondary)] transition ${
//         active ? "text-[var(--text-primary)]" : ""
//       }`}
//     >
//       {children}
//       {active && (
//         <span className="absolute inset-x-0 -bottom-[2px] block h-1 rounded-full bg-[var(--color-primary)]" />
//       )}
//     </button>
//   );
// }

// function Pill({
//   active,
//   children,
//   onClick,
// }: {
//   active?: boolean;
//   children: React.ReactNode;
//   onClick?: () => void;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`rounded-full border px-5 py-2 font-bold transition ${
//         active
//           ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
//           : "border-[var(--border-secondary)] bg-[var(--color-card)] text-[var(--text-primary)] hover:bg-[var(--color-surface)]"
//       }`}
//     >
//       {children}
//     </button>
//   );
// }

// function TaskCard({
//   work,
//   showDeadline,
// }: {
//   work: Work;
//   showDeadline?: boolean;
// }) {
//   return (
//     <div className="flex gap-4 rounded-2xl border-2 border-[var(--border-secondary)] bg-[var(--color-card)] p-5">
//       <div className="h-[116px] w-[140px] rounded-xl border border-[var(--border-secondary)] bg-[var(--color-tertiary)]" />
//       <div className="min-w-0">
//         <h3 className="mb-2 text-lg font-extrabold leading-snug">
//           {work.title}
//         </h3>
//         <span className="inline-block rounded-full bg-[var(--color-secondary)] px-3 py-1 text-[12px] font-bold text-[var(--text-primary)]">
//           {work.kind}
//         </span>

//         <div className="mt-3 grid gap-1 text-[var(--text-secondary)]">
//           <div>Mata Pelajaran: {work.subject}</div>
//           <div>Jumlah Soal: {work.questions}</div>
//           {showDeadline && work.deadline && (
//             <div className="mt-1 inline-flex items-center gap-2">
//               <svg
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 aria-hidden
//               >
//                 <path
//                   d="M7 10h5m-5 4h10M7 2v4m10-4v4M3 8h18M5 6h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
//                   stroke="currentColor"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//               <span className="whitespace-pre-wrap">
//                 Deadline: {work.deadline}
//               </span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function CountToggle({
//   label,
//   count,
//   active,
//   onClick,
// }: {
//   label: string;
//   count: number;
//   active?: boolean;
//   onClick?: () => void;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`grid min-w-[120px] grid-rows-[auto_auto] justify-items-center rounded-t-xl border px-4 py-2 font-bold ${
//         active
//           ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
//           : "border-[var(--border-secondary)] bg-[var(--color-tertiary)] text-[var(--text-secondary)]"
//       }`}
//     >
//       <div className="text-sm">{count}</div>
//       <div className="text-xs">{label}</div>
//     </button>
//   );
// }

// function PodiumPosition({
//   place,
//   name,
//   score,
//   avatar,
// }: {
//   place: 1 | 2 | 3;
//   name: string;
//   score: number;
//   avatar: string;
// }) {
//   const medalColors: Record<1 | 2 | 3, string> = {
//     1: "#F7E08F", // gold
//     2: "#D9DDE5", // silver
//     3: "#E6C392", // bronze
//   };

//   return (
//     <div
//       className="relative flex flex-col items-center justify-end rounded-lg border-2 border-[var(--border-secondary)] pb-6 pt-12"
//       style={{
//         background: `linear-gradient(180deg, #ffffffaa 0%, #ffffff00 60%), ${medalColors[place]}`,
//         height: "400px", // fixed height for nice balance
//       }}
//     >
//       {/* Top Medal */}
//       <div className="absolute -top-5 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--border-secondary)] bg-white/60">
//         <span
//           className="h-6 w-6 rounded-full border border-[var(--border-secondary)]"
//           style={{
//             background:
//               "radial-gradient(circle at 30% 30%, #ffffffaa 0 35%, transparent 36%), #ffd54f",
//           }}
//         />
//       </div>

//       {/* Avatar */}
//       <div className="absolute top-1/4 -translate-y-1/2 transform">
//         <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-[var(--border-secondary)] bg-[var(--color-card)] shadow-md">
//           {/* eslint-disable-next-line @next/next/no-img-element */}
//           <img src={avatar} alt={name} className="h-full w-full object-cover" />
//         </div>
//       </div>

//       {/* Name & Score */}
//       <div className="mt-32 text-center">
//         <div className="font-extrabold text-[var(--text-primary)]">{name}</div>
//         <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--border-secondary)] bg-[var(--color-primary)] px-4 py-2 font-extrabold text-white">
//           <span
//             className="inline-block h-4 w-4 rounded-full border border-[var(--border-secondary)]"
//             style={{
//               background:
//                 "radial-gradient(circle at 30% 30%, #ffffffaa 0 35%, transparent 36%), #ffd54f",
//             }}
//           />
//           {score}
//         </div>
//       </div>
//     </div>
//   );
// }

// function Pager({
//   page,
//   pages,
//   onChange,
// }: {
//   page: number;
//   pages: number;
//   onChange: (n: number) => void;
// }) {
//   return (
//     <div className="mx-auto mt-6 flex w-fit items-center gap-2">
//       <button
//         onClick={() => onChange(Math.max(1, page - 1))}
//         className="grid h-9 min-w-9 place-items-center rounded-md border border-[var(--border-secondary)] bg-[var(--color-card)] text-[var(--text-secondary)]"
//         aria-label="Sebelumnya"
//       >
//         ‹
//       </button>
//       {Array.from({ length: pages }).map((_, i) => {
//         const n = i + 1;
//         const active = n === page;
//         return (
//           <button
//             key={n}
//             onClick={() => onChange(n)}
//             className={`grid h-9 min-w-9 place-items-center rounded-md border font-bold ${
//               active
//                 ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
//                 : "border-[var(--border-secondary)] bg-[var(--color-card)] text-[var(--text-secondary)]"
//             }`}
//           >
//             {n}
//           </button>
//         );
//       })}
//       <button
//         onClick={() => onChange(Math.min(pages, page + 1))}
//         className="grid h-9 min-w-9 place-items-center rounded-md border border-[var(--border-secondary)] bg-[var(--color-card)] text-[var(--text-secondary)]"
//         aria-label="Berikutnya"
//       >
//         ›
//       </button>
//     </div>
//   );
// }

"use client";

import {
  MemberCard,
  MemberCardSkeleton,
  MemberCardWrapper,
  TaskCard,
  TaskCardSkeleton,
  TaskCardWrapper,
} from "@/app/components/pages/Dashboard/Class/Cards";
import Button from "@/app/components/shared/Button";
import { IMAGES } from "@/app/constants/images";
import { ROUTES } from "@/app/constants/routes";
import { useClassTasks } from "@/app/hooks/class-tasks/useClassTasks";
import { useClassDetail } from "@/app/hooks/classes/useClassDetail";
import { useClassMember } from "@/app/hooks/classes/useClassMember";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

type ClassDetailView = "tasks" | "members" | "leaderboard";
type MemberRole = "students" | "teacher";

const StudentClassDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const { data: classDetailData } = useClassDetail(params.slug, "detail");

  const [view, setView] = useState<ClassDetailView>("tasks");
  // Buat daftar tab dinamis
  const tabs: { key: ClassDetailView; label: string }[] = [
    { key: "tasks" as const, label: "Tasks" },
    { key: "members" as const, label: "Member" },
    { key: "leaderboard" as const, label: "Leaderboard" },
  ];

  const handleBack = () => {
    router.back();
  };

  const TaskView = () => {
    const { data: classTasks, isLoading } = useClassTasks(params.slug);

    const handleNavigateToTaskDetailPage = (taskSlug: string) => {
      const query = new URLSearchParams({
        class: params.slug,
        task: taskSlug,
      });

      router.push(`${ROUTES.DASHBOARD.STUDENT.TASKS_VIEW}?${query.toString()}`);
    };

    if (!classTasks) return;

    return (
      <div>
        {/* Task Grid */}
        {isLoading ? (
          <TaskCardWrapper>
            {Array.from({ length: 4 }).map((_, idx) => (
              <TaskCardSkeleton key={idx} />
            ))}
          </TaskCardWrapper>
        ) : classTasks.length > 0 ? (
          <TaskCardWrapper>
            {classTasks.map((ct) => (
              <TaskCard
                key={ct.slug}
                image={ct.image}
                title={ct.title}
                slug={ct.slug}
                type={ct.type}
                // difficulty={ct.difficulty}
                subject={ct.subject}
                questionCount={ct.questionCount}
                deadline={ct.deadline}
                onClick={() => handleNavigateToTaskDetailPage(ct.slug)}
              />
            ))}
          </TaskCardWrapper>
        ) : (
          <p className="text-center">Task not found.</p>
        )}
      </div>
    );
  };

  const MemberView = () => {
    const { data: classMember, isLoading } = useClassMember(params.slug);

    const [view, setView] = useState<MemberRole>("students");
    // Buat daftar tab dinamis
    const tabs: { key: MemberRole; label: string }[] = [
      { key: "students" as const, label: "Student" },
      { key: "teacher" as const, label: "Teacher" },
    ];

    if (!classMember) return;

    const members =
      view === "students" ? classMember.students : classMember.teacher;

    return (
      <div>
        {/* Navigation tab */}
        <div className="w-full flex items-center">
          <div className="flex overflow-x-auto custom-thin-scrollbar max-w-full">
            {tabs.map((tab) => {
              const count =
                tab.key === "students"
                  ? classMember.students.length
                  : classMember.teacher.length;

              return (
                <Button
                  key={tab.key}
                  size="middle"
                  onClick={() => setView(tab.key)}
                  className={`relative flex items-center gap-2 !px-7 !py-6 !border-none !rounded-t-lg !rounded-b-none text-sm transition-all duration-150 ${
                    view === tab.key
                      ? "!bg-primary !text-white"
                      : "!bg-tertiary hover:!bg-tertiary-hover !text-dark"
                  }`}
                >
                  <span
                    className={`flex flex-col text-sm ${
                      view === tab.key ? "font-semibold" : "font-medium"
                    }`}
                  >
                    <p>{count}</p>
                    <p>{tab.label}</p>
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Member Grid */}
        {isLoading ? (
          <MemberCardWrapper>
            {Array.from({ length: 4 }).map((_, idx) => (
              <MemberCardSkeleton key={idx} />
            ))}
          </MemberCardWrapper>
        ) : members.length > 0 ? (
          <MemberCardWrapper>
            {members.map((m, idx) => (
              <MemberCard key={idx} image={m.image} name={m.name} />
            ))}
          </MemberCardWrapper>
        ) : (
          <p className="text-center">Member not found.</p>
        )}
      </div>
    );
  };

  const LeaderboardView = () => {
    return (
      <div>
        <h1>Leaderboard View</h1>
      </div>
    );
  };

  if (!classDetailData) return;

  const { name, description, image } = classDetailData;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <Button
            type="primary"
            size="middle"
            variant="primary"
            onClick={handleBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
            <span className="text-base font-semibold">Kembali</span>
          </Button>
        </div>
        <div className="w-full sm:max-w-[60%] lg:max-w-[40%] flex items-center gap-4">
          <div className="flex flex-col text-end gap-2">
            <h3 className="text-dark text-2xl md:text-3xl font-bold">{name}</h3>
            <p className="text-sm font-medium">{description}</p>
          </div>
          {/* Class Image */}
          <div className="max-w-32">
            <Image
              src={image ?? IMAGES.DEFAULT_CLASS}
              alt={name}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Navigation tab antar view */}
      <div className="w-full flex items-center mt-4 mb-8 border-y border-y-br-primary">
        <div className="flex overflow-x-auto custom-thin-scrollbar max-w-full">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              size="middle"
              onClick={() => setView(tab.key)}
              className={`relative flex items-center gap-2 !px-10 !py-5 !border-none text-sm transition-all duration-150 !bg-background hover:!bg-background-hover !text-dark`}
            >
              <span className="text-base font-semibold">{tab.label}</span>
              {view === tab.key && (
                <span className="absolute -bottom-0 left-0 w-full h-[2px] bg-primary" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Render View */}
      {view === "tasks" ? (
        <TaskView />
      ) : view === "members" ? (
        <MemberView />
      ) : (
        <LeaderboardView />
      )}
    </div>
  );
};

export default StudentClassDetailPage;
