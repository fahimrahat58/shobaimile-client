import { Suspense } from "react";
import EventsPage from "./EventsPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background px-3 py-10 sm:px-5 sm:py-14 lg:px-8 lg:py-16">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-8 space-y-3 sm:mb-10 sm:space-y-4">
              <div className="mx-auto h-5 w-36 animate-pulse rounded-full bg-muted sm:h-6 sm:w-44" />
              <div className="mx-auto h-8 w-3/4 animate-pulse rounded-lg bg-muted sm:h-10 sm:w-1/2 md:h-12" />
              <div className="mx-auto h-4 w-full max-w-xl animate-pulse rounded bg-muted sm:h-5" />
            </div>

            <div className="mb-7 flex flex-wrap gap-2 sm:mb-8 sm:gap-3">
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className="h-9 w-20 animate-pulse rounded-full bg-muted sm:h-10 sm:w-28"
                />
              ))}
            </div>

            <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:gap-4">
              <div className="h-11 w-full animate-pulse rounded-xl bg-muted sm:h-12" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-muted sm:h-12 sm:w-32" />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="h-48 animate-pulse bg-muted sm:h-56" />
                  <div className="space-y-4 p-4 sm:p-6">
                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                    <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                    <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
                  </div>
                </div>
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
