"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { CalendarDays, Loader2, Plus } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CreateEventPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
    location: "",
    eventDate: "",
  });

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!API_URL) {
      toast.error("API URL is not configured");
      return;
    }

    try {
      setLoading(true);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        toast.error("Please login to create an event");
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create event");
      }

      toast.success("Event created successfully!");

      setFormData({
        title: "",
        description: "",
        category: "",
        image: "",
        location: "",
        eventDate: "",
      });

      router.push("/manage-events");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <span className="font-semibold text-cyan-700">MAKE A DIFFERENCE</span>

          <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Create a Community Event
          </h1>

          <p className="mt-3 text-gray-600">
            Bring people together and make a positive impact.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8"
        >
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
              placeholder="Describe your event..."
              rows={5}
              required
              maxLength={2000}
              className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-cyan-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Event Category
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
              Event Image URL
            </label>

            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-cyan-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Event Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter event location"
              required
              maxLength={200}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-cyan-600"
            />
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
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-cyan-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-6 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                Creating Event...
              </>
            ) : (
              <>
                <Plus size={19} />
                Create Event
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
