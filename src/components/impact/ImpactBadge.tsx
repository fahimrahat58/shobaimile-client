type ImpactBadgeProps = {
  badge: string;
};

export default function ImpactBadge({ badge }: ImpactBadgeProps) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
      <p className="text-sm font-medium text-emerald-700">
        Your Volunteer Badge
      </p>

      <div className="mt-3 flex items-center gap-3">
        <span className="text-4xl">🏅</span>

        <div>
          <h3 className="text-xl font-bold capitalize text-emerald-900">
            {badge || "Beginner"}
          </h3>

          <p className="mt-1 text-sm text-emerald-700">
            Keep contributing to unlock more achievements.
          </p>
        </div>
      </div>
    </div>
  );
}
