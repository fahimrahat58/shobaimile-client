import Link from "next/link";
import { HeartHandshake, UsersRound, Camera, Code2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 sm:gap-10 sm:px-6 sm:py-12 lg:grid-cols-4 lg:gap-12 lg:px-8 lg:py-14">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xl font-bold text-white sm:text-2xl"
          >
            <HeartHandshake className="size-6 shrink-0 text-cyan-400 sm:size-7" />
            ShobaiMile
          </Link>

          <p className="mt-4 max-w-xs text-sm leading-7 text-gray-400 sm:mt-5">
            Small Actions. Stronger Communities. Together, we can create
            positive change.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white sm:mb-5">Explore</h3>

          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/" className="transition-colors hover:text-cyan-400">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/events"
                className="transition-colors hover:text-cyan-400"
              >
                Upcoming Events
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className="transition-colors hover:text-cyan-400"
              >
                Join Community
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white sm:mb-5">Account</h3>

          <ul className="space-y-3 text-sm">
            <li>
              <Link
                href="/login"
                className="transition-colors hover:text-cyan-400"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className="transition-colors hover:text-cyan-400"
              >
                Register
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className="transition-colors hover:text-cyan-400"
              >
                My Profile
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white sm:mb-5">Follow Us</h3>

          <div className="flex flex-wrap gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="rounded-lg bg-gray-800 p-3 transition-colors hover:bg-cyan-700"
            >
              <UsersRound size={19} />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="rounded-lg bg-gray-800 p-3 transition-colors hover:bg-cyan-700"
            >
              <Camera size={19} />
            </a>

            <a
              href="#"
              aria-label="GitHub"
              className="rounded-lg bg-gray-800 p-3 transition-colors hover:bg-cyan-700"
            >
              <Code2 size={19} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 px-4 py-5 text-center text-xs text-gray-500 sm:px-6 sm:py-6 sm:text-sm">
        © 2026 ShobaiMile. All rights reserved.
      </div>
    </footer>
  );
}
