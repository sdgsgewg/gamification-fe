import React from "react";

const TaskCardSkeleton = () => {
  return (
    <div className="bg-background flex gap-4 rounded-xl shadow-xs p-6 border border-br-primary animate-pulse">
      {/* Thumbnail / image placeholder */}
      <div className="flex-shrink-0 w-[200px] h-[120px] bg-light-accent rounded-lg"></div>

      {/* Content section */}
      <div className="flex flex-col justify-between flex-1">
        <div className="flex flex-col gap-2">
          <div className="w-3/4 h-4 bg-light-accent rounded"></div>
          <div className="w-16 h-4 bg-light-accent rounded-full"></div>
          <div className="w-1/2 h-3 bg-light-accent rounded"></div>
          <div className="w-1/3 h-3 bg-light-accent rounded"></div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div className="w-3 h-3 bg-light-accent rounded-full"></div>
          <div className="w-1/4 h-3 bg-light-accent rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default TaskCardSkeleton;
