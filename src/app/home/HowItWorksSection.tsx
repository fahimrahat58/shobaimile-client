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
    <section className="bg-cyan-50 px-3 py-12 dark:bg-background sm:px-5 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10 md:mb-14">
          <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-400 sm:text-base">
            GET STARTED
          </span>

          <h2 className="mt-3 text-2xl font-bold leading-tight text-gray-900 dark:text-foreground sm:text-3xl md:text-4xl">
            Making a Difference Is Simple
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-muted-foreground sm:mt-4 sm:text-base sm:leading-7">
            Three simple steps to start contributing to your community.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6 lg:gap-8">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="rounded-2xl border border-transparent bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6 lg:p-8 dark:border-border dark:bg-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-cyan-100 sm:text-4xl dark:text-cyan-900">
                    {step.number}
                  </span>

                  <div className="rounded-xl bg-cyan-100 p-3 text-cyan-700 sm:p-4 dark:bg-cyan-950 dark:text-cyan-300">
                    <Icon size={24} className="sm:h-7 sm:w-7" />
                  </div>
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900 sm:mt-7 sm:text-xl dark:text-card-foreground">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600 sm:mt-3 sm:leading-7 dark:text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-7 text-center sm:mt-10">
          <Link
            href="/register"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 sm:w-auto sm:text-base"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
