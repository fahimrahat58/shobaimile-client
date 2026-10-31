import { Suspense } from "react";
import EventDetailsContent from "./EventDetailsContent";

export default function EventDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen animate-pulse bg-slate-50 px-3 py-8 sm:px-6 sm:py-12 lg:px-10">
          <div className="mx-auto w-full max-w-6xl">
            <div className="h-[240px] rounded-xl bg-slate-200 sm:h-[360px] sm:rounded-2xl md:h-[420px]" />

            <div className="mt-4 space-y-3 rounded-xl bg-white p-3 sm:mt-6 sm:space-y-4 sm:rounded-2xl sm:p-6">
              <div className="h-5 w-2/3 rounded bg-slate-200 sm:h-6" />
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-4/5 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      }
    >
      <EventDetailsContent />
    </Suspense>
  );
}
