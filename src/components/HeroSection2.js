import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiChevronDown } from "react-icons/fi";

const HeroSection = () => {
  const [hero, setHero] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/data/meta.json")
      .then((res) => res.json())
      .then((data) => setHero(data.hero))
      .catch(console.error);
  }, []);

  if (!hero) return null;

  const scrollToProducts = () => navigate('/products');

  const scrollToContact = () => {
    if (window.location.pathname === '/') {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
        window.scrollTo({
          top: contactSection.offsetTop - headerHeight,
          behavior: 'smooth'
        });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          const headerHeight = document.querySelector('header')?.offsetHeight || 80;
          window.scrollTo({
            top: contactSection.offsetTop - headerHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      {/* Optimized Background Image */}
      <div className="absolute inset-0">
        <img
          src={hero.image}
          alt="Natural Minerals and Ores"
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-jvcNavy/80 via-jvcNavy/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-6xl mx-auto w-full">
          {/* Title */}
          <div className="mb-10">
            <h1 className="text-white font-bold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 drop-shadow-lg">
              <span className="block">{hero.titleLine1}</span>
              <span className="block mt-2 sm:mt-4">
                <span className="text-jvcOrange">{hero.highlight}</span>
                {" "}{hero.titleLine2}
              </span>
            </h1>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button
              onClick={scrollToProducts}
              className="px-8 py-4 bg-jvcOrange text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-3 shadow-lg"
            >
              <span>Explore Our Products</span>
              <FiArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={scrollToContact}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-3"
            >
              <span>Request Quote</span>
              <span>↗</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <button
          onClick={scrollToProducts}
          className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <span className="text-sm font-medium">EXPLORE PRODUCTS</span>
          <div className="animate-bounce w-10 h-10 rounded-full border border-white/30 flex items-center justify-center">
            <FiChevronDown className="w-5 h-5" />
          </div>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;