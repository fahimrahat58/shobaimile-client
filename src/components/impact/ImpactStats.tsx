type ImpactStatsProps = {
  totalPoints: number;
  volunteerHours: number;
  completedEvents: number;
};

export default function ImpactStats({
  totalPoints,
  volunteerHours,
  completedEvents,
}: ImpactStatsProps) {
  const stats = [
    {
      title: "Total Points",
      value: totalPoints,
      icon: "🏆",
      description: "Your earned points",
    },
    {
      title: "Volunteer Hours",
      value: volunteerHours,
      icon: "⏱️",
      description: "Hours you contributed",
    },
    {
      title: "Completed Events",
      value: completedEvents,
      icon: "🌱",
      description: "Events you completed",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 md:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                {stat.title}
              </p>

              <h2 className="mt-1.5 break-words text-2xl font-bold text-gray-900 sm:mt-2 sm:text-3xl">
                {stat.value}
              </h2>
            </div>

            <span className="shrink-0 text-2xl sm:text-3xl">{stat.icon}</span>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:mt-3 sm:text-sm">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
}
