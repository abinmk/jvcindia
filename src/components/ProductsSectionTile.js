import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLayers,
  FiGrid,
  FiPackage,
  FiCheckCircle,
  FiX,
  FiInfo
} from "react-icons/fi";

const VISIBLE = 3;
const AUTO_SCROLL = 4500;

const ProductsGrid = () => {
  const [products, setProducts] = useState([]);
  const [index, setIndex] = useState(0);
  const [activeProduct, setActiveProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!products.length) return;
    timerRef.current = setInterval(
      () => setIndex((i) => (i + 1) % products.length),
      AUTO_SCROLL
    );
    return () => clearInterval(timerRef.current);
  }, [products.length]);

  const openModal = (product) => {
    setActiveProduct(product);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
    setTimeout(() => setActiveProduct(null), 300);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  const next = () => setIndex((i) => (i + 1) % products.length);
  const prev = () =>
    setIndex((i) => (i === 0 ? products.length - 1 : i - 1));

  const visible = [];
  for (let i = 0; i < VISIBLE; i++) {
    visible.push(products[(index + i) % products.length]);
  }

  if (!products.length) return null;

  return (
    <section className="bg-white pt-24 pb-28 overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <p className="text-xs tracking-widest text-gray-400 uppercase">
          JVC India
        </p>
        <h2 className="text-4xl font-semibold text-jvcNavy mt-2">
          Our Products
        </h2>
      </div>

      {/* Carousel */}
      <div
        className="relative max-w-7xl mx-auto px-6"
        onMouseEnter={() => clearInterval(timerRef.current)}
        onMouseLeave={() =>
          (timerRef.current = setInterval(next, AUTO_SCROLL))
        }
      >
        {/* Nav */}
        <button
          onClick={prev}
          className="absolute -left-6 top-1/2 -translate-y-1/2 z-20
                     w-12 h-12 rounded-full bg-white border shadow
                     hover:bg-jvcOrange hover:text-white transition"
        >
          ‹
        </button>

        <button
          onClick={next}
          className="absolute -right-6 top-1/2 -translate-y-1/2 z-20
                     w-12 h-12 rounded-full bg-white border shadow
                     hover:bg-jvcOrange hover:text-white transition"
        >
          ›
        </button>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {visible.map((product, i) => {
            const isCenter = i === 1;

            return (
              <motion.div
                key={product.id}
                onClick={() => openModal(product)}
                className="cursor-pointer"
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <motion.div
                  className="
                    bg-gray-50 border border-gray-200
                    rounded-2xl shadow-sm
                    overflow-hidden
                    hover:shadow-lg transition-shadow
                  "
                  animate={{
                    scale: isCenter ? 1.05 : 0.9,
                    opacity: isCenter ? 1 : 0.85,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {/* Image */}
                  <div className="h-72 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                    <motion.img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      initial={{ scale: 1.35 }}
                      whileHover={{ scale: 1.55 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>

                  {/* Content */}
                  <div className="px-6 py-6">
                    <h3 className="text-lg font-semibold text-jvcNavy">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {product.subtitle}
                    </p>

                    {product.variants?.length > 0 && (
                      <p className="mt-3 text-xs font-medium text-jvcOrange">
                        {product.variants.length} grades available
                      </p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* View All */}
      <div className="mt-16 flex justify-center">
        <a
          href="/products"
          className="
            inline-flex items-center gap-3
            px-10 py-3.5
            bg-orange-600
            text-white
            font-semibold tracking-wide
            rounded-full
            shadow-md
            hover:bg-orange-500
            hover:shadow-lg
            transition-all duration-300
          "
        >
          View All Products →
        </a>
      </div>

      {/* ================= COMPACT MODAL ================= */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            
            {/* Modal Container */}
            <motion.div
              className="
                w-full max-w-4xl
                h-[85vh]
                rounded-2xl
                overflow-hidden
                flex flex-col
                bg-white
                shadow-2xl
                relative z-10
              "
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* COMPACT HEADER */}
              <div className="
                sticky top-0 z-50
                bg-white border-b border-gray-200
                px-5 lg:px-6 py-3 lg:py-4
                flex items-center justify-between
              ">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-5 bg-jvcOrange rounded-full"></div>
                    <h2 className="
                      text-lg lg:text-xl font-bold text-jvcNavy
                      truncate
                    ">
                      {activeProduct?.name}
                    </h2>
                  </div>
                  <p className="
                    text-xs text-gray-500
                    truncate mt-0.5
                  ">
                    {activeProduct?.subtitle}
                  </p>
                </div>

                {/* COMPACT CLOSE BUTTON */}
                <button
                  onClick={closeModal}
                  className="
                    w-10 h-10 rounded-full
                    bg-jvcOrange text-white
                    flex items-center justify-center
                    hover:bg-orange-600
                    active:scale-95
                    transition-all duration-200
                    shadow-md
                    flex-shrink-0
                  "
                  aria-label="Close modal"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              {/* MAIN CONTENT */}
              <div className="
                flex-1 overflow-y-auto
                px-5 lg:px-6 py-4
                scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
              ">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  
                  {/* IMAGE SECTION */}
                  <div className="
                    lg:sticky lg:top-4
                    h-[35vh] lg:h-[calc(85vh-150px)]
                    flex items-center justify-center
                    bg-gradient-to-br from-gray-50 to-white
                    rounded-xl lg:rounded-xl
                    p-3 lg:p-6
                    border border-gray-200
                  ">
                    <motion.img
                      src={activeProduct?.image}
                      alt={activeProduct?.name}
                      className="
                        max-w-full max-h-full
                        object-contain
                        drop-shadow-lg
                      "
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>

                  {/* DETAILS SECTION */}
                  <div className="space-y-5 lg:pr-2">
                    {/* Quick Info Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      {activeProduct?.purity && (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                          <p className="text-xs text-blue-700 font-medium">Purity</p>
                          <p className="text-sm font-bold text-blue-900">{activeProduct.purity}</p>
                        </div>
                      )}
                      {activeProduct?.moisture && (
                        <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                          <p className="text-xs text-green-700 font-medium">Moisture</p>
                          <p className="text-sm font-bold text-green-900">{activeProduct.moisture}</p>
                        </div>
                      )}
                      {activeProduct?.origin && (
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                          <p className="text-xs text-amber-700 font-medium">Origin</p>
                          <p className="text-sm font-bold text-amber-900">{activeProduct.origin}</p>
                        </div>
                      )}
                      {activeProduct?.leadTime && (
                        <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
                          <p className="text-xs text-purple-700 font-medium">Lead Time</p>
                          <p className="text-sm font-bold text-purple-900">{activeProduct.leadTime}</p>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FiInfo className="w-4 h-4 text-jvcOrange" />
                        <h3 className="text-sm font-semibold text-jvcNavy">
                          Product Summary
                        </h3>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {activeProduct?.description}
                      </p>
                    </div>

                    {/* Applications */}
                    {activeProduct?.applications?.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <FiCheckCircle className="w-4 h-4 text-jvcOrange" />
                          <h3 className="text-sm font-semibold text-jvcNavy">
                            Key Applications
                          </h3>
                        </div>
                        <ul className="space-y-1.5">
                          {activeProduct.applications.map((item, i) => (
                            <li key={i} className="flex items-start text-xs">
                              <span className="text-jvcOrange mr-2">•</span>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Grades & Variants */}
                    {(activeProduct?.grades?.length > 0 || activeProduct?.variants?.length > 0) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeProduct?.grades?.length > 0 && (
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <FiLayers className="w-4 h-4 text-jvcOrange" />
                              <h3 className="text-sm font-semibold text-jvcNavy">
                                Grades
                              </h3>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {activeProduct.grades.map((g, i) => (
                                <span
                                  key={i}
                                  className="
                                    px-2.5 py-1
                                    bg-jvcOrange/5
                                    border border-jvcOrange/20
                                    text-jvcOrange text-xs font-medium
                                    rounded-lg
                                  "
                                >
                                  {g}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                       {/* Mesh Sizes */}
                        {activeProduct.meshSizes?.length > 0 && (
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <FiGrid className="w-4 h-4 text-jvcOrange" />
                              <h3 className="text-sm font-semibold text-jvcNavy">
                                Mesh / Particle Size
                              </h3>
                            </div>

                            <ul className="text-sm text-gray-700 space-y-1">
                              {activeProduct.meshSizes.map((mesh, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-jvcOrange mr-2">•</span>
                                  <span>{mesh}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {activeProduct?.variants?.length > 0 && (
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <FiGrid className="w-4 h-4 text-jvcOrange" />
                              <h3 className="text-sm font-semibold text-jvcNavy">
                                Variants
                              </h3>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {activeProduct.variants.map((v, i) => (
                                <span
                                  key={i}
                                  className="
                                    px-2.5 py-1
                                    bg-jvcOrange/5
                                    border border-jvcOrange/20
                                    text-jvcOrange text-xs font-medium
                                    rounded-lg
                                  "
                                >
                                  {v}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Packaging */}
                    {activeProduct?.packaging?.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <FiPackage className="w-4 h-4 text-jvcOrange" />
                          <h3 className="text-sm font-semibold text-jvcNavy">
                            Packaging Details
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {activeProduct.packaging.map((p, i) => (
                            <div key={i} className="flex items-center text-xs">
                              <div className="w-1.5 h-1.5 rounded-full bg-jvcOrange mr-2"></div>
                              <span className="text-gray-700">{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* COMPACT BOTTOM CTA */}
              <div className="
                sticky bottom-0
                bg-white border-t border-gray-200
                px-5 lg:px-6 py-3
                shadow-sm
              ">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-xs text-gray-600">
                    <span className="font-medium text-jvcNavy">Ready to order?</span>
                    <span className="ml-1">Get competitive pricing with bulk discounts.</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        closeModal();
                        const contactSection = document.getElementById('contact');
                        if (contactSection) {
                          contactSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="
                        px-5 py-2.5
                        bg-gradient-to-r from-jvcOrange to-orange-500
                        text-white text-sm font-semibold
                        rounded-lg
                        hover:from-orange-600 hover:to-orange-500
                        active:scale-[0.98]
                        transition-all duration-200
                        shadow-md hover:shadow
                        flex-1 sm:flex-none
                      "
                    >
                      Get Quote
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProductsGrid;