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
    <main className="min-h-screen bg-background px-4 py-16 text-foreground">
      <div className="mx-auto max-w-7xl">
        {/* Page Heading */}
        <div className="mb-10 text-center">
          <Badge className="mb-4 border-0 bg-teal-100 text-teal-700 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-300 dark:hover:bg-teal-950">
            Make a Difference
          </Badge>

          <h1 className="text-3xl font-bold text-foreground md:text-5xl">
            Community Events
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Discover opportunities to help your community and create a positive
            impact together.
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Explore Categories
          </h2>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const isActive =
                selectedCategory.toLowerCase() === category.toLowerCase();

              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${
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
        </div>

        {/* Search and Add Event */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events by title, location or category..."
              className="h-12 w-full rounded-xl border border-border bg-card pl-12 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <Link
            href="/create-event"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            <Plus className="h-5 w-5" />
            Add Event
          </Link>
        </div>

        {/* Selected Category Info */}
        {selectedCategory !== "All" && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {selectedCategory} Events
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
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

        {/* Event List */}
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-2xl border border-border bg-muted"
              />
            ))}
          </div>
        ) : error ? (
          <p className="py-16 text-center text-red-500">{error}</p>
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card py-20 text-center shadow-sm">
            <CalendarDays className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />

            <h2 className="text-xl font-semibold text-card-foreground">
              {searchTerm
                ? "No Matching Events"
                : selectedCategory !== "All" && !hasSelectedCategoryEvents
                  ? "No Events in This Category"
                  : "No Upcoming Events"}
            </h2>

            <p className="mt-2 text-muted-foreground">
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
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredEvents.length}
                </span>{" "}
                {filteredEvents.length === 1 ? "event" : "events"}
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <article
                  key={event._id}
                  className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />

                    <Badge className="absolute left-4 top-4 border-0 bg-white text-teal-700 hover:bg-white dark:bg-slate-900 dark:text-teal-300 dark:hover:bg-slate-900">
                      {event.category}
                    </Badge>
                  </div>

                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-2 text-sm text-teal-700 dark:text-teal-300">
                      <CalendarDays className="h-4 w-4" />

                      {new Date(event.eventDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>

                    <h2 className="mb-3 line-clamp-2 text-xl font-bold text-card-foreground">
                      {event.title}
                    </h2>

                    <p className="mb-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {event.description}
                    </p>

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
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
