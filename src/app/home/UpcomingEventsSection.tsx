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
        setEvents(data.events?.slice(0, 6) || []);
      } catch (error) {
        console.error("Upcoming events error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="bg-white px-4 py-14 sm:px-6 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <span className="text-xs font-semibold tracking-wider text-cyan-700 sm:text-sm">
              MAKE A DIFFERENCE
            </span>

            <h2 className="mt-2 text-2xl leading-tight font-bold text-gray-900 sm:mt-3 sm:text-3xl md:text-4xl">
              Upcoming Community Events
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
              Join an event and become part of something meaningful.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex w-fit shrink-0 items-center gap-2 text-sm font-semibold text-cyan-700 transition hover:text-cyan-900 sm:text-base"
          >
            Explore All <ArrowRight size={18} />
          </Link>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-2xl bg-gray-100 sm:h-96"
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl bg-gray-50 px-4 py-12 text-center sm:py-16">
            <CalendarDays className="mx-auto mb-4 h-9 w-9 text-gray-400 sm:h-10 sm:w-10" />

            <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
              No Upcoming Events
            </h3>

            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              New community events will appear here soon.
            </p>
          </div>
        ) : (
          /* Events Grid */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
            {events.map((event) => (
              <article
                key={event._id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Event Image */}
                <div className="h-52 shrink-0 overflow-hidden sm:h-56">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Event Content */}
                <div className="flex flex-1 flex-col p-4 sm:p-5 md:p-6">
                  <div>
                    <span className="inline-block max-w-full truncate rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                      {event.category}
                    </span>

                    <h3 className="mt-3 line-clamp-2 text-lg leading-snug font-bold text-gray-900 sm:mt-4 sm:text-xl">
                      {event.title}
                    </h3>

                    <div className="mt-4 space-y-3 text-sm text-gray-600 sm:mt-5">
                      <p className="flex items-start gap-2">
                        <CalendarDays
                          size={17}
                          className="mt-0.5 shrink-0 text-cyan-700"
                        />

                        <span>
                          {new Date(event.eventDate).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </p>

                      <p className="flex items-start gap-2">
                        <MapPin
                          size={17}
                          className="mt-0.5 shrink-0 text-cyan-700"
                        />

                        <span className="line-clamp-2 break-words">
                          {event.location}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Details Button */}
                  <Link
                    href={`/events/${event._id}`}
                    className="mt-auto mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 active:scale-[0.98] sm:mt-6 sm:text-base"
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
