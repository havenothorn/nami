import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import fm from "front-matter";

const root = process.cwd();
const dist = path.join(root, "dist");
const postDirectory = path.join(root, "src/content/posts");
const siteUrl = (process.env.VITE_SITE_URL || "https://namis-log-3b0d8.web.app")
  .replace(/\/+$/, "");
const template = await readFile(path.join(dist, "index.html"), "utf8");
const files = (await readdir(postDirectory)).filter((file) => file.endsWith(".md"));
const postsById = new Map();

for (const file of files) {
  const source = await readFile(path.join(postDirectory, file), "utf8");
  const parsed = fm(source);
  const data = parsed.attributes;
  if (!data.id) {
    throw new Error(`Missing post id in ${file}`);
  }

  const translations = postsById.get(String(data.id)) ?? [];
  translations.push({ data, body: parsed.body });
  postsById.set(String(data.id), translations);
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function setMeta(html, attribute, key, value) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `<meta\\s+${attribute}="${escapedKey}"\\s+content="[^"]*"\\s*\\/?>`,
    "i",
  );
  const replacement = `<meta ${attribute}="${key}" content="${escapeAttribute(value)}" />`;
  if (!pattern.test(html)) {
    throw new Error(`Missing metadata placeholder: ${attribute}="${key}"`);
  }
  return html.replace(pattern, replacement);
}

function absoluteUrl(value) {
  return new URL(value, `${siteUrl}/`).href;
}

const sitemapEntries = [];

for (const [id, translations] of postsById) {
  const post = translations.find(({ data }) => data.language === "en") ?? translations[0];
  const { data, body } = post;
  const postUrl = `${siteUrl}/posts/${encodeURIComponent(id)}`;
  const imagePath =
    data.ogImage ??
    body.match(/!\[[^\]]*\]\(([^)]+)\)/)?.[1] ??
    "/images/posts/pnpm-lifecycle-20261020-220725.png";
  const imageUrl = absoluteUrl(imagePath);
  const description = data.excerpt || data.title;
  const tags = Array.isArray(data.tags) ? data.tags : [];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    headline: data.title,
    description,
    image: [imageUrl],
    datePublished: data.date,
    dateModified: data.updated || data.date,
    author: { "@type": "Person", name: data.author?.name || "Nami" },
    publisher: { "@type": "Person", name: "Nami" },
    inLanguage: "en",
    keywords: tags,
  };
  const safeStructuredData = JSON.stringify(structuredData).replaceAll("<", "\\u003c");
  let html = template.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeAttribute(data.title)} | Nami's Log</title>`,
  );
  html = setMeta(html, "name", "description", description);
  html = setMeta(html, "property", "og:title", data.title);
  html = setMeta(html, "property", "og:description", description);
  html = setMeta(html, "property", "og:type", "article");
  html = setMeta(html, "property", "og:url", postUrl);
  html = setMeta(html, "property", "og:image", imageUrl);
  html = setMeta(html, "property", "og:image:alt", data.title);
  html = html.replace(
    /<meta\s+property="og:image:(?:type|width|height)"[^>]*\/?>/gi,
    "",
  );
  html = setMeta(html, "name", "twitter:title", data.title);
  html = setMeta(html, "name", "twitter:description", description);
  html = setMeta(html, "name", "twitter:image", imageUrl);
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeAttribute(postUrl)}" />`,
  );
  html = html.replace(
    /<script id="structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script id="structured-data" type="application/ld+json">${safeStructuredData}</script>`,
  );

  const outputDirectory = path.join(dist, "posts", id);
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, "index.html"), html);
  sitemapEntries.push(
    `  <url>\n    <loc>${escapeAttribute(postUrl)}</loc>\n    <lastmod>${escapeAttribute(data.updated || data.date)}</lastmod>\n  </url>`,
  );
}

await writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${escapeAttribute(`${siteUrl}/`)}</loc>\n  </url>\n${sitemapEntries.join("\n")}\n</urlset>\n`,
);
await writeFile(
  path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
);

console.log(`Generated metadata pages for ${postsById.size} posts.`);
