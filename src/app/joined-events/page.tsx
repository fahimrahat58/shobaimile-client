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

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingEvents = (data.events || [])
          .filter((item: JoinedEvent) => {
            const eventDate = new Date(item.event.eventDate);

            return !isNaN(eventDate.getTime()) && eventDate >= today;
          })
          .sort((a: JoinedEvent, b: JoinedEvent) => {
            return (
              new Date(a.event.eventDate).getTime() -
              new Date(b.event.eventDate).getTime()
            );
          });

        setEvents(upcomingEvents);
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
      <main className="min-h-screen overflow-x-hidden bg-background px-3 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-8 flex flex-col items-center sm:mb-10 md:mb-12">
            <div className="mb-4 h-6 w-36 animate-pulse rounded-full bg-muted" />

            <div className="h-8 w-56 animate-pulse rounded-lg bg-muted sm:h-10 sm:w-72 md:h-12 md:w-80" />

            <div className="mt-4 h-4 w-64 max-w-full animate-pulse rounded-md bg-muted sm:h-5 sm:w-96" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-7 xl:gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card sm:rounded-2xl"
              >
                <div className="aspect-[16/9] w-full animate-pulse bg-muted" />

                <div className="flex flex-1 flex-col p-4 sm:p-5 lg:p-6">
                  <div className="mb-3 h-5 w-24 animate-pulse rounded-full bg-muted" />

                  <div className="mb-2 h-5 w-full animate-pulse rounded-md bg-muted" />

                  <div className="mb-4 h-5 w-3/4 animate-pulse rounded-md bg-muted" />

                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
                  </div>

                  <div className="mb-5 flex items-center gap-2">
                    <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
                  </div>

                  {/* Button */}
                  <div className="mt-auto h-10 w-full animate-pulse rounded-md bg-muted sm:h-11" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-4 py-10 text-center sm:py-14">
        <Users className="mb-4 h-10 w-10 text-teal-600 dark:text-teal-300 sm:h-12 sm:w-12" />

        <h1 className="text-xl font-bold text-foreground sm:text-2xl">
          Login Required
        </h1>

        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground sm:text-base">
          Login to see your joined events
        </p>

        <Link
          href="/login"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-teal-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
        >
          Login
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-background px-3 py-8 text-foreground sm:px-6 sm:py-12 md:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 text-center sm:mb-10 md:mb-12">
          <Badge className="mb-3 border-0 bg-teal-100 px-3 py-1 text-xs text-teal-700 hover:bg-teal-100 sm:mb-4 dark:bg-teal-950 dark:text-teal-300 dark:hover:bg-teal-950">
            Your Participation
          </Badge>

          <h1 className="text-2xl leading-tight font-bold text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
            My Joined Events
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
            Track the upcoming community events you have joined.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-card px-4 py-10 text-center shadow-sm sm:px-8 sm:py-14 md:py-16">
            <Users className="mx-auto mb-4 h-10 w-10 text-muted-foreground sm:h-12 sm:w-12" />

            <h2 className="text-lg font-semibold text-card-foreground sm:text-xl">
              No Upcoming Joined Events
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
              You have no upcoming joined events. Explore upcoming events and
              join your next community activity.
            </p>

            <Link
              href="/events"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-teal-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
            >
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-7 xl:gap-8">
            {events.map((item) => {
              const event = item.event;

              return (
                <article
                  key={item._id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-2xl"
                >
                  <div className="aspect-[16/9] w-full shrink-0 overflow-hidden bg-muted">
                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-5 lg:p-6">
                    <div className="min-w-0">
                      <Badge className="mb-3 max-w-full truncate border-0 bg-teal-100 text-xs text-teal-700 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-300 dark:hover:bg-teal-950">
                        {event.category}
                      </Badge>

                      <h2 className="mb-3 line-clamp-2 break-words text-base leading-snug font-bold text-card-foreground sm:text-lg lg:text-xl">
                        {event.title}
                      </h2>

                      <div className="mb-3 flex min-w-0 items-start gap-2 text-xs text-muted-foreground sm:text-sm">
                        <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-300" />

                        <span className="break-words">
                          {new Date(event.eventDate).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>

                      <div className="mb-5 flex min-w-0 items-start gap-2 text-xs text-muted-foreground sm:text-sm">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-300" />

                        <span className="line-clamp-2 break-words">
                          {event.location}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/events/${event._id}`}
                      className="mt-auto inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-teal-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-card sm:min-h-11"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 shrink-0" />
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
