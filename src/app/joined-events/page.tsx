"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, ArrowRight, Users } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
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

interface JoinedEvent {
  _id: string;
  joinedAt: string;
  event: Event;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function JoinedEventsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [events, setEvents] = useState<JoinedEvent[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchJoinedEvents = async () => {
      setFetching(true);

      try {
        const tokenResult = await authClient.token();
        const token = tokenResult.data?.token;

        if (tokenResult.error || !token) {
          throw new Error("Authentication token পাওয়া যায়নি");
        }

        if (!API_URL) {
          throw new Error("API URL is not configured");
        }

        const response = await fetch(`${API_URL}/api/events/joined`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load joined events");
        }

        setEvents(data.events || []);
      } catch (error) {
        console.error(error);
        toast.error("Joined events load করা যায়নি");
      } finally {
        setFetching(false);
      }
    };

    if (!isPending && session) {
      fetchJoinedEvents();
    }
  }, [session, isPending]);

  const loading = isPending || (session && fetching);

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-2xl border border-border bg-muted"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-4 text-center">
        <Users className="mb-4 h-12 w-12 text-teal-600 dark:text-teal-300" />

        <h1 className="text-2xl font-bold text-foreground">Login Required</h1>

        <p className="mt-2 text-muted-foreground">
          তোমার Joined Events দেখতে Login করো।
        </p>

        <Link
          href="/login"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
        >
          Login
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-16 text-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <Badge className="mb-4 border-0 bg-teal-100 text-teal-700 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-300 dark:hover:bg-teal-950">
            Your Participation
          </Badge>

          <h1 className="text-3xl font-bold text-foreground md:text-5xl">
            My Joined Events
          </h1>

          <p className="mt-4 text-muted-foreground">
            Track the community events you have joined.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card py-20 text-center shadow-sm">
            <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />

            <h2 className="text-xl font-semibold text-card-foreground">
              No Joined Events Yet
            </h2>

            <p className="mt-2 text-muted-foreground">
              Explore upcoming events and join your first community activity.
            </p>

            <Link
              href="/events"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
            >
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((item) => {
              const event = item.event;

              return (
                <article
                  key={item._id}
                  className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="h-56 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <Badge className="mb-3 border-0 bg-teal-100 text-teal-700 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-300 dark:hover:bg-teal-950">
                      {event.category}
                    </Badge>

                    <h2 className="mb-3 line-clamp-2 text-xl font-bold text-card-foreground">
                      {event.title}
                    </h2>

                    <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4 text-teal-600 dark:text-teal-300" />

                      {new Date(event.eventDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>

                    <div className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-300" />

                      <span className="line-clamp-1">{event.location}</span>
                    </div>

                    <Link
                      href={`/events/${event._id}`}
                      className="inline-flex h-10 w-full items-center justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
