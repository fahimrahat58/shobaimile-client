"use client";

import { useEffect, useRef, useState } from "react";
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
  event: {
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

  const isMountedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    isMountedRef.current = true;

    const fetchEvent = async () => {
      if (!eventId) {
        setError("Event ID Not Found");
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
              : "Event details load failed",
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

  useEffect(() => {
    let isMounted = true;

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
          throw new Error("Authentication token পাওয়া যায়নি");
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

        if (isMounted) {
          setHasJoined(joined);
        }
      } catch (error) {
        console.error("Check joined event error:", error);
      } finally {
        if (isMounted) {
          setCheckingJoined(false);
        }
      }
    };

    checkJoinedEvent();

    return () => {
      isMounted = false;
    };
  }, [eventId, session?.user?.email, isPending]);

  const handleJoinEvent = async () => {
    if (isPending) {
      toast.info("Please Wait...");
      return;
    }

    if (!session?.user) {
      toast.error("To Join Please Log In");
      router.push("/login");
      return;
    }

    if (hasJoined) {
      toast.info("You have already joined this event");
      return;
    }

    if (!API_URL) {
      toast.error("API URL is not configured");
      return;
    }

    if (!eventId) {
      toast.error("Event Not Found");
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

      if (response.status === 409) {
        if (isMountedRef.current) {
          setHasJoined(true);
        }

        toast.info("You have already joined this event");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to join event");
      }

      if (isMountedRef.current) {
        setHasJoined(true);
        setEvent((previous) =>
          previous
            ? {
                ...previous,
                participantsCount: (previous.participantsCount ?? 0) + 1,
              }
            : previous,
        );
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

  if (loading) {
    return (
      <div className="min-h-screen animate-pulse bg-background px-3 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-5 h-5 w-36 rounded bg-muted sm:mb-6 sm:w-40" />
          <div className="h-[240px] rounded-xl bg-muted sm:h-[360px] sm:rounded-2xl md:h-[420px]" />
          <div className="mt-5 h-36 rounded-xl bg-muted sm:mt-6 sm:h-40 sm:rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-4 text-center text-foreground">
        <h2 className="text-xl font-bold sm:text-2xl">Event Not Found</h2>

        <p className="mt-3 max-w-md break-words text-sm text-muted-foreground sm:text-base">
          {error || "Even Not Found"}
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

  const isPastEvent = new Date(event.eventDate).getTime() < Date.now();

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
      : checkingJoined
        ? "Checking..."
        : joining
          ? "Joining..."
          : "Join Event";

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-5 text-slate-900 dark:bg-background dark:text-foreground sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <button
          onClick={() => router.push("/events")}
          className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-teal-600 sm:mb-5 sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          Back to Upcoming Events
        </button>

        <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl dark:border-border dark:bg-card">
          <div className="relative h-[240px] overflow-hidden sm:h-[360px] md:h-[420px] lg:h-[460px]">
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-slate-200 dark:bg-muted" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

            <div className="absolute left-3 top-3 sm:left-5 sm:top-5">
              <Badge className="border-0 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-800 hover:bg-white sm:px-3 sm:text-xs">
                <HandHeart className="mr-1.5 h-3.5 w-3.5 text-teal-600" />
                {event.category}
              </Badge>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-3 sm:p-6 md:p-8">
              <h1 className="max-w-3xl break-words text-xl font-extrabold text-white sm:text-3xl md:text-4xl lg:text-5xl">
                {event.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-white/90 sm:gap-x-5 sm:text-sm">
                <span className="flex min-w-0 items-start gap-1.5 break-words">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                  <span className="break-words">{event.location}</span>
                </span>

                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 shrink-0 text-teal-400" />
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-6 md:p-8">
            <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:p-4 md:px-5 dark:border-border dark:bg-muted/30">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  <Users className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="break-words text-sm font-bold text-slate-800 dark:text-foreground">
                    {event.participantsCount ?? 0} Volunteers Joined
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-muted-foreground">
                    Sign up to join hands for this drive
                  </p>
                </div>
              </div>

              <div className="flex w-full items-center gap-2 sm:w-auto">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="h-10 w-10 shrink-0 border-slate-200 bg-white dark:border-border dark:bg-card"
                  aria-label="Share event"
                >
                  <Share2 className="h-4 w-4" />
                </Button>

                <Button
                  onClick={handleJoinEvent}
                  disabled={joinButtonDisabled}
                  className="h-10 flex-1 bg-teal-600 px-3 text-sm text-white hover:bg-teal-700 sm:flex-none sm:px-5 sm:text-base"
                >
                  {hasJoined ? (
                    <CheckCircle2 className="mr-2 h-4 w-4 shrink-0" />
                  ) : (
                    <HandHeart className="mr-2 h-4 w-4 shrink-0" />
                  )}

                  {joinButtonText}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-[minmax(0,1fr)_280px] md:gap-10">
              <div className="min-w-0">
                <section>
                  <h2 className="text-base font-bold text-slate-900 sm:text-lg dark:text-foreground">
                    About this Social Initiative
                  </h2>

                  <p className="mt-3 whitespace-pre-line break-words border-b border-slate-200 pb-5 text-sm leading-7 text-slate-600 sm:pb-6 sm:text-base dark:border-border dark:text-muted-foreground">
                    {event.description}
                  </p>
                </section>

                <section className="mt-6 sm:mt-7">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                      <ClipboardList className="h-4 w-4" />
                    </div>

                    <h2 className="text-xs font-bold uppercase tracking-wide text-slate-800 sm:text-sm dark:text-foreground">
                      Volunteer Guidelines
                    </h2>
                  </div>

                  {guidelines.length > 0 ? (
                    <ul className="space-y-3">
                      {guidelines.map((guideline, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2.5 text-sm leading-6 text-slate-600 sm:text-sm dark:text-muted-foreground"
                        >
                          <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-teal-600 dark:text-teal-400" />

                          <span className="min-w-0 break-words">
                            {guideline}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-500 sm:p-4 dark:bg-muted/30 dark:text-muted-foreground">
                      No volunteer guidelines have been added for this event
                      yet. Please follow the organizer&apos;s instructions.
                    </p>
                  )}
                </section>
              </div>

              <aside className="min-w-0">
                <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 dark:border-border dark:bg-card">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-muted-foreground">
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

                      <p className="mt-1 flex min-w-0 items-start gap-1 break-all text-[10px] leading-4 text-slate-500 dark:text-muted-foreground">
                        <Mail className="mt-0.5 h-3 w-3 shrink-0" />
                        <span className="break-all">
                          {event.creator?.email || event.creatorEmail}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-slate-200 pt-3 dark:border-border">
                    <div className="flex items-center gap-2 text-[11px] text-teal-700 dark:text-teal-400">
                      <ShieldCheck className="h-4 w-4 shrink-0" />
                      <span>Verified Platform Member</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50/70 p-3 sm:p-4 dark:border-teal-900 dark:bg-teal-950/30">
                  <div className="flex items-center gap-2">
                    <HandHeart className="h-4 w-4 shrink-0 text-teal-700 dark:text-teal-300" />

                    <h3 className="text-xs font-bold text-teal-900 dark:text-teal-200">
                      Make a Difference
                    </h3>
                  </div>

                  <p className="mt-2 break-words text-xs leading-5 text-teal-800/80 dark:text-teal-300/80">
                    Your time and effort can make a real difference in
                    someone&apos;s life.
                  </p>
                </div>
              </aside>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:mt-9 sm:p-5 dark:border-border dark:bg-muted/30">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h3 className="break-words text-sm font-bold text-slate-900 sm:text-base dark:text-foreground">
                    Be Part of the Change
                  </h3>

                  <p className="mt-1 break-words text-xs leading-5 text-slate-500 sm:text-sm dark:text-muted-foreground">
                    Join this initiative and make a positive impact in your
                    community.
                  </p>
                </div>

                <Button
                  onClick={handleJoinEvent}
                  disabled={joinButtonDisabled}
                  className="w-full shrink-0 bg-teal-600 px-6 text-white hover:bg-teal-700 sm:w-auto"
                >
                  {hasJoined ? (
                    <CheckCircle2 className="mr-2 h-4 w-4 shrink-0" />
                  ) : (
                    <HandHeart className="mr-2 h-4 w-4 shrink-0" />
                  )}

                  {hasJoined
                    ? "Already Joined"
                    : isPastEvent
                      ? "Event Has Ended"
                      : checkingJoined
                        ? "Checking..."
                        : joining
                          ? "Joining..."
                          : "Join This Event"}
                </Button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
