import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiChevronDown,
  FiGlobe,
  FiCheck,
  FiTruck
} from "react-icons/fi";

const toSlug = (str) =>
  str
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");


const HeroSection = () => {
  const [hero, setHero] = useState(null);
  const [types, setTypes] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    fetch("/data/meta.json")
      .then((res) => res.json())
      .then((data) => {
        setHero(data.hero);
        setTimeout(() => setIsVisible(true), 100);
      })
      .catch(console.error);

    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => {
        const uniqueTypes = Array.from(
          new Set(data.map((p) => p.type).filter(Boolean))
        );
        setTypes(uniqueTypes);
      })
      .catch(console.error);

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width - 0.5) * 20;
      const y = ((e.clientY - top) / height - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!hero) return null;

  const goToAllProducts = () => navigate("/products");
  const goToType = (type) =>
    navigate(`/products/${toSlug(type)}`);

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    const headerHeight =
      document.querySelector("header")?.offsetHeight || 80;
    if (el) {
      window.scrollTo({
        top: el.offsetTop - headerHeight,
        behavior: "smooth"
      });
    }
  };

  const stats = [
    { icon: <FiTruck />, value: "Seamless", label: "Logistics" },
    { icon: <FiCheck />, value: "Assured", label: "Quality" },
    { icon: <FiGlobe />, value: "Global", label: "Exports" }
  ];

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[95vh] overflow-hidden bg-gradient-to-b from-gray-900 to-jvcNavy"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.05)`
          }}
        >
          <img
            src={hero.image}
            alt="Natural Minerals and Ores"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-jvcNavy/95" />
      </div>

      {/* CONTENT */}
      <div className="relative z-20 min-h-[100vh] flex items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-1 gap-12 items-center">
            <div
              className={`space-y-8 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h1 className="text-4xl sm:text-4xl md:text-5xl font-black text-white">
                <span className="block">{hero.titleLine1}</span>
                <span className="block mt-2">
                  <span className="bg-gradient-to-r from-jvcOrange to-orange-500 bg-clip-text text-transparent">
                    {hero.highlight}
                  </span>{" "}
                  <span className="block mt-2"></span>
                  {hero.titleLine2}
                </span>
              </h1>

              {/* MOBILE STATS */}
              <div className="flex justify-between py-4 border-y border-white/10 lg:hidden">
                {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-jvcOrange flex justify-center mb-1">
                      {s.icon}
                    </div>
                    <div className="text-white font-bold">{s.value}</div>
                    <div className="text-white/60 text-xs">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 relative">
                {/* DESKTOP DROPDOWN (FIXED) */}
                <div
                  className="relative hidden lg:block"
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <button
                    className="
                      relative overflow-hidden
                      group
                      px-8 py-4
                      bg-gradient-to-r from-jvcOrange to-orange-500
                      text-white font-bold text-lg
                      rounded-2xl
                      shadow-2xl shadow-orange-500/30
                      hover:shadow-orange-500/50
                      transition-all duration-300
                    "
                  >
                    <span className="shine-layer" />
                    <span className="relative z-10 flex items-center gap-3">
                      Explore Products
                      <FiChevronDown />
                    </span>
                  </button>

                  {/* DROPDOWN PANEL */}
                  <div
                    className={`
                      absolute top-full left-0 mt-3 w-72
                      bg-white rounded-xl shadow-xl overflow-hidden z-50
                      transition-all duration-200
                      ${
                        showDropdown
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-2"
                      }
                    `}
                  >
                    {types.map((type) => (
                      <button
                        key={type}
                        onClick={() => goToType(type)}
                        className="w-full text-left px-5 py-3 hover:bg-gray-100 text-jvcNavy"
                      >
                        {type}
                      </button>
                    ))}

                    <div className="border-t">
                      <button
                        onClick={goToAllProducts}
                        className="w-full px-5 py-3 font-semibold text-jvcOrange hover:bg-orange-50"
                      >
                        View All Products →
                      </button>
                    </div>
                  </div>
                </div>

                {/* MOBILE BUTTON */}
                <button
                  onClick={goToAllProducts}
                  className="
                    lg:hidden
                    px-8 py-4
                    bg-gradient-to-r from-jvcOrange to-orange-500
                    text-white font-bold text-lg
                    rounded-2xl
                  "
                >
                  Explore Products
                </button>

                <button
                  onClick={scrollToContact}
                  className="
                    px-8 py-4
                    bg-white/10 backdrop-blur-md
                    border-2 border-white/30
                    hover:bg-white/20
                    text-white font-bold text-lg
                    rounded-2xl
                    transition-all duration-300
                  "
                >
                  Get Quote ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SCROLL */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={goToAllProducts}
          className="flex flex-col items-center gap-2 text-white/70"
        >
          <span className="text-sm tracking-widest">SCROLL TO EXPLORE</span>
          <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center">
            <FiChevronDown className="w-6 h-6" />
          </div>
        </button>
      </div>

      {/* SHINE */}
      <style>{`
        .shine-layer {
          pointer-events: none;
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 25%,
            rgba(255,255,255,0.35),
            transparent 75%
          );
          transform: translateX(-180%);
          animation: shine 4s ease-in-out infinite;
        }

        @keyframes shine {
          0% { transform: translateX(-180%); }
          70% { transform: translateX(180%); }
          100% { transform: translateX(180%); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
