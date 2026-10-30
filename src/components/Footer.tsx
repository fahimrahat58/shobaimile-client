import Link from "next/link";
import { HeartHandshake, Facebook, Instagram, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-bold text-white"
          >
            <HeartHandshake className="text-cyan-400" />
            ShobaiMile
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">
            Small Actions. Stronger Communities. Together, we can create
            positive change.
          </p>
        </div>

        <div>
          <h3 className="mb-5 font-bold text-white">Explore</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/" className="hover:text-cyan-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-cyan-400">
                Upcoming Events
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-cyan-400">
                Join Community
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 font-bold text-white">Account</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/login" className="hover:text-cyan-400">
                Login
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-cyan-400">
                Register
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-cyan-400">
                My Profile
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 font-bold text-white">Follow Us</h3>
          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="rounded-lg bg-gray-800 p-3 hover:bg-cyan-700"
            >
              <Facebook size={19} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="rounded-lg bg-gray-800 p-3 hover:bg-cyan-700"
            >
              <Instagram size={19} />
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="rounded-lg bg-gray-800 p-3 hover:bg-cyan-700"
            >
              <Github size={19} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 px-4 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ShobaiMile. All rights reserved.
      </div>
    </footer>
  );
}
