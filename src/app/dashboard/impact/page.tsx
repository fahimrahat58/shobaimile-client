"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import ImpactStats from "@/components/impact/ImpactStats";
import ImpactBadge from "@/components/impact/ImpactBadge";
import ImpactProgress from "@/components/impact/ImpactProgress";

type ImpactData = {
  totalPoints: number;
  volunteerHours: number;
  completedEvents: number;
  badge: string;
  nextMilestone: number | null;
  pointsToNextMilestone: number;
};

type ImpactResponse = {
  success: boolean;
  totalEvents: number;
  totalHours: number;
  totalPoints: number;
  records: {
    totalPoints?: number;
    volunteerHours?: number;
  }[];
};

function getBadge(totalPoints: number) {
  if (totalPoints >= 500) return "Impact Champion";
  if (totalPoints >= 250) return "Community Hero";
  if (totalPoints >= 100) return "Dedicated Volunteer";
  if (totalPoints >= 50) return "Active Volunteer";
  return "Beginner";
}

function getNextMilestone(totalPoints: number) {
  const milestones = [50, 100, 250, 500, 1000];

  return milestones.find((milestone) => totalPoints < milestone) ?? null;
}

export default function ImpactPage() {
  const [impact, setImpact] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadImpact() {
      try {
        const result = await apiFetch<ImpactResponse>("/api/impact/me");

        const totalPoints = Number(result.totalPoints) || 0;
        const volunteerHours = Number(result.totalHours) || 0;
        const completedEvents = Number(result.totalEvents) || 0;
        const nextMilestone = getNextMilestone(totalPoints);

        setImpact({
          totalPoints,
          volunteerHours,
          completedEvents,
          badge: getBadge(totalPoints),
          nextMilestone,
          pointsToNextMilestone:
            nextMilestone === null ? 0 : nextMilestone - totalPoints,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Impact data load করা যায়নি।",
        );
      } finally {
        setLoading(false);
      }
    }

    loadImpact();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 text-center text-sm text-gray-600 sm:text-base">
        Loading your impact...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-3 mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-600 sm:mx-6 sm:p-4 sm:text-base lg:mx-10">
        {error}
      </div>
    );
  }

  if (!impact) {
    return (
      <p className="px-4 py-6 text-center text-sm text-gray-600 sm:text-base">
        No impact data found.
      </p>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-3 py-6 sm:px-6 sm:py-10 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <p className="text-sm font-semibold text-emerald-600 sm:text-base">
            ShobaiMile
          </p>

          <h1 className="mt-2 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
            My Impact Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-base">
            Track your volunteering journey and see the difference you make.
          </p>
        </div>

        <div className="min-w-0">
          <ImpactStats
            totalPoints={impact.totalPoints}
            volunteerHours={impact.volunteerHours}
            completedEvents={impact.completedEvents}
          />
        </div>

        <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-2">
          <div className="min-w-0">
            <ImpactBadge badge={impact.badge} />
          </div>

          <div className="min-w-0">
            {impact.nextMilestone !== null && (
              <ImpactProgress
                totalPoints={impact.totalPoints}
                nextMilestone={impact.nextMilestone}
                pointsToNextMilestone={impact.pointsToNextMilestone}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
