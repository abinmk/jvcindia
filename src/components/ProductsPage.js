import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import ProductModal from "./ProductModal";
import ProductEnquiryModal from "./ProductEnquiryModal";

/* ================= CONSTANTS ================= */

const DEFAULT_TITLE = "JVC India | Industrial Minerals Exporter";
const DEFAULT_DESCRIPTION =
  "Industrial minerals exporter from India supplying baryte, bentonite, dolomite, silica, quartz and processed mineral products globally.";

const DEFAULT_OG_IMAGE =
  "https://www.jvcindia.com/images/og-default.jpg";


/*================== Slug Helper =============== */
const toSlug = (str) =>
  str
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/* ================= COMPONENT ================= */

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [activeProduct, setActiveProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryProductName, setEnquiryProductName] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [isSticky, setIsSticky] = useState(false);

  const stickyRef = useRef(null);
  const navigate = useNavigate();
  const { slug: routeSlug } = useParams();
  const categoryFromSlug = products.find(
    (p) => toSlug(p.type) === routeSlug
  )?.type;
  const isCategoryPage = Boolean(routeSlug && categoryFromSlug);
  const location = useLocation();

  /* ================= QUERY PARAM ================= */

  const queryParams = new URLSearchParams(location.search);
  const selectedType = queryParams.get("type");

  const isFiltered =
  Boolean(searchQuery.trim()) ||
  Boolean(selectedType) ||
  Boolean(categoryFromSlug);


  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(console.error);
  }, []);

  /* ================= FILTER LOGIC ================= */

  useEffect(() => {
    let base = [...products];

    const activeType = categoryFromSlug || selectedType;

    if (activeType) {
      base = base.filter((p) => p.type === activeType);
    }


    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      base = base.filter((p) =>
        p.name.toLowerCase().includes(q)
      );
    }

    setFilteredProducts(base);
  }, [products, searchQuery, selectedType, categoryFromSlug]);

  /* ================= STICKY SEARCH ================= */

  useEffect(() => {
    const onScroll = () => setIsSticky(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= MODAL FROM URL ================= */

  useEffect(() => {
    if (!products.length) return;

    /* ===== CATEGORY PAGE HANDLING (STEP 3.5) ===== */
    if (routeSlug && categoryFromSlug) {
      const title = `${categoryFromSlug} Exporter from India | JVC India`;
      const desc = `JVC India is a trusted exporter of ${categoryFromSlug.toLowerCase()} supplying global industries with consistent quality and bulk packaging.`;

      setIsModalOpen(false);
      setActiveProduct(null);
      document.body.style.overflow = "auto";

      document.title = title;
      updateMetaDescription(desc);
      updateCanonical(`${window.location.origin}/products/${routeSlug}`);

      updateOGTag("og:type", "website");
      updateOGTag("og:title", title);
      updateOGTag("og:description", desc);
      updateOGTag("og:url", `${window.location.origin}/products/${routeSlug}`);
      updateOGTag("og:image", DEFAULT_OG_IMAGE);

      removeProductSchema();
      removeProductListSchema();
      const categoryProducts = products.filter(
        (p) => p.type === categoryFromSlug
      );

      injectProductListSchema(categoryProducts);

      injectCategorySchema(categoryFromSlug, categoryProducts);

      injectBreadcrumbSchema({
        name: categoryFromSlug,
        slug: routeSlug,
      });

      return;
    }

    /* ===== ALL PRODUCTS PAGE ===== */
    if (!routeSlug) {
      setIsModalOpen(false);
      setActiveProduct(null);
      document.body.style.overflow = "auto";

      document.title = DEFAULT_TITLE;
      updateMetaDescription(DEFAULT_DESCRIPTION);
      updateCanonical(`${window.location.origin}/products`);

      updateOGTag("og:type", "website");
      updateOGTag("og:title", DEFAULT_TITLE);
      updateOGTag("og:description", DEFAULT_DESCRIPTION);
      updateOGTag("og:url", `${window.location.origin}/products`);
      updateOGTag("og:image", DEFAULT_OG_IMAGE);

      removeProductSchema();
      removeProductListSchema();

      const c = document.getElementById("category-schema");
      if (c) c.remove();

      injectProductListSchema(products);
      injectBreadcrumbSchema(null);
      return;
    }

    /* ===== PRODUCT PAGE ===== */
    const found = products.find((p) => p.slug === routeSlug);
    if (!found) {
      navigate("/products", { replace: true });
      return;
    }

    const s = document.getElementById("category-schema");
      if (s) s.remove();

    removeProductListSchema();
    setActiveProduct(found);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  }, [routeSlug, products, navigate]);

  /* ================= PRODUCT SEO ================= */

  useEffect(() => {
    if (!activeProduct) return;

    const url = `${window.location.origin}/products/${activeProduct.slug}`;

    document.title = `${activeProduct.name} | JVC India`;
    updateMetaDescription(
      activeProduct.description?.slice(0, 155) || DEFAULT_DESCRIPTION
    );
    updateCanonical(url);

    updateOGTag("og:type", "product");
    updateOGTag("og:title", `${activeProduct.name} | JVC India`);
    updateOGTag(
      "og:description",
      activeProduct.description?.slice(0, 200)
    );
    updateOGTag("og:url", url);
    updateOGTag(
      "og:image",
      activeProduct.images?.[0] ||
        activeProduct.image ||
        DEFAULT_OG_IMAGE
    );

    injectProductSchema(activeProduct);
    injectBreadcrumbSchema(activeProduct);
  }, [activeProduct]);

  /* ================= HELPERS ================= */

  const clearSearch = () => setSearchQuery("");

  const clearAllFilters = () => {
    setSearchQuery("");
    navigate("/products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectCategory = (type) => {
    navigate(`/products/${toSlug(type)}`);
  };

  /* ================= SPLIT PRODUCTS ================= */

  const fullProducts = filteredProducts.filter(
    (p) => p.image && p.description && p.applications?.length
  );

  const liteProducts = filteredProducts.filter(
    (p) => !p.image || !p.description || !p.applications?.length
  );

  const categories = [
    ...new Set(products.map((p) => p.type).filter(Boolean)),
  ];

  /* ================= RENDER ================= */

  return (
    <section className="bg-gray-50 pb-28 pt-32 relative">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold text-jvcNavy">
          Our Products
        </h1>

        <p className="mt-4 text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold">
            {filteredProducts.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold">
            {products.length}
          </span>{" "}
          products
        </p>

        {/* CATEGORY CHIPS */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={clearAllFilters}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              !selectedType && !categoryFromSlug
                ? "bg-jvcOrange text-white"
                : "bg-white text-gray-600"
            }`}
          >
            All
          </button>

          {categories.map((type) => (
            <button
              key={type}
              onClick={() => selectCategory(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                (categoryFromSlug || selectedType) === type
                  ? "bg-jvcOrange text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH */}
      <div
        ref={stickyRef}
        className={`w-full z-40 ${
          isSticky ? "fixed top-20 shadow-lg" : "relative"
        } bg-white mt-0`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 border-b">
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

      {isSticky && <div className="h-[88px]" />}

      {/* PRODUCTS GRID */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {fullProducts.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.slug}`}
            className="bg-white rounded-xl border shadow hover:shadow-lg transition overflow-hidden"
          >
            <div className="relative h-56 bg-gray-100">
              {/* ✅ PRODUCT TYPE TAG */}
              {product.type && (
                <span className="absolute top-3 left-3 text-xs px-3 py-1 bg-black/70 text-white rounded-full">
                  {product.type}
                </span>
              )}

              <img
                src={product.image}
                alt={`${product.name} ${product.type.toLowerCase()} exporter from India for construction and industrial use`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5">
              <h3 className="text-lg font-bold text-jvcNavy">
                {highlightText(product.name, searchQuery)}
              </h3>

              <p className="text-sm text-gray-600 line-clamp-2">
                {product.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>


      {/* LITE PRODUCTS */}
      {liteProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {liteProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => {
                setEnquiryProductName(product.name);
                setIsEnquiryOpen(true);
              }}
              className="relative text-left bg-white border rounded-lg px-6 py-4 shadow-sm hover:shadow-md transition"
            >
              {/* ✅ PRODUCT TYPE TAG — TOP RIGHT */}
              {product.type && (
                <span className="absolute top-3 right-3 text-xs px-3 py-1 bg-black/70 text-white rounded-full">
                  {product.type}
                </span>
              )}

              <h3 className="font-semibold text-jvcNavy">
                {highlightText(product.name, searchQuery)}
              </h3>

              {/* ✅ SUBTITLE (UNCHANGED, SAFE) */}
              {product.subtitle && (
                <p className="text-sm text-gray-600 mt-1">
                  {product.subtitle}
                </p>
              )}
            </button>
          ))}
        </div>
      )}


      {/* SEE ALL PRODUCTS — DESKTOP */}
      <div className="hidden md:flex justify-center mt-16">
        <button
          onClick={clearAllFilters}
          disabled={!isFiltered}
          className={`px-10 py-4 rounded-xl font-semibold ${
            isFiltered
              ? "bg-jvcOrange text-white hover:bg-orange-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          See All Products →
        </button>
      </div>

      {/* SEE ALL PRODUCTS — MOBILE */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-xl transition-transform duration-300 ${
          isFiltered ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <button
          onClick={clearAllFilters}
          disabled={!isFiltered}
          className={`w-full py-4 rounded-xl font-semibold transition ${
            isFiltered
              ? "bg-jvcOrange text-white hover:bg-orange-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          See All Products →
        </button>
      </div>

      {/* MODALS */}
      <ProductModal
        product={activeProduct}
        isOpen={isModalOpen}
        onClose={() => navigate("/products")}
      />

      <ProductEnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        productName={enquiryProductName}
      />
    </section>
  );
};

/* ================= TEXT HIGHLIGHT ================= */

function highlightText(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <span
        key={i}
        className="bg-jvcOrange/20 text-jvcOrange px-1 rounded"
      >
        {part}
      </span>
    ) : (
      part
    )
  );
}

/* ================= SEO HELPERS ================= */

function updateMetaDescription(content) {
  let meta = document.querySelector("meta[name='description']");
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function updateCanonical(url) {
  let link = document.querySelector("link[rel='canonical']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = url;
}

function updateOGTag(property, content) {
  let meta = document.querySelector(`meta[property='${property}']`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

/* ================= SCHEMA HELPERS ================= */

function injectProductSchema(product) {
  removeProductSchema();

  const url = `${window.location.origin}/products/${product.slug}`;

  const unique = (arr) => [...new Set(arr)];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": url,

    name: product.name,

    description:
      product.description ||
      "Industrial mineral supplied by JVC India for global export applications.",

    ...(product.images?.length || product.image
      ? {
          image: product.images?.length
            ? product.images
            : [product.image],
        }
      : {}),

    brand: {
      "@type": "Brand",
      name: "JVC India",
    },

    // 🔹 INDUSTRIAL CONTEXT
    category: product.type || "Industrial Minerals",
    material: product.name,

    // 🔹 TARGET BUYERS (B2B SIGNAL)
    audience: {
      "@type": "BusinessAudience",
      "audienceType": "Construction companies, ready-mix concrete plants, Industries, Local Trading Companies"
    },

    // 🔹 IDENTIFIERS
    sku: product.slug,
    mpn: product.slug.toUpperCase(),

    // 🔹 TECHNICAL ATTRIBUTES (ONLY IF PRESENT)
    ...(product.grades?.length ||
    product.meshSizes?.length ||
    product.packaging?.length
      ? {
          additionalProperty: [
            ...(product.grades?.length
              ? [
                  {
                    "@type": "PropertyValue",
                    name: "Grades",
                    value: unique(product.grades).join(", "),
                  },
                ]
              : []),

            ...(product.meshSizes?.length
              ? [
                  {
                    "@type": "PropertyValue",
                    name: "Mesh Size",
                    value: unique(product.meshSizes).join(", "),
                  },
                ]
              : []),

            ...(product.packaging?.length
              ? [
                  {
                    "@type": "PropertyValue",
                    name: "Packaging",
                    value: unique(product.packaging).join(", "),
                  },
                ]
              : []),
          ],
        }
      : {}),

    // 🔹 B2B OFFER (NO PRICE CLAIM)
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "JVC India",
      },
    },
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "product-schema";
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}

function injectCategorySchema(category, products) {
  const id = "category-schema";
  if (document.getElementById(id)) return;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category} Products`,
    description: `Exporter and bulk supplier of ${category.toLowerCase()} from India for construction and industrial applications in Middle East and global markets.`,
    url: `${window.location.origin}/products/${toSlug(category)}`,
    hasPart: products.map((p) => ({
      "@type": "Product",
      name: p.name,
      url: `${window.location.origin}/products/${p.slug}`,
    })),
  };

  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}



function removeProductSchema() {
  const s = document.getElementById("product-schema");
  if (s) s.remove();
}

function injectProductListSchema(products) {
  removeProductListSchema();

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${window.location.origin}/products/${p.slug}`,
    })),
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "product-list-schema";
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}

function removeProductListSchema() {
  const s = document.getElementById("product-list-schema");
  if (s) s.remove();
}

function injectBreadcrumbSchema(entity) {
  removeBreadcrumbSchema();

  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: window.location.origin,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Products",
      item: `${window.location.origin}/products`,
    },
  ];

  if (entity?.slug) {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: entity.name,
      item: `${window.location.origin}/products/${entity.slug}`,
    });
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "breadcrumb-schema";
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}


function removeBreadcrumbSchema() {
  const s = document.getElementById("breadcrumb-schema");
  if (s) s.remove();
}

export default ProductsPage;
