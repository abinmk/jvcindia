import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  FiSearch,
  FiX
} from "react-icons/fi";
import ProductModal from "../components/ProductModal";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef(null);

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.subtitle.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.applications?.some((a) =>
            a.toLowerCase().includes(query)
          ) ||
          product.grades?.some((g) =>
            g.toLowerCase().includes(query)
          )
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  useEffect(() => {
    const onScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openModal = (product) => {
    setActiveProduct(product);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
    setTimeout(() => setActiveProduct(null), 300);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <section className="bg-gray-50 pt-32 relative">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <p className="text-sm uppercase tracking-wide text-gray-500">
          JVC India
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold text-jvcNavy mt-2">
          Our Products
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-gray-600 text-lg">
          Export-grade industrial minerals supplied with reliability,
          quality assurance, and global logistics.
        </p>
      </div>

      {/* STICKY SEARCH */}
      <div
        ref={stickyRef}
        className={`w-full z-40 transition-all ${
          isSticky ? "fixed top-20 shadow-lg" : "relative"
        } bg-white`}
      >
        <div className="border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-12 pr-10 py-3 border rounded-lg bg-gray-50"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isSticky && <div className="h-[120px]" />}

      {/* PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => openModal(product)}
            className="cursor-pointer bg-white rounded-xl border shadow hover:shadow-lg transition overflow-hidden"
          >
            <div className="h-56 bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-jvcNavy">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* SHARED MODAL */}
      <ProductModal
        product={activeProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
};

export default ProductsPage;
