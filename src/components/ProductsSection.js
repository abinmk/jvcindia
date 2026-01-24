import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AUTO_SCROLL = 4500;

const ProductsMobileCarousel = () => {
  const [products, setProducts] = useState([]);
  const [index, setIndex] = useState(0);
  const [activeProduct, setActiveProduct] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!products.length) return;
    timerRef.current = setInterval(next, AUTO_SCROLL);
    return () => clearInterval(timerRef.current);
  }, [products.length]);

  const next = () =>
    setIndex((i) => (i + 1) % products.length);

  const prev = () =>
    setIndex((i) => (i === 0 ? products.length - 1 : i - 1));

  if (!products.length) return null;

  const product = products[index];

  return (
    <section className="bg-white py-20">
      {/* Header */}
      <div className="px-6 text-center mb-12">
        <p className="text-[11px] tracking-[0.3em] text-gray-400 uppercase">
          JVC India
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-jvcNavy leading-tight">
          Our Products
        </h2>
      </div>

      {/* Carousel */}
      <div
        className="relative px-5"
        onTouchStart={() => clearInterval(timerRef.current)}
        onTouchEnd={() => (timerRef.current = setInterval(next, AUTO_SCROLL))}
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

        {/* Controls */}
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

      {/* View All */}
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

      {/* ================= POPUP ================= */}
      <AnimatePresence>
  {activeProduct && (
    <motion.div
      className="
        fixed inset-0 z-[9999]
        bg-white
        flex flex-col
      "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* ================= STICKY HEADER ================= */}
      <div
        className="
          sticky top-0 z-20
          bg-white
          border-b
        "
      >
        {/* Close */}
        <button
  onClick={() => setActiveProduct(null)}
  className="
    absolute top-4 right-4
    z-50
    w-11 h-11
    rounded-full

    bg-jvcOrange/100
    text-white
    text-xl

    flex items-center justify-center
    backdrop-blur

    hover:bg-jvcOrange/90
    transition
  "
>
  ✕
</button>

        {/* Image */}
        {/* <div className="h-[260px] bg-gray-100 flex items-center justify-center">
          <img
            src={activeProduct.image}
            alt={activeProduct.name}
            className="max-h-full max-w-full object-contain scale-[1.2]"
          />
        </div> */}

        <div className="h-[300px] overflow-hidden">
  <img
    src={activeProduct.image}
    alt={activeProduct.name}
    className="
      w-full h-full
      object-cover
      scale-[1]
      transform
    "
  />
</div>

        {/* Title */}
        <div className="px-6 py-4">
          <h2 className="text-2xl font-semibold text-jvcNavy">
            {activeProduct.name}
          </h2>
          <p className="text-sm text-gray-600">
            {activeProduct.subtitle}
          </p>
        </div>
      </div>

      {/* ================= SCROLLABLE CONTENT ================= */}
      <div className="flex-1 overflow-y-auto px-6 pb-10 space-y-6">

        {/* Description */}
        <p className="text-sm text-gray-700 leading-relaxed">
          {activeProduct.description}
        </p>

        {/* Applications */}
        {activeProduct.applications?.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-jvcNavy mb-2">
              Applications
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              {activeProduct.applications.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Grades */}
        {activeProduct.grades?.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-jvcNavy mb-2">
              Available Grades
            </p>
            <div className="flex flex-wrap gap-2">
              {activeProduct.grades.map((grade, i) => (
                <span
                  key={i}
                  className="
                    px-3 py-1 text-xs
                    border border-jvcOrange
                    text-jvcOrange rounded-full
                  "
                >
                  {grade}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Mesh Sizes */}
        {activeProduct.meshSizes?.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-jvcNavy mb-2">
              Mesh / Particle Size
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              {activeProduct.meshSizes.map((mesh, i) => (
                <li key={i}>• {mesh}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Packaging */}
        {activeProduct.packaging?.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-jvcNavy mb-2">
              Packaging & Supply
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              {activeProduct.packaging.map((pack, i) => (
                <li key={i}>• {pack}</li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        <div className="pt-6">
          <a
            href="#contact"
            onClick={() => setActiveProduct(null)}
            className="
              block w-full text-center
              py-4
              bg-jvcOrange text-white
              font-semibold
              rounded-lg
              hover:bg-orange-600
              transition
            "
          >
            Request Quotation
          </a>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
    </section>
  );
};

export default ProductsMobileCarousel;