"use client";

import React from "react";

const TaskSubmissionCardSkeleton = () => {
  return (
    <div className="min-h-24 max-h-24 sm:min-h-32 sm:max-h-32 xl:min-h-32 xl:max-h-32 bg-card flex gap-6 rounded-lg shadow-sm p-4 lg:p-6 animate-pulse">
      {/* Thumbnail skeleton */}
      <div className="w-[15%] sm:w-[18%] xl:w-[8%]">
        <div className="w-full h-full bg-light-accent rounded-md"></div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1 flex justify-between">
        <div className="flex flex-col justify-between flex-1">
          {/* Title + Event */}
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-light-accent rounded w-3/4"></div>{" "}
            {/* title */}
            <div className="h-3 bg-light-accent rounded w-1/2"></div>{" "}
            {/* event text */}
          </div>

          {/* Class & User info */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-light-accent rounded-full"></div>{" "}
              {/* icon */}
              <div className="h-3 bg-light-accent rounded w-1/3"></div>{" "}
              {/* class text */}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-light-accent rounded-full"></div>{" "}
              {/* icon */}
              <div className="h-3 bg-light-accent rounded w-1/4"></div>{" "}
              {/* user text */}
            </div>
          </div>
        </div>

        {/* Status tag skeleton */}
        <div className="flex items-start justify-start">
          <div className="h-6 bg-light-accent rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default TaskSubmissionCardSkeleton;
