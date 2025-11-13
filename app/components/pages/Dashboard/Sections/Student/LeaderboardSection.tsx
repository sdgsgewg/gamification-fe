import React from "react";

interface LeaderboardSectionProps {
  data: { id: number; name: string; point: number }[];
}

const LeaderboardSection = ({ data }: LeaderboardSectionProps) => {
  return (
    <div className="bg-card p-5 rounded-2xl shadow-md border border-outline">
      <h2 className="text-lg font-semibold text-primary mb-3">Top Students</h2>
      <ul className="space-y-3">
        {data.map((user, index) => (
          <li
            key={user.id}
            className="flex justify-between items-center bg-tertiary p-3 rounded-xl border border-br-tertiary"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-primary">
                #{index + 1}
              </span>
              <span className="font-medium text-tx-primary">{user.name}</span>
            </div>
            <span className="text-sm text-tx-tertiary">{user.point} XP</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderboardSection;
