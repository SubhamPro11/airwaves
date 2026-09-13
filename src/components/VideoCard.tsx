import React, { useState, useEffect } from 'react';
import { Heart, ArrowUpRight, Info, Share2, Check, AlertCircle } from 'lucide-react';
import { Video, getEffectiveThumbnailUrl, getThumbnailSrcSet, DEFAULT_FALLBACK_THUMBNAIL, isRecentStation } from '../types/video';
import { getStationSlug } from '../utils/slug';
import { useToast } from './Toast';

interface VideoCardProps {
  video: Video;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onNavigatePermalink?: (slug: string) => void;
  variant?: 'grid' | 'row';
  reactionCount?: number;
  hasReacted?: boolean;
  onAddReaction?: (id: string) => void;
  onRecordView?: (id: string) => void;
  onReportBroken?: (video: { id: string; externalLink: string }) => boolean;
  isBrokenReported?: boolean;
  priority?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  isFavorite,
  onToggleFavorite,
  onNavigatePermalink,
  variant = 'row',
  reactionCount = 0,
  hasReacted = false,
  onAddReaction,
  onRecordView,
  onReportBroken,
  isBrokenReported = false,
  priority = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reported, setReported] = useState(isBrokenReported);
  const [currentSrc, setCurrentSrc] = useState(() => getEffectiveThumbnailUrl(video));
  const { showToast } = useToast();

  useEffect(() => {
    setCurrentSrc(getEffectiveThumbnailUrl(video));
    setImageError(false);
  }, [video.thumbnailUrl, video.category]);

  // Extract clean domain for destination display
  const domain = video.externalLink
    .replace(/^https?:\/\//, '')
    .split('/')[0];

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(video.id);
    showToast(isFavorite ? 'Removed from favorites' : 'Saved to favorites');
  };

  const handleReactionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddReaction) {
      onAddReaction(video.id);
    }
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    if (onNavigatePermalink) {
      e.preventDefault();
      e.stopPropagation();
      onNavigatePermalink(getStationSlug(video.title));
    }
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const permalink = `https://airwaves.dpdns.org/station/${getStationSlug(video.title)}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(permalink);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = permalink;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      showToast('Station link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      showToast('Failed to copy link', 'error');
    }
  };

  const [confirmingReport, setConfirmingReport] = useState(false);

  const handleReportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (reported || isBrokenReported) return;

    if (!confirmingReport) {
      setConfirmingReport(true);
      setTimeout(() => setConfirmingReport(false), 4000);
      return;
    }

    setConfirmingReport(false);
    if (onReportBroken) {
      const ok = onReportBroken({ id: video.id, externalLink: video.externalLink });
      if (ok) {
        setReported(true);
        showToast('Thanks for reporting! Station flagged for review.', 'info');
      }
    }
  };

  const handleImageError = () => {
    if (currentSrc !== DEFAULT_FALLBACK_THUMBNAIL) {
      setCurrentSrc(DEFAULT_FALLBACK_THUMBNAIL);
    } else {
      setImageError(true);
    }
  };

  const isRow = variant === 'row';

  return (
    <a
      id={`track-${video.id}`}
      data-station-card
      href={video.externalLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onRecordView?.(video.id)}
      aria-label={`Open ${video.title} on ${domain} in a new tab`}
      title={`Open ${video.title} on ${domain} (opens in new tab)`}
      className="group flex flex-col bg-surface-850 hover:bg-surface-800 rounded-xl border border-surface-700 hover:border-surface-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900 transition-all duration-200 overflow-hidden relative shadow-sm hover:shadow-md h-full cursor-pointer"
    >
      {/* 16:9 Thumbnail Viewport */}
      <div className="relative aspect-video w-full overflow-hidden bg-surface-950 border-b border-surface-700">
        {!imageError ? (
          <img
            src={currentSrc}
            srcSet={getThumbnailSrcSet(currentSrc)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
            alt={`Broadcast artwork for ${video.title} (${video.category})`}
            width={640}
            height={360}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            {...(priority ? { fetchPriority: 'high' as const } : {})}
            onError={handleImageError}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-surface-950 text-center">
            <span className="w-2.5 h-2.5 rounded-full mb-2 bg-accent-500" />
            <span className="font-mono text-xs text-slate-300 font-semibold truncate max-w-full">
              {domain}
            </span>
            <span className="text-xs text-slate-400 mt-0.5">
              {video.category}
            </span>
          </div>
        )}

        {/* Flame Reaction Button */}
        {onAddReaction && (
          <button
            type="button"
            onClick={handleReactionClick}
            disabled={hasReacted}
            title={hasReacted ? `You reacted (${reactionCount})` : 'React with 🔥'}
            aria-label={hasReacted ? `Reacted (${reactionCount})` : 'React with flame'}
            className={`absolute top-2.5 left-2.5 h-8 px-2.5 rounded-full flex items-center gap-1 backdrop-blur-md transition-all cursor-pointer z-10 shadow-sm text-xs font-mono font-bold ${
              hasReacted
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 scale-105 cursor-default'
                : 'bg-surface-950/70 text-slate-300 hover:text-amber-400 hover:bg-surface-950/90 border border-white/10 opacity-85 group-hover:opacity-100'
            }`}
          >
            <span>🔥</span>
            {reactionCount > 0 && <span>{reactionCount}</span>}
          </button>
        )}

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer z-10 shadow-sm ${
            isFavorite
              ? 'bg-surface-950/95 text-accent-500 border border-accent-500/50 scale-105'
              : 'bg-surface-950/70 text-slate-400 hover:text-accent-400 hover:bg-surface-950/90 border border-white/10 opacity-80 group-hover:opacity-100'
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              isFavorite ? 'fill-accent-500 text-accent-500' : ''
            }`}
          />
        </button>

        {/* "New" Badge for Recently Added Stations */}
        {isRecentStation(video.dateAdded) && (
          <div
            title={`Added recently (${new Date(video.dateAdded!).toLocaleDateString()})`}
            className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-950/90 border border-accent-500/40 backdrop-blur-md text-[10px] font-mono font-bold text-accent-400 shadow-sm z-10 select-none pointer-events-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            <span>NEW</span>
          </div>
        )}
      </div>

      {/* Card Info & Scannable Typography */}
      <div className={`flex-1 flex flex-col justify-between bg-surface-850 group-hover:bg-surface-800 transition-colors ${isRow ? 'p-4' : 'p-3.5 sm:p-4'}`}>
        <div>
          {/* Category tag ONLY shown in cross-category grid/search view */}
          {!isRow && (
            <div className="inline-block px-2 py-0.5 rounded-md bg-surface-950 border border-surface-700/80 text-[10px] text-slate-400 font-medium tracking-wide uppercase mb-2 truncate max-w-full">
              {video.category}
            </div>
          )}

          {/* Card title */}
          <h3 className={`font-sans font-bold text-white group-hover:text-accent-400 transition-colors leading-snug line-clamp-2 ${isRow ? 'text-base sm:text-lg min-h-[3rem]' : 'text-sm sm:text-base min-h-[2.5rem]'}`}>
            {video.title}
          </h3>
        </div>

        {/* Unified Outbound Destination Bar */}
        <div className="mt-3 pt-2.5 border-t border-surface-700/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 truncate max-w-[210px]">
            <span className="font-mono text-xs truncate text-slate-400 group-hover:text-slate-300 transition-colors">
              {domain}
            </span>
            {onNavigatePermalink && (
              <button
                type="button"
                onClick={handleDetailsClick}
                title="View station details & permalink"
                className="inline-flex items-center gap-1 px-2 py-1 min-h-[28px] rounded bg-surface-900 hover:bg-surface-750 text-[10px] text-slate-400 hover:text-white border border-surface-700 transition-colors cursor-pointer"
              >
                <Info className="w-2.5 h-2.5" />
                <span>Info</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleCopyLink}
              title={copied ? "Copied to clipboard!" : "Copy station link"}
              aria-label={copied ? "Station link copied" : `Copy link for ${video.title}`}
              className={`inline-flex items-center gap-1 px-2 py-1 min-h-[28px] rounded text-[10px] border transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-medium'
                  : 'bg-surface-900 hover:bg-surface-750 text-slate-400 hover:text-white border-surface-700'
              }`}
            >
              {copied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Share2 className="w-2.5 h-2.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
            {onReportBroken && (
              <button
                type="button"
                onClick={handleReportClick}
                disabled={reported || isBrokenReported}
                title={
                  reported || isBrokenReported
                    ? "Report received — thank you!"
                    : confirmingReport
                    ? "Click again to confirm broken report"
                    : "Report dead or broken link"
                }
                aria-label={reported || isBrokenReported ? "Broken link reported" : `Report broken link for ${video.title}`}
                className={`inline-flex items-center gap-1 px-2 py-1 min-h-[28px] rounded text-[10px] border transition-all ${
                  reported || isBrokenReported
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 cursor-default'
                    : confirmingReport
                    ? 'bg-amber-500 text-surface-950 border-amber-500 font-bold cursor-pointer'
                    : 'bg-surface-900 hover:bg-surface-750 text-slate-400 hover:text-amber-400 border-surface-700 cursor-pointer'
                }`}
              >
                <AlertCircle className="w-2.5 h-2.5" />
                <span>{reported || isBrokenReported ? 'Reported' : confirmingReport ? 'Confirm?' : 'Report'}</span>
              </button>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-slate-400 group-hover:text-accent-400 transition-colors font-medium shrink-0">
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </a>
  );
};
