"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
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

  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error("Logout failed");
      return;
    }

    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-cyan-700">
          ShobaiMile
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="hover:text-cyan-700">
            Home
          </Link>

          <Link href="/events" className="hover:text-cyan-700">
            Upcoming Events
          </Link>

          {!isPending && (
            <>
              {session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="rounded-md bg-cyan-50 px-4 py-2 text-cyan-800 outline-none hover:bg-cyan-100">
                    {session.user.name || "My Account"}
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/create-event">Create Event</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/manage-events">Manage Events</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/joined-events">Joined Events</Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/login" className="hover:text-cyan-700">
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="rounded-md bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
