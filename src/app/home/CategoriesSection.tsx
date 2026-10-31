import Link from "next/link";
import {
  Trees,
  Heart,
  BookOpen,
  Utensils,
  PawPrint,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    name: "Cleanup",
    icon: Trees,
    color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  {
    name: "Donation",
    icon: Heart,
    color: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  },
  {
    name: "Education",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    name: "Plantation",
    icon: Trees,
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  {
    name: "Food Support",
    icon: Utensils,
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  },
  {
    name: "Animal Welfare",
    icon: PawPrint,
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
];

export default function CategoriesSection() {
  return (
    <section className="bg-gray-50 py-12 dark:bg-background sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-8">
        <div className="mb-8 flex flex-col items-start gap-5 sm:mb-10 md:flex-row md:items-end md:justify-between lg:mb-12">
          <div>
            <span className="text-xs font-semibold tracking-wide text-cyan-700 dark:text-cyan-400 sm:text-sm">
              EXPLORE OPPORTUNITIES
            </span>

            <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-foreground sm:mt-3 sm:text-3xl md:text-4xl">
              Find Your Cause
            </h2>

            <p className="mt-2 text-sm text-gray-600 dark:text-muted-foreground sm:mt-3 sm:text-base">
              Choose a cause that matters to you.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300 sm:text-base"
          >
            View All Events
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                href={`/events?category=${encodeURIComponent(category.name)}`}
                key={category.name}
                className="group flex min-w-0 flex-col items-center rounded-xl border border-gray-100 bg-white px-3 py-5 text-center transition hover:-translate-y-1 hover:shadow-lg dark:border-border dark:bg-card sm:rounded-2xl sm:px-4 sm:py-6"
              >
                <div
                  className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl sm:mb-4 sm:h-14 sm:w-14 ${category.color}`}
                >
                  <Icon size={22} className="sm:h-[27px] sm:w-[27px]" />
                </div>

                <h3 className="break-words text-sm font-semibold leading-5 text-gray-800 dark:text-card-foreground sm:text-base">
                  {category.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
