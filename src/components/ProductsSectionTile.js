import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import ProductModal from "./ProductModal";

const VISIBLE = 3;
const AUTO_SCROLL = 4500;

const ProductsGrid = () => {
  const [products, setProducts] = useState([]);
  const [index, setIndex] = useState(0);
  const [activeProduct, setActiveProduct] = useState(null);
  const timerRef = useRef(null);

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    if (!products.length) return;

    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % products.length);
    }, AUTO_SCROLL);

    return () => clearInterval(timerRef.current);
  }, [products.length]);

  const next = () => setIndex((i) => (i + 1) % products.length);
  const prev = () =>
    setIndex((i) => (i === 0 ? products.length - 1 : i - 1));

  const openModal = (product) => {
    setActiveProduct(product);
  };

  const closeModal = () => {
    setActiveProduct(null);
  };

  if (!products.length) return null;

  const visible = [];
  for (let i = 0; i < VISIBLE; i++) {
    visible.push(products[(index + i) % products.length]);
  }

  return (
    <section className="bg-white pt-24 pb-28 overflow-hidden">
      {/* ================= HEADER ================= */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <p className="text-xs tracking-widest text-gray-400 uppercase">
          JVC India
        </p>
        <h2 className="text-4xl font-semibold text-jvcNavy mt-2">
          Our Products
        </h2>
      </div>

      {/* ================= CAROUSEL ================= */}
      <div
        className="relative max-w-7xl mx-auto px-6"
        onMouseEnter={() => clearInterval(timerRef.current)}
        onMouseLeave={() =>
          (timerRef.current = setInterval(next, AUTO_SCROLL))
        }
      >
        {/* NAV */}
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

        {/* PRODUCT CARDS */}
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
                    bg-gray-50
                    rounded-2xl
                    shadow-sm
                    overflow-hidden
                    hover:shadow-lg transition-shadow
                  "
                  animate={{
                    scale: isCenter ? 1.05 : 0.9,
                    opacity: isCenter ? 1 : 0.85,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {/* IMAGE — BORDERLESS (UNCHANGED) */}
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

                  {/* CONTENT */}
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

      {/* ================= VIEW ALL ================= */}
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

      {/* ================= PRODUCT MODAL ================= */}
      <ProductModal
        product={activeProduct}
        isOpen={!!activeProduct}
        onClose={closeModal}
      />
    </section>
  );
};

export default ProductsGrid;
