"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  CalendarDays,
  MapPin,
  Pencil,
  Trash2,
  Loader2,
  Plus,
  X,
  Users,
  CheckCircle2,
  Award,
  Clock,
  Mail,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ALLOWED_CATEGORIES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Food Support",
  "Animal Welfare",
  "Other",
];

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
}

interface Participant {
  email: string;
  name: string;
  image: string;
  joinedAt: string;
  verified: boolean;
  volunteerHours: number;
  totalPoints: number;
}

const initialFormData = {
  title: "",
  description: "",
  category: "",
  image: "",
  location: "",
  eventDate: "",
};

export default function ManageEventsPage() {
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [volunteerGuidelines, setVolunteerGuidelines] = useState<string[]>([
    "",
  ]);

  const [saving, setSaving] = useState(false);
  const [minDate, setMinDate] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(
    null,
  );

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);

  const [hoursInput, setHoursInput] = useState<Record<string, string>>({});
  const [verifyingEmail, setVerifyingEmail] = useState<string | null>(null);

  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    const tomorrow = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    setMinDate(tomorrow);
  }, []);
  // Get authentication token
  const getToken = useCallback(async () => {
    const tokenResult = await authClient.token();
    const token = tokenResult.data?.token;

    if (tokenResult.error || !token) {
      throw new Error("Please login to continue");
    }

    return token;
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);

      if (!API_URL) {
        throw new Error("API URL is not configured");
      }

      const token = await getToken();

      const response = await fetch(`${API_URL}/api/events/my-events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load events");
      }

      setEvents(result.events || []);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      toast.error(message);

      if (message.toLowerCase().includes("login")) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [getToken, router]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const isValidImageURL = (value: string) => {
    try {
      const url = new URL(value);

      return (
        (url.protocol === "http:" || url.protocol === "https:") &&
        url.hostname.includes(".")
      );
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const title = formData.title.trim();
    const description = formData.description.trim();
    const category = formData.category.trim();
    const image = formData.image.trim();
    const location = formData.location.trim();

    if (title.length < 3) {
      toast.error("Event title must be at least 3 characters");
      return false;
    }

    if (title.length > 100) {
      toast.error("Event title cannot exceed 100 characters");
      return false;
    }

    if (description.length < 10) {
      toast.error("Description must be at least 10 characters");
      return false;
    }

    if (description.length > 2000) {
      toast.error("Description cannot exceed 2000 characters");
      return false;
    }

    if (!ALLOWED_CATEGORIES.includes(category)) {
      toast.error("Please select a valid event category");
      return false;
    }

    if (!image) {
      toast.error("Please enter an event image URL");
      return false;
    }

    if (!isValidImageURL(image)) {
      toast.error("Please enter a valid HTTP or HTTPS image URL");
      return false;
    }

    if (location.length < 3) {
      toast.error("Location must be at least 3 characters");
      return false;
    }

    if (location.length > 200) {
      toast.error("Location cannot exceed 200 characters");
      return false;
    }

    if (!formData.eventDate || !minDate) {
      toast.error("Please select an event date");
      return false;
    }

    if (formData.eventDate < minDate) {
      toast.error("Only tomorrow and future dates are allowed");
      return false;
    }

    const cleanedGuidelines = volunteerGuidelines.map((item) => item.trim());

    if (
      cleanedGuidelines.length === 0 ||
      cleanedGuidelines.every((item) => !item)
    ) {
      toast.error("Please add at least one volunteer guideline");
      return false;
    }

    if (cleanedGuidelines.some((item) => !item)) {
      toast.error("Please fill in or remove empty guidelines");
      return false;
    }

    if (cleanedGuidelines.length > 10) {
      toast.error("Maximum 10 guidelines allowed");
      return false;
    }

    if (cleanedGuidelines.some((item) => item.length < 3)) {
      toast.error("Each guideline must be at least 3 characters");
      return false;
    }

    if (cleanedGuidelines.some((item) => item.length > 200)) {
      toast.error("Each guideline cannot exceed 200 characters");
      return false;
    }

    return true;
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);

    setFormData({
      title: event.title || "",
      description: event.description || "",
      category: event.category || "",
      image: event.image || "",
      location: event.location || "",
      eventDate: event.eventDate ? event.eventDate.slice(0, 10) : "",
    });

    setVolunteerGuidelines(
      event.volunteerGuidelines?.length ? [...event.volunteerGuidelines] : [""],
    );
  };

  const closeEditDialog = () => {
    if (saving) return;

    setEditingEvent(null);
    setFormData(initialFormData);
    setVolunteerGuidelines([""]);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuidelineChange = (index: number, value: string) => {
    setVolunteerGuidelines((prev) =>
      prev.map((item, i) => (i === index ? value : item)),
    );
  };

  const addGuideline = () => {
    if (volunteerGuidelines.length >= 10) {
      toast.error("Maximum 10 guidelines allowed");
      return;
    }

    setVolunteerGuidelines((prev) => [...prev, ""]);
  };

  const removeGuideline = (index: number) => {
    setVolunteerGuidelines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (saving) return;

    if (!editingEvent || !API_URL) {
      toast.error("Unable to update event");
      return;
    }

    if (!validateForm()) return;

    try {
      setSaving(true);

      const token = await getToken();

      const cleanedGuidelines = volunteerGuidelines.map((item) => item.trim());

      const response = await fetch(
        `${API_URL}/api/events/${editingEvent._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: formData.category.trim(),
            image: formData.image.trim(),
            location: formData.location.trim(),
            volunteerGuidelines: cleanedGuidelines,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update event");
      }

      toast.success("Event updated successfully");

      setEditingEvent(null);
      setFormData(initialFormData);
      setVolunteerGuidelines([""]);

      await fetchEvents();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update event",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!API_URL) {
      toast.error("API URL is not configured");
      return;
    }

    try {
      setDeletingId(id);

      const token = await getToken();

      const response = await fetch(`${API_URL}/api/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete event");
      }

      setEvents((prev) => prev.filter((event) => event._id !== id));
      setConfirmingDeleteId(null);

      toast.success("Event deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete event",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const fetchParticipants = async (event: Event) => {
    if (!API_URL) {
      toast.error("API URL is not configured");
      return;
    }

    setSelectedEvent(event);
    setParticipants([]);
    setHoursInput({});

    try {
      setParticipantsLoading(true);

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/events/${event._id}/participants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load participants");
      }

      setParticipants(result.participants || []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load participants",
      );
    } finally {
      setParticipantsLoading(false);
    }
  };

  const closeParticipantsModal = () => {
    if (verifyingEmail) return;

    setSelectedEvent(null);
    setParticipants([]);
    setHoursInput({});
  };

  const handleHoursChange = (email: string, value: string) => {
    setHoursInput((prev) => ({
      ...prev,
      [email]: value,
    }));
  };

  const handleVerifyAttendance = async (userEmail: string) => {
    if (!selectedEvent || !API_URL) {
      toast.error("Unable to verify attendance");
      return;
    }

    const hours = Number(hoursInput[userEmail]);

    if (!Number.isFinite(hours) || hours < 1 || hours > 24) {
      toast.error("Enter volunteer hours between 1 and 24");
      return;
    }

    try {
      setVerifyingEmail(userEmail);

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/events/${selectedEvent._id}/verify-participant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userEmail,
            volunteerHours: hours,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to verify attendance");
      }

      toast.success(
        `Attendance verified! ${
          result.totalPoints ?? result.record?.totalPoints ?? ""
        } points awarded.`,
      );

      setHoursInput((prev) => ({
        ...prev,
        [userEmail]: "",
      }));

      await fetchParticipants(selectedEvent);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to verify attendance",
      );
    } finally {
      setVerifyingEmail(null);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <Loader2 className="animate-spin text-cyan-600" size={36} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-3 py-6 sm:px-5 sm:py-8 lg:px-6 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col items-start justify-between gap-5 sm:mb-10 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <span className="text-sm font-semibold text-cyan-700">
              YOUR CONTRIBUTION
            </span>

            <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Manage Your Events
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-600 sm:mt-3 sm:text-base">
              View, update, and manage the events you have created.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 sm:w-auto sm:text-base"
          >
            <Plus size={19} />
            Create Event
          </Link>
        </div>

        <div className="mb-6 rounded-xl border border-cyan-100 bg-cyan-50 p-4 sm:mb-8 sm:p-5">
          <p className="text-sm text-cyan-800">Total Events Created</p>

          <p className="mt-1 text-2xl font-bold text-cyan-900 sm:text-3xl">
            {events.length}
          </p>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-12 text-center sm:px-6 sm:py-16">
            <CalendarDays
              size={44}
              className="mx-auto text-gray-400 sm:size-12"
            />

            <h2 className="mt-5 text-lg font-bold text-gray-900 sm:text-xl">
              No Events Yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              You have not created any community events.
            </p>

            <Link
              href="/create-event"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-700 sm:text-base"
            >
              <Plus size={18} />
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
            {events.map((event) => (
              <article
                key={event._id}
                className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="h-44 overflow-hidden bg-gray-100 sm:h-48 lg:h-52">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-5 lg:p-6">
                  <div>
                    <span className="inline-block max-w-full rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                      {event.category}
                    </span>

                    <h2 className="mt-4 break-words text-lg font-bold text-gray-900 sm:text-xl">
                      {event.title}
                    </h2>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                      {event.description}
                    </p>

                    <div className="mt-5 space-y-3 text-sm text-gray-600">
                      <p className="flex min-w-0 items-start gap-2">
                        <CalendarDays
                          size={17}
                          className="mt-0.5 shrink-0 text-cyan-700"
                        />
                        <span>
                          {new Date(event.eventDate).toLocaleDateString()}
                        </span>
                      </p>

                      <p className="flex min-w-0 items-start gap-2">
                        <MapPin
                          size={17}
                          className="mt-0.5 shrink-0 text-cyan-700"
                        />
                        <span className="break-words">{event.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    {confirmingDeleteId === event._id ? (
                      <div className="mt-6 rounded-lg border border-red-100 bg-red-50 p-3 sm:p-4">
                        <p className="text-sm font-medium text-red-800">
                          Are you sure you want to delete this event?
                        </p>

                        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-3">
                          <button
                            onClick={() => handleDelete(event._id)}
                            disabled={deletingId === event._id}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                          >
                            {deletingId === event._id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                            Confirm
                          </button>

                          <button
                            onClick={() => setConfirmingDeleteId(null)}
                            disabled={deletingId === event._id}
                            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-6 space-y-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                          <button
                            onClick={() => openEditDialog(event)}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-cyan-600 px-3 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50"
                          >
                            <Pencil size={16} />
                            Edit
                          </button>

                          <button
                            onClick={() => setConfirmingDeleteId(event._id)}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>

                        <button
                          onClick={() => fetchParticipants(event)}
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
                        >
                          <Users size={17} />
                          Manage Participants
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {editingEvent && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 p-2 sm:items-center sm:p-4">
          <div className="my-auto w-full max-w-2xl rounded-xl bg-white p-4 shadow-xl sm:rounded-2xl sm:p-6 md:p-8">
            <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6">
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Edit Event
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update your event information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditDialog}
                disabled={saving}
                aria-label="Close edit form"
                className="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Event Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  required
                  minLength={3}
                  maxLength={100}
                  disabled={saving}
                  className="w-full min-w-0 rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-cyan-600 disabled:bg-gray-100 sm:px-4"
                />

                <p className="mt-1 text-xs text-gray-500">
                  3-100 characters required.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your event..."
                  rows={4}
                  required
                  minLength={10}
                  maxLength={2000}
                  disabled={saving}
                  className="w-full min-w-0 resize-y rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-cyan-600 disabled:bg-gray-100 sm:px-4"
                />

                <p className="mt-1 text-xs text-gray-500">
                  10-2000 characters required.
                </p>
              </div>

              <div className="rounded-xl border border-cyan-100 bg-cyan-50/40 p-3 sm:p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Volunteer Guidelines
                  </label>

                  <span className="shrink-0 text-xs text-gray-500">
                    {volunteerGuidelines.length}/10
                  </span>
                </div>

                <div className="space-y-3">
                  {volunteerGuidelines.map((guideline, index) => (
                    <div
                      key={index}
                      className="flex min-w-0 items-center gap-2"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-sm font-bold text-cyan-700 sm:h-10 sm:w-10">
                        {index + 1}
                      </span>

                      <input
                        type="text"
                        value={guideline}
                        onChange={(e) =>
                          handleGuidelineChange(index, e.target.value)
                        }
                        placeholder={`Guideline ${index + 1}`}
                        minLength={3}
                        maxLength={200}
                        required
                        disabled={saving}
                        className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-cyan-600 disabled:bg-gray-100 sm:px-4"
                      />

                      {volunteerGuidelines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeGuideline(index)}
                          disabled={saving}
                          className="shrink-0 rounded-lg border border-red-200 p-2.5 text-red-600 transition hover:bg-red-50 disabled:opacity-50 sm:p-3"
                          aria-label={`Remove guideline ${index + 1}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addGuideline}
                  disabled={saving || volunteerGuidelines.length >= 10}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-600 px-3 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
                >
                  <Plus size={16} />
                  Add Guideline
                </button>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  Add 1-10 guidelines. Each must contain 3-200 characters.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={saving}
                  className="w-full min-w-0 rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-cyan-600 disabled:bg-gray-100 sm:px-4"
                >
                  <option value="">Select a category</option>
                  <option value="Cleanup">Cleanup</option>
                  <option value="Plantation">Plantation</option>
                  <option value="Donation">Donation</option>
                  <option value="Education">Education</option>
                  <option value="Food Support">Food Support</option>
                  <option value="Animal Welfare">Animal Welfare</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Image URL
                </label>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  required
                  disabled={saving}
                  className="w-full min-w-0 rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-cyan-600 disabled:bg-gray-100 sm:px-4"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Enter a valid HTTP or HTTPS image URL.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter event location"
                  required
                  minLength={3}
                  maxLength={200}
                  disabled={saving}
                  className="w-full min-w-0 rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-cyan-600 disabled:bg-gray-100 sm:px-4"
                />

                <p className="mt-1 text-xs text-gray-500">
                  3-200 characters required.
                </p>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <CalendarDays size={17} />
                  Event Date
                </label>

                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  min={minDate}
                  required
                  disabled={saving || !minDate}
                  className="w-full min-w-0 rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-cyan-600 disabled:cursor-not-allowed disabled:bg-gray-100 sm:px-4"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Only tomorrow and future dates are allowed.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
                <button
                  type="button"
                  onClick={closeEditDialog}
                  disabled={saving}
                  className="w-full rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 sm:w-auto sm:text-base"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || !minDate}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-base"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Pencil size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-black/60 p-2 sm:items-center sm:p-4">
          <div className="my-auto max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-3 shadow-2xl sm:max-h-[90vh] sm:rounded-2xl sm:p-5 md:p-8">
            <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6 sm:gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-cyan-700">
                  <Users size={20} />
                  <span className="text-xs font-semibold sm:text-sm">
                    VOLUNTEER MANAGEMENT
                  </span>
                </div>

                <h2 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                  Participants
                </h2>

                <p className="mt-1 break-words text-sm text-gray-500">
                  {selectedEvent.title}
                </p>
              </div>

              <button
                type="button"
                onClick={closeParticipantsModal}
                disabled={Boolean(verifyingEmail)}
                aria-label="Close participants"
                className="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            {!participantsLoading && (
              <div className="mb-5 grid grid-cols-2 gap-2 sm:gap-3">
                <div className="rounded-xl bg-cyan-50 p-3 sm:p-4">
                  <p className="text-xs text-cyan-700 sm:text-sm">
                    Total Participants
                  </p>

                  <p className="mt-1 text-xl font-bold text-cyan-900 sm:text-2xl">
                    {participants.length}
                  </p>
                </div>

                <div className="rounded-xl bg-green-50 p-3 sm:p-4">
                  <p className="text-xs text-green-700 sm:text-sm">Verified</p>

                  <p className="mt-1 text-xl font-bold text-green-900 sm:text-2xl">
                    {participants.filter((p) => p.verified).length}
                  </p>
                </div>
              </div>
            )}

            {participantsLoading ? (
              <div className="flex min-h-48 items-center justify-center">
                <Loader2 size={35} className="animate-spin text-cyan-600" />
              </div>
            ) : participants.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 px-3 py-10 text-center sm:py-12">
                <Users size={40} className="mx-auto text-gray-400" />

                <h3 className="mt-4 font-semibold text-gray-800">
                  No Participants Yet
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Nobody has joined this event yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {participants.map((participant) => (
                  <div
                    key={participant.email}
                    className="rounded-xl border border-gray-200 p-3 transition hover:border-cyan-200 sm:p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                        {participant.image ? (
                          <img
                            src={participant.image}
                            alt={participant.name}
                            className="h-11 w-11 shrink-0 rounded-full border border-gray-200 object-cover sm:h-12 sm:w-12"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-100 font-bold text-cyan-700 sm:h-12 sm:w-12">
                            {participant.name?.charAt(0)?.toUpperCase() || "V"}
                          </div>
                        )}

                        <div className="min-w-0">
                          <h3 className="break-words text-sm font-semibold text-gray-900 sm:text-base">
                            {participant.name}
                          </h3>

                          <p className="mt-1 flex min-w-0 items-center gap-1 break-all text-xs text-gray-500">
                            <Mail size={13} className="shrink-0" />
                            {participant.email}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {participant.verified ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-2 text-xs font-semibold text-green-700">
                            <CheckCircle2 size={15} />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-2 text-xs font-semibold text-yellow-700">
                            <Clock size={15} />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>

                    {participant.verified ? (
                      <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4 sm:gap-3">
                        <div className="flex items-center gap-2 rounded-lg bg-cyan-50 px-3 py-2 text-xs text-cyan-800 sm:text-sm">
                          <Clock size={16} />
                          {participant.volunteerHours} Hours
                        </div>

                        <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 text-xs text-purple-800 sm:text-sm">
                          <Award size={16} />
                          {participant.totalPoints} Points
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 border-t border-gray-100 pt-4">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Volunteer Hours
                        </label>

                        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                          <input
                            type="number"
                            min="1"
                            max="24"
                            step="0.5"
                            placeholder="Enter hours (1-24)"
                            value={hoursInput[participant.email] || ""}
                            onChange={(e) =>
                              handleHoursChange(
                                participant.email,
                                e.target.value,
                              )
                            }
                            disabled={verifyingEmail === participant.email}
                            className="w-full min-w-0 rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-cyan-600 sm:px-4"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              handleVerifyAttendance(participant.email)
                            }
                            disabled={verifyingEmail === participant.email}
                            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-5"
                          >
                            {verifyingEmail === participant.email ? (
                              <>
                                <Loader2 size={17} className="animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={17} />
                                Verify Attendance
                              </>
                            )}
                          </button>
                        </div>

                        <p className="mt-2 text-xs leading-5 text-gray-500">
                          Verify only after confirming that the volunteer
                          attended the event.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 flex justify-end border-t border-gray-100 pt-4 sm:mt-6 sm:pt-5">
              <button
                type="button"
                onClick={closeParticipantsModal}
                disabled={Boolean(verifyingEmail)}
                className="w-full rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
