import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiChevronDown, FiX } from "react-icons/fi";

const HeroSection = () => {
  const [hero, setHero] = useState(null);
  const [types, setTypes] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showDesktopDropdown, setShowDesktopDropdown] = useState(false);
  const [showMobileSheet, setShowMobileSheet] = useState(false);

  const navigate = useNavigate();
  const containerRef = useRef(null);

  const toSlug = (str) =>
  str
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");


  /* 🔑 NEW REFS */
  const dropdownRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    fetch("/data/meta.json")
      .then((res) => res.json())
      .then((data) => {
        setHero(data.hero);
        setTimeout(() => setIsVisible(true), 100);
      });

    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => {
        const uniqueTypes = Array.from(
          new Set(data.map((p) => p.type).filter(Boolean))
        );
        setTypes(uniqueTypes);
      });

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - left) / width - 0.5) * 20,
        y: ((e.clientY - top) / height - 0.5) * 20
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /* ---------------- OUTSIDE CLICK (DESKTOP) ---------------- */
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        showDesktopDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDesktopDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showDesktopDropdown]);

  if (!hero) return null;

  /* ---------------- NAV HELPERS ---------------- */

  const goToAll = () => {
    setShowDesktopDropdown(false);
    setShowMobileSheet(false);
    navigate("/products");
  };

  const goToType = (type) => {
    setShowDesktopDropdown(false);
    setShowMobileSheet(false);
    navigate(`/products/${toSlug(type)}`);
  };


  /* ---------------- DESKTOP HOVER HANDLERS ---------------- */

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeoutRef.current);
    setShowDesktopDropdown(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowDesktopDropdown(false);
    }, 180); // ⏱ enough time to move cursor
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[95vh] overflow-hidden bg-gradient-to-b from-gray-900 to-jvcNavy"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 transition-transform duration-300"
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
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12">
            <div
              className={`space-y-8 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                <span className="block">{hero.titleLine1}</span>
                <span className="block mt-2">
                  <span className="bg-gradient-to-r from-jvcOrange to-orange-500 bg-clip-text text-transparent">
                    {hero.highlight}
                  </span>{" "}
                  <span className="block mt-2"></span>
                  {hero.titleLine2}
                </span>
              </h1>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 relative">

                {/* ================= DESKTOP DROPDOWN ================= */}
                <div
                  ref={dropdownRef}
                  className="relative hidden lg:block"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="px-8 py-4 bg-gradient-to-r from-jvcOrange to-orange-500 text-white font-bold rounded-2xl flex items-center gap-2">
                    Explore Products
                    <FiChevronDown />
                  </button>

                  {showDesktopDropdown && (
                    <div className="absolute top-full mt-3 w-72 bg-white rounded-xl shadow-xl overflow-hidden z-50">
                      {types.map((type) => (
                        <button
                          key={type}
                          onClick={() => goToType(type)}
                          className="w-full text-left px-5 py-3 hover:bg-gray-100"
                        >
                          {type}
                        </button>
                      ))}
                      <div className="border-t">
                        <button
                          onClick={goToAll}
                          className="w-full px-5 py-3 font-semibold text-jvcOrange hover:bg-orange-50"
                        >
                          View All Products →
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ================= MOBILE BUTTON ================= */}
                <button
                  onClick={() => setShowMobileSheet(true)}
                  className="lg:hidden px-8 py-4 bg-gradient-to-r from-jvcOrange to-orange-500 text-white font-bold rounded-2xl"
                >
                  Explore Products
                </button>

                <button
                  onClick={() => navigate("/#contact")}
                  className="px-8 py-4 bg-white/10 border border-white/30 text-white font-bold rounded-2xl"
                >
                  Get Quote ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE BOTTOM SHEET ================= */}
      {showMobileSheet && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end lg:hidden"
          onClick={() => setShowMobileSheet(false)}
        >
          <div
            className="w-full bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-jvcNavy">Products</h3>
              <button onClick={() => setShowMobileSheet(false)}>
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {types.map((type) => (
              <button
                key={type}
                onClick={() => goToType(type)}
                className="w-full text-left py-3 text-jvcNavy border-b"
              >
                {type}
              </button>
            ))}

            <button
              onClick={goToAll}
              className="mt-4 w-full py-3 bg-jvcOrange text-white font-semibold rounded-xl"
            >
              View All Products
            </button>
          </div>
        </div>
      )}
      
    </section>
  );
};

export default HeroSection;
