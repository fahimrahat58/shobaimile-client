import Link from "next/link";
import {
  Trees,
  Heart,
  BookOpen,
  Droplets,
  Utensils,
  PawPrint,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  { name: "Cleanup", icon: Trees, color: "bg-green-100 text-green-700" },
  { name: "Donation", icon: Heart, color: "bg-rose-100 text-rose-700" },
  { name: "Education", icon: BookOpen, color: "bg-blue-100 text-blue-700" },
  { name: "Plantation", icon: Trees, color: "bg-emerald-100 text-emerald-700" },
  {
    name: "Food Support",
    icon: Utensils,
    color: "bg-orange-100 text-orange-700",
  },
  {
    name: "Animal Welfare",
    icon: PawPrint,
    color: "bg-purple-100 text-purple-700",
  },
];

export default function CategoriesSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-semibold text-cyan-700">
              EXPLORE OPPORTUNITIES
            </span>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Find Your Cause
            </h2>
            <p className="mt-3 text-gray-600">
              Choose a cause that matters to you.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 font-semibold text-cyan-700 hover:text-cyan-900"
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
                className="group rounded-2xl border border-gray-100 bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${category.color}`}
                >
                  <Icon size={27} />
                </div>

                <h3 className="font-semibold text-gray-800">{category.name}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
