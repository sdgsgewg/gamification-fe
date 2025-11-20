import React from "react";

const UserActivityCardSkeleton = () => {
  return (
    <div className="w-full flex justify-between items-start py-3 border-b border-outline last:border-none animate-pulse">
      {/* Description skeleton */}
      <div className="bg-light-muted max-w-[90%] flex-1 pr-4">
        <div className="h-4 w-3/4 bg-muted rounded-md mb-1"></div>
      </div>

      {/* Timestamp skeleton */}
      <div className="bg-light-muted w-12 h-3 bg-muted rounded-md"></div>
    </div>
  );
};

export default UserActivityCardSkeleton;
