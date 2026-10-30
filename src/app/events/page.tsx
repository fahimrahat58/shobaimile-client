"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events`);

        if (!response.ok) {
          throw new Error("Failed to load events");
        }

        const data = await response.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error(error);
        setError("Events load করা যায়নি। আবার চেষ্টা করো।");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <Badge className="mb-4 bg-teal-100 text-teal-700 hover:bg-teal-100">
            Make a Difference
          </Badge>

          <h1 className="text-3xl font-bold text-slate-900 md:text-5xl">
            Upcoming Community Events
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Discover opportunities to help your community and create a positive
            impact together.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        ) : error ? (
          <p className="py-16 text-center text-red-500">{error}</p>
        ) : events.length === 0 ? (
          <div className="rounded-2xl bg-white py-20 text-center shadow-sm">
            <CalendarDays className="mx-auto mb-4 h-12 w-12 text-slate-400" />
            <h2 className="text-xl font-semibold text-slate-800">
              No Upcoming Events
            </h2>
            <p className="mt-2 text-slate-500">
              There are no upcoming events right now. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />

                  <Badge className="absolute left-4 top-4 bg-white text-teal-700 hover:bg-white">
                    {event.category}
                  </Badge>
                </div>

                <div className="p-6">
                  <div className="mb-3 flex items-center gap-2 text-sm text-teal-700">
                    <CalendarDays className="h-4 w-4" />
                    {new Date(event.eventDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>

                  <h2 className="mb-3 line-clamp-2 text-xl font-bold text-slate-900">
                    {event.title}
                  </h2>

                  <p className="mb-4 line-clamp-2 text-sm leading-6 text-slate-600">
                    {event.description}
                  </p>

                  <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="h-4 w-4 shrink-0 text-teal-600" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>

                  <Link
                    href={`/events/${event._id}`}
                    className="inline-flex h-10 w-full items-center justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
