"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import {
  Sun,
  Moon,
  Home,
  CalendarDays,
  UserRound,
  PlusCircle,
  ClipboardList,
  CalendarCheck,
  Trophy,
  Medal,
  Award,
  LogOut,
  ChevronDown,
  Loader2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error("Logout failed");
        return;
      }

      toast.success("Logged out successfully");

      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong during logout");
    } finally {
      setLoggingOut(false);
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const user = session?.user;

  const menuItemClass =
    "flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm font-medium";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 text-foreground shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 text-lg font-extrabold tracking-tight text-cyan-700 transition hover:text-cyan-600 sm:text-2xl dark:text-cyan-400"
        >
          ShobaiMile
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden flex-1 items-center justify-center gap-5 text-sm font-semibold md:flex">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground transition hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Home className="h-4 w-4 text-blue-500" />
            Home
          </Link>

          <Link
            href="/events"
            className="flex items-center gap-2 text-muted-foreground transition hover:text-purple-600 dark:hover:text-purple-400"
          >
            <CalendarDays className="h-4 w-4 text-purple-500" />
            Upcoming Events
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {/* Theme Toggle */}
          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle theme"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card transition hover:bg-muted"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-600" />
              )}
            </button>
          )}

          {/* Authentication */}
          {!isPending &&
            (user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="group flex max-w-[220px] items-center gap-1.5 rounded-xl border border-border bg-card p-1 pr-2 outline-none transition hover:border-cyan-500/50 hover:bg-muted sm:gap-2 sm:pr-2.5">
                  {/* Avatar */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-white sm:h-9 sm:w-9">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound className="h-4 w-4" />
                    )}
                  </div>

                  {/* Username */}
                  <span
                    className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[110px] group-hover:opacity-100 sm:text-sm sm:group-hover:max-w-[180px]"
                    title={user.name || "My Account"}
                  >
                    {user.name || "My Account"}
                  </span>

                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="max-h-[75vh] w-[min(240px,calc(100vw-24px))] overflow-y-auto rounded-xl border border-border bg-card p-1.5 shadow-lg sm:w-60"
                >
                  {/* User Information */}
                  <div className="flex items-center gap-2.5 px-2 py-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-white">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound className="h-4 w-4" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {user.name || "User"}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <DropdownMenuSeparator className="my-1" />

                  {/* Profile */}
                  <DropdownMenuItem
                    className={menuItemClass}
                    onClick={() => router.push("/profile")}
                  >
                    <UserRound className="h-4 w-4 shrink-0 text-blue-500" />
                    Profile
                  </DropdownMenuItem>

                  {/* Create Event */}
                  <DropdownMenuItem
                    className={menuItemClass}
                    onClick={() => router.push("/create-event")}
                  >
                    <PlusCircle className="h-4 w-4 shrink-0 text-green-500" />
                    Create Event
                  </DropdownMenuItem>

                  {/* Manage Events */}
                  <DropdownMenuItem
                    className={menuItemClass}
                    onClick={() => router.push("/manage-events")}
                  >
                    <ClipboardList className="h-4 w-4 shrink-0 text-orange-500" />
                    Manage Events
                  </DropdownMenuItem>

                  {/* Joined Events */}
                  <DropdownMenuItem
                    className={menuItemClass}
                    onClick={() => router.push("/joined-events")}
                  >
                    <CalendarCheck className="h-4 w-4 shrink-0 text-teal-500" />
                    Joined Events
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1" />

                  {/* Impact Dashboard */}
                  <DropdownMenuItem
                    className={menuItemClass}
                    onClick={() => router.push("/dashboard/impact")}
                  >
                    <Trophy className="h-4 w-4 shrink-0 text-amber-500" />
                    Impact Dashboard
                  </DropdownMenuItem>

                  {/* Leaderboard */}
                  <DropdownMenuItem
                    className={menuItemClass}
                    onClick={() => router.push("/leaderboard")}
                  >
                    <Medal className="h-4 w-4 shrink-0 text-pink-500" />
                    Leaderboard
                  </DropdownMenuItem>

                  {/* Certificates */}
                  <DropdownMenuItem
                    className={menuItemClass}
                    onClick={() => router.push("/certificates")}
                  >
                    <Award className="h-4 w-4 shrink-0 text-indigo-500" />
                    My Certificates
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1" />

                  {/* Logout */}
                  <DropdownMenuItem
                    disabled={loggingOut}
                    className={`${menuItemClass} text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-500/10 dark:focus:text-red-400`}
                    onClick={handleLogout}
                  >
                    {loggingOut ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}

                    {loggingOut ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                {/* Login */}
                <Link
                  href="/login"
                  className="rounded-lg px-2.5 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-cyan-600 sm:px-3 sm:text-sm"
                >
                  Login
                </Link>

                {/* Register */}
                <Link
                  href="/register"
                  className="rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-700 sm:px-3.5 sm:text-sm"
                >
                  Register
                </Link>
              </>
            ))}
        </div>

        {/* Mobile Navigation */}
        <div className="order-3 flex w-full items-center justify-center gap-6 border-t border-border pt-2 text-xs font-semibold md:hidden sm:text-sm">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-muted-foreground transition hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Home className="h-4 w-4 text-blue-500" />
            Home
          </Link>

          <Link
            href="/events"
            className="flex items-center gap-1.5 text-muted-foreground transition hover:text-purple-600 dark:hover:text-purple-400"
          >
            <CalendarDays className="h-4 w-4 text-purple-500" />
            Upcoming Events
          </Link>
        </div>
      </nav>
    </header>
  );
}
