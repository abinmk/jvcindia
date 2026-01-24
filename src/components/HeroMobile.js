import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiChevronDown, FiGlobe, FiCheck, FiTruck } from "react-icons/fi";

const HeroSection = () => {
  const [hero, setHero] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    fetch("/data/meta.json")
      .then((res) => res.json())
      .then((data) => {
        setHero(data.hero);
        setTimeout(() => setIsVisible(true), 100);
      })
      .catch(console.error);

    // Parallax effect on mouse move
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width - 0.5) * 20;
      const y = ((e.clientY - top) / height - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!hero) return null;

  const scrollToProducts = () => navigate("/products");

  const scrollToContact = () => {
    const go = () => {
      const el = document.getElementById("contact");
      const headerHeight = document.querySelector("header")?.offsetHeight || 80;
      if (el) {
        window.scrollTo({
          top: el.offsetTop - headerHeight,
          behavior: "smooth",
        });
      }
    };

    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(go, 300);
    } else {
      go();
    }
  };

  // Creative stats for mobile view
  const stats = [
    { icon: <FiTruck />, value: "Seamless", label: "Logistics" },
    { icon: <FiCheck />, value: "Assured", label: "Quality" },
    { icon: <FiGlobe />, value: "Global", label: "Exports" },
  ];

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[95vh] overflow-hidden bg-gradient-to-b from-gray-900 to-jvcNavy"
    >
      {/* ================= BACKGROUND LAYERS ================= */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main Image with Parallax */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.05)`,
          }}
        >
          <img
            src={hero.image}
            alt="Natural Minerals and Ores"
            className="w-full h-full object-cover"
            style={{
              objectPosition: "center 25%", // Optimized for mobile
            }}
          />
        </div>

        {/* Dynamic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-jvcNavy/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-jvcNavy/30 via-transparent to-jvcNavy/30" />
        
        {/* Animated Light Streaks */}
        <div className="absolute inset-0 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"
              style={{
                transform: `translateX(${i * 100}px)`,
                animation: `lightStreak ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i}s`,
              }}
            />
          ))}
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[2px] h-[2px] bg-jvcOrange/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `floatParticle ${5 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative z-20 min-h-[100vh] flex items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Column - Text Content */}
            <div
              ref={textRef}
              className={`space-y-6 lg:space-y-8 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              {/* Tagline Badge */}
              {/* <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-500 delay-100 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
              > */}
                {/* <div className="w-2 h-2 rounded-full bg-jvcOrange animate-pulse" /> */}
                {/* <span className="text-white/90 text-sm font-medium tracking-wider">
                  Mineral Export Specialists
                </span> */}
              {/* </div> */}

              {/* Main Headline */}
              <div className="space-y-4">
                <h1
                  className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight transition-all duration-700 delay-200 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <span className="block text-white">
                    {hero.titleLine1}
                  </span>
                  <span className="block mt-2">
                    <span className="bg-gradient-to-r from-jvcOrange to-orange-400 bg-clip-text text-transparent">
                      {hero.highlight}
                    </span>
                    <span className="text-white"> {hero.titleLine2}</span>
                  </span>
                </h1>

                {/* Description */}
                {/* <p
                  className={`text-lg sm:text-xl text-white/80 leading-relaxed max-w-xl transition-all duration-700 delay-300 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  Leading global exporters of premium natural minerals, ores, and cement admixture with unmatched quality and reliability.
                </p> */}
              </div>

              {/* Mobile Stats Bar */}
              <div
                className={`flex justify-between py-4 border-y border-white/10 lg:hidden transition-all duration-700 delay-400 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2 text-jvcOrange">
                      {stat.icon}
                    </div>
                    <div className="text-white font-bold text-xl">
                      {stat.value}
                    </div>
                    <div className="text-white/60 text-xs mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div
                className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <button
                  onClick={scrollToProducts}
                  className="
                    group
                    px-8 py-4
                    bg-gradient-to-r from-jvcOrange to-orange-500
                    hover:from-orange-500 hover:to-jvcOrange
                    text-white font-bold text-lg
                    rounded-2xl
                    shadow-2xl shadow-orange-500/30
                    flex items-center justify-center gap-3
                    transition-all duration-300
                    active:scale-95
                    hover:shadow-orange-500/50
                    hover:-translate-y-1
                  "
                >
                  <span>Explore Products</span>
                  <FiArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
                </button>

                <button
                  onClick={scrollToContact}
                  className="
                    group
                    px-8 py-4
                    bg-white/10 backdrop-blur-md
                    hover:bg-white/20
                    border-2 border-white/30
                    hover:border-white/50
                    text-white font-bold text-lg
                    rounded-2xl
                    flex items-center justify-center gap-3
                    transition-all duration-300
                    active:scale-95
                    hover:-translate-y-1
                  "
                >
                  <span>Get Instant Quote</span>
                  <span className="text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column - Visual Elements (Hidden on mobile) */}
            <div className="hidden lg:block relative">
              {/* Floating Mineral Cards */}
              <div className="relative h-[400px]">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="absolute w-64 h-80 rounded-2xl overflow-hidden border-2 border-white/10 backdrop-blur-sm bg-gradient-to-br from-white/5 to-transparent"
                    style={{
                      right: `${i * 40}px`,
                      top: `${i * 60}px`,
                      transform: `rotate(${i * 5}deg)`,
                      animation: `floatCard ${8 + i * 2}s ease-in-out infinite`,
                      animationDelay: `${i * 1.5}s`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-jvcOrange/10 to-transparent" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SCROLL INDICATOR ================= */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-30 transition-all duration-700 delay-700 ${
          isVisible ? "opacity-100" : "opacity-0 translate-y-4"
        }`}
      >
        <br></br>
        <button
          onClick={scrollToProducts}
          className="flex flex-col items-center gap-2 group"
        >
          <span className="text-white/70 text-sm font-medium tracking-widest transition-all duration-300 group-hover:text-white">
            SCROLL TO EXPLORE
          </span>
          <div className="w-12 h-12 rounded-full border-2 border-white/30 group-hover:border-white/60 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            <div className="animate-bounce-slow">
              <FiChevronDown className="w-6 h-6 text-white/70 group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
        </button>
      </div>

      {/* ================= CSS ANIMATIONS ================= */}
      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
          }
        }

        @keyframes lightStreak {
          0%, 100% {
            transform: translateY(-100%) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(100%) translateX(0);
            opacity: 0;
          }
        }

        @keyframes floatCard {
          0%, 100% {
            transform: translateY(0) rotate(var(--rotate, 0deg));
          }
          50% {
            transform: translateY(-20px) rotate(var(--rotate, 0deg));
          }
        }

        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;