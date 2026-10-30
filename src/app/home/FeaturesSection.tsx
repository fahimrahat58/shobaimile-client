import { Search, Users, HeartHandshake, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Discover Local Events",
    description:
      "Find meaningful community activities and volunteer opportunities near you.",
  },
  {
    icon: Users,
    title: "Volunteer Together",
    description:
      "Connect with people who share your passion for helping the community.",
  },
  {
    icon: HeartHandshake,
    title: "Create Real Impact",
    description:
      "Organize your own events and inspire others to make a difference.",
  },
  {
    icon: ShieldCheck,
    title: "Build Trust",
    description:
      "Stay connected with event organizers and manage your participation.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="font-semibold text-cyan-700">WHY SHOBAIMILE</span>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Making Community Service Easier
          </h2>
          <p className="mt-4 leading-7 text-gray-600">
            Everything you need to discover opportunities, connect with
            volunteers, and create positive change.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 inline-flex rounded-xl bg-cyan-100 p-3 text-cyan-700">
                  <Icon size={26} />
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
