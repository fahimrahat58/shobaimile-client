type ImpactProgressProps = {
  totalPoints: number;
  nextMilestone: number;
  pointsToNextMilestone: number;
};

export default function ImpactProgress({
  totalPoints,
  nextMilestone,
  pointsToNextMilestone,
}: ImpactProgressProps) {
  const progress =
    nextMilestone > 0
      ? Math.min((totalPoints / nextMilestone) * 100, 100)
      : 100;

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-gray-900 sm:text-lg">
            Next Achievement
          </h3>

          <p className="mt-1 text-xs leading-relaxed text-gray-500 sm:text-sm">
            {pointsToNextMilestone > 0
              ? `${pointsToNextMilestone} points left to reach your next milestone`
              : "You reached your current milestone!"}
          </p>
        </div>

        <span className="shrink-0 text-sm font-semibold text-emerald-600 sm:text-base">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-gray-100 sm:mt-5 sm:h-3">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-gray-500 sm:text-sm">
        <span>{totalPoints} points</span>
        <span>{nextMilestone} points</span>
      </div>
    </div>
  );
}
