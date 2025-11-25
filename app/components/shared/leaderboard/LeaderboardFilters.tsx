"use client";

import { LeaderboardScope } from "@/app/types/LeaderboardScope";

type Props = {
  module: "root" | "dashboard";
  filter: LeaderboardScope;
  setFilter: (f: LeaderboardScope) => void;
};

export default function LeaderboardFilters({
  module,
  filter,
  setFilter,
}: Props) {
  const scopes =
    module === "root"
      ? [
          { value: "global", label: "Global" },
          { value: "activity", label: "Activity" },
          { value: "class", label: "Class" },
        ]
      : [
          { value: "class", label: "Class" },
          { value: "student", label: "Student" },
        ];

  return (
    <div className="flex gap-4 mb-6 ">
      {scopes.map((scope) => (
        <button
          key={scope.value}
          onClick={() => setFilter(scope.value as LeaderboardScope)}
          className={`px-4 py-2 font-bold rounded-lg ${
            filter === scope.value
              ? "bg-primary text-white"
              : "bg-card text-tx-primary border border-br-secondary"
          } cursor-pointer`}
        >
          {scope.label}
        </button>
      ))}
    </div>
  );
}
