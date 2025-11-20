const LeaderboardCardSkeleton = () => {
  return (
    <div className="flex justify-between items-center bg-tertiary p-3 rounded-xl border border-br-tertiary animate-pulse">
      <div className="flex items-center gap-3">
        {/* Rank */}
        <div className="h-5 w-10 bg-br-tertiary rounded-md"></div>

        {/* Username */}
        <div className="h-5 w-32 bg-br-tertiary rounded-md"></div>
      </div>

      {/* Points */}
      <div className="h-4 w-20 bg-br-tertiary rounded-md"></div>
    </div>
  );
};

export default LeaderboardCardSkeleton;
