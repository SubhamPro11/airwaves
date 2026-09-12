import React, { useState } from 'react';
import { Radio, ArrowLeft, Home, Search } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { AmbientBackground } from './AmbientBackground';
import { usePageMeta } from '../hooks/usePageMeta';

interface NotFoundPageProps {
  onBackToHome: () => void;
  onSearchFrom404?: (query: string) => void;
  onSelectCategory?: (category: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onBackToHome,
  onSearchFrom404,
  onSelectCategory,
}) => {
  usePageMeta({
    title: '404 Page Not Found · Airwaves Radio',
    description: 'The requested audio frequency or station could not be found. Return to Airwaves to browse 70 curated web radio and soundscape projects.',
    canonicalPath: '/404',
  });

  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearchFrom404) {
        onSearchFrom404(query.trim());
      } else {
        window.location.href = `/?q=${encodeURIComponent(query.trim())}`;
      }
    } else {
      onBackToHome();
    }
  };

  const popularCategories = [
    'Radio & mixtapes',
    'Ambient & mood',
    'Travel & transit',
    'Classical & instrumental',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface-900 text-slate-200 font-sans relative overflow-x-hidden">
      <AmbientBackground />

      {/* Header */}
      <header className="border-b border-surface-700 bg-surface-900/95 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div onClick={onBackToHome} className="cursor-pointer">
            <BrandLogo />
          </div>
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-850 hover:bg-surface-800 text-slate-300 hover:text-white border border-surface-700 hover:border-surface-600 text-xs font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to directory</span>
          </button>
        </div>
      </header>

      {/* 404 Center Banner */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center justify-center text-center">
        {/* Animated Radio Dial Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-surface-850 border border-surface-700 flex items-center justify-center text-accent-500 shadow-xl mb-6">
          <Radio className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
        </div>

        {/* 404 Badge */}
        <span className="inline-flex items-center px-3 py-1 rounded-md bg-accent-500/10 border border-accent-500/30 text-accent-400 font-mono text-xs font-bold uppercase tracking-wider mb-4">
          Status 404 · Static / Off-Air
        </span>

        <h1 className="font-sans font-bold text-2xl sm:text-4xl text-white tracking-tight">
          Audio frequency not found
        </h1>

        <p className="text-sm sm:text-base text-slate-400 mt-3 sm:mt-4 leading-relaxed max-w-lg">
          The route or station parameter you navigated to is off-frequency. Search our catalog of 70 independent audio feeds or jump to a popular channel below:
        </p>

        {/* Search Bar on 404 */}
        <form onSubmit={handleSearchSubmit} className="mt-8 w-full max-w-md">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 70 playlists or soundscapes..."
              className="w-full pl-10 pr-24 py-2.5 bg-surface-850 text-white placeholder:text-slate-500 rounded-xl border border-surface-700 focus:border-accent-500 focus:outline-none text-xs sm:text-sm shadow-md"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-accent-500 hover:bg-accent-400 text-surface-950 font-bold text-xs transition-all cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Popular Categories Quick Jump */}
        <div className="mt-8 w-full max-w-md text-left">
          <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2.5 text-center">
            Or browse popular channels
          </span>
          <div className="flex flex-wrap gap-2 justify-center">
            {popularCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(cat);
                  } else {
                    window.location.href = `/?category=${encodeURIComponent(cat)}`;
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-surface-850 hover:bg-surface-800 text-slate-300 hover:text-accent-400 border border-surface-700 hover:border-surface-600 text-xs font-medium transition-all cursor-pointer shadow-xs"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Call to Action */}
        <div className="mt-8">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-surface-850 hover:bg-surface-800 text-slate-200 hover:text-white border border-surface-700 text-xs font-medium transition-all shadow-md cursor-pointer"
          >
            <Home className="w-4 h-4 text-accent-400" />
            <span>Return to full directory</span>
          </button>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-surface-700 bg-surface-950 py-6 px-4 text-center text-xs text-slate-500 font-mono">
        Airwaves · Curated Independent Audio &amp; Web Radio
      </footer>
    </div>
  );
};
