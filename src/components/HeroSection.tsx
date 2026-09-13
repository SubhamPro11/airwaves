import React, { useState } from 'react';
import { Search, X, ExternalLink, Heart, Star } from 'lucide-react';
import { Video, getEffectiveThumbnailUrl, getThumbnailSrcSet, DEFAULT_FALLBACK_THUMBNAIL } from '../types/video';

import { CATEGORIES, Category } from '../data/playlist';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  selectedCategory?: Category;
  onSelectCategory?: (category: Category) => void;
  featuredVideos: Video[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onSurpriseMe?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  selectedCategory = 'All',
  onSelectCategory,
  featuredVideos,
  isFavorite,
  onToggleFavorite,
  onSurpriseMe,
}) => {
  const [selectedSpotlightIndex, setSelectedSpotlightIndex] = useState(0);
  const currentSpotlight = featuredVideos[selectedSpotlightIndex] || featuredVideos[0];

  if (!currentSpotlight) return null;

  const domain = currentSpotlight.externalLink
    .replace(/^https?:\/\//, '')
    .split('/')[0];

  const isFav = isFavorite(currentSpotlight.id);

  return (
    <section className="relative border-b border-surface-700 bg-surface-900 py-8 sm:py-12 overflow-hidden">
      {/* Subtle Warm Amber Glow in Background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Description & Primary Search Action */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-500 animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest text-accent-400 font-semibold">
                  Curated Audio Index
                </span>
              </div>
              <a
                href="https://github.com/SubhamPro11/airwaves"
                target="_blank"
                rel="noopener noreferrer"
                title="Star Airwaves on GitHub for early access"
                className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-accent-500/10 hover:bg-accent-500/20 border border-accent-500/30 hover:border-accent-500/50 text-accent-400 text-xs font-mono font-medium transition-all group cursor-pointer shadow-xs"
              >
                <Star className="w-3.5 h-3.5 text-accent-400 group-hover:scale-110 transition-transform" />
                <span>Star repo for early access</span>
                <span className="text-slate-400 group-hover:text-white transition-colors">&rarr;</span>
              </a>
            </div>

            <h1 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight leading-[1.1] mb-4">
              70 Ambient Radios, Nostalgia & Soundscapes
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mb-2">
              An open directory of 70 independent aesthetic web audio stations — from late-night highway drives and retro Doordarshan memories to temple bells and rain on tin roofs.
            </p>

            {/* Primary Search Input & Quick Actions in Hero */}
            <div className="mt-6 sm:mt-8 w-full max-w-xl">
              <div className="flex items-center gap-2.5">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    id="global-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search 70 playlists by name, mood, or domain..."
                    className="w-full pl-12 pr-12 py-3 bg-surface-850 text-white placeholder:text-slate-500 rounded-xl border border-surface-700 focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 focus:outline-none transition-all text-sm sm:text-base shadow-md"
                  />
                  {searchQuery ? (
                    <button
                      onClick={onClearSearch}
                      aria-label="Clear search"
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="hidden sm:flex absolute inset-y-0 right-0 pr-3.5 items-center pointer-events-none">
                      <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-surface-900 border border-surface-700 rounded shadow-xs">
                        /
                      </kbd>
                    </div>
                  )}
                </div>

                {/* Prominent Surprise Me Quick Button */}
                {onSurpriseMe && (
                  <button
                    type="button"
                    onClick={onSurpriseMe}
                    title="Jump to a random station"
                    className="flex items-center gap-2 px-4 py-3 bg-accent-500 hover:bg-accent-400 text-surface-950 font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-accent-500/20 active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    <span>🎲</span>
                    <span className="hidden sm:inline">Surprise me</span>
                  </button>
                )}
              </div>

              {/* Category Filter Chips */}
              <div className="mt-3.5 flex items-center gap-1.5 flex-wrap">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => onSelectCategory?.(cat)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer border ${
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

              {/* Quick Suggestion Tags */}
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                <span className="text-slate-400 font-mono text-[11px]">Quick keywords:</span>
                {['Saloon', 'Roadways', 'Ghazal', 'Doordarshan', 'Lo-Fi'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => onSearchChange(term)}
                    className="px-2 py-0.5 rounded-md bg-surface-850 hover:bg-surface-800 text-slate-400 hover:text-accent-400 border border-surface-700/60 hover:border-surface-600 text-[11px] transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Spotlight Feature Card */}
          <div className="lg:col-span-5">
            <div className="bg-surface-850 rounded-xl border border-surface-700 hover:border-surface-600 p-4 sm:p-5 shadow-xl relative overflow-hidden transition-all duration-300">
              
              {/* Spotlight Header Row */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-500" />
                  <span className="text-xs uppercase text-slate-300 font-semibold tracking-wider">
                    Spotlight #{String(selectedSpotlightIndex + 1).padStart(2, '0')}
                  </span>
                  {currentSpotlight.dateAdded &&
                    Date.now() - new Date(currentSpotlight.dateAdded).getTime() <= 7 * 24 * 60 * 60 * 1000 && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                        New
                      </span>
                    )}
                </div>

                {/* Switcher Dots for Picks with accessible touch target sizing */}
                <div className="flex items-center gap-1">
                  {featuredVideos.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedSpotlightIndex(idx)}
                      aria-label={`Select spotlight pick ${idx + 1}`}
                      className="p-1 cursor-pointer flex items-center justify-center"
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full transition-all block ${
                          selectedSpotlightIndex === idx
                            ? 'bg-accent-500 scale-125'
                            : 'bg-surface-700 hover:bg-slate-500'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Spotlight Thumbnail Image */}
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black border border-surface-700 group">
                <img
                  src={getEffectiveThumbnailUrl(currentSpotlight)}
                  srcSet={getThumbnailSrcSet(getEffectiveThumbnailUrl(currentSpotlight))}
                  sizes="(max-width: 768px) 100vw, 480px"
                  alt={`Featured spotlight broadcast: ${currentSpotlight.title} (${currentSpotlight.category})`}
                  width={640}
                  height={360}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_THUMBNAIL;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                />

                {/* Category Chip */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md bg-surface-950/85 backdrop-blur-md text-xs font-medium text-slate-200 border border-white/10 shadow-sm">
                    {currentSpotlight.category}
                  </span>
                </div>

                {/* Heart Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onToggleFavorite(currentSpotlight.id);
                  }}
                  aria-label={isFav ? 'Remove from favorites' : 'Save to favorites'}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer z-10 shadow-sm ${
                    isFav
                      ? 'bg-surface-950/90 text-accent-500 border border-accent-500/50'
                      : 'bg-surface-950/70 text-slate-400 hover:text-accent-400 hover:bg-surface-950/90 border border-white/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-accent-500 text-accent-500' : ''}`} />
                </button>
              </div>

              {/* Spotlight Details & Action Button */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div>
                  <h2 className="font-sans font-bold text-base sm:text-lg text-white leading-tight">
                    {currentSpotlight.title}
                  </h2>
                  <p className="font-mono text-xs text-slate-400 mt-1 truncate max-w-[220px]">
                    {domain}
                  </p>
                </div>

                <a
                  href={currentSpotlight.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-accent-500 hover:bg-accent-400 active:bg-accent-600 text-surface-950 font-bold text-xs uppercase tracking-wider transition-colors shrink-0 shadow-md cursor-pointer"
                >
                  <span>Open feed</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
