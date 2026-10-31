import { Quote } from "lucide-react";

const stories = [
  {
    quote:
      "Joining community events helped me meet amazing people and contribute to something bigger than myself.",
    name: "A Community Volunteer",
    role: "Volunteer",
  },
  {
    quote:
      "Organizing a local cleanup became easier when people from different backgrounds came together.",
    name: "A Community Organizer",
    role: "Event Organizer",
  },
  {
    quote:
      "Small contributions from many people can create a meaningful change in our society.",
    name: "A Community Member",
    role: "Member",
  },
];

export default function CommunityStoriesSection() {
  return (
    <section className="bg-gray-50 py-12 dark:bg-background sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-8">
        <div className="mx-auto mb-8 max-w-2xl px-2 text-center sm:mb-10 lg:mb-12">
          <span className="text-xs font-semibold tracking-wide text-cyan-700 dark:text-cyan-400 sm:text-sm">
            COMMUNITY VOICES
          </span>

          <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-foreground sm:mt-3 sm:text-3xl md:text-4xl">
            Stories That Inspire
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-muted-foreground sm:mt-4 sm:text-base sm:leading-7">
            Discover what community participation means to people.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {stories.map((story) => (
            <article
              key={story.name}
              className="flex h-full min-w-0 flex-col rounded-xl border border-gray-100 bg-white p-5 dark:border-border dark:bg-card sm:rounded-2xl sm:p-6 lg:p-8"
            >
              <Quote
                size={28}
                className="shrink-0 text-cyan-600 sm:h-8 sm:w-8"
              />

              <p className="mt-4 flex-1 text-sm leading-7 text-gray-600 dark:text-muted-foreground sm:mt-5 sm:text-base sm:leading-8">
                “{story.quote}”
              </p>

              <div className="mt-6 border-t border-gray-200 pt-4 dark:border-border sm:mt-7 sm:pt-5">
                <h3 className="break-words text-sm font-bold text-gray-900 dark:text-card-foreground sm:text-base">
                  {story.name}
                </h3>

                <p className="mt-1 text-xs text-cyan-700 dark:text-cyan-400 sm:text-sm">
                  {story.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
