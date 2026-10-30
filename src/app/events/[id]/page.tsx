import { Suspense } from "react";
import EventDetailsContent from "./EventDetailsContent";

export default function EventDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen animate-pulse bg-slate-50 px-4 py-20">
          <div className="mx-auto h-96 max-w-5xl rounded-2xl bg-slate-200" />
        </div>
      }
    >
      <EventDetailsContent />
    </Suspense>
  );
}
