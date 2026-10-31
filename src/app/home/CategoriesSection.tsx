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
    <section className="bg-gray-50 py-20 dark:bg-background">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-semibold text-cyan-700 dark:text-cyan-400">
              EXPLORE OPPORTUNITIES
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-foreground md:text-4xl">
              Find Your Cause
            </h2>

            <p className="mt-3 text-gray-600 dark:text-muted-foreground">
              Choose a cause that matters to you.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 font-semibold text-cyan-700 transition hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300"
          >
            View All Events <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                href={`/events?category=${encodeURIComponent(category.name)}`}
                key={category.name}
                className="group rounded-2xl border border-gray-100 bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-lg dark:border-border dark:bg-card"
              >
                <div
                  className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${category.color}`}
                >
                  <Icon size={27} />
                </div>

                <h3 className="font-semibold text-gray-800 dark:text-card-foreground">
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
