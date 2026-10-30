"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Leader = {
  name: string;
  totalPoints: number;
  volunteerHours: number;
  completedEvents: number;
};

type LeaderboardResponse = {
  success: boolean;
  leaderboard: Leader[];
};

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const result = await apiFetch<LeaderboardResponse>(
          "/api/impact/leaderboard",
        );

        setLeaders(result.leaderboard || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Leaderboard load করা যায়নি।",
        );
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="font-semibold text-emerald-600">ShobaiMile</p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Volunteer Leaderboard
          </h1>

          <p className="mt-2 text-gray-500">
            See how volunteers are making a positive impact.
          </p>
        </div>

        {loading && (
          <p className="py-10 text-center text-gray-500">
            Loading leaderboard...
          </p>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-red-600">{error}</div>
        )}

        {!loading && !error && leaders.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
            No leaderboard data available yet.
          </div>
        )}

        {!loading && !error && leaders.length > 0 && (
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
                      <td className="px-6 py-4 font-bold text-emerald-600">
                        {index + 1 === 1
                          ? "🥇"
                          : index + 1 === 2
                            ? "🥈"
                            : index + 1 === 3
                              ? "🥉"
                              : `#${index + 1}`}
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {leader.name}
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {leader.totalPoints}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {leader.volunteerHours}
                      </td>

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
