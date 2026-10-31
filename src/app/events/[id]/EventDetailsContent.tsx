"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CalendarDays, MapPin, ArrowLeft, Users } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  eventDate: string;
  creatorEmail: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EventDetailsContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const eventId = params?.id;

  const { data: session, isPending } = authClient.useSession();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);
  const isMountedRef = useRef(false);

  // Fetch event details
  useEffect(() => {
    let isMounted = true;
    isMountedRef.current = true;

    const fetchEvent = async () => {
      if (!eventId) {
        setError("Event ID পাওয়া যায়নি");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        if (!API_URL) {
          throw new Error("API URL is not configured");
        }

        const response = await fetch(
          `${API_URL}/api/events/${encodeURIComponent(eventId)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load event");
        }

        if (!data.success || !data.event) {
          throw new Error(data.message || "Event data not found");
        }

        if (isMounted) {
          setEvent(data.event);
        }
      } catch (error) {
        console.error("Event details error:", error);

        if (isMounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Event details load করা যায়নি",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEvent();

    return () => {
      isMounted = false;
      isMountedRef.current = false;
    };
  }, [eventId]);

  // Join event
  const handleJoinEvent = async () => {
    if (isPending) {
      toast.info("একটু অপেক্ষা করো...");
      return;
    }

    if (!session?.user) {
      toast.error("Join করতে আগে login করো");
      router.push("/login");
      return;
    }

    if (!API_URL) {
      toast.error("API URL is not configured");
      return;
    }

    try {
      setJoining(true);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication token পাওয়া যায়নি");
      }

      const response = await fetch(
        `${API_URL}/api/events/${encodeURIComponent(eventId)}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to join event");
      }

      toast.success("Successfully joined the event!");
    } catch (error) {
      console.error("Join event error:", error);

      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      if (isMountedRef.current) {
        setJoining(false);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen animate-pulse bg-background px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 h-10 w-36 rounded-md bg-muted" />
          <div className="h-96 rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  // Error or event not found
  if (error || !event) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-4 text-center text-foreground">
        <h2 className="text-2xl font-bold">Event Not Found</h2>

        <p className="mt-3 max-w-md text-muted-foreground">
          {error || "এই event-টি পাওয়া যায়নি।"}
        </p>

        <Button onClick={() => router.push("/events")} className="mt-5">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
      </main>
    );
  }

  // Check if event has ended
  const isPastEvent = new Date(event.eventDate).getTime() < Date.now();

  return (
    <main className="min-h-screen bg-background px-4 py-12 text-foreground">
      <div className="mx-auto max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => router.push("/events")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>

        <article className="overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-sm">
          {/* Event image */}
          <div className="h-64 sm:h-96">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-10">
            <Badge className="mb-4 border-0 bg-teal-100 text-teal-700 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-300 dark:hover:bg-teal-950">
              {event.category}
            </Badge>

            <h1 className="text-3xl font-bold text-card-foreground sm:text-4xl">
              {event.title}
            </h1>

            {/* Event information */}
            <div className="mt-6 flex flex-col gap-4 text-muted-foreground sm:flex-row sm:gap-8">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-teal-600 dark:text-teal-300" />

                {new Date(event.eventDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-teal-600 dark:text-teal-300" />
                {event.location}
              </div>
            </div>

            <div className="my-8 border-t border-border" />

            {/* Description */}
            <h2 className="mb-4 text-2xl font-bold text-card-foreground">
              About This Event
            </h2>

            <p className="whitespace-pre-line leading-8 text-muted-foreground">
              {event.description}
            </p>

            {/* Join event section */}
            <div className="mt-10 rounded-2xl border border-teal-200 bg-teal-50 p-6 dark:border-teal-900 dark:bg-teal-950/60">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-teal-700 dark:text-teal-300" />

                <div>
                  <h3 className="font-semibold text-foreground">
                    Be Part of the Change
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Join this event and make a positive impact in your
                    community.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleJoinEvent}
                disabled={joining || isPastEvent}
                className="mt-5 w-full bg-teal-600 text-white hover:bg-teal-700 sm:w-auto"
              >
                {isPastEvent
                  ? "Event Has Ended"
                  : joining
                    ? "Joining..."
                    : "Join This Event"}
              </Button>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
