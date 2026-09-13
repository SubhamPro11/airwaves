import React from 'react';
import { History, X, ExternalLink } from 'lucide-react';
import { Video, getEffectiveThumbnailUrl, getOptimizedThumbnailUrl } from '../types/video';
import { getStationSlug } from '../utils/slug';

interface RecentlyViewedSectionProps {
  recentlyViewedIds: string[];
  videos: Video[];
  onNavigateStation: (slug: string) => void;
  onClear: () => void;
}

export const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  recentlyViewedIds,
  videos,
  onNavigateStation,
  onClear,
}) => {
  // Only show if there are recently viewed stations
  if (recentlyViewedIds.length === 0) return null;

  // Map IDs to video objects in most-recent-first order
  const recentVideos = recentlyViewedIds
    .map((id) => videos.find((v) => v.id === id))
    .filter((v): v is Video => Boolean(v));

  if (recentVideos.length === 0) return null;

  return (
    <section className="mb-8 p-4 sm:p-5 rounded-2xl bg-surface-850/60 border border-surface-700/60 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-accent-500" />
          <h2 className="text-xs sm:text-sm font-semibold text-white tracking-wide uppercase font-mono">
            Recently Discovered
          </h2>
          <span className="text-[11px] font-mono text-slate-500">
            ({recentVideos.length})
          </span>
        </div>

        <button
          onClick={onClear}
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors py-1 px-2 rounded-lg hover:bg-surface-800 cursor-pointer"
          title="Clear recent stations"
        >
          <X className="w-3.5 h-3.5" />
          <span>Clear history</span>
        </button>
      </div>

      {/* Horizontal scroll container for recent cards */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-surface-700 scrollbar-track-transparent">
        {recentVideos.map((video) => {
          const thumb = getOptimizedThumbnailUrl(getEffectiveThumbnailUrl(video), 120, 75, 'webp');
          const slug = getStationSlug(video.title);

          return (
            <div
              key={video.id}
              className="flex-shrink-0 group relative flex items-center gap-3 p-2 pr-3 rounded-xl bg-surface-850 border border-surface-700 hover:border-surface-600 hover:bg-surface-800 transition-all duration-200 w-56 sm:w-64"
            >
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-800 flex-shrink-0">
                <img
                  src={thumb}
                  alt={`Broadcast thumbnail for ${video.title} (${video.category})`}
                  width={48}
                  height={48}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  onClick={() => onNavigateStation(slug)}
                  title={video.title}
                  className="text-xs font-semibold text-white truncate cursor-pointer hover:text-accent-400 transition-colors"
                >
                  {video.title}
                </h3>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {video.category}
                </p>
              </div>

              <a
                href={video.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                title={`Open stream for ${video.title}`}
                className="p-1.5 rounded-lg bg-surface-700/60 hover:bg-accent-500/20 text-slate-300 hover:text-accent-300 transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
};
