import { useEffect } from 'react';

export interface PageMetaOptions {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: string;
}

const DEFAULT_BASE_URL = 'https://airwaves.dpdns.org';
const DEFAULT_TITLE = 'Airwaves — Curated Web Radio & Soundscapes';
const DEFAULT_DESCRIPTION =
  'A curated sequence of 70 independent web radio streams, ambient soundscapes, highway bus mixtapes, and cultural music projects.';
const DEFAULT_OG_IMAGE = `${DEFAULT_BASE_URL}/og-image.svg`;

/**
 * Ensures title stays strictly <= 60 characters while retaining "Airwaves" and key context.
 */
export function formatMetaTitle(rawTitle?: string): string {
  if (!rawTitle || rawTitle === 'Home' || rawTitle === 'Airwaves') {
    return DEFAULT_TITLE; // 43 chars
  }

  // Already includes Airwaves?
  if (rawTitle.includes('Airwaves')) {
    if (rawTitle.length <= 60) return rawTitle;
    return rawTitle.slice(0, 57).trim() + '...';
  }

  // Target suffix: " · Airwaves Radio" (17 chars) or " — Airwaves" (11 chars)
  const preferredSuffix = ' · Airwaves Radio';
  const maxContentLen = 60 - preferredSuffix.length; // 43 chars

  if (rawTitle.length <= maxContentLen) {
    return `${rawTitle}${preferredSuffix}`;
  }

  // Fallback to shorter suffix " · Airwaves" (11 chars)
  const shortSuffix = ' · Airwaves';
  const maxShortContentLen = 60 - shortSuffix.length; // 49 chars
  if (rawTitle.length <= maxShortContentLen) {
    return `${rawTitle}${shortSuffix}`;
  }

  // Truncate station/category title
  const truncated = rawTitle.slice(0, maxShortContentLen - 3).trim();
  return `${truncated}...${shortSuffix}`;
}

/**
 * Ensures description stays strictly <= 160 characters.
 */
export function formatMetaDescription(rawDesc?: string): string {
  const desc = rawDesc || DEFAULT_DESCRIPTION;
  if (desc.length <= 160) return desc;
  return desc.slice(0, 157).trim() + '...';
}

function setMetaTag(selector: string, attr: string, value: string) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    if (selector.startsWith('meta[name="')) {
      const nameMatch = selector.match(/name="([^"]+)"/);
      if (nameMatch) el.setAttribute('name', nameMatch[1]);
    } else if (selector.startsWith('meta[property="')) {
      const propMatch = selector.match(/property="([^"]+)"/);
      if (propMatch) el.setAttribute('property', propMatch[1]);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export function usePageMeta({
  title,
  description,
  canonicalPath = '',
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
}: PageMetaOptions) {
  useEffect(() => {
    const formattedTitle = formatMetaTitle(title);
    const formattedDesc = formatMetaDescription(description);
    const fullCanonical = `${DEFAULT_BASE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;

    // 1. Page Title
    document.title = formattedTitle;

    // 2. Meta description
    setMetaTag('meta[name="description"]', 'content', formattedDesc);

    // 3. Canonical Link
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', fullCanonical);

    // 4. Open Graph Tags
    setMetaTag('meta[property="og:title"]', 'content', formattedTitle);
    setMetaTag('meta[property="og:description"]', 'content', formattedDesc);
    setMetaTag('meta[property="og:url"]', 'content', fullCanonical);
    setMetaTag('meta[property="og:image"]', 'content', ogImage);
    setMetaTag('meta[property="og:type"]', 'content', ogType);

    // 5. Twitter Card Tags
    setMetaTag('meta[name="twitter:title"]', 'content', formattedTitle);
    setMetaTag('meta[name="twitter:description"]', 'content', formattedDesc);
    setMetaTag('meta[name="twitter:url"]', 'content', fullCanonical);
    setMetaTag('meta[name="twitter:image"]', 'content', ogImage);
  }, [title, description, canonicalPath, ogImage, ogType]);
}
