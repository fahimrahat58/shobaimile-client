"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  ArrowLeft,
  Users,
  UserRound,
  ShieldCheck,
  Mail,
  Share2,
  HandHeart,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  eventDate: string;
  creatorEmail: string;
  volunteerGuidelines?: string[];
  participantsCount?: number;
  creator?: {
    name: string;
    email: string;
    image?: string;
  } | null;
}

interface JoinedEvent {
  _id: string;
  joinedAt: string;
  event?: {
    _id: string;
  };
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
  const [hasJoined, setHasJoined] = useState(false);
  const [checkingJoined, setCheckingJoined] = useState(true);

  // Current date/time
  const [currentTime, setCurrentTime] = useState(Date.now());

  // ================= FETCH EVENT =================

  useEffect(() => {
    let active = true;

    const fetchEvent = async () => {
      if (!eventId) {
        setError("Event ID not found");
        setLoading(false);
        return;
      }

      if (!API_URL) {
        setError("API URL is not configured");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

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

        if (!response.ok || !data.success || !data.event) {
          throw new Error(data.message || "Failed to load event");
        }

        const eventData: Event = {
          ...data.event,
          category:
            typeof data.event.category === "string" &&
            data.event.category.trim()
              ? data.event.category.trim()
              : "Community",
        };

        if (active) {
          setEvent(eventData);
        }
      } catch (error) {
        console.error("Event details error:", error);

        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Event details load failed",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchEvent();

    return () => {
      active = false;
    };
  }, [eventId]);

  // ================= CHECK JOINED EVENT =================

  useEffect(() => {
    let active = true;

    const checkJoinedEvent = async () => {
      if (isPending) return;

      if (!session?.user || !eventId || !API_URL) {
        setHasJoined(false);
        setCheckingJoined(false);
        return;
      }

      try {
        setCheckingJoined(true);

        const tokenResult = await authClient.token();
        const token = tokenResult.data?.token;

        if (tokenResult.error || !token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(`${API_URL}/api/events/joined`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to check joined events");
        }

        const joinedEvents: JoinedEvent[] = Array.isArray(data.events)
          ? data.events
          : [];

        const joined = joinedEvents.some(
          (item) => String(item.event?._id) === String(eventId),
        );

        if (active) {
          setHasJoined(joined);
        }
      } catch (error) {
        console.error("Check joined event error:", error);

        if (active) {
          setHasJoined(false);
        }
      } finally {
        if (active) {
          setCheckingJoined(false);
        }
      }
    };

    checkJoinedEvent();

    return () => {
      active = false;
    };
  }, [eventId, session?.user?.email, isPending]);

  // ================= JOIN EVENT =================

  const handleJoinEvent = async () => {
    if (isPending) {
      toast.info("Please wait...");
      return;
    }

    if (!session?.user) {
      toast.error("Please login to join this event");
      router.push("/login");
      return;
    }

    if (hasJoined) {
      toast.info("You have already joined this event");
      return;
    }

    if (joining || checkingJoined) {
      return;
    }

    if (!API_URL || !eventId) {
      toast.error("Event information not found");
      return;
    }

    // Prevent joining past events
    if (event && new Date(event.eventDate).getTime() < Date.now()) {
      toast.error("This event has already ended");
      return;
    }

    try {
      setJoining(true);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication token not found");
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

      // Already joined
      if (response.status === 409) {
        setHasJoined(true);
        toast.info("You have already joined this event");
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to join event");
      }

      // Update joined status
      setHasJoined(true);

      // Update volunteer count
      setEvent((previous) =>
        previous
          ? {
              ...previous,
              participantsCount:
                typeof data.participantsCount === "number"
                  ? data.participantsCount
                  : (previous.participantsCount ?? 0) + 1,
            }
          : previous,
      );

      toast.success("Successfully joined as a volunteer!");
    } catch (error) {
      console.error("Join event error:", error);

      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setJoining(false);
    }
  };

  // ================= SHARE EVENT =================

  const handleShare = async () => {
    try {
      const shareUrl = window.location.href;

      if (navigator.share) {
        await navigator.share({
          title: event?.title || "Community Event",
          text: "Join this community event with me!",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Event link copied!");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success("Event link copied!");
        } catch {
          toast.error("Could not share event link");
        }
      }
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen animate-pulse bg-background px-3 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-5 h-5 w-36 rounded bg-muted" />
          <div className="h-[240px] rounded-xl bg-muted sm:h-[360px] md:h-[420px]" />
          <div className="mt-5 h-36 rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (error || !event) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-4 text-center text-foreground">
        <h2 className="text-xl font-bold sm:text-2xl">Event Not Found</h2>

        <p className="mt-3 max-w-md break-words text-sm text-muted-foreground">
          {error || "Event not found"}
        </p>

        <Button
          onClick={() => router.push("/events")}
          className="mt-5 w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
      </main>
    );
  }

  // ================= EVENT STATUS =================

  const eventTimestamp = new Date(event.eventDate).getTime();

  const isPastEvent =
    !Number.isNaN(eventTimestamp) && eventTimestamp < currentTime;

  const formattedDate = new Date(event.eventDate).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const guidelines = Array.isArray(event.volunteerGuidelines)
    ? event.volunteerGuidelines.filter(
        (item) => typeof item === "string" && item.trim().length > 0,
      )
    : [];

  const joinButtonDisabled =
    joining || hasJoined || isPastEvent || isPending || checkingJoined;

  const joinButtonText = hasJoined
    ? "Already Joined"
    : isPastEvent
      ? "Event Ended"
      : isPending || checkingJoined
        ? "Checking..."
        : joining
          ? "Joining..."
          : "Join Event";

  // ================= UI =================

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-5 text-slate-900 dark:bg-background dark:text-foreground sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">
        {/* Back Button */}

        <button
          onClick={() => router.push("/events")}
          className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-teal-600 sm:mb-5 sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Upcoming Events
        </button>

        <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl dark:border-border dark:bg-card">
          {/* Category */}

          <div className="px-3 pt-3 sm:px-6 sm:pt-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
              <HandHeart className="h-4 w-4" />
              {event.category || "Community"}
            </span>
          </div>

          {/* Event Image */}

          <div className="relative isolate h-[240px] overflow-hidden sm:h-[360px] md:h-[420px] lg:h-[460px]">
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-slate-200 dark:bg-muted" />
            )}

            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

            <div className="absolute bottom-0 left-0 z-20 w-full p-3 sm:p-6 md:p-8">
              <h1 className="max-w-3xl break-words text-xl font-extrabold text-white sm:text-3xl md:text-4xl lg:text-5xl">
                {event.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-white/90 sm:text-sm">
                <span className="flex items-start gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0 text-teal-400" />
                  {event.location}
                </span>

                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-teal-400" />
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-6 md:p-8">
            {/* Volunteer Count and Join Button */}

            <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4 dark:border-border dark:bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-foreground">
                    {event.participantsCount ?? 0} Volunteers Joined
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-muted-foreground">
                    Sign up to join hands for this drive
                  </p>
                </div>
              </div>

              <div className="flex w-full items-center gap-2 sm:w-auto">
                {/* Share Button */}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="h-10 w-10 shrink-0"
                  aria-label="Share event"
                >
                  <Share2 className="h-4 w-4" />
                </Button>

                {/* Join Button */}

                <Button
                  onClick={handleJoinEvent}
                  disabled={joinButtonDisabled}
                  className="h-10 flex-1 bg-teal-600 px-3 text-white hover:bg-teal-700 sm:flex-none sm:px-5"
                >
                  {hasJoined ? (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  ) : (
                    <HandHeart className="mr-2 h-4 w-4" />
                  )}

                  {joinButtonText}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-[minmax(0,1fr)_280px] md:gap-10">
              {/* Main Content */}

              <div className="min-w-0">
                {/* Description */}

                <section>
                  <h2 className="text-base font-bold text-slate-900 sm:text-lg dark:text-foreground">
                    About this Social Initiative
                  </h2>

                  <p className="mt-3 whitespace-pre-line break-words border-b border-slate-200 pb-5 text-sm leading-7 text-slate-600 sm:pb-6 sm:text-base dark:border-border dark:text-muted-foreground">
                    {event.description}
                  </p>
                </section>

                {/* Guidelines */}

                <section className="mt-6 sm:mt-7">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                      <ClipboardList className="h-4 w-4" />
                    </div>

                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-foreground">
                      Volunteer Guidelines
                    </h2>
                  </div>

                  {guidelines.length > 0 ? (
                    <ul className="space-y-3">
                      {guidelines.map((guideline, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2.5 text-sm leading-6 text-slate-600 dark:text-muted-foreground"
                        >
                          <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-teal-600" />

                          <span className="break-words">{guideline}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-500 dark:bg-muted/30 dark:text-muted-foreground">
                      No volunteer guidelines have been added for this event
                      yet. Please follow the organizer&apos;s instructions.
                    </p>
                  )}
                </section>
              </div>

              {/* Sidebar */}

              <aside className="min-w-0">
                {/* Organizer */}

                <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 dark:border-border dark:bg-card">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-muted-foreground">
                    Initiative Organizer
                  </h3>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-border dark:bg-muted">
                      {event.creator?.image ? (
                        <img
                          src={event.creator.image}
                          alt={event.creator.name || "Organizer"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound className="h-6 w-6 text-teal-600" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-bold text-slate-900 dark:text-foreground">
                        {event.creator?.name || "Community Organizer"}
                      </h4>

                      <p className="mt-1 flex items-start gap-1 break-all text-xs text-slate-500 dark:text-muted-foreground">
                        <Mail className="mt-0.5 h-3 w-3 shrink-0" />
                        {event.creator?.email || event.creatorEmail}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-slate-200 pt-3 dark:border-border">
                    <div className="flex items-center gap-2 text-xs text-teal-700 dark:text-teal-400">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Verified Platform Member</span>
                    </div>
                  </div>
                </div>

                {/* Make Difference */}

                <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50/70 p-3 sm:p-4 dark:border-teal-900 dark:bg-teal-950/30">
                  <div className="flex items-center gap-2">
                    <HandHeart className="h-4 w-4 text-teal-700 dark:text-teal-300" />

                    <h3 className="text-xs font-bold text-teal-900 dark:text-teal-200">
                      Make a Difference
                    </h3>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-teal-800/80 dark:text-teal-300/80">
                    Your time and effort can make a real difference in
                    someone&apos;s life.
                  </p>
                </div>
              </aside>
            </div>

            {/* Bottom Join Section */}

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:mt-9 sm:p-5 dark:border-border dark:bg-muted/30">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-foreground">
                    Be Part of the Change
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm dark:text-muted-foreground">
                    Join this initiative and make a positive impact in your
                    community.
                  </p>
                </div>

                {/* Same Join Function */}

                <Button
                  onClick={handleJoinEvent}
                  disabled={joinButtonDisabled}
                  className="w-full shrink-0 bg-teal-600 px-6 text-white hover:bg-teal-700 sm:w-auto"
                >
                  {hasJoined ? (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  ) : (
                    <HandHeart className="mr-2 h-4 w-4" />
                  )}

                  {joinButtonText}
                </Button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
