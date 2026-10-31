import { Suspense } from "react";
import EventsPage from "./EventsPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-96 animate-pulse rounded-2xl border border-border bg-muted"
                />
              ))}
            </div>
          </div>
        </main>
      }
    >
      <EventsPage />
    </Suspense>
  );
}
