"use client";

import React from "react";

const TaskCardSkeleton = () => {
  return (
    <div className="rounded-2xl border border-br-secondary bg-card shadow-sm p-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-br-tertiary pb-4">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-br-tertiary rounded"></div>
        </div>
      </div>

      {/* Content */}
      <div className="py-4 space-y-4">
        <div className="h-3 w-48 bg-br-tertiary rounded"></div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-br-tertiary rounded"></div>
          <div className="h-3 w-24 bg-br-tertiary rounded"></div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-br-tertiary rounded"></div>
          <div className="h-3 w-28 bg-br-tertiary rounded"></div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-2 mt-2">
        <div className="w-1/2 h-10 bg-br-tertiary rounded-lg"></div>
        <div className="w-1/2 h-10 bg-br-tertiary rounded-lg"></div>
      </div>
    </div>
  );
};

export default TaskCardSkeleton;
