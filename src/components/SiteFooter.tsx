import React from 'react';
import { CATEGORIES, Category } from '../data/playlist';
import { ThemeToggle } from './ThemeToggle';
import { Mail } from 'lucide-react';

interface SiteFooterProps {
  totalVideos: number;
  onOpenAbout?: () => void;
  onOpenSuggest?: () => void;
  onOpenShortcuts?: () => void;
  onNavigatePrivacy?: () => void;
  onNavigateTerms?: () => void;
  onSelectCategory?: (category: Category) => void;
  onOpenCookieSettings?: () => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ 
  totalVideos, 
  onOpenAbout, 
  onOpenSuggest, 
  onOpenShortcuts,
  onNavigatePrivacy,
  onNavigateTerms,
  onSelectCategory,
  onOpenCookieSettings,
}) => {
  const realCategories = CATEGORIES.filter((c) => c !== 'All');

  return (
    <footer className="border-t border-surface-700 bg-surface-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-16 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Col 1: About the Project & Contact */}
        <div className="md:col-span-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-500"></div>
            <span className="font-bold text-sm text-white tracking-tight">
              AIRWAVES
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
            A single, human-curated playlist indexing independent audio projects, web radios, highway travel soundscapes, and regional folk music from across India.
          </p>

          <div className="mt-3 flex items-center gap-4 flex-wrap">
            {onOpenAbout && (
              <button
                type="button"
                onClick={onOpenAbout}
                className="text-xs text-accent-400 hover:text-accent-300 font-medium underline underline-offset-4 cursor-pointer"
              >
                Curation manifesto &rarr;
              </button>
            )}
            {onOpenSuggest && (
              <button
                type="button"
                onClick={onOpenSuggest}
                className="text-xs text-slate-300 hover:text-white font-medium underline underline-offset-4 cursor-pointer"
              >
                Suggest a station &rarr;
              </button>
            )}
            {onOpenShortcuts && (
              <button
                type="button"
                onClick={onOpenShortcuts}
                className="text-xs text-slate-400 hover:text-accent-400 font-mono underline underline-offset-4 cursor-pointer"
              >
                Shortcuts (?)
              </button>
            )}
          </div>

          {/* Real Contact Address & Info */}
          <div className="mt-5 pt-4 border-t border-surface-800 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-accent-400" />
              <span>Contact &amp; Inquiries:</span>
              <a
                href="mailto:contact@airwaves.dpdns.org"
                className="text-accent-400 hover:text-accent-300 font-mono underline underline-offset-2"
              >
                contact@airwaves.dpdns.org
              </a>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Curated independently · Open source on GitHub (SubhamPro11/airwaves)
            </p>
          </div>
        </div>

        {/* Col 2: Real Index Metrics */}
        <div className="md:col-span-3">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
            Collection index
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center justify-between">
              <span>Total curated links:</span>
              <span className="text-accent-400 font-bold font-mono">{totalVideos}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Genre categories:</span>
              <span className="text-slate-200 font-mono">{realCategories.length}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Playback model:</span>
              <span className="text-slate-200">External direct links</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Favorites storage:</span>
              <span className="text-slate-200">Local browser only</span>
            </li>
          </ul>

          <div className="mt-6 pt-4 border-t border-surface-800 text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Trust &amp; Legal
            </div>
            <div className="flex items-center gap-3 flex-wrap text-xs">
              {onNavigatePrivacy ? (
                <button
                  type="button"
                  onClick={onNavigatePrivacy}
                  className="text-slate-400 hover:text-accent-400 underline underline-offset-2 cursor-pointer"
                >
                  Privacy Policy
                </button>
              ) : (
                <a href="/privacy" className="text-slate-400 hover:text-accent-400 underline underline-offset-2">
                  Privacy Policy
                </a>
              )}
              <span>·</span>
              {onNavigateTerms ? (
                <button
                  type="button"
                  onClick={onNavigateTerms}
                  className="text-slate-400 hover:text-accent-400 underline underline-offset-2 cursor-pointer"
                >
                  Terms of Service
                </button>
              ) : (
                <a href="/terms" className="text-slate-400 hover:text-accent-400 underline underline-offset-2">
                  Terms of Service
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Col 3: Channels & Transparency */}
        <div className="md:col-span-4">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
            Browse by channel
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {realCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory?.(cat)}
                className="px-2.5 py-1 rounded-lg bg-surface-850 hover:bg-surface-800 border border-surface-700 hover:border-surface-600 text-xs text-slate-300 hover:text-accent-400 transition-colors cursor-pointer text-left"
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-surface-700 text-xs text-slate-400 flex items-center justify-between">
            <span>Built with honest web principles</span>
            {onOpenCookieSettings && (
              <button
                type="button"
                onClick={onOpenCookieSettings}
                className="text-[11px] text-slate-500 hover:text-slate-300 underline cursor-pointer"
              >
                Cookie Preferences
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-surface-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div>
          <span>Airwaves · 70 independent audio websites · Hosted on Cloudflare</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 flex-wrap">
          <span>No algorithms</span>
          <span>·</span>
          <span>No ad trackers</span>
          <span>·</span>
          <span>Zero ads</span>
          <span className="hidden sm:inline">·</span>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
};
