
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  ArrowRight,
} from "lucide-react";

const events = [
  {
    id: "1",
    title: "Community Park Cleanup",
    category: "Cleanup",
    date: "November 15, 2026",
    location: "Dhaka, Bangladesh",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  },
  {
    id: "2",
    title: "Plant Trees, Save Nature",
    category: "Plantation",
    date: "November 20, 2026",
    location: "Chattogram, Bangladesh",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
  },
  {
    id: "3",
    title: "Support Local Families",
    category: "Donation",
    date: "November 25, 2026",
    location: "Sylhet, Bangladesh",
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800",
  },
];

export default function UpcomingEventsSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-semibold text-cyan-700">
              MAKE A DIFFERENCE
            </span>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Upcoming Community Events
            </h2>
            <p className="mt-3 text-gray-600">
              Join an event and become part of something meaningful.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 font-semibold text-cyan-700 hover:text-cyan-900"
          >
            Explore All <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>

              <div className="p-6">
                <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                  {event.category}
                </span>

                <h3 className="mt-4 text-xl font-bold text-gray-900">
                  {event.title}
                </h3>

                <div className="mt-5 space-y-3 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <CalendarDays size={17} className="text-cyan-700" />
                    {event.date}
                  </p>

                  <p className="flex items-center gap-2">
                    <MapPin size={17} className="text-cyan-700" />
                    {event.location}
                  </p>
                </div>

                <Link
                  href={`/events/${event.id}`}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-700"
                >
                  View Details <ArrowRight size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
