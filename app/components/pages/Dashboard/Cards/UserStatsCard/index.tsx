import React from "react";
import { Users, User, GraduationCap, Shield } from "lucide-react";
import CountUp from "react-countup";

interface UserStatsCardProps {
  label: string;
  value: number;
}

const iconMap: any = {
  "All Users": Users,
  Admins: Shield,
  Teachers: User,
  Students: GraduationCap,
};

const UserStatsCard = ({ label, value }: UserStatsCardProps) => {
  const Icon = iconMap[label] ?? Users;

  return (
    <div
      className="
        relative p-6 rounded-2xl shadow-sm border overflow-hidden group transition
        bg-card 
        border-outline
        hover:shadow-md
      "
    >
      {/* Soft gradient accent */}
      <div
        className="
          absolute inset-0 pointer-events-none
          bg-gradient-to-br
          from-[color-mix(in_srgb_var(--color-primary)_15%,transparent)]
          to-transparent
        "
      />

      <div className="relative flex flex-col items-start gap-2">
        <Icon className="w-6 h-6 mb-1 opacity-80 text-primary" />

        <div className="text-4xl font-extrabold text-tx-primary">
          <CountUp end={value} duration={0.8} separator="," />
        </div>

        <p className="text-sm font-medium text-tx-muted">{label}</p>

        {/* Thin Accent Line */}
        <div className="w-full h-1 rounded-full bg-primary/40 mt-3" />
      </div>
    </div>
  );
};

export default UserStatsCard;
