import Link from "next/link";
import { ArrowRight, HeartHandshake, Users, CalendarDays } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(3, 20, 30, 0.75), rgba(3, 30, 40, 0.85)), url('/images/community.jpg')",
      }}
    >
      <div className="relative z-10 mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20 lg:px-8">
        {/* Left Content */}
        <div className="text-center md:text-left">
          {/* Badge */}
          <span className="mb-6 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-200 backdrop-blur-sm sm:text-sm md:justify-start">
            <HeartHandshake size={18} className="shrink-0" />A Community-Driven
            Event Management Platform
          </span>

          {/* Heading */}
          <h1 className="mx-auto max-w-xl text-4xl leading-tight font-bold text-white sm:text-5xl md:mx-0 md:text-6xl">
            Small Actions.
            <span className="mt-2 block text-cyan-400">
              Stronger Communities.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-lg text-base leading-8 text-gray-200 md:mx-0">
            Join hands with your community to create positive change. Discover
            local events, volunteer your time, and make a meaningful difference
            together.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-cyan-600"
            >
              Explore Events
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/register"
              className="rounded-lg border border-white/60 px-6 py-3 font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-gray-900"
            >
              Join Our Community
            </Link>
          </div>

          {/* Features */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 md:justify-start">
            {/* Community */}
            <div className="flex items-center gap-3 text-left">
              <div className="rounded-lg bg-cyan-400/20 p-3 text-cyan-300">
                <Users size={24} />
              </div>

              <div>
                <p className="font-bold text-white">Community</p>
                <p className="text-sm text-gray-300">People Together</p>
              </div>
            </div>

            {/* Local Events */}
            <div className="flex items-center gap-3 text-left">
              <div className="rounded-lg bg-teal-400/20 p-3 text-teal-300">
                <CalendarDays size={24} />
              </div>

              <div>
                <p className="font-bold text-white">Local Events</p>
                <p className="text-sm text-gray-300">Real Impact</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex justify-center">
          <div className="flex aspect-square w-full max-w-[420px] items-center justify-center rounded-[40px] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-sm">
            <div className="text-center">
              <HeartHandshake
                size={110}
                strokeWidth={1.2}
                className="mx-auto text-cyan-300"
              />

              <h2 className="mt-6 text-3xl font-bold text-white">
                Be the Change
              </h2>

              <p className="mt-3 text-gray-200">Every small action matters.</p>

              <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-cyan-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
