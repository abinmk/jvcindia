import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [meta, setMeta] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/data/meta.json")
      .then((res) => res.json())
      .then((data) => setMeta(data.header))
      .catch(console.error);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

   if (!meta) return null;

  const scrollToSection = (id) => {
    setMenuOpen(false); // ✅ FORCE CLOSE ALWAYS
  
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

  return (
    <header className="fixed top-0 w-full bg-white z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20 md:h-24">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4">
            <div className="leading-tight">
            <img
              src={meta.logo}
              alt="JVC India"
              className="h-12 w-auto"
            />
              <div className="text-sm text-gray-500">
                {meta.subtitle}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-12">
            <NavLinkItem to="/">Home</NavLinkItem>
            <NavLinkItem to="/products">Products</NavLinkItem>

            <button
              onClick={() => scrollToSection("about")}
              className="text-lg text-jvcNavy hover:text-jvcOrange font-medium transition"
            >
              About
            </button>

            <button
              onClick={() => scrollToSection("contact")}
              className="text-lg text-jvcNavy hover:text-jvcOrange font-medium transition"
            >
              Contact
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-jvcNavy"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
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

      {/* Mobile Menu */}
      {menuOpen && (
  <div className="md:hidden bg-white border-t shadow-lg">
    <nav className="flex flex-col px-8 py-6 space-y-6">
      <MobileNavItem to="/">Home</MobileNavItem>
      <MobileNavItem to="/products">Products</MobileNavItem>

      <button
        onClick={() => scrollToSection("about")}
        className="text-xl font-medium text-jvcNavy hover:text-jvcOrange transition text-left"
      >
        About
      </button>

      <button
        onClick={() => scrollToSection("contact")}
        className="text-xl font-medium text-jvcNavy hover:text-jvcOrange transition text-left"
      >
        Contact
      </button>
    </nav>
  </div>
)}
    </header>
  );
};

/* Reusable NavLink Item */
const NavLinkItem = ({ to, children, mobile }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        ${mobile ? "text-xl" : "text-lg"}
        font-medium
        text-jvcNavy
        hover:text-jvcOrange
        transition
        ${isActive ? "text-jvcOrange" : ""}
      `
      }
    >
      {children}
    </NavLink>
  );
};

const MobileNavItem = ({ to, children }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        navigate(to);
      }}
      className="text-xl font-medium text-jvcNavy hover:text-jvcOrange transition text-left"
    >
      {children}
    </button>
  );
};

export default Header;