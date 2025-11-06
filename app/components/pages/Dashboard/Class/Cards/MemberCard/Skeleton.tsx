import React from "react";

const MemberCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-32 max-h-32 w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse mb-2"></div>
      <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
  );
};

export default MemberCardSkeleton;
