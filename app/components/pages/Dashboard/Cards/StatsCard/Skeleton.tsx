import React from "react";

const StatsCardSkeleton = () => {
  return (
    <div className="bg-surface rounded-xl border border-light-muted p-6 text-dark text-center shadow-sm animate-pulse">
      {/* Value Skeleton */}
      <div className="h-8 w-16 mx-auto mb-2 bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* Label Skeleton */}
      <div className="h-4 w-24 mx-auto bg-gray-300 dark:bg-gray-700 rounded"></div>
    </div>
  );
};

export default StatsCardSkeleton;
