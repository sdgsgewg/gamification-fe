"use client";

type Props = {
  filter: "class" | "student";
  setFilter: (f: "class" | "student") => void;
};

export default function LeaderboardFilters({ filter, setFilter }: Props) {
  return (
    <div className="mb-6 flex gap-4">
      <button
        onClick={() => setFilter("class")}
        className={`px-4 py-2 font-bold rounded-lg ${
          filter === "class"
            ? "bg-primary text-white"
            : "bg-card text-tx-primary border border-br-secondary"
        } cursor-pointer`}
      >
        Class
      </button>

      <button
        onClick={() => setFilter("student")}
        className={`px-4 py-2 font-bold rounded-lg ${
          filter === "student"
            ? "bg-primary text-white"
            : "bg-card text-tx-primary border border-br-secondary"
        } cursor-pointer`}
      >
        Student
      </button>
    </div>
  );
}
