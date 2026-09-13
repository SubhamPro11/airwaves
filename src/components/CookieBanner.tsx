import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { getCookieConsent, setCookieConsent, CookieConsentStatus } from '../lib/analytics';

interface CookieBannerProps {
  onOpenPrivacy?: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPrivacy }) => {
  const [consent, setConsent] = useState<CookieConsentStatus>('pending');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const current = getCookieConsent();
    setConsent(current);
    setIsMounted(true);
  }, []);

  if (!isMounted || consent !== 'pending') {
    return null;
  }

  const handleAccept = () => {
    setCookieConsent('accepted');
    setConsent('accepted');
  };

  const handleDecline = () => {
    setCookieConsent('declined');
    setConsent('declined');
  };

  return (
    <aside
      aria-label="Privacy and cookies preferences"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="relative overflow-hidden rounded-2xl bg-surface-850/95 backdrop-blur-md border border-surface-700 p-5 shadow-2xl text-slate-200">
        {/* Subtle warm amber ambient glow */}
        <div
          className="absolute -top-10 -right-10 w-32 h-32 bg-accent-500/10 rounded-full blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-accent-500/15 border border-accent-500/30 flex items-center justify-center shrink-0 text-accent-400 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-sans font-bold text-sm text-white flex items-center justify-between">
              <span>Privacy &amp; Minimal Analytics</span>
              <button
                type="button"
                onClick={handleDecline}
                aria-label="Decline and close"
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1 -mr-1 rounded-lg hover:bg-surface-800"
              >
                <X className="w-4 h-4" />
              </button>
            </h2>

            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Airwaves uses local storage for your favorites and dark/light theme. We request permission to load cookieless, privacy-friendly analytics to count aggregate listeners. Zero third-party ad trackers.
            </p>

            <div className="mt-3.5 flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleAccept}
                className="px-3.5 py-1.5 rounded-xl bg-accent-500 hover:bg-accent-400 text-surface-950 font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                Accept Analytics
              </button>

              <button
                type="button"
                onClick={handleDecline}
                className="px-3.5 py-1.5 rounded-xl bg-surface-800 hover:bg-surface-750 text-slate-300 hover:text-white border border-surface-700 text-xs font-medium transition-colors cursor-pointer"
              >
                Decline
              </button>

              {onOpenPrivacy && (
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="text-xs text-slate-400 hover:text-accent-400 underline underline-offset-4 ml-auto cursor-pointer"
                >
                  Privacy policy
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
