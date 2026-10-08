/*
 * The site's public address. Absolute URLs are required for share previews,
 * the canonical link and the sitemap. VERCEL_PROJECT_PRODUCTION_URL is the
 * stable production domain; VERCEL_URL would be the one-off deployment URL,
 * which search engines must never be told is the real address.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
