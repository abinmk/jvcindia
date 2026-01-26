import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  FiLayers,
  FiGrid,
  FiPackage,
  FiCheckCircle,
  FiX,
  FiInfo
} from "react-icons/fi";

import ProductEnquiryModal from "./ProductEnquiryModal";
import SpecSheetModal from "./SpecSheetModal"; // ✅ NEW

const ProductModal = ({ product, isOpen, onClose }) => {
  const contentRef = useRef(null);
  const justOpenedRef = useRef(true);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [pendingSpecSheet, setPendingSpecSheet] = useState(null); // ✅ NEW
  const [isZoomOpen, setIsZoomOpen] = useState(false); // 🔍 image zoom


  /* ---------------- NORMALIZE IMAGES ---------------- */
  const images = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    if (product.image) {
      return [product.image];
    }
    return [];
  }, [product]);

  /* ---------------- GRADE LAYOUT LOGIC ---------------- */
  const hasLongGrades = useMemo(() => {
    return product?.grades?.some(g => g.length > 30);
  }, [product]);

  /* ---------------- IMAGE NAVIGATION ---------------- */
  const showPrevImage = () => {
    setActiveImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const showNextImage = () => {
    setActiveImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    setActiveImage(0);
  }, [product]);

  /* ---------------- CLOSE EVERYTHING ---------------- */
  const closeAllModals = () => {
    setShowEnquiry(false);
    setPendingSpecSheet(null);
    onClose();
  };

  /* ---------------- ESC HANDLER ---------------- */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closeAllModals();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      justOpenedRef.current = true;

      // allow interaction after first paint
      requestAnimationFrame(() => {
        justOpenedRef.current = false;
      });
    } else {
      setShowEnquiry(false);
      setPendingSpecSheet(null);
      setIsZoomOpen(false);
    }
  }, [isOpen]);


  if (!isOpen || !product) return null;

  return (
    <>
      {/* ================= PRODUCT MODAL ================= */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} product details`}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60"
          onClick={closeAllModals}
        />

        {/* Modal */}
        <div className="
          relative z-10
          w-full max-w-5xl h-[85vh]
          bg-white rounded-2xl shadow-2xl
          flex flex-col overflow-hidden
        ">
          {/* HEADER */}
          <div className="sticky top-0 z-20 bg-white border-b px-6 py-4 flex justify-between items-center">
            <div>
            {/* ✅ SEO PRIMARY HEADING */}
            <h1 className="text-xl md:text-2xl font-bold text-jvcNavy leading-tight">
              {product.name}
            </h1>

            {/* ✅ SUPPORTING HEADING */}
            {product.subtitle && (
              <h2 className="text-sm md:text-base text-gray-500 font-medium mt-1">
                {product.subtitle}
              </h2>
            )}
          </div>

            <button
              onClick={closeAllModals}
              className="w-10 h-10 rounded-full bg-jvcOrange text-white flex items-center justify-center"
            >
              <FiX />
            </button>
          </div>

          {/* CONTENT */}
          <div
            ref={contentRef}
            className="
              flex-1 overflow-y-auto
              px-6 py-5
              grid grid-cols-1 lg:grid-cols-2 gap-6
              pb-32
            "
          >
            {/* ================= IMAGE GALLERY ================= */}
            <div className="lg:sticky lg:top-24 self-start">
              <div className="flex flex-col space-y-4">
                {/* Main Image */}
                <div className="relative bg-gray-50 rounded-xl p-4 h-[420px] flex items-center justify-center">
                  {/* LEFT ARROW */}
                  {images.length > 1 && (
                    <button
                      onClick={showPrevImage}
                      className="
                        absolute left-2 top-1/2 -translate-y-1/2
                        w-9 h-9 rounded-full
                        bg-white/80 hover:bg-white
                        shadow flex items-center justify-center
                        text-lg
                      "
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                  )}

                  {/* MAIN IMAGE */}
                  {images.length > 0 && (
                    <img
                      src={images[activeImage]}
                      alt={product.name}
                      onClick={() => {
                        if (justOpenedRef.current) return;
                        setIsZoomOpen(true);
                      }}
                      className="
                        max-h-[420px] max-w-full object-contain
                        cursor-zoom-in
                      "
                    />
                  )}

                  {/* RIGHT ARROW */}
                  {images.length > 1 && (
                    <button
                      onClick={showNextImage}
                      className="
                        absolute right-2 top-1/2 -translate-y-1/2
                        w-9 h-9 rounded-full
                        bg-white/80 hover:bg-white
                        shadow flex items-center justify-center
                        text-lg
                      "
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  )}
                </div>


                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`h-16 w-20 rounded-lg border ${
                          i === activeImage
                            ? "border-jvcOrange"
                            : "border-gray-200"
                        }`}
                      >
                        <img
                          src={img}
                          className="w-full h-full object-contain bg-white"
                          alt={`${product.name} thumbnail ${i + 1}`}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>


            {/* ================= DETAILS ================= */}
            <div className="space-y-6">
              <section className="border rounded-xl p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <FiInfo className="text-jvcOrange" />
                  <h3 className="text-sm font-semibold text-jvcNavy">
                    Product Summary
                  </h3>
                </div>
                <p className="text-sm text-gray-700">
                  {product.description}
                </p>
              </section>

              {product.applications?.length > 0 && (
                <section className="border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiCheckCircle className="text-jvcOrange" />
                    <h3 className="text-sm font-semibold text-jvcNavy">
                      Applications
                    </h3>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-1 gap-2 text-sm text-gray-700">
                    {product.applications.map((a, i) => {
                      const [title, ...rest] = a.split(":");
                      const description = rest.join(":");

                      return (
                        <li key={i} className="text-sm text-gray-700">
                          <span className="font-semibold text-jvcNavy">
                            {title}
                          </span>
                          {description && (
                            <span>: {description.trim()}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {product.grades?.length > 0 && (
                <section className="border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiLayers className="text-jvcOrange" />
                    <h3 className="text-sm font-semibold text-jvcNavy">
                      Grades
                    </h3>
                  </div>

                  <div
                    className={`grid gap-2 ${
                      hasLongGrades ? "grid-cols-1" : "grid-cols-2"
                    }`}
                  >
                    {product.grades.map((g, i) => (
                      <span
                      key={i}
                      className="
                        px-3 py-1 text-xs rounded-full
                        border border-jvcOrange
                        w-fit
                      "
                    >
                      {(() => {
                        const [title, ...rest] = g.split(":");
                        const description = rest.join(":");

                        return (
                          <>
                            <span className="font-semibold text-jvcOrange">
                              {title.trim()}
                            </span>
                            {description && (
                              <span className="text-black">
                                {" – "}{description.trim()}
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </span>

                    ))}
                  </div>
                </section>
              )}


              {product.meshSizes?.length > 0 && (
                <section className="border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FiGrid className="text-jvcOrange" />
                    <h3 className="text-sm font-semibold text-jvcNavy">
                      Mesh Size
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product.meshSizes.map((m, i) => {
                      const isCustom = m.toLowerCase().includes("custom");

                      return (
                        <span
                          key={i}
                          className={`
                            px-3 py-1.5 text-xs rounded-full text-center
                            ${isCustom
                              ? "sm:col-span-3 bg-gray-100 text-gray-600 border border-dashed border-gray-300"
                              : "bg-white text-gray-800 border border-jvcOrange"}
                          `}
                        >
                          {m}
                        </span>
                      );
                    })}
                  </div>
                </section>
              )}


              {product.packaging?.length > 0 && (
                <section className="border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiPackage className="text-jvcOrange" />
                    <h3 className="text-sm font-semibold text-jvcNavy">
                      Packaging
                    </h3>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {product.packaging.map((p, i) => (
                      <li key={i}>• {p}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="sticky bottom-0 z-20 bg-white border-t px-6 py-4 flex justify-between items-center">
            <p className="text-sm text-gray-600 hidden sm:block">
              Ready to order? Get bulk pricing.
            </p>

            <div className="flex gap-3 w-full sm:w-auto">
              {product.specSheet && (
                <button
                  onClick={() => setPendingSpecSheet(product.specSheet)}
                  className="px-4 py-2 border rounded-lg text-sm"
                >
                  Spec Sheet
                </button>
              )}

              <button
                onClick={() => setShowEnquiry(true)}
                className="flex-1 sm:flex-none px-5 py-2 bg-jvcOrange text-white rounded-lg"
              >
                Get Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ENQUIRY MODAL ================= */}
      <ProductEnquiryModal
        isOpen={showEnquiry}
        onClose={() => setShowEnquiry(false)}
        productName={product.name}
      />

      {/* ================= SPEC SHEET MODAL ================= */}
      <SpecSheetModal
        isOpen={!!pendingSpecSheet}
        onClose={() => setPendingSpecSheet(null)}
        productName={product.name}
        specSheetUrl={pendingSpecSheet}
      />
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-[10000] bg-black/80 flex items-center justify-center"
          onClick={() => setIsZoomOpen(false)}
        >
          {/* LEFT ARROW */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                showPrevImage();
              }}
              className="
                absolute left-6 top-1/2 -translate-y-1/2
                w-12 h-12 rounded-full
                bg-white/80 hover:bg-white
                shadow flex items-center justify-center
                text-2xl
              "
              aria-label="Previous image"
            >
              ‹
            </button>
          )}

          {/* ZOOMED IMAGE */}
          <img
            src={images[activeImage]}
            alt={product.name}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[90vw] object-contain cursor-zoom-out"
          />

          {/* RIGHT ARROW */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                showNextImage();
              }}
              className="
                absolute right-6 top-1/2 -translate-y-1/2
                w-12 h-12 rounded-full
                bg-white/80 hover:bg-white
                shadow flex items-center justify-center
                text-2xl
              "
              aria-label="Next image"
            >
              ›
            </button>
          )}
        </div>
      )}

    </>
  );
};

export default ProductModal;
