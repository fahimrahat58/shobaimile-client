"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";

interface Event {
  _id: string;
  title: string;
  category: string;
  eventDate: string;
  location: string;
  image: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UpcomingEventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events/upcoming`);

        if (!response.ok) {
          throw new Error("Failed to load upcoming events");
        }

        const data = await response.json();
        setEvents(data.events?.slice(0, 3) || []);
      } catch (error) {
        console.error("Upcoming events error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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

        {loading ? (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl bg-gray-50 py-16 text-center">
            <CalendarDays className="mx-auto mb-4 h-10 w-10 text-gray-400" />
            <h3 className="text-xl font-bold text-gray-900">
              No Upcoming Events
            </h3>
            <p className="mt-2 text-gray-600">
              New community events will appear here soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
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
                      {new Date(event.eventDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin size={17} className="text-cyan-700" />
                      {event.location}
                    </p>
                  </div>

                  <Link
                    href={`/events/${event._id}`}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-700"
                  >
                    View Details <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
