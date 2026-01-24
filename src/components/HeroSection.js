import React, { useEffect, useState } from "react";
import { CContainer } from "@coreui/react";

const HeroSection = () => {
  const [hero, setHero] = useState(null);

  useEffect(() => {
    fetch("/data/meta.json")
      .then((res) => res.json())
      .then((data) => setHero(data.hero))
      .catch(console.error);
  }, []);

  if (!hero) return null;

  return (
    <section
      className="
        relative w-full overflow-hidden
        pt-16 sm:pt-20
      "
    >
      {/* Hero Image */}
      <img
        src={hero.image}
        alt="Natural Minerals and Ores"
        className="
          w-full
          h-[55vh]
          sm:h-[65vh]
          lg:h-[75vh]
          object-cover
          object-center
          contrast-110
          saturate-110
        "
        style={{
          minHeight: window.innerWidth < 640
            ? hero.minHeightMobile
            : hero.minHeightDesktop,
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-jvcNavy/55"></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/30 to-transparent"></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-4">
        <CContainer>
          <h1
            className="
              text-white font-extrabold tracking-wide
              leading-snug sm:leading-tight
              text-2xl sm:text-4xl lg:text-6xl
            "
            style={{
              textShadow: "0 4px 20px rgba(0,0,0,0.8)",
            }}
          >
            {hero.titleLine1}
            <br />
            <span className="text-jvcOrange">
              {hero.highlight}
            </span>{" "}
            {hero.titleLine2}
          </h1>
        </CContainer>
      </div>
    </section>
  );
};

export default HeroSection;