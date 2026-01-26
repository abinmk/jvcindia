import React, { useEffect, useState } from "react";

const AboutSection = () => {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetch("/data/meta.json")
      .then((res) => res.json())
      .then((data) => setAbout(data.about))
      .catch(console.error);

    injectOrganizationSchema();
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

        {/* Services */}
        {about.services && (
          <div className="max-w-6xl mx-auto mt-24 text-center">
            <h3 className="text-4xl font-semibold text-white tracking-tight mb-16">
              Services
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {about.services.map((service, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  {/* Icon Box */}
                  <div className="w-32 h-32 bg-jvcOrange flex items-center justify-center mb-6">
                    <img
                      src={service.icon}
                      alt={service.title}
                      className="w-32 h-32"
                    />
                  </div>

                  <h4 className="text-xl font-semibold text-white mb-3">
                    {service.title}
                  </h4>

                  <p className="text-gray-200 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="sr-only">
          JVC India operates as an experienced industrial minerals export company
          from India, supporting global buyers with consistent quality, export
          documentation, and bulk shipment capabilities across international markets.
        </p>

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

function injectOrganizationSchema() {
  const existing = document.getElementById("org-schema");
  if (existing) return;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "JVC India",
    url: window.location.origin,
    description:
      "JVC India is an industrial minerals exporter from India supplying processed and raw mineral products to global markets.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN"
    },
    areaServed: "Worldwide",
    knowsAbout: [
      "Industrial Minerals",
      "Mineral Export",
      "Bulk Mineral Supply",
      "Global Export Logistics"
    ]
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "org-schema";
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}

<p className="sr-only">
  JVC India is an Indian exporter and supplier of industrial minerals,
  construction minerals, micro silica, silica fume, quartz sand,
  gypsum powder, GGBS, ores, and industrial raw materials serving
  Middle East and global markets.
</p>



export default AboutSection;