import React from "react";

interface StatsCardProps {
  label: string;
  value: number;
}

const StatsCard = ({ label, value }: StatsCardProps) => {
  return (
    <div
      key={label}
      className="bg-surface rounded-xl border border-light-muted p-6 text-dark text-center shadow-sm"
    >
      <div className="text-3xl font-extrabold mb-1">{value}</div>
      <div className="text-sm font-semibold">{label}</div>
    </div>
  );
};

export default StatsCard;
