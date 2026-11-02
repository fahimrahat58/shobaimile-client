"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { Trophy, Loader2, AlertCircle } from "lucide-react";

type Leader = {
  name: string;
  totalPoints: number;
  volunteerHours: number;
  totalEvents: number;
  completedEventNames: string[];
};

type LeaderboardResponse = {
  success: boolean;
  leaderboard: Leader[];
  message?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LeaderboardPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.push("/login");
      return;
    }

    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        setError("");

        if (!API_URL) {
          throw new Error("API URL is not configured");
        }

        const { data, error: tokenError } = await authClient.token();

        if (tokenError || !data?.token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(`${API_URL}/api/impact/leaderboard`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
          cache: "no-store",
        });

        const result: LeaderboardResponse = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load leaderboard");
        }

        setLeaders(result.leaderboard || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Leaderboard load করা যায়নি।",
        );
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [session, isPending, router]);

  if (isPending || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 sm:mb-8">
          <p className="text-sm font-semibold text-emerald-600 sm:text-base">
            ShobaiMile
          </p>

          <div className="mt-2 flex items-center gap-2 sm:gap-3">
            <Trophy className="h-7 w-7 shrink-0 text-emerald-600 sm:h-8 sm:w-8" />

            <h1 className="text-2xl leading-tight font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Volunteer Leaderboard
            </h1>
          </div>

          <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
            See how volunteers are making a positive impact.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-xl bg-red-50 p-3 text-sm text-red-600 sm:p-4 sm:text-base">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="break-words">{error}</p>
          </div>
        )}

        {!error && leaders.length === 0 && (
          <div className="rounded-2xl bg-white px-4 py-12 text-center shadow-sm sm:py-16">
            <Trophy className="mx-auto h-10 w-10 text-gray-300 sm:h-12 sm:w-12" />

            <h2 className="mt-4 text-lg font-semibold text-gray-800 sm:text-xl">
              No leaderboard data available yet.
            </h2>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Complete volunteer events to appear on the leaderboard.
            </p>
          </div>
        )}

        {!error && leaders.length > 0 && (
          <>
            <div className="space-y-4 md:hidden">
              {leaders.map((leader, index) => (
                <article
                  key={`${leader.name}-${index}`}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-600">
                      {index === 0 ? (
                        <span className="text-2xl">🥇</span>
                      ) : index === 1 ? (
                        <span className="text-2xl">🥈</span>
                      ) : index === 2 ? (
                        <span className="text-2xl">🥉</span>
                      ) : (
                        `#${index + 1}`
                      )}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate font-bold text-gray-900 sm:text-lg">
                        {leader.name}
                      </h2>

                      <p className="text-xs text-gray-500 sm:text-sm">
                        Volunteer
                      </p>
                    </div>

                    <div className="ml-auto shrink-0 text-right">
                      <p className="text-lg font-bold text-emerald-600">
                        {leader.totalPoints}
                      </p>
                      <p className="text-xs text-gray-500">Points</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Volunteer Hours</p>
                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {leader.volunteerHours}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Completed Events</p>
                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {leader.totalEvents}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="mb-2 text-xs font-semibold text-gray-500 sm:text-sm">
                      Completed Event Names
                    </p>

                    {leader.completedEventNames?.length > 0 ? (
                      <ul className="space-y-2">
                        {leader.completedEventNames.map(
                          (eventName, eventIndex) => (
                            <li
                              key={`${eventName}-${eventIndex}`}
                              className="flex items-start gap-2 text-sm text-gray-700"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                              <span className="break-words">{eventName}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400">
                        No completed event names available.
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-sm text-gray-600">
                    <tr>
                      <th className="px-5 py-4 lg:px-6">Rank</th>
                      <th className="px-5 py-4 lg:px-6">Volunteer</th>
                      <th className="px-5 py-4 lg:px-6">Points</th>
                      <th className="px-5 py-4 lg:px-6">Hours</th>
                      <th className="px-5 py-4 lg:px-6">Completed Events</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {leaders.map((leader, index) => (
                      <tr
                        key={`${leader.name}-${index}`}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-5 py-4 font-bold text-emerald-600 lg:px-6">
                          {index === 0 ? (
                            <span className="text-xl">🥇</span>
                          ) : index === 1 ? (
                            <span className="text-xl">🥈</span>
                          ) : index === 2 ? (
                            <span className="text-xl">🥉</span>
                          ) : (
                            `#${index + 1}`
                          )}
                        </td>

                        <td className="max-w-[220px] truncate px-5 py-4 font-semibold text-gray-900 lg:px-6">
                          {leader.name}
                        </td>

                        <td className="px-5 py-4 font-semibold text-gray-900 lg:px-6">
                          {leader.totalPoints}
                        </td>

                        <td className="px-5 py-4 text-gray-600 lg:px-6">
                          {leader.volunteerHours}
                        </td>

                        <td className="min-w-[260px] px-5 py-4 text-gray-600 lg:px-6">
                          {leader.completedEventNames?.length > 0 ? (
                            <ul className="space-y-2">
                              {leader.completedEventNames.map(
                                (eventName, eventIndex) => (
                                  <li
                                    key={`${eventName}-${eventIndex}`}
                                    className="flex items-start gap-2 text-sm"
                                  >
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                                    <span className="break-words">
                                      {eventName}
                                    </span>
                                  </li>
                                ),
                              )}
                            </ul>
                          ) : (
                            <span className="text-sm text-gray-400">
                              No completed event names available.
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
