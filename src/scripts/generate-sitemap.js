const fs = require("fs");
const path = require("path");

const SITE_URL = "https://www.jvcindia.com";
const products = require("../../public/data/products.json");

/* Same slug logic as frontend */
const toSlug = (str) =>
  str
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

function generateSitemap() {
  const today = new Date().toISOString().split("T")[0];
  const urls = [];

  /* ================= HOME ================= */
  urls.push(`
    <url>
      <loc>${SITE_URL}/</loc>
      <lastmod>${today}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
  `);

  /* ================= PRODUCTS INDEX ================= */
  urls.push(`
    <url>
      <loc>${SITE_URL}/products</loc>
      <lastmod>${today}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>
  `);

  /* ================= CATEGORY PAGES ================= */
  const categories = [
    ...new Set(products.map((p) => p.type).filter(Boolean)),
  ];

  categories.forEach((category) => {
    urls.push(`
      <url>
        <loc>${SITE_URL}/products/${toSlug(category)}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.85</priority>
      </url>
    `);
  });

  /* ================= PRODUCT PAGES ================= */
  products.forEach((product) => {
    if (!product.slug) return;

    urls.push(`
      <url>
        <loc>${SITE_URL}/products/${product.slug}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.95</priority>
      </url>
    `);
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("")}
</urlset>`;

  fs.writeFileSync(
    path.join(__dirname, "../../public/sitemap.xml"),
    sitemap.trim()
  );

  console.log("✅ sitemap.xml generated correctly");
}

generateSitemap();
