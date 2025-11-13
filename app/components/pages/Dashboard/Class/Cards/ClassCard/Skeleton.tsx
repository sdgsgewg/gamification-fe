import React from "react";

export default function ClassCardSkeleton() {
  return (
    <div className="bg-background flex flex-col items-center justify-center gap-4 p-6 rounded-lg shadow-xs border border-br-primary animate-pulse">
      <div className="w-24 h-24 bg-gray-300 rounded-md"></div>
      <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
    </div>
  );
}
