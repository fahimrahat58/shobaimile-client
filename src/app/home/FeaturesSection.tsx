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
    <section className="bg-white px-3 py-12 sm:px-5 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <span className="text-sm font-semibold text-cyan-700 sm:text-base">
            WHY SHOBAIMILE
          </span>

          <h2 className="mt-3 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl md:text-4xl">
            Making Community Service Easier
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-600 sm:mt-4 sm:text-base sm:leading-7">
            Everything you need to discover opportunities, connect with
            volunteers, and create positive change.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:-translate-y-1 hover:shadow-lg sm:p-6 lg:p-7"
              >
                <div className="mb-4 inline-flex rounded-xl bg-cyan-100 p-3 text-cyan-700 sm:mb-5">
                  <Icon size={24} className="sm:h-[26px] sm:w-[26px]" />
                </div>

                <h3 className="text-base font-bold leading-snug text-gray-900 sm:text-lg">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600 sm:mt-3 sm:leading-7">
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
