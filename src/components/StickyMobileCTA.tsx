import React, { useState, useEffect } from 'react';
import { Star, X, Compass } from 'lucide-react';

const STORAGE_KEY = 'airwaves_sticky_mobile_cta_dismissed_v1';
const REPO_URL = 'https://github.com/SubhamPro11/airwaves';

interface StickyMobileCTAProps {
  onSurpriseMe: () => void;
  onExplore: () => void;
}

export const StickyMobileCTA: React.FC<StickyMobileCTAProps> = ({ onSurpriseMe, onExplore }) => {
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY) === 'true';
      setIsDismissed(dismissed);
    } catch {
      setIsDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
  };

  if (isDismissed) return null;

  return (
    <div
      aria-label="Mobile quick actions bar"
      className="fixed bottom-3 left-3 right-3 z-30 md:hidden animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="relative flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-surface-850/95 backdrop-blur-md border border-surface-700 shadow-2xl">
        <button
          type="button"
          onClick={onExplore}
          className="inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-surface-800 hover:bg-surface-750 text-slate-200 border border-surface-700 text-xs font-medium active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <Compass className="w-3.5 h-3.5 text-accent-400" />
          <span>Explore</span>
        </button>

        <button
          type="button"
          onClick={onSurpriseMe}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-accent-500 hover:bg-accent-400 text-surface-950 font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer truncate"
        >
          <span>🎲</span>
          <span className="truncate">Surprise Me</span>
        </button>

        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-surface-800 hover:bg-surface-750 text-slate-200 border border-surface-700 text-xs font-medium active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <Star className="w-3.5 h-3.5 text-accent-400" />
          <span>Star</span>
        </a>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss mobile bar"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
