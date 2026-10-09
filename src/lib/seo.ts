import type { Metadata } from "next";

export const SITE_NAME = "Decorative Floor Register";

// Canonical public origin. The apex domain redirects to www, so www is canonical.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.decorativefloorregister.com"
).replace(/\/$/, "");

type PageMetadataInput = {
  /** Page <title>; the root layout template appends " | Decorative Floor Register". */
  title: string;
  description: string;
  /** Route path, e.g. "/careers". Used for canonical + og:url. */
  path: string;
  /** Overrides for the social card text; default to title/description. */
  socialTitle?: string;
  socialDescription?: string;
  type?: "website" | "article";
  /** Use `title` as-is instead of applying the layout's "%s | …" template. */
  absoluteTitle?: boolean;
};

/**
 * Next.js merges metadata shallowly, so a page that sets `openGraph` wipes out
 * the layout's siteName/locale/type. Build every page's metadata here so each
 * URL gets a complete, consistent set of canonical, Open Graph and Twitter tags.
 * Images come from the nearest `opengraph-image.tsx` file convention.
 */
export function pageMetadata({
  title,
  description,
  path,
  socialTitle,
  socialDescription,
  type = "website",
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const ogTitle = socialTitle ?? (absoluteTitle ? title : `${title} | ${SITE_NAME}`);
  const ogDescription = socialDescription ?? description;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      locale: "en_US",
      siteName: SITE_NAME,
      url,
      title: ogTitle,
      description: ogDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
  };
}
