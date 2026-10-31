"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { Trophy, Loader2, AlertCircle, Medal } from "lucide-react";

type Leader = {
  name: string;
  totalPoints: number;
  volunteerHours: number;
  completedEvents: number;
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

        // Get JWT token
        const { data, error: tokenError } = await authClient.token();

        if (tokenError || !data?.token) {
          throw new Error("Authentication token not found");
        }

        // Fetch leaderboard with JWT
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
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <p className="font-semibold text-emerald-600">ShobaiMile</p>

          <div className="mt-2 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-emerald-600" />

            <h1 className="text-3xl font-bold text-gray-900">
              Volunteer Leaderboard
            </h1>
          </div>

          <p className="mt-2 text-gray-500">
            See how volunteers are making a positive impact.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-600">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!error && leaders.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <Trophy className="mx-auto h-12 w-12 text-gray-300" />

            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              No leaderboard data available yet.
            </h2>

            <p className="mt-2 text-gray-500">
              Complete volunteer events to appear on the leaderboard.
            </p>
          </div>
        )}

        {/* Leaderboard Table */}
        {!error && leaders.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead className="bg-gray-100 text-sm text-gray-600">
                  <tr>
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">Volunteer</th>
                    <th className="px-6 py-4">Points</th>
                    <th className="px-6 py-4">Hours</th>
                    <th className="px-6 py-4">Events</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {leaders.map((leader, index) => (
                    <tr
                      key={`${leader.name}-${index}`}
                      className="transition hover:bg-gray-50"
                    >
                      {/* Rank */}
                      <td className="px-6 py-4 font-bold text-emerald-600">
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

                      {/* Volunteer */}
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {leader.name}
                      </td>

                      {/* Points */}
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {leader.totalPoints}
                      </td>

                      {/* Hours */}
                      <td className="px-6 py-4 text-gray-600">
                        {leader.volunteerHours}
                      </td>

                      {/* Events */}
                      <td className="px-6 py-4 text-gray-600">
                        {leader.completedEvents}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
