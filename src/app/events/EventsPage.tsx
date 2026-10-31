"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  ArrowRight,
  Search,
  Plus,
  X,
} from "lucide-react";
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

const categories = [
  "All",
  "Cleanup",
  "Donation",
  "Education",
  "Plantation",
  "Food Support",
  "Animal Welfare",
];

export default function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const selectedCategory = searchParams.get("category") || "All";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (!API_URL) {
          throw new Error("API URL is not configured");
        }

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

  const handleCategoryChange = (category: string) => {
    if (category === "All") {
      router.push("/events", { scroll: false });
    } else {
      router.push(`/events?category=${encodeURIComponent(category)}`, {
        scroll: false,
      });
    }
  };

  const filteredEvents = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const searchedEvents = events.filter((event) => {
      return (
        event.title.toLowerCase().includes(search) ||
        event.description.toLowerCase().includes(search) ||
        event.location.toLowerCase().includes(search) ||
        event.category.toLowerCase().includes(search)
      );
    });

    if (selectedCategory === "All") {
      return searchedEvents;
    }

    return [...searchedEvents].sort((a, b) => {
      const aMatches =
        a.category.toLowerCase() === selectedCategory.toLowerCase();

      const bMatches =
        b.category.toLowerCase() === selectedCategory.toLowerCase();

      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;

      return 0;
    });
  }, [events, selectedCategory, searchTerm]);

  const hasSelectedCategoryEvents = events.some(
    (event) => event.category.toLowerCase() === selectedCategory.toLowerCase(),
  );

  return (
    <main className="min-h-screen bg-background px-3 py-10 text-foreground sm:px-5 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 text-center sm:mb-10">
          <Badge className="mb-3 border-0 bg-teal-100 text-teal-700 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-300 dark:hover:bg-teal-950 sm:mb-4">
            Make a Difference
          </Badge>

          <h1 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl md:text-5xl">
            Community Events
          </h1>

          <p className="mx-auto mt-3 max-w-2xl px-2 text-sm leading-6 text-muted-foreground sm:mt-4 sm:text-base sm:leading-7">
            Discover opportunities to help your community and create a positive
            impact together.
          </p>
        </div>

        <section className="mb-7 sm:mb-8">
          <h2 className="mb-3 text-base font-semibold text-foreground sm:mb-4 sm:text-lg">
            Explore Categories
          </h2>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category) => {
              const isActive =
                selectedCategory.toLowerCase() === category.toLowerCase();

              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`rounded-full border px-3 py-2 text-xs font-medium transition sm:px-5 sm:py-2.5 sm:text-sm ${
                    isActive
                      ? "border-teal-600 bg-teal-600 text-white shadow-sm hover:bg-teal-700"
                      : "border-border bg-card text-muted-foreground hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-300"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:gap-4">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:left-4 sm:h-5 sm:w-5" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events by title, location or category..."
              className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-10 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 sm:h-12 sm:pl-12 sm:pr-12"
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground sm:right-4"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
          </div>

          <Link
            href="/create-event"
            className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white transition hover:bg-teal-700 sm:h-12 sm:w-auto sm:px-6"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            Add Event
          </Link>
        </div>

        {selectedCategory !== "All" && (
          <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                {selectedCategory} Events
              </h2>

              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Events from your selected category appear first.
              </p>
            </div>

            <button
              onClick={() => handleCategoryChange("All")}
              className="text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-300"
            >
              Clear Category
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-2xl border border-border bg-muted sm:h-96"
              />
            ))}
          </div>
        ) : error ? (
          <p className="py-12 text-center text-sm text-red-500 sm:py-16 sm:text-base">
            {error}
          </p>
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-4 py-12 text-center shadow-sm sm:px-6 sm:py-20">
            <CalendarDays className="mx-auto mb-4 h-10 w-10 text-muted-foreground sm:h-12 sm:w-12" />

            <h2 className="text-lg font-semibold text-card-foreground sm:text-xl">
              {searchTerm
                ? "No Matching Events"
                : selectedCategory !== "All" && !hasSelectedCategoryEvents
                  ? "No Events in This Category"
                  : "No Upcoming Events"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {searchTerm
                ? "Try searching with a different keyword."
                : "There are no events available right now. Check back later!"}
            </p>

            {(searchTerm || selectedCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  handleCategoryChange("All");
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 sm:px-5"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between sm:mb-5">
              <p className="text-xs text-muted-foreground sm:text-sm">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredEvents.length}
                </span>{" "}
                {filteredEvents.length === 1 ? "event" : "events"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
              {filteredEvents.map((event) => (
                <article
                  key={event._id}
                  className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition hover:shadow-lg sm:hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden sm:h-56">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />

                    <Badge className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] border-0 bg-white text-teal-700 hover:bg-white dark:bg-slate-900 dark:text-teal-300 dark:hover:bg-slate-900 sm:left-4 sm:top-4">
                      {event.category}
                    </Badge>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="mb-3 flex items-center gap-2 text-xs text-teal-700 dark:text-teal-300 sm:text-sm">
                      <CalendarDays className="h-4 w-4 shrink-0" />

                      <span>
                        {new Date(event.eventDate).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h2 className="mb-3 line-clamp-2 text-lg font-bold text-card-foreground sm:text-xl">
                      {event.title}
                    </h2>

                    <p className="mb-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {event.description}
                    </p>

                    <div className="mb-5 flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-300" />

                      <span className="line-clamp-1 break-all">
                        {event.location}
                      </span>
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
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
