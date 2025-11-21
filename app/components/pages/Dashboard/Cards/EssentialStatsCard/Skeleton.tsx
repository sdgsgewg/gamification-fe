import React from "react";

const EssentialStatsCardSkeleton = () => {
  return (
    <div
      className="
        relative overflow-hidden
        rounded-xl border
        p-5 shadow-sm
        bg-card border-outline
        animate-pulse
      "
    >
      <div className="relative z-10 flex items-center gap-4">
        {/* Icon placeholder */}
        <div
          className="
            w-12 h-12 rounded-xl
            bg-[color-mix(in_oklab,var(--color-light-muted)_60%,transparent)]
          "
        />

        <div className="flex flex-col gap-2 flex-1">
          {/* Value placeholder */}
          <div className="w-16 h-6 rounded-md bg-light-muted"></div>

          {/* Label placeholder */}
          <div className="w-24 h-4 rounded-md bg-light-muted"></div>
        </div>
      </div>
    </div>
  );
};

export default EssentialStatsCardSkeleton;
