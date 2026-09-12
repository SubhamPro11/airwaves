/**
 * Consent-Gated Privacy-Respecting Analytics Utility
 * Supports Cloudflare Web Analytics (default for Cloudflare Workers/Pages) and Plausible.
 */

const CONSENT_STORAGE_KEY = 'airwaves_cookie_consent_v1';

export type CookieConsentStatus = 'accepted' | 'declined' | 'pending';

export function getCookieConsent(): CookieConsentStatus {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === 'accepted' || stored === 'declined') {
      return stored;
    }
  } catch {
    // fallback
  }
  return 'pending';
}

export function setCookieConsent(status: 'accepted' | 'declined'): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, status);
  } catch {
    // ignore
  }

  if (status === 'accepted') {
    loadAnalytics();
  } else {
    removeAnalytics();
  }
}

let analyticsLoaded = false;

export function loadAnalytics(): void {
  if (typeof window === 'undefined' || analyticsLoaded) return;
  if (getCookieConsent() !== 'accepted') return;

  const cfToken = import.meta.env.VITE_CLOUDFLARE_ANALYTICS_TOKEN;
  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;

  // 1. Cloudflare Web Analytics (Privacy-first, cookieless)
  if (cfToken) {
    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    script.setAttribute('data-cf-beacon', JSON.stringify({ token: cfToken }));
    script.id = 'cf-analytics-beacon';
    document.head.appendChild(script);
    analyticsLoaded = true;
    return;
  }

  // 2. Plausible Analytics fallback
  if (plausibleDomain) {
    const script = document.createElement('script');
    script.defer = true;
    script.setAttribute('data-domain', plausibleDomain);
    script.src = 'https://plausible.io/js/script.js';
    script.id = 'plausible-analytics-script';
    document.head.appendChild(script);
    analyticsLoaded = true;
    return;
  }

  // Development/Informational log if no token provided
  if (import.meta.env.DEV) {
    console.info(
      '[Airwaves Analytics] Consent granted. Analytics ready for VITE_CLOUDFLARE_ANALYTICS_TOKEN or VITE_PLAUSIBLE_DOMAIN in .env.'
    );
  }
}

export function removeAnalytics(): void {
  const cfScript = document.getElementById('cf-analytics-beacon');
  if (cfScript) cfScript.remove();

  const plausibleScript = document.getElementById('plausible-analytics-script');
  if (plausibleScript) plausibleScript.remove();

  analyticsLoaded = false;
}

export function trackPageView(path: string): void {
  if (getCookieConsent() !== 'accepted') return;

  // If Plausible is loaded
  if (typeof (window as unknown as { plausible?: (event: string, opts?: { u: string }) => void }).plausible === 'function') {
    (window as unknown as { plausible: (event: string, opts?: { u: string }) => void }).plausible('pageview', {
      u: window.location.origin + path,
    });
  }
}
