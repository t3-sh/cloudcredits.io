import config from "@/config/config.json";

/**
 * Generates a canonical URL for a given pathname
 * @param pathname - The pathname (e.g., "/about", "/providers/aws")
 * @returns Canonical URL with proper base URL and trailing slash handling
 */
export function getCanonicalURL(pathname: string): string {
  const { base_url, trailing_slash } = config.site;
  
  // Normalize pathname - remove leading slash if present
  const normalizedPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  
  // Build canonical URL
  let canonicalURL = `${base_url}/${normalizedPath}`;
  
  // Handle trailing slash preference
  if (trailing_slash && !canonicalURL.endsWith("/") && normalizedPath !== "") {
    canonicalURL += "/";
  } else if (!trailing_slash && canonicalURL.endsWith("/") && normalizedPath !== "") {
    canonicalURL = canonicalURL.slice(0, -1);
  }
  
  return canonicalURL;
}

/**
 * Gets canonical URL from Astro.url object
 * @param astroUrl - Astro.url object from component
 * @returns Canonical URL
 */
export function getCanonicalFromAstroURL(astroUrl: URL): string {
  return getCanonicalURL(astroUrl.pathname);
}