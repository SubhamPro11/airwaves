import React, { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, ExternalLink, Heart, Share2, Check, Radio, AlertCircle } from 'lucide-react';
import { Video, getEffectiveThumbnailUrl } from '../types/video';
import { BrandLogo } from './BrandLogo';
import { VideoCard } from './VideoCard';
import { AmbientBackground } from './AmbientBackground';
import { getStationSlug } from '../utils/slug';
import { useToast } from './Toast';
import { usePageMeta } from '../hooks/usePageMeta';

interface StationPermalinkPageProps {
  video: Video;
  allVideos: Video[];
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onNavigateHome: () => void;
  onNavigateStation: (slug: string) => void;
  onSurpriseMe?: () => void;
  reactionCount?: number;
  hasReacted?: boolean;
  onAddReaction?: (id: string) => void;
  getReactionCount?: (id: string) => number;
  hasReactedForId?: (id: string) => boolean;
  onRecordView?: (id: string) => void;
  onReportBroken?: (video: { id: string; externalLink: string }) => boolean;
  isBrokenReported?: boolean;
}

export const StationPermalinkPage: React.FC<StationPermalinkPageProps> = ({
  video,
  allVideos,
  isFavorite,
  onToggleFavorite,
  onNavigateHome,
  onNavigateStation,
  onSurpriseMe,
  reactionCount = 0,
  hasReacted = false,
  onAddReaction,
  getReactionCount,
  hasReactedForId,
  onRecordView,
  onReportBroken,
  isBrokenReported = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [reported, setReported] = useState(isBrokenReported);
  const [imgError, setImgError] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    onRecordView?.(video.id);
  }, [video.id, onRecordView]);

  const domain = video.externalLink
    .replace(/^https?:\/\//, '')
    .split('/')[0];

  const thumbnailUrl = getEffectiveThumbnailUrl(video);

  const permalinkSlug = getStationSlug(video.title);
  const currentPermalink = `https://airwaves.dpdns.org/station/${permalinkSlug}`;

  // Dynamic SEO meta tags and Open Graph per station
  usePageMeta({
    title: `${video.title} · Airwaves Radio`,
    description: `Listen to ${video.title} (${domain}), curated in ${video.category} on Airwaves. Independent web radio, ambient soundscapes, and regional audio.`,
    canonicalPath: `/station/${permalinkSlug}`,
    ogImage: thumbnailUrl,
    ogType: 'music.playlist',
  });

  // Dynamic JSON-LD for Station
  useEffect(() => {
    const scriptId = 'station-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'RadioBroadcastService',
      'name': video.title,
      'url': currentPermalink,
      'sameAs': video.externalLink,
      'image': thumbnailUrl,
      'genre': video.category,
      'inLanguage': 'en'
    });

    // Scroll to top on page load
    const isReducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: isReducedMotion ? 'auto' : 'smooth' });

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [video.id, video.title, video.externalLink, video.category, thumbnailUrl, currentPermalink]);

  const handleCopyLink = async () => {
    const url = `https://airwaves.dpdns.org/station/${getStationSlug(video.title)}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      showToast('Station permalink copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link', err);
      showToast('Failed to copy link', 'error');
    }
  };

  const [confirmingReport, setConfirmingReport] = useState(false);

  const handleReportBroken = () => {
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

  const relatedStations = useMemo(() => {
    return allVideos
      .filter((v) => v.id !== video.id && v.category === video.category)
      .slice(0, 4);
  }, [allVideos, video]);

  return (
    <div className="min-h-screen flex flex-col bg-surface-950 text-slate-100 font-sans selection:bg-accent-500 selection:text-white relative overflow-x-hidden">
      <AmbientBackground />
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-surface-900/90 backdrop-blur-md border-b border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-850 hover:bg-surface-800 text-slate-300 hover:text-white border border-surface-700 hover:border-surface-600 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All stations</span>
            </button>

            <div className="h-4 w-px bg-surface-700 hidden sm:block" />

            <div className="hidden sm:block">
              <BrandLogo />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {onSurpriseMe && (
              <button
                type="button"
                onClick={onSurpriseMe}
                title="Jump to another random station"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-500/10 hover:bg-accent-500 text-accent-400 hover:text-surface-950 border border-accent-500/30 hover:border-accent-400 text-xs font-semibold transition-all cursor-pointer group"
              >
                <span className="text-sm transition-transform group-hover:rotate-12">🎲</span>
                <span className="hidden sm:inline">Surprise me</span>
              </button>
            )}

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-850 hover:bg-surface-800 text-slate-300 hover:text-white border border-surface-700 hover:border-surface-600 text-xs font-medium transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Link copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Showcase Hero */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: High-Res Artwork */}
          <div className="md:col-span-6">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-surface-900 border border-surface-700 shadow-2xl">
              {!imgError ? (
                <img
                  src={thumbnailUrl}
                  alt={`Cover artwork for ${video.title} on ${domain}`}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-surface-900 text-center">
                  <Radio className="w-12 h-12 text-accent-500 mb-3 opacity-60" />
                  <span className="font-mono text-sm text-slate-300 font-semibold">{domain}</span>
                  <span className="text-xs text-slate-500 mt-1">{video.category}</span>
                </div>
              )}

              {/* Category Badge Floating on Artwork */}
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-lg bg-surface-950/90 backdrop-blur-md font-sans text-xs font-semibold text-slate-200 border border-white/10 shadow-sm">
                  {video.category}
                </span>
              </div>

              {/* Flame Reaction Button Floating on Artwork */}
              {onAddReaction && (
                <button
                  type="button"
                  onClick={() => onAddReaction(video.id)}
                  disabled={hasReacted}
                  title={hasReacted ? `You reacted (${reactionCount})` : 'React with 🔥'}
                  aria-label={hasReacted ? `Reacted (${reactionCount})` : 'React with flame'}
                  className={`absolute bottom-3 left-3 h-9 px-3 rounded-full flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-md text-xs font-mono font-bold ${
                    hasReacted
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 scale-105 cursor-default'
                      : 'bg-surface-950/75 text-slate-200 hover:text-amber-400 hover:bg-surface-950/90 border border-white/15'
                  }`}
                >
                  <span className="text-sm">🔥</span>
                  <span>{reactionCount > 0 ? `${reactionCount} reactions` : 'React'}</span>
                </button>
              )}

              {/* Heart Favorite Button */}
              <button
                type="button"
                onClick={() => onToggleFavorite(video.id)}
                aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-md ${
                  isFavorite
                    ? 'bg-surface-950/95 text-accent-500 border border-accent-500/50 scale-105'
                    : 'bg-surface-950/75 text-slate-300 hover:text-accent-400 hover:bg-surface-950/90 border border-white/15'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-accent-500 text-accent-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right Column: Station Details & Direct Outbound Launch */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                  Live External Feed
                </span>
              </div>

              <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight mb-3">
                {video.title}
              </h1>

              <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 font-mono">
                <span>Host:</span>
                <span className="text-slate-300 font-semibold">{domain}</span>
              </div>

              {/* Creator Credit Attribution Block */}
              {video.creator ? (
                <div className="p-3.5 rounded-xl bg-surface-900 border border-surface-700/80 mb-5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 font-mono text-[11px] block uppercase tracking-wider">Created & Curated By</span>
                    <span className="text-slate-200 font-bold font-sans text-sm mt-0.5 block">{video.creator}</span>
                  </div>
                  {video.creatorUrl && (
                    <a
                      href={video.creatorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-850 hover:bg-surface-800 text-accent-400 hover:text-accent-300 border border-surface-700 hover:border-surface-600 font-medium transition-colors text-xs"
                    >
                      <span>Creator profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-surface-900/60 border border-surface-800 mb-5 text-xs text-slate-400">
                  <span className="text-slate-500 font-mono text-[11px] block uppercase tracking-wider">Attribution</span>
                  <span className="text-slate-300 mt-0.5 block">Independent Web Radio / Open Community Project</span>
                </div>
              )}

              <div className="p-4 rounded-xl bg-surface-900 border border-surface-700/80 mb-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>
                  This station is part of the Airwaves curated index of 70 independent web radio and audio environments. Audio plays directly from the creator&apos;s live site in a new browser tab.
                </p>
              </div>
            </div>

            {/* Launch Action & Broken Link Report */}
            <div className="space-y-3">
              <a
                href={video.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-accent-500 hover:bg-accent-400 active:bg-accent-600 text-surface-950 font-bold text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-accent-500/20 cursor-pointer"
              >
                <span>Launch audio station</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-[11px] text-slate-500 font-mono">
                <span>Opens in a new tab • Zero tracking</span>
                {onReportBroken && (
                  <button
                    type="button"
                    onClick={handleReportBroken}
                    disabled={reported || isBrokenReported}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                      reported || isBrokenReported
                        ? 'text-amber-400 bg-amber-500/10 cursor-default'
                        : confirmingReport
                        ? 'text-surface-950 bg-amber-500 font-bold cursor-pointer'
                        : 'text-slate-400 hover:text-amber-400 hover:underline cursor-pointer'
                    }`}
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>
                      {reported || isBrokenReported
                        ? 'Broken stream reported'
                        : confirmingReport
                        ? 'Confirm report?'
                        : 'Report broken stream'}
                    </span>
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Related Category Stations */}
        {relatedStations.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-10 border-t border-surface-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-sans font-bold text-lg sm:text-xl text-white">
                  More in {video.category}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Explore other curated soundscapes in this channel.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {relatedStations.map((rel) => (
                <div key={rel.id} className="relative group">
                  <VideoCard
                    video={rel}
                    variant="grid"
                    isFavorite={false}
                    onToggleFavorite={() => onToggleFavorite(rel.id)}
                    reactionCount={getReactionCount ? getReactionCount(rel.id) : 0}
                    hasReacted={hasReactedForId ? hasReactedForId(rel.id) : false}
                    onAddReaction={onAddReaction}
                  />
                  {/* Overlay button to open related station permalink */}
                  <button
                    onClick={() => onNavigateStation(getStationSlug(rel.title))}
                    className="absolute top-2.5 right-12 z-10 px-2 py-0.5 rounded bg-surface-950/85 hover:bg-surface-950 text-[10px] text-slate-300 font-mono border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    Details &rarr;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-700 bg-surface-950 py-8 px-4 text-center text-xs text-slate-500 font-mono">
        <p>Airwaves — Curated single-playlist index • No algorithms • Zero ads</p>
      </footer>
    </div>
  );
};
