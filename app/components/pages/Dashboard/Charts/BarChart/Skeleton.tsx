import React from "react";

const BarChartSkeleton = () => {
  return (
    <div className="relative h-64 w-full bg-surface rounded-xl border border-light-muted animate-pulse">
      <div className="absolute inset-0 flex items-end justify-around px-4 pb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-end w-full max-w-[60px] gap-2"
          >
            {/* Nilai di atas bar */}
            <div className="h-4 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
            {/* Batang bar */}
            <div
              className="w-full bg-gray-300 dark:bg-gray-700 rounded-md"
              style={{ height: `${Math.random() * 60 + 20}%` }} // variasi tinggi biar realistis
            />
            {/* Label di bawah bar */}
            <div className="h-3 w-10 bg-gray-300 dark:bg-gray-700 rounded mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChartSkeleton;
