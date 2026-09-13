import React, { useState, useEffect } from 'react';
import { Heart, Menu, X, Plus, Info, Star, Keyboard } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { SortControl, SortOption } from './SortControl';
import { LiveVisitorsBadge } from './LiveVisitorsBadge';
import { UserAuthControl } from './UserAuthControl';
import { ThemeToggle } from './ThemeToggle';
import { CATEGORIES, Category } from '../data/playlist';

const REPO_URL = 'https://github.com/SubhamPro11/airwaves';
const CACHE_KEY = 'airwaves_github_stars_cache';
const REPO_API_URL = 'https://api.github.com/repos/SubhamPro11/airwaves';

interface PlaylistHeaderProps {
  totalItems: number;
  filteredItemsCount: number;
  favoritesCount: number;
  favoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  currentSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  onShuffle: () => void;
  onSurpriseMe?: () => void;
  onOpenAbout?: () => void;
  onOpenSuggest?: () => void;
  onOpenShortcuts?: () => void;
}

export const PlaylistHeader: React.FC<PlaylistHeaderProps> = ({
  totalItems,
  filteredItemsCount,
  favoritesCount,
  favoritesOnly,
  onToggleFavoritesOnly,
  selectedCategory,
  onSelectCategory,
  currentSort,
  onSelectSort,
  onShuffle,
  onOpenAbout,
  onOpenSuggest,
  onOpenShortcuts,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [starCount, setStarCount] = useState<number | null>(null);
  const isFiltered = selectedCategory !== 'All' || favoritesOnly;

  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 30 * 60 * 1000 && typeof parsed.count === 'number') {
          setStarCount(parsed.count);
          return;
        }
      }
    } catch {
      // ignore
    }

    fetch(REPO_API_URL)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.stargazers_count === 'number') {
          setStarCount(data.stargazers_count);
          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ count: data.stargazers_count, timestamp: Date.now() })
            );
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        // silently fallback
      });
  }, []);

  const handleMobileAction = (action: () => void) => {
    action();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-surface-900/95 backdrop-blur-md border-b border-surface-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <BrandLogo />

        {/* Desktop Controls Toolbar */}
        <div className="hidden md:flex items-center gap-2 sm:gap-2.5 flex-wrap justify-end">
          
          {/* Star on GitHub Button */}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Star Airwaves on GitHub"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-surface-850 hover:bg-surface-800 border border-surface-700 hover:border-accent-500/50 transition-all cursor-pointer group"
          >
            <Star className="w-3.5 h-3.5 text-slate-400 group-hover:text-accent-400 transition-colors" />
            <span>Star</span>
            {starCount !== null && (
              <span className="px-1.5 py-0.2 rounded-full bg-accent-500/20 text-accent-300 text-[10px] font-bold font-mono">
                {starCount}
              </span>
            )}
          </a>

          {/* Suggest Station Button */}
          {onOpenSuggest && (
            <button
              type="button"
              onClick={onOpenSuggest}
              className="px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium text-accent-400 hover:text-accent-300 bg-surface-850 hover:bg-surface-800 border border-surface-700 hover:border-accent-500/50 transition-all cursor-pointer"
            >
              + Suggest
            </button>
          )}

          {/* About Project Button */}
          {onOpenAbout && (
            <button
              type="button"
              onClick={onOpenAbout}
              className="px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-surface-850 hover:bg-surface-800 border border-surface-700 hover:border-surface-600 transition-all cursor-pointer"
            >
              About
            </button>
          )}

          {/* Keyboard Shortcuts Guide Button */}
          {onOpenShortcuts && (
            <button
              type="button"
              onClick={onOpenShortcuts}
              title="Keyboard shortcuts (?)"
              aria-label="Keyboard shortcuts"
              className="px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-mono font-bold text-slate-400 hover:text-accent-400 bg-surface-850 hover:bg-surface-800 border border-surface-700 hover:border-surface-600 transition-all cursor-pointer hidden lg:inline-flex items-center gap-1"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>?</span>
            </button>
          )}

          {/* Sort Dropdown */}
          <SortControl
            currentSort={currentSort}
            onSelectSort={onSelectSort}
            onShuffle={onShuffle}
          />

          {/* Favorites Only Toggle */}
          <button
            type="button"
            onClick={onToggleFavoritesOnly}
            aria-label={favoritesOnly ? "Show all stations" : "Show favorites only"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
              favoritesOnly
                ? 'bg-accent-500/15 text-accent-400 border-accent-500/40 font-semibold'
                : 'bg-surface-850 hover:bg-surface-800 text-slate-300 hover:text-white border-surface-700 hover:border-surface-600'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                favoritesOnly ? 'fill-accent-500 text-accent-500' : 'text-slate-400'
              }`}
            />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-accent-500/20 text-accent-300 text-[10px] font-bold font-mono">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Optional Google Sign-In Control */}
          <UserAuthControl />

          {/* Theme Dark/Light Mode Toggle */}
          <ThemeToggle />

          {/* Live Listener Counter Badge */}
          <LiveVisitorsBadge />

          {/* Collection Counter Badge */}
          <div className="px-3 py-1.5 sm:py-2 rounded-xl bg-surface-850 border border-surface-700 text-slate-300 text-xs whitespace-nowrap">
            {isFiltered ? (
              <>
                <span className="text-accent-400 font-bold font-mono">{filteredItemsCount}</span> of {totalItems}
              </>
            ) : (
              <>
                <span className="text-accent-400 font-bold font-mono">{totalItems}</span> radio feeds
              </>
            )}
          </div>
        </div>

        {/* Mobile Compact Bar (< md) */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <UserAuthControl />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="p-2 rounded-xl bg-surface-850 hover:bg-surface-800 text-slate-300 hover:text-white border border-surface-700 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Category Filter Chips & Sort Toolbar Sub-bar */}
      <div className="border-t border-surface-800/80 bg-surface-900/90 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Horizontal Scrollable Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 min-w-0 flex-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 shrink-0 mr-1 hidden sm:inline">
              Filter:
            </span>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onSelectCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 sm:py-1.5 min-h-[32px] rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-accent-500/15 text-accent-400 border-accent-500/50 font-semibold shadow-xs'
                      : 'bg-surface-850 hover:bg-surface-800 text-slate-300 hover:text-white border-surface-700 hover:border-surface-600 font-medium'
                  }`}
                >
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
                  )}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown positioned consistently right near the filter chips */}
          <div className="shrink-0 flex items-center gap-2">
            <SortControl
              currentSort={currentSort}
              onSelectSort={onSelectSort}
              onShuffle={onShuffle}
            />
          </div>
        </div>
      </div>

      {/* Mobile Expandable Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-700 bg-surface-900/98 backdrop-blur-xl px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-2xl">
          
          <div className="flex items-center justify-between pb-3 border-b border-surface-800">
            <LiveVisitorsBadge />
            <div className="text-xs text-slate-400">
              <span className="text-accent-400 font-mono font-bold">{filteredItemsCount}</span> of {totalItems} stations
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-surface-850 text-slate-300 hover:text-white font-medium text-xs border border-surface-700 hover:border-accent-500/50 transition-all cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 text-accent-400" />
              <span>Star {starCount !== null ? `(${starCount})` : ''}</span>
            </a>

            <button
              type="button"
              onClick={() => handleMobileAction(onToggleFavoritesOnly)}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                favoritesOnly
                  ? 'bg-accent-500/20 text-accent-400 border-accent-500/50'
                  : 'bg-surface-850 text-slate-300 border-surface-700 hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-accent-500 text-accent-500' : ''}`} />
              <span>Favorites {favoritesCount > 0 ? `(${favoritesCount})` : ''}</span>
            </button>
          </div>

          {/* Sort Control Mobile Row */}
          <div className="pt-1">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Sort Order
            </div>
            <SortControl
              currentSort={currentSort}
              onSelectSort={(sort) => {
                onSelectSort(sort);
                setMobileMenuOpen(false);
              }}
              onShuffle={() => {
                onShuffle();
                setMobileMenuOpen(false);
              }}
            />
          </div>

          {/* Quick Actions List */}
          <div className="pt-2 border-t border-surface-800 space-y-1.5">
            {onOpenSuggest && (
              <button
                type="button"
                onClick={() => handleMobileAction(onOpenSuggest)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-surface-850 hover:bg-surface-800 text-xs font-medium text-slate-200 border border-surface-700/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5 text-accent-400" />
                  <span>Suggest a New Station</span>
                </div>
                <span className="text-[10px] text-accent-400 font-mono">+ Submit</span>
              </button>
            )}

            {onOpenAbout && (
              <button
                type="button"
                onClick={() => handleMobileAction(onOpenAbout)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-surface-850 hover:bg-surface-800 text-xs font-medium text-slate-200 border border-surface-700/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-sky-400" />
                  <span>About Airwaves & Manifesto</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Read &rarr;</span>
              </button>
            )}

            {onOpenShortcuts && (
              <button
                type="button"
                onClick={() => handleMobileAction(onOpenShortcuts)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-surface-850 hover:bg-surface-800 text-xs font-medium text-slate-200 border border-surface-700/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Keyboard className="w-3.5 h-3.5 text-accent-400" />
                  <span>Keyboard Shortcuts Guide</span>
                </div>
                <span className="text-[10px] text-accent-400 font-mono">?</span>
              </button>
            )}
          </div>

        </div>
      )}
    </header>
  );
};
