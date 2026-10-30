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
    <section className="bg-cyan-700 py-16 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 md:grid-cols-4">
        {impacts.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="text-center">
              <Icon size={32} className="mx-auto mb-4 text-cyan-200" />
              <h3 className="text-3xl font-bold">{item.value}</h3>
              <p className="mt-2 text-sm text-cyan-100">{item.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
