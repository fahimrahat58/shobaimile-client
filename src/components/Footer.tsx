import Link from "next/link";
import { HeartHandshake, UsersRound, Camera, Code2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 sm:gap-10 sm:px-6 sm:py-12 lg:grid-cols-4 lg:gap-12 lg:px-8 lg:py-14">
        {/* Brand */}
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

        {/* Explore */}
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

        {/* Account */}
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

        {/* Social Links */}
        <div>
          <h3 className="mb-4 font-bold text-white sm:mb-5">Follow Us</h3>

          <div className="flex flex-wrap gap-3">
            {/* Facebook */}
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="rounded-lg bg-gray-800 p-3 transition-colors hover:bg-cyan-700"
            >
              <UsersRound size={19} />
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-lg bg-gray-800 p-3 transition-colors hover:bg-cyan-700"
            >
              <Camera size={19} />
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="rounded-lg bg-gray-800 p-3 transition-colors hover:bg-cyan-700"
            >
              <Code2 size={19} />
            </a>

            {/* Official X Logo */}
            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="rounded-lg bg-gray-800 p-3 transition-colors hover:bg-cyan-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-[19px]"
                aria-hidden="true"
              >
                <path d="M18.901 1.153h3.308l-7.227 8.26 8.502 11.434h-6.657l-5.214-6.817-5.963 6.817H2.34l7.73-8.835L1.914 1.153h6.826l4.713 6.231zm-1.161 17.68h1.833L7.877 3.059H5.91z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 px-4 py-5 text-center text-xs text-gray-500 sm:px-6 sm:py-6 sm:text-sm">
        © 2026 ShobaiMile. All rights reserved.
      </div>
    </footer>
  );
}
