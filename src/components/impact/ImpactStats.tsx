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
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {stat.value}
              </h2>
            </div>

            <span className="text-3xl">{stat.icon}</span>
          </div>

          <p className="mt-3 text-sm text-gray-500">{stat.description}</p>
        </div>
      ))}
    </div>
  );
}
