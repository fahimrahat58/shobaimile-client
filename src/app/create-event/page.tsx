"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Loader2, Plus, ListChecks, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const categories = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Food Support",
  "Animal Welfare",
  "Other",
];

type EventFormData = {
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  eventDate: string;
};

const initialFormData: EventFormData = {
  title: "",
  description: "",
  category: "",
  image: "",
  location: "",
  eventDate: "",
};

export default function CreateEventPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [volunteerGuidelines, setVolunteerGuidelines] = useState<string[]>([
    "",
  ]);
  const [minDate, setMinDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");

    setMinDate(`${year}-${month}-${day}`);
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleGuidelineChange = (index: number, value: string) => {
    setVolunteerGuidelines((previous) =>
      previous.map((item, i) => (i === index ? value : item)),
    );
  };

  const addGuideline = () => {
    if (volunteerGuidelines.length >= 10) {
      toast.warning("You can add maximum 10 guidelines.");
      return;
    }

    setVolunteerGuidelines((previous) => [...previous, ""]);
  };

  const removeGuideline = (index: number) => {
    if (volunteerGuidelines.length === 1) {
      toast.warning("At least one guideline is required.");
      return;
    }

    setVolunteerGuidelines((previous) =>
      previous.filter((_, i) => i !== index),
    );
  };

  const isValidImageURL = (value: string) => {
    try {
      const url = new URL(value);

      return (
        ["http:", "https:"].includes(url.protocol) && url.hostname.includes(".")
      );
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const { title, description, category, image, location, eventDate } =
      formData;

    if (title.trim().length < 3 || title.trim().length > 100) {
      toast.error("Title must be between 3 and 100 characters.");
      return false;
    }

    if (description.trim().length < 10 || description.trim().length > 2000) {
      toast.error("Description must be between 10 and 2000 characters.");
      return false;
    }

    if (!categories.includes(category)) {
      toast.error("Please select a valid category.");
      return false;
    }

    if (!isValidImageURL(image.trim())) {
      toast.error("Please enter a valid image URL.");
      return false;
    }

    if (location.trim().length < 3 || location.trim().length > 200) {
      toast.error("Location must be between 3 and 200 characters.");
      return false;
    }

    if (!eventDate || (minDate && eventDate < minDate)) {
      toast.error("Please select a future event date.");
      return false;
    }

    if (
      volunteerGuidelines.length === 0 ||
      volunteerGuidelines.some((item) => item.trim().length < 3)
    ) {
      toast.error("Every guideline must contain at least 3 characters.");
      return false;
    }

    if (volunteerGuidelines.some((item) => item.trim().length > 200)) {
      toast.error("Each guideline cannot exceed 200 characters.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    if (!validateForm()) return;

    if (!API_URL) {
      toast.error("API URL is not configured.");
      return;
    }

    setLoading(true);

    try {
      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        toast.error("Please login first.");
        router.push("/login");
        return;
      }

      const payload = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        image: formData.image.trim(),
        location: formData.location.trim(),
        volunteerGuidelines: volunteerGuidelines.map((item) => item.trim()),
      };

      const response = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Failed to create event.");
      }

      toast.success("Event created successfully!");

      setFormData(initialFormData);
      setVolunteerGuidelines([""]);

      router.push("/events");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Create an Event
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
            Create a volunteering event and make a positive impact.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:space-y-6 sm:rounded-2xl sm:p-6 md:p-8"
        >
          {/* Event Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 sm:text-base">
              Event Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              maxLength={100}
              required
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 sm:px-4 sm:text-base"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 sm:text-base">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event..."
              rows={5}
              maxLength={2000}
              required
              className="w-full min-w-0 resize-y rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 sm:px-4 sm:text-base"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 sm:text-base">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 sm:px-4 sm:text-base"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Event Image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 sm:text-base">
              Event Image URL
            </label>

            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none transition focus:border-green-600 sm:px-4 sm:text-base"
            />
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 sm:text-base">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter event location"
              maxLength={200}
              required
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none transition focus:border-green-600 sm:px-4 sm:text-base"
            />
          </div>

          {/* Event Date */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 sm:text-base">
              <CalendarDays size={18} className="shrink-0" />
              Event Date
            </label>

            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              min={minDate}
              required
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none transition focus:border-green-600 sm:px-4 sm:text-base"
            />
          </div>

          {/* Volunteer Guidelines */}
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 sm:text-base">
                <ListChecks size={19} className="shrink-0" />
                Volunteer Guidelines
              </label>

              <button
                type="button"
                onClick={addGuideline}
                className="flex shrink-0 items-center gap-1 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100"
              >
                <Plus size={17} />
                Add
              </button>
            </div>

            <div className="space-y-3">
              {volunteerGuidelines.map((guideline, index) => (
                <div key={index} className="flex min-w-0 items-center gap-2">
                  <input
                    type="text"
                    value={guideline}
                    onChange={(e) =>
                      handleGuidelineChange(index, e.target.value)
                    }
                    placeholder={`Guideline ${index + 1}`}
                    maxLength={200}
                    required
                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none transition focus:border-green-600 sm:px-4 sm:text-base"
                  />

                  <button
                    type="button"
                    onClick={() => removeGuideline(index)}
                    aria-label="Remove guideline"
                    className="shrink-0 rounded-lg p-3 text-red-500 transition hover:bg-red-50"
                  >
                    <Trash2 size={19} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:py-3.5 sm:text-base"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Creating Event...
              </>
            ) : (
              <>
                <Plus size={20} />
                Create Event
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
