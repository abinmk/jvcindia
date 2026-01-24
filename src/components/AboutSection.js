import React, { useEffect, useState } from "react";

const AboutSection = () => {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetch("/data/meta.json")
      .then((res) => res.json())
      .then((data) => setAbout(data.about))
      .catch(console.error);
  }, []);

  if (!about) return null;

  return (
    <section
      id="about"
      className="relative py-28 bg-gray-900 overflow-hidden"
    >
      {/* Background Image */}
      {about.backgroundImage && (
        <img
          src={about.backgroundImage}
          alt="Mineral processing and export"
          className="absolute inset-0 w-full h-full object-cover opacity-85"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-jvcNavy/80"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl font-semibold text-white tracking-tight">
            {about.title}
          </h2>
          <p className="mt-5 text-lg text-gray-200 leading-relaxed">
            {about.description}
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-12 max-w-5xl mx-auto">
          {about.cards.map((card, index) => (
            <div
              key={index}
              className="
                bg-white/95
                backdrop-blur
                p-10
                border border-gray-200
                rounded-xl
                text-center
                shadow-lg
              "
            >
              <span className="block text-sm tracking-widest text-jvcOrange font-medium mb-4">
                {card.label}
              </span>

              <h3 className="text-2xl font-semibold text-jvcNavy mb-4">
                {card.heading}
              </h3>

              <p className="text-gray-700 leading-relaxed">
                {card.content}
              </p>
            </div>
          ))}
        </div>

        {/* Credibility Line */}
        {about.credibilityLine && (
          <div className="max-w-4xl mx-auto mt-16 text-center">
            <p className="text-gray-300 text-sm tracking-wide">
              {about.credibilityLine}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;