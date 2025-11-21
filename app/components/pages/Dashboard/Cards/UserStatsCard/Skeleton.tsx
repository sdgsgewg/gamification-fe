import React from "react";

const UserStatsCardSkeleton = () => {
  return (
    <div
      className="
        relative p-6 rounded-2xl shadow-sm border overflow-hidden
        bg-card border-outline
      "
    >
      {/* Soft gradient accent */}
      <div
        className="
          absolute inset-0 pointer-events-none
          bg-gradient-to-br
          from-[color-mix(in_srgb_var(--color-primary)_10%,transparent)]
          to-transparent
        "
      />

      <div className="relative flex flex-col items-start gap-2 w-full">
        {/* Icon placeholder */}
        <div className="w-7 h-7 rounded-md skeleton" />

        {/* Number placeholder */}
        <div className="w-24 h-8 rounded-md skeleton" />

        {/* Label placeholder */}
        <div className="w-20 h-4 rounded-md skeleton" />

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full mt-3 overflow-hidden bg-light-muted">
          <div className="h-full skeleton" />
        </div>
      </div>
    </div>
  );
};

export default UserStatsCardSkeleton;
