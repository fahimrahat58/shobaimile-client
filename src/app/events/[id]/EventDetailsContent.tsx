"use client";

import { useEffect, useState } from "react";
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
  const params = useParams();
  const router = useRouter();

  const eventId = params.id as string;

  const { data: session, isPending } = authClient.useSession();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  // Fetch Event Details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!API_URL) {
          throw new Error("API URL is not configured");
        }

        const response = await fetch(`${API_URL}/api/events/${eventId}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load event");
        }

        setEvent(data.event);
      } catch (error) {
        console.error(error);
        toast.error("Event details load করা যায়নি");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  // Join Event
  const handleJoinEvent = async () => {
    if (!session?.user) {
      toast.error("Join করতে আগে login করো");
      router.push("/login");
      return;
    }

    try {
      setJoining(true);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication token পাওয়া যায়নি");
      }

      const response = await fetch(`${API_URL}/api/events/${eventId}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to join event");
      }

      toast.success("Successfully joined the event!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setJoining(false);
    }
  };

  // Loading State
  if (loading || isPending) {
    return (
      <div className="min-h-screen animate-pulse bg-slate-50 px-4 py-20">
        <div className="mx-auto h-96 max-w-5xl rounded-2xl bg-slate-200" />
      </div>
    );
  }

  // Event Not Found
  if (!event) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-slate-800">Event Not Found</h2>

        <Button onClick={() => router.push("/events")} className="mt-5">
          Back to Events
        </Button>
      </div>
    );
  }

  // Check Past Event
  const isPastEvent =
    new Date(event.eventDate).getTime() < new Date().getTime();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/events")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>

        <article className="overflow-hidden rounded-3xl bg-white shadow-sm">
          {/* Event Image */}
          <div className="h-64 sm:h-96">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-10">
            {/* Category */}
            <Badge className="mb-4 bg-teal-100 text-teal-700 hover:bg-teal-100">
              {event.category}
            </Badge>

            {/* Title */}
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              {event.title}
            </h1>

            {/* Event Information */}
            <div className="mt-6 flex flex-col gap-4 text-slate-600 sm:flex-row sm:gap-8">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-teal-600" />

                {new Date(event.eventDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-teal-600" />
                {event.location}
              </div>
            </div>

            <div className="my-8 border-t border-slate-100" />

            {/* Description */}
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              About This Event
            </h2>

            <p className="whitespace-pre-line leading-8 text-slate-600">
              {event.description}
            </p>

            {/* Join Event Section */}
            <div className="mt-10 rounded-2xl bg-teal-50 p-6">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-teal-700" />

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Be Part of the Change
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    Join this event and make a positive impact in your
                    community.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleJoinEvent}
                disabled={joining || isPastEvent}
                className="mt-5 w-full bg-teal-600 hover:bg-teal-700 sm:w-auto"
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
