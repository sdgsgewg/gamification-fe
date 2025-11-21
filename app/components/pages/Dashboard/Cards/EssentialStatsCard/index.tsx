import React from "react";
import { LucideIcon } from "lucide-react";

interface EssentialStatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
}

const EssentialStatsCard = ({
  label,
  value,
  icon: Icon,
}: EssentialStatsCardProps) => {
  return (
    <div
      className="
        relative overflow-hidden
        rounded-xl border
        p-5 shadow-sm transition-all
        hover:shadow-md hover:scale-[1.02]
        bg-card
        border-outline
      "
    >
      {/* Gradient tipis pakai primary + tertiary */}
      <div
        className="
          absolute inset-0 
          bg-gradient-to-br 
          from-[color-mix(in_oklab,var(--color-primary)_15%,transparent)]
          to-[color-mix(in_oklab,var(--color-tertiary)_15%,transparent)]
        "
      />

      <div className="relative z-10 flex items-center gap-4">
        {/* Icon container pakai surface color */}
        <div
          className="
            p-3 rounded-xl backdrop-blur-md
            bg-[color-mix(in_oklab,var(--color-surface)_60%,transparent)]
          "
        >
          <Icon className="w-6 h-6 text-primary" />
        </div>

        <div>
          <div className="text-3xl font-bold leading-none text-tx-primary">
            {value}
          </div>
          <div className="text-sm mt-1 text-tx-muted">{label}</div>
        </div>
      </div>
    </div>
  );
};

export default EssentialStatsCard;
