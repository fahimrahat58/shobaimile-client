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
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Next Achievement</h3>

          <p className="mt-1 text-sm text-gray-500">
            {pointsToNextMilestone > 0
              ? `${pointsToNextMilestone} points left to reach your next milestone`
              : "You reached your current milestone!"}
          </p>
        </div>

        <span className="font-semibold text-emerald-600">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 flex justify-between text-sm text-gray-500">
        <span>{totalPoints} points</span>
        <span>{nextMilestone} points</span>
      </div>
    </div>
  );
}
