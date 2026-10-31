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
      <div className="relative z-10 mx-auto grid min-h-[auto] w-full max-w-7xl items-center gap-10 px-3 py-12 sm:px-5 sm:py-16 md:min-h-[650px] md:grid-cols-2 md:gap-8 md:px-6 md:py-20 lg:gap-12 lg:px-8">
        {/* Left Content */}
        <div className="text-center md:text-left">
          {/* Badge */}
          <span className="mb-5 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-xs font-medium leading-5 text-cyan-200 backdrop-blur-sm sm:mb-6 sm:px-4 sm:text-sm md:justify-start">
            <HeartHandshake size={18} className="shrink-0" />
            <span>A Community-Driven Event Management Platform</span>
          </span>

          {/* Heading */}
          <h1 className="mx-auto max-w-xl text-3xl leading-tight font-bold text-white sm:text-4xl md:mx-0 md:text-5xl lg:text-6xl">
            Small Actions.
            <span className="mt-2 block text-cyan-400">
              Stronger Communities.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-gray-200 sm:mt-6 sm:text-base sm:leading-8 md:mx-0">
            Join hands with your community to create positive change. Discover
            local events, volunteer your time, and make a meaningful difference
            together.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-col justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4 md:justify-start">
            <Link
              href="/events"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-cyan-600 sm:w-auto sm:px-6 sm:text-base"
            >
              Explore Events
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/60 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-gray-900 sm:w-auto sm:px-6 sm:text-base"
            >
              Join Our Community
            </Link>
          </div>

          {/* Features */}
          <div className="mt-8 flex flex-wrap justify-center gap-5 sm:mt-10 sm:gap-8 md:mt-12 md:justify-start">
            {/* Community */}
            <div className="flex items-center gap-3 text-left">
              <div className="rounded-lg bg-cyan-400/20 p-2.5 text-cyan-300 sm:p-3">
                <Users size={22} className="sm:h-6 sm:w-6" />
              </div>

              <div>
                <p className="text-sm font-bold text-white sm:text-base">
                  Community
                </p>
                <p className="text-xs text-gray-300 sm:text-sm">
                  People Together
                </p>
              </div>
            </div>

            {/* Local Events */}
            <div className="flex items-center gap-3 text-left">
              <div className="rounded-lg bg-teal-400/20 p-2.5 text-teal-300 sm:p-3">
                <CalendarDays size={22} className="sm:h-6 sm:w-6" />
              </div>

              <div>
                <p className="text-sm font-bold text-white sm:text-base">
                  Local Events
                </p>
                <p className="text-xs text-gray-300 sm:text-sm">Real Impact</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex justify-center">
          <div className="flex aspect-square w-full max-w-[280px] items-center justify-center rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-sm sm:max-w-[360px] sm:rounded-[36px] sm:p-7 md:max-w-[420px] md:rounded-[40px] md:p-8">
            <div className="text-center">
              <HeartHandshake
                size={80}
                strokeWidth={1.2}
                className="mx-auto text-cyan-300 sm:h-24 sm:w-24 md:h-[110px] md:w-[110px]"
              />

              <h2 className="mt-4 text-2xl font-bold text-white sm:mt-6 sm:text-3xl">
                Be the Change
              </h2>

              <p className="mt-2 text-sm text-gray-200 sm:mt-3 sm:text-base">
                Every small action matters.
              </p>

              <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-cyan-400 sm:mt-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
