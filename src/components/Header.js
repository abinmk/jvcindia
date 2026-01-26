import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const toSlug = (str) =>
  str
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [meta, setMeta] = useState(null);
  const [types, setTypes] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [showMobileProducts, setShowMobileProducts] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  /* 🔑 REFS */
  const mobileMenuRef = useRef(null);
  const burgerRef = useRef(null);
  const desktopProductsRef = useRef(null);

  /* ---------------- FETCH HEADER META ---------------- */
  useEffect(() => {
    fetch("/data/meta.json")
      .then((res) => res.json())
      .then((data) => setMeta(data.header))
      .catch(console.error);
  }, []);

  /* ---------------- FETCH PRODUCT TYPES ---------------- */
  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => {
        const uniqueTypes = Array.from(
          new Set(data.map((p) => p.type).filter(Boolean))
        );
        setTypes(uniqueTypes);
      })
      .catch(console.error);
  }, []);

  /* ---------------- CLOSE ON ROUTE CHANGE ---------------- */
  useEffect(() => {
    setMenuOpen(false);
    setShowProducts(false);
    setShowMobileProducts(false);
  }, [location.pathname]);

  /* ---------------- CLOSE ON BACK BUTTON ---------------- */
  useEffect(() => {
    const handlePopState = () => {
      setMenuOpen(false);
      setShowProducts(false);
      setShowMobileProducts(false);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  /* ---------------- CLOSE ON OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handleOutsideClick = (e) => {
      // Desktop dropdown
      if (
        showProducts &&
        desktopProductsRef.current &&
        !desktopProductsRef.current.contains(e.target)
      ) {
        setShowProducts(false);
      }

      // Mobile menu
      if (
        menuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        burgerRef.current &&
        !burgerRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
        setShowMobileProducts(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [menuOpen, showProducts]);

  if (!meta) return null;

  /* ---------------- HELPERS ---------------- */

  const goHome = () => {
    setMenuOpen(false);
    setShowProducts(false);
    setShowMobileProducts(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToSection = (id) => {
    setMenuOpen(false);
    setShowProducts(false);
    setShowMobileProducts(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const goToType = (type) => {
    setMenuOpen(false);
    setShowProducts(false);
    setShowMobileProducts(false);
    navigate(`/products/${toSlug(type)}`);
  };


  const goToAllProducts = () => {
    setMenuOpen(false);
    setShowProducts(false);
    setShowMobileProducts(false);
    navigate("/products");
  };

  return (
    <header className="fixed top-0 w-full bg-white z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20 md:h-20">

          {/* LOGO */}
          <button onClick={goHome} className="flex items-center space-x-4 text-left">
            <div className="leading-tight">
              <img src={meta.logo} alt="JVC India" className="h-12 w-auto" />
              <div className="text-sm md:text-base tracking-wide font-medium ml-3">
                {meta.subtitle}
              </div>
            </div>
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center space-x-12">
            <button
              onClick={goHome}
              className="text-lg font-medium text-jvcNavy hover:text-jvcOrange transition"
            >
              Home
            </button>

            {/* PRODUCTS DROPDOWN */}
            <div
              ref={desktopProductsRef}
              className="relative"
              onMouseEnter={() => setShowProducts(true)}
            >
              <button
                className="text-lg text-jvcNavy hover:text-jvcOrange font-medium flex items-center gap-1"
                onClick={() => setShowProducts((v) => !v)}
              >
                Products <span className="text-sm">▾</span>
              </button>

              {showProducts && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border z-50">
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
              )}
            </div>

            <button
              onClick={() => scrollToSection("about")}
              className="text-lg font-medium text-jvcNavy hover:text-jvcOrange"
            >
              About
            </button>

            <button
              onClick={() => scrollToSection("contact")}
              className="text-lg font-medium text-jvcNavy hover:text-jvcOrange"
            >
              Contact
            </button>
          </nav>

          {/* MOBILE BURGER */}
          <button
            ref={burgerRef}
            className="md:hidden text-jvcNavy"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  menuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div ref={mobileMenuRef} className="md:hidden bg-white border-t shadow-lg">
          <nav className="flex flex-col px-8 py-6 space-y-6">

            <button
              onClick={goHome}
              className="text-xl font-medium text-jvcNavy hover:text-jvcOrange text-left"
            >
              Home
            </button>

            {/* MOBILE PRODUCTS */}
            <div>
              <button
                onClick={() => setShowMobileProducts((v) => !v)}
                className="text-xl font-medium text-jvcNavy flex justify-between w-full"
              >
                Products <span>{showMobileProducts ? "−" : "+"}</span>
              </button>

              {showMobileProducts && (
                <div className="mt-4 ml-4 space-y-4">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => goToType(type)}
                      className="block text-lg text-jvcNavy hover:text-jvcOrange"
                    >
                      {type}
                    </button>
                  ))}
                  <button
                    onClick={goToAllProducts}
                    className="block text-lg font-semibold text-jvcOrange"
                  >
                    View All Products →
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => scrollToSection("about")}
              className="text-xl font-medium text-jvcNavy hover:text-jvcOrange text-left"
            >
              About
            </button>

            <button
              onClick={() => scrollToSection("contact")}
              className="text-xl font-medium text-jvcNavy hover:text-jvcOrange text-left"
            >
              Contact
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
