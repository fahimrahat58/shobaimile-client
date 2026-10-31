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
    <section className="bg-cyan-50 px-4 py-14 sm:px-6 sm:py-16 md:py-20 dark:bg-background">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 sm:h-14 sm:w-14 sm:rounded-2xl dark:bg-cyan-950 dark:text-cyan-300">
          <Mail size={26} className="sm:size-7" />
        </div>

        <h2 className="mt-5 text-2xl leading-tight font-bold text-gray-900 sm:mt-6 sm:text-3xl md:text-4xl dark:text-foreground">
          Stay Connected With Our Community
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:mt-4 sm:text-base sm:leading-7 dark:text-muted-foreground">
          Get updates about upcoming events and opportunities to make a
          difference.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-6 flex w-full max-w-xl flex-col gap-3 sm:mt-8 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="h-12 min-w-0 w-full flex-1 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20 sm:h-auto sm:px-5 sm:py-3 sm:text-base dark:border-border dark:bg-card dark:text-foreground dark:placeholder:text-muted-foreground"
            required
          />

          <button
            type="submit"
            className="h-12 w-full shrink-0 rounded-lg bg-cyan-600 px-7 text-sm font-semibold text-white transition hover:bg-cyan-700 active:scale-[0.98] sm:h-auto sm:w-auto sm:py-3 sm:text-base"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
