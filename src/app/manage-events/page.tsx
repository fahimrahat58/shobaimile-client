"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
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
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(
    null,
  );

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

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);

    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      image: event.image,
      location: event.location,
      eventDate: new Date(event.eventDate).toISOString().slice(0, 10),
    });
  };

  const closeEditDialog = () => {
    setEditingEvent(null);
    setFormData(initialFormData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingEvent || !API_URL) return;

    try {
      setSaving(true);

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/events/${editingEvent._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update event");
      }

      toast.success("Event updated successfully");

      closeEditDialog();
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

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="animate-spin text-cyan-600" size={36} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-cyan-700">
              YOUR CONTRIBUTION
            </span>

            <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
              Manage Your Events
            </h1>

            <p className="mt-3 text-gray-600">
              View, update, and manage the events you have created.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-700"
          >
            <Plus size={19} />
            Create Event
          </Link>
        </div>

        <div className="mb-8 rounded-xl border border-cyan-100 bg-cyan-50 p-5">
          <p className="text-sm text-cyan-800">Total Events Created</p>
          <p className="mt-1 text-3xl font-bold text-cyan-900">
            {events.length}
          </p>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <CalendarDays size={48} className="mx-auto text-gray-400" />

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No Events Yet
            </h2>

            <p className="mt-2 text-gray-500">
              You have not created any community events.
            </p>

            <Link
              href="/create-event"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-3 font-semibold text-white hover:bg-cyan-700"
            >
              <Plus size={18} />
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="h-52 overflow-hidden bg-gray-100">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                    {event.category}
                  </span>

                  <h2 className="mt-4 text-xl font-bold text-gray-900">
                    {event.title}
                  </h2>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                    {event.description}
                  </p>

                  <div className="mt-5 space-y-3 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <CalendarDays size={17} className="text-cyan-700" />
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin size={17} className="text-cyan-700" />
                      {event.location}
                    </p>
                  </div>

                  {confirmingDeleteId === event._id ? (
                    <div className="mt-6 rounded-lg border border-red-100 bg-red-50 p-4">
                      <p className="text-sm font-medium text-red-800">
                        Are you sure you want to delete this event?
                      </p>

                      <div className="mt-3 flex gap-3">
                        <button
                          onClick={() => handleDelete(event._id)}
                          disabled={deletingId === event._id}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
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
                          className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => openEditDialog(event)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-cyan-600 px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => setConfirmingDeleteId(event._id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {editingEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Edit Event</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update your event information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditDialog}
                disabled={saving}
                aria-label="Close edit form"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
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
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-cyan-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  maxLength={2000}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-cyan-600"
                />
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
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-cyan-600"
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
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-cyan-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Location
                </label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-cyan-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Event Date
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 10)}
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-cyan-600"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditDialog}
                  disabled={saving}
                  className="rounded-lg border border-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 py-3 font-semibold text-white hover:bg-cyan-700 disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
