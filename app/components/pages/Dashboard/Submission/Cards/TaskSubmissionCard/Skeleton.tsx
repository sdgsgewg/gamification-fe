"use client";

import React from "react";

const TaskSubmissionCardSkeleton = () => {
  return (
    <div className="h-24 sm:h-28 xl:h-32 bg-card flex gap-6 rounded-lg shadow-sm p-4 lg:p-6 animate-pulse">
      {/* Thumbnail skeleton */}
      <div className="w-[15%] md:w-[12%] xl:w-[8%]">
        <div className="w-full h-full bg-light-accent rounded-md"></div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1 flex justify-between">
        <div className="flex flex-col gap-2 w-[70%]">
          {/* Title */}
          <div className="h-4 bg-light-accent rounded w-3/4"></div>

          {/* Subtitle (event text) */}
          <div className="h-3 bg-light-accent rounded w-1/2"></div>

          {/* User text */}
          <div className="h-3 bg-light-accent rounded w-1/3"></div>
        </div>

        {/* Status tag */}
        <div className="flex items-start justify-start">
          <div className="h-6 bg-light-accent rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default TaskSubmissionCardSkeleton;
