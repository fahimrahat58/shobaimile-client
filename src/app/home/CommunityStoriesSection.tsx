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
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="font-semibold text-cyan-700">COMMUNITY VOICES</span>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Stories That Inspire
          </h2>
          <p className="mt-4 text-gray-600">
            Discover what community participation means to people.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {stories.map((story) => (
            <div
              key={story.name}
              className="rounded-2xl border border-gray-100 bg-white p-8"
            >
              <Quote size={32} className="text-cyan-600" />

              <p className="mt-5 leading-8 text-gray-600">“{story.quote}”</p>

              <div className="mt-7 border-t pt-5">
                <h3 className="font-bold text-gray-900">{story.name}</h3>
                <p className="mt-1 text-sm text-cyan-700">{story.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
