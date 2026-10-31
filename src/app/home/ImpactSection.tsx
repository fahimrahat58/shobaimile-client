import { Users, CalendarCheck, HeartHandshake, MapPin } from "lucide-react";

const impacts = [
  {
    icon: Users,
    value: "500+",
    label: "Community Members",
  },
  {
    icon: CalendarCheck,
    value: "50+",
    label: "Events Organized",
  },
  {
    icon: HeartHandshake,
    value: "1,200+",
    label: "Volunteer Hours",
  },
  {
    icon: MapPin,
    value: "20+",
    label: "Local Communities",
  },
];

export default function ImpactSection() {
  return (
    <section className="bg-cyan-700 px-3 py-12 text-white sm:px-5 sm:py-16 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-4 md:gap-8">
        {impacts.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="text-center">
              <Icon
                size={28}
                className="mx-auto mb-3 text-cyan-200 sm:mb-4 sm:h-8 sm:w-8"
              />

              <h3 className="text-2xl font-bold sm:text-3xl md:text-4xl">
                {item.value}
              </h3>

              <p className="mt-2 text-xs leading-5 text-cyan-100 sm:text-sm">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
