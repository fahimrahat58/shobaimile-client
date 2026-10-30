import Link from "next/link";
import { ArrowRight, HeartHandshake, Users, CalendarDays } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-teal-50">
      <div className="mx-auto grid min-h-[600px] max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2">
        <div>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-2 text-sm font-medium text-cyan-800">
            <HeartHandshake size={18} />
            Together, We Can Make a Difference
          </span>

          <h1 className="max-w-xl text-4xl leading-tight font-bold text-gray-900 md:text-6xl">
            Small Actions.
            <span className="block text-cyan-600">Stronger Communities.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-gray-600">
            Join hands with your community to create positive change. Discover
            local events, volunteer your time, and make a meaningful difference
            together.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-3 font-semibold text-white transition hover:bg-cyan-700"
            >
              Explore Events
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/register"
              className="rounded-lg border border-cyan-600 px-6 py-3 font-semibold text-cyan-700 transition hover:bg-cyan-50"
            >
              Join Our Community
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-cyan-100 p-3 text-cyan-700">
                <Users size={22} />
              </div>

              <div>
                <p className="font-bold text-gray-900">Community</p>
                <p className="text-sm text-gray-500">People Together</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-teal-100 p-3 text-teal-700">
                <CalendarDays size={22} />
              </div>

              <div>
                <p className="font-bold text-gray-900">Local Events</p>
                <p className="text-sm text-gray-500">Real Impact</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex aspect-square w-full max-w-[480px] items-center justify-center rounded-[40px] bg-gradient-to-br from-cyan-200 to-teal-300 p-8">
            <div className="text-center">
              <HeartHandshake
                size={130}
                strokeWidth={1.2}
                className="mx-auto text-cyan-900"
              />

              <p className="mt-6 text-3xl font-bold text-cyan-950">
                Be the Change
              </p>

              <p className="mt-2 text-cyan-900">Every small action matters.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
