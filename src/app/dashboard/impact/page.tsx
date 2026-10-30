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
  nextMilestone: number;
  pointsToNextMilestone: number;
};

type ImpactResponse = {
  success: boolean;
  impact: ImpactData;
};

export default function ImpactPage() {
  const [impact, setImpact] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadImpact() {
      try {
        const result = await apiFetch<ImpactResponse>("/api/impact/me");
        setImpact(result.impact);
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
      <div className="p-6 text-center text-gray-600">
        Loading your impact...
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-6 rounded-xl bg-red-50 p-4 text-red-600">{error}</div>
    );
  }

  if (!impact) {
    return <p className="p-6 text-gray-600">No impact data found.</p>;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="font-semibold text-emerald-600">ShobaiMile</p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            My Impact Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Track your volunteering journey and see the difference you make.
          </p>
        </div>

        <ImpactStats
          totalPoints={impact.totalPoints}
          volunteerHours={impact.volunteerHours}
          completedEvents={impact.completedEvents}
        />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ImpactBadge badge={impact.badge} />

          <ImpactProgress
            totalPoints={impact.totalPoints}
            nextMilestone={impact.nextMilestone}
            pointsToNextMilestone={impact.pointsToNextMilestone}
          />
        </div>
      </div>
    </main>
  );
}
