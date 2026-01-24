import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import ProductModal from "./ProductModal";

const AUTO_SCROLL = 4500;

const ProductsMobileCarousel = () => {
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
    timerRef.current = setInterval(next, AUTO_SCROLL);
    return () => clearInterval(timerRef.current);
  }, [products.length]);

  const next = () => setIndex((i) => (i + 1) % products.length);
  const prev = () =>
    setIndex((i) => (i === 0 ? products.length - 1 : i - 1));

  if (!products.length) return null;

  const product = products[index];

  return (
    <section className="bg-white py-20">
      {/* ================= HEADER ================= */}
      <div className="px-6 text-center mb-12">
        <p className="text-[11px] tracking-[0.3em] text-gray-400 uppercase">
          JVC India
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-jvcNavy leading-tight">
          Our Products
        </h2>
      </div>

      {/* ================= CAROUSEL ================= */}
      <div
        className="relative px-5"
        onTouchStart={() => clearInterval(timerRef.current)}
        onTouchEnd={() =>
          (timerRef.current = setInterval(next, AUTO_SCROLL))
        }
      >
        <motion.div
          key={product.id}
          onClick={() => setActiveProduct(product)}
          className="
            bg-white
            rounded-3xl
            shadow-[0_10px_30px_rgba(0,0,0,0.08)]
            overflow-hidden
            cursor-pointer
          "
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {/* IMAGE */}
          <div className="h-[320px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
              initial={{ scale: 1.25 }}
              whileTap={{ scale: 1.45 }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* CONTENT */}
          <div className="px-6 pt-6 pb-7 text-left">
            <h3 className="text-lg font-semibold text-jvcNavy">
              {product.name}
            </h3>

            <p className="mt-1 text-sm text-gray-600 leading-relaxed">
              {product.subtitle}
            </p>

            {product.variants?.length > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-jvcOrange">
                <span className="w-1.5 h-1.5 rounded-full bg-jvcOrange"></span>
                {product.variants.length} grades available
              </div>
            )}

            <div className="mt-5 text-sm font-medium text-jvcOrange">
              View details →
            </div>
          </div>
        </motion.div>

        {/* CONTROLS */}
        <div className="flex justify-between items-center mt-6 px-2">
          <button
            onClick={prev}
            className="
              w-11 h-11 rounded-full
              bg-white shadow border
              text-xl
              hover:bg-jvcOrange hover:text-white
              transition
            "
          >
            ‹
          </button>

          <div className="text-xs text-gray-400 tracking-wide">
            {index + 1} / {products.length}
          </div>

          <button
            onClick={next}
            className="
              w-11 h-11 rounded-full
              bg-white shadow border
              text-xl
              hover:bg-jvcOrange hover:text-white
              transition
            "
          >
            ›
          </button>
        </div>
      </div>

      {/* ================= VIEW ALL ================= */}
      <div className="mt-16 flex justify-center">
        <a
          href="/products"
          className="
            px-10 py-3.5
            bg-jvcOrange
            text-white
            font-semibold
            rounded-full
            shadow-md
            hover:bg-orange-600
            transition
          "
        >
          View All Products
        </a>
      </div>

      {/* ================= PRODUCT MODAL (REUSED) ================= */}
      <ProductModal
        product={activeProduct}
        isOpen={!!activeProduct}
        onClose={() => setActiveProduct(null)}
      />
    </section>
  );
};

export default ProductsMobileCarousel;
