"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MapPin, ArrowRight, History } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  eventDate: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const formatEventDate = (date: string) => {
  const [year, month, day] = date.slice(0, 10).split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function CommunityGallerySection() {
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        if (!API_URL) {
          throw new Error("API URL is not configured");
        }

        const response = await fetch(`${API_URL}/api/events/past`);

        if (!response.ok) {
          throw new Error("Failed to load past events");
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.events)) {
          throw new Error("Invalid events response");
        }

        setPastEvents(data.events);
      } catch (error) {
        console.error("Past Events Error:", error);
        setError("Past events load করা যায়নি। আবার চেষ্টা করো।");
      } finally {
        setLoading(false);
      }
    };

    fetchPastEvents();
  }, []);

  const displayedEvents = pastEvents.slice(0, 6);

  return (
    <section className="bg-background px-3 py-16 text-foreground sm:px-5 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <Badge className="mb-3 border-0 bg-teal-100 text-teal-700 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-300">
            <History className="mr-1.5 h-3.5 w-3.5" />
            OUR PAST WORK
          </Badge>

          <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
            Our Impact in Action
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
            Explore the events we have completed together. Every past event
            represents the dedication of our volunteers and the positive
            difference we make in our communities.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        ) : error ? (
          <p className="py-10 text-center text-sm text-red-500">{error}</p>
        ) : displayedEvents.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-5 py-12 text-center">
            <CalendarDays className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

            <h3 className="text-lg font-semibold text-card-foreground">
              No Past Events Yet
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Completed events will appear here once their event dates have
              passed.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {displayedEvents.map((event) => (
              <article
                key={event._id}
                className="group overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-52 overflow-hidden sm:h-60">
                  <img
                    src={event.image || "/images/event-placeholder.png"}
                    alt={event.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/event-placeholder.png";
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <Badge className="absolute left-3 top-3 border-0 bg-white text-teal-700 hover:bg-white dark:bg-slate-900 dark:text-teal-300 dark:hover:bg-slate-900">
                    {event.category}
                  </Badge>

                  <span className="absolute bottom-3 right-3 rounded-full border border-white/30 bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    Completed
                  </span>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs text-teal-700 dark:text-teal-300 sm:text-sm">
                    <CalendarDays className="h-4 w-4 shrink-0" />

                    <span>{formatEventDate(event.eventDate)}</span>
                  </div>

                  <h3 className="mb-3 line-clamp-2 text-lg font-bold sm:text-xl">
                    {event.title}
                  </h3>

                  <p className="mb-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {event.description}
                  </p>

                  <div className="mb-5 flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-300" />

                    <span className="line-clamp-1">{event.location}</span>
                  </div>

                  <Link
                    href={`/events/${event._id}`}
                    className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-teal-600/30 bg-teal-600/5 px-4 text-sm font-semibold text-teal-700 transition hover:bg-teal-600 hover:text-white dark:text-teal-300 dark:hover:text-white"
                  >
                    View Event
                    <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
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
