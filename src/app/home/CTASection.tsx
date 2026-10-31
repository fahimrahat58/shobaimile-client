import Link from "next/link";
import { ArrowRight, HeartHandshake } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-white px-3 py-12 dark:bg-background sm:px-5 sm:py-16 lg:px-8">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-700 to-teal-600 px-5 py-10 text-center text-white sm:rounded-3xl sm:px-8 sm:py-14 md:px-16 md:py-16">
        <HeartHandshake
          size={38}
          className="mx-auto text-cyan-100 sm:h-12 sm:w-12"
        />

        <h2 className="mt-4 text-2xl font-bold leading-tight sm:mt-6 sm:text-3xl md:text-4xl">
          Your Community Needs You
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-cyan-50 sm:mt-5 sm:text-base sm:leading-8">
          A better community starts with people like you. Take the first step
          and become part of something meaningful.
        </p>

        <Link
          href="/register"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-50 sm:mt-8 sm:w-auto sm:px-7 sm:text-base"
        >
          Join ShobaiMile
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
