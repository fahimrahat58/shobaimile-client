import Link from "next/link";
import { Search, UserPlus, HandHeart, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover an Event",
    description:
      "Explore upcoming community events and find a cause you care about.",
  },
  {
    number: "02",
    icon: UserPlus,
    title: "Join the Community",
    description:
      "Create your account and register for events that inspire you.",
  },
  {
    number: "03",
    icon: HandHeart,
    title: "Make an Impact",
    description: "Show up, volunteer, and help build a stronger community.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-cyan-50 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="font-semibold text-cyan-700">GET STARTED</span>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Making a Difference Is Simple
          </h2>
          <p className="mt-4 leading-7 text-gray-600">
            Three simple steps to start contributing to your community.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="rounded-2xl bg-white p-8 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold text-cyan-100">
                    {step.number}
                  </span>
                  <div className="rounded-xl bg-cyan-100 p-4 text-cyan-700">
                    <Icon size={28} />
                  </div>
                </div>

                <h3 className="mt-7 text-xl font-bold text-gray-900">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-3 font-semibold text-white hover:bg-cyan-700"
          >
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
