const PendingTaskCardSkeleton = () => {
  return (
    <div className="flex justify-between items-center bg-tertiary p-4 rounded-xl border border-br-tertiary animate-pulse">
      <div className="flex flex-col gap-2">
        {/* Title skeleton */}
        <div className="h-4 w-40 bg-gray-300/30 rounded"></div>

        {/* Deadline skeleton */}
        <div className="h-3 w-28 bg-gray-300/20 rounded"></div>
      </div>

      {/* Status skeleton */}
      <div className="h-6 w-20 bg-gray-300/30 rounded-full"></div>
    </div>
  );
};

export default PendingTaskCardSkeleton;
