// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import ScrollToHash from "./components/scrollToHash";

import HeroSection from "./components/HeroSection2";
import HeroSectionMobile from "./components/HeroMobile";
import ProductsSection from "./components/ProductsSection";
import ProductsSectionTile from "./components/ProductsSectionTile";
import AboutSection from "./components/AboutSection";
import ContactForm from "./components/ContactForm";

import ProductsPage from "./components/ProductsPage";


import "./App.css";

/* ================= HOME PAGE ================= */
const HomePage = () => (
  <>
    {/* Mobile */}
    <div className="block lg:hidden">
      <HeroSectionMobile />
      <ProductsSection />
    </div>

    {/* Desktop */}
    <div className="hidden lg:block">
      <HeroSection />
      <ProductsSectionTile />
    </div>

    <AboutSection />
    <ContactForm />
  </>
);

function App() {
  return (
    <div className="App">
      <ScrollToHash /> {/* keeps hash scrolling */}
      <Header />

      <Routes>
        {/* HOME */}
        <Route path="/" element={<HomePage />} />

        {/* PRODUCTS LIST PAGE */}
        <Route path="/products" element={<ProductsPage />} />

        {/* ✅ SEO PRODUCT PAGE (MODAL OPENS HERE) */}
        <Route path="/products/:slug" element={<ProductsPage />} />
      </Routes>
    </div>
  );
}

export default App;
