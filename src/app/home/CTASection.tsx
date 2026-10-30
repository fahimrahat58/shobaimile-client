import Link from "next/link";
import { ArrowRight, HeartHandshake } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-700 to-teal-600 px-6 py-16 text-center text-white md:px-16">
        <HeartHandshake size={48} className="mx-auto text-cyan-100" />

        <h2 className="mt-6 text-3xl font-bold md:text-4xl">
          Your Community Needs You
        </h2>

        <p className="mx-auto mt-5 max-w-2xl leading-8 text-cyan-50">
          A better community starts with people like you. Take the first step
          and become part of something meaningful.
        </p>

        <Link
          href="/register"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 font-semibold text-cyan-800 transition hover:bg-cyan-50"
        >
          Join ShobaiMile <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
