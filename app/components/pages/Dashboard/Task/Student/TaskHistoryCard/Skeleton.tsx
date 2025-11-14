"use client";

import React from "react";

const TaskHistoryCardSkeleton = () => {
  return (
    <div className="h-24 sm:h-28 xl:h-32 bg-card flex gap-6 rounded-lg shadow-sm p-4 lg:p-6 animate-pulse">
      {/* Thumbnail Skeleton */}
      <div className="w-[15%] md:w-[12%] xl:w-[8%]">
        <div className="w-full h-full bg-light-accent rounded-md"></div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 flex justify-between w-full">
        <div className="flex flex-col justify-between gap-2 w-[70%]">
          <div className="flex flex-col gap-2">
            {/* Title */}
            <div className="h-4 bg-light-accent rounded w-3/4"></div>

            {/* Progress text */}
            <div className="h-3 bg-light-accent rounded w-1/2"></div>
          </div>

          {/* Deadline skeleton */}
          <div className="flex items-center gap-2 mt-1">
            <div className="h-3 w-3 bg-light-accent rounded-full"></div>
            <div className="h-3 bg-light-accent rounded w-1/3"></div>
          </div>
        </div>

        {/* Status Tag Skeleton */}
        <div className="flex items-start justify-start">
          <div className="h-6 bg-light-accent rounded-md w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default TaskHistoryCardSkeleton;
