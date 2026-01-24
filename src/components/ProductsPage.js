import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  FiLayers,
  FiGrid,
  FiPackage,
  FiCheckCircle,
  FiX,
  FiSearch,
  FiInfo
} from "react-icons/fi";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSticky, setIsSticky] = useState(false);
  const contentRef = useRef(null);
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

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = ["all", ...new Set(products.map(p => p.category).filter(Boolean))];
    return cats;
  }, [products]);

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products;
    
    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => 
        product.category === selectedCategory
      );
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.subtitle.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.applications && product.applications.some(app => 
          app.toLowerCase().includes(query)
        )) ||
        (product.grades && product.grades.some(grade => 
          grade.toLowerCase().includes(query)
        ))
      );
    }
    
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  // Sticky search bar effect - starts after header
  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef.current) {
        // Header is fixed at top, so start sticking after 100px scroll
        const shouldBeSticky = window.scrollY > 100;
        
        if (shouldBeSticky !== isSticky) {
          setIsSticky(shouldBeSticky);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isSticky]);

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

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <section className="bg-gray-50 pt-32 relative">
      {/* ================= HEADER ================= */}
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

      {/* ================= STICKY SEARCH BAR (starts below header) ================= */}
      <div 
        ref={stickyRef}
        className={`
          w-full z-40 transition-all duration-300
          ${isSticky ? 'fixed top-20 md:top-24 shadow-lg' : 'relative'}
          bg-white
        `}
        style={{
          // When sticky, position it below the fixed header
          ...(isSticky && {
            top: '80px', // Mobile header height
            '@media (min-width: 768px)': {
              top: '96px' // Desktop header height
            }
          })
        }}
      >
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            {/* Main search container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search products by name, application, grade, or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="
                        w-full pl-12 pr-10 py-3
                        bg-gray-50 border border-gray-300
                        rounded-lg focus:ring-2 focus:ring-jvcOrange/50
                        focus:border-jvcOrange outline-none
                        transition-all duration-200
                        placeholder:text-gray-400 text-base
                      "
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2
                                 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Clear Filters Button - Only show when filters are active */}
                {(searchQuery || selectedCategory !== "all") && (
                  <button
                    onClick={handleClearSearch}
                    className="
                      px-4 py-3
                      bg-gray-100 border border-gray-300
                      text-gray-700 font-medium
                      rounded-lg hover:bg-gray-200
                      transition-colors duration-200
                      whitespace-nowrap
                      flex items-center gap-2
                    "
                  >
                    <FiX className="w-4 h-4" />
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Results Count and Status */}
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-jvcNavy">{filteredProducts.length}</span> of{" "}
                  <span className="font-semibold text-jvcNavy">{products.length}</span> products
                  {searchQuery && (
                    <span className="ml-2 text-jvcOrange">
                      • Searching for: "{searchQuery}"
                    </span>
                  )}
                </div>
                
                {/* Quick actions when no results */}
                {filteredProducts.length === 0 && products.length > 0 && (
                  <button
                    onClick={handleClearSearch}
                    className="
                      text-sm text-jvcOrange hover:text-orange-600 font-medium
                      flex items-center gap-1 self-end sm:self-auto
                    "
                  >
                    <span>Show all products</span>
                    <span>→</span>
                  </button>
                )}
              </div>
            </div>

            {/* Sticky indicator (only when sticky) */}
            {isSticky && (
              <div className="mt-2 flex items-center justify-center">
                <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  🔍 Search active • Scroll to see results
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer to prevent content jump when sticky */}
      {isSticky && <div className="h-[140px]"></div>}

      {/* ================= NO RESULTS ================= */}
      {filteredProducts.length === 0 && products.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mb-10 mt-8">
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <FiSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              No products match your search criteria. Try different keywords or clear filters.
            </p>
            <button
              onClick={handleClearSearch}
              className="
                px-6 py-3
                bg-jvcOrange text-white font-medium
                rounded-lg hover:bg-orange-600
                transition-colors duration-200
                inline-flex items-center gap-2
              "
            >
              <FiSearch className="w-4 h-4" />
              View All Products
            </button>
          </div>
        </div>
      )}

      {/* ================= PRODUCT GRID ================= */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => openModal(product)}
            className="cursor-pointer bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group transform hover:-translate-y-0.5"
          >
            <div className="h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-semibold text-jvcNavy capitalize">
                {product.category || "Industrial"}
              </div>
              {/* Search highlight indicator */}
              {searchQuery && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-jvcOrange/90 text-white text-xs font-medium rounded-md backdrop-blur-sm animate-pulse">
                  🔍 Match
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  {/* Highlight search matches in title */}
                  <h3 className="text-lg font-bold text-jvcNavy">
                    {searchQuery ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: product.name.replace(
                            new RegExp(`(${searchQuery})`, 'gi'),
                            '<mark class="bg-yellow-200 text-jvcNavy px-1 rounded">$1</mark>'
                          )
                        }}
                      />
                    ) : (
                      product.name
                    )}
                  </h3>
                  <p className="mt-1 text-gray-600 text-sm line-clamp-2">
                    {searchQuery ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: product.subtitle.replace(
                            new RegExp(`(${searchQuery})`, 'gi'),
                            '<mark class="bg-yellow-200 text-gray-800 px-1 rounded">$1</mark>'
                          )
                        }}
                      />
                    ) : (
                      product.subtitle
                    )}
                  </p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-jvcOrange/10 flex items-center justify-center group-hover:bg-jvcOrange/20 transition-colors">
                    <span className="text-jvcOrange font-bold text-sm group-hover:scale-110 transition-transform">→</span>
                  </div>
                </div>
              </div>
              
              {/* Quick info badges */}
              <div className="mt-3 flex flex-wrap gap-2">
                {product.grades && product.grades.map((grade, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md border border-gray-200">
                    {grade}
                  </span>
                ))}
                {product.applications && product.applications.length > 0 && (
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-100">
                    {product.applications.length} application
                  </span>
                )}
              </div>
              
              <div className="mt-3 text-xs text-jvcNavy font-medium flex items-center">
                <span>View Specifications</span>
                <span className="ml-1 transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= COMPACT MODAL ================= */}
      <div className={`
        fixed inset-0 z-[9999] flex items-center justify-center p-4
        transition-all duration-300 ease-out
        ${isModalOpen 
          ? 'opacity-100 visible' 
          : 'opacity-0 invisible delay-300'
        }
      `}>
        {/* Backdrop */}
        <div 
          className={`
            absolute inset-0 bg-black/60 transition-opacity duration-300
            ${isModalOpen ? 'opacity-100' : 'opacity-0'}
          `}
          onClick={closeModal}
        />
        
        {/* Modal Container - Properly Centered */}
        <div className={`
          w-full max-w-5xl
          h-[85vh]
          rounded-2xl
          transform transition-all duration-400 ease-out
          ${isModalOpen 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
          }
          overflow-hidden
          flex flex-col
          bg-white
          shadow-2xl
          relative z-10
        `}>
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

          {/* MAIN CONTENT - More Compact */}
          <div 
            ref={contentRef}
            className="
              flex-1 overflow-y-auto
              px-5 lg:px-6 py-4
              scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
            "
          >
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
                <img
                  src={activeProduct?.image}
                  alt={activeProduct?.name}
                  className="
                    max-w-full max-h-full
                    object-contain
                    drop-shadow-lg
                  "
                />
              </div>

              {/* DETAILS SECTION - More Dense */}
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

                {/* Applications - Compact */}
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

                {/* Grades & Sizes - Combined */}
                {(activeProduct?.grades?.length > 0 || activeProduct?.meshSizes?.length > 0) && (
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
                          {activeProduct.grades.length > 3 && (
                            <span className="
                              px-2.5 py-1
                              bg-gray-100
                              border border-gray-200
                              text-gray-600 text-xs font-medium
                              rounded-lg
                            ">
                              +{activeProduct.grades.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

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
                  </div>
                )}

                {/* Packaging & Quality */}
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
                    {activeProduct?.qualityStandards && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          Quality Standards:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {activeProduct.qualityStandards.map((std, i) => (
                            <span key={i} className="
                              px-2 py-0.5
                              bg-green-50
                              border border-green-100
                              text-green-700 text-xs
                              rounded
                            ">
                              {std}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Certifications if available */}
                {activeProduct?.certifications && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4">
                    <p className="text-xs font-semibold text-blue-800 mb-2">
                      🏆 Certifications & Compliance
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeProduct.certifications.map((cert, i) => (
                        <span key={i} className="
                          px-2.5 py-1
                          bg-white/80
                          border border-blue-200
                          text-blue-700 text-xs font-medium
                          rounded-lg
                          shadow-sm
                        ">
                          {cert}
                        </span>
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
                    // Download spec sheet
                    window.open(activeProduct?.specSheet, '_blank');
                  }}
                  className="
                    px-4 py-2
                    bg-white border border-gray-300
                    text-gray-700 text-sm font-medium
                    rounded-lg
                    hover:bg-gray-50
                    transition-colors
                    flex items-center gap-1.5
                  "
                >
                  <FiInfo className="w-3.5 h-3.5" />
                  Spec Sheet
                </button>
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
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;