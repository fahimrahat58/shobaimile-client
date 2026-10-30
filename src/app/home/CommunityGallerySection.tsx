const gallery = [
  {
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900",
    title: "Volunteers Together",
  },
  {
    image: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=900",
    title: "Community Support",
  },
  {
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=900",
    title: "Working Together",
  },
  {
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=900",
    title: "Helping Others",
  },
];

export default function CommunityGallerySection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="font-semibold text-cyan-700">OUR COMMUNITY</span>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Small Moments, Big Impact
          </h2>
          <p className="mt-4 leading-7 text-gray-600">
            Every volunteer, every action, and every moment brings us closer.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {gallery.map((item) => (
            <div
              key={item.title}
              className="group relative h-64 overflow-hidden rounded-2xl md:h-80"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              <h3 className="absolute bottom-5 left-5 font-semibold text-white">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
