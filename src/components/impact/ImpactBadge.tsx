type ImpactBadgeProps = {
  badge: string;
};

export default function ImpactBadge({ badge }: ImpactBadgeProps) {
  return (
    <div className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:p-5 md:p-6">
      <p className="text-xs font-medium text-emerald-700 sm:text-sm">
        Your Volunteer Badge
      </p>

      <div className="mt-3 flex items-center gap-3 sm:gap-4">
        <span className="shrink-0 text-3xl sm:text-4xl">🏅</span>

        <div className="min-w-0">
          <h3 className="break-words text-lg font-bold capitalize text-emerald-900 sm:text-xl">
            {badge || "Beginner"}
          </h3>

          <p className="mt-1 text-xs leading-relaxed text-emerald-700 sm:text-sm">
            Keep contributing to unlock more achievements.
          </p>
        </div>
      </div>
    </div>
  );
}
