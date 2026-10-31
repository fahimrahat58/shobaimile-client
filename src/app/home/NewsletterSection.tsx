"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    toast.info("Newsletter subscription will be available soon.");
    setEmail("");
  };

  return (
    <section className="bg-cyan-50 px-4 py-20 dark:bg-background">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
          <Mail size={28} />
        </div>

        <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-foreground md:text-4xl">
          Stay Connected With Our Community
        </h2>

        <p className="mt-4 leading-7 text-gray-600 dark:text-muted-foreground">
          Get updates about upcoming events and opportunities to make a
          difference.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-5 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20 dark:border-border dark:bg-card dark:text-foreground dark:placeholder:text-muted-foreground"
            required
          />

          <button
            type="submit"
            className="rounded-lg bg-cyan-600 px-7 py-3 font-semibold text-white transition hover:bg-cyan-700"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
