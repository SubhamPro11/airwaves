import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Video } from '../types/video';
import { VideoCard } from './VideoCard';
import { Category } from '../data/playlist';

interface CategoryRowProps {
  category: Category;
  videos: Video[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onViewAllCategory: (category: Category) => void;
  onNavigatePermalink?: (slug: string) => void;
  getReactionCount?: (id: string) => number;
  hasReacted?: (id: string) => boolean;
  onAddReaction?: (id: string) => void;
  onRecordView?: (id: string) => void;
  onReportBroken?: (video: { id: string; externalLink: string }) => boolean;
  hasReportedBroken?: (id: string) => boolean;
  isFirstRow?: boolean;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({
  category,
  videos,
  isFavorite,
  onToggleFavorite,
  onViewAllCategory,
  onNavigatePermalink,
  getReactionCount,
  hasReacted,
  onAddReaction,
  onRecordView,
  onReportBroken,
  hasReportedBroken,
  isFirstRow = false,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const categoryId = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Lazy-render below-the-fold rows to prevent main-thread long tasks
  const [isVisible, setIsVisible] = useState(() => {
    if (isFirstRow) return true;
    if (typeof window !== 'undefined' && window.location.hash.includes(categoryId)) return true;
    return false;
  });

  useEffect(() => {
    if (isVisible) return;
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible]);

  const checkScrollability = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const overflow = scrollWidth > clientWidth + 4;
    setHasOverflow(overflow);
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [isVisible, checkScrollability, videos.length]);

  if (videos.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section ref={sectionRef} id={categoryId} className="scroll-mt-28 min-h-[260px]">
      {/* Category Header Row */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="font-sans font-bold text-xl sm:text-2xl text-white tracking-tight">
            {category}
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-surface-850 border border-surface-700 text-slate-400 font-mono text-xs">
            {videos.length} {videos.length === 1 ? 'feed' : 'feeds'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View All Button */}
          <button
            onClick={() => onViewAllCategory(category)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-850 hover:bg-surface-800 text-xs font-medium text-slate-300 hover:text-accent-400 border border-surface-700 hover:border-surface-600 transition-colors cursor-pointer"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Left/Right Scroll Arrows (dynamically enabled when row overflows) */}
          {hasOverflow && (
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label={`Scroll ${category} left`}
                className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                  canScrollLeft
                    ? 'bg-surface-850 hover:bg-surface-800 text-slate-200 hover:text-white border-surface-700 hover:border-surface-600 cursor-pointer shadow-sm'
                    : 'bg-surface-950/50 text-slate-600 border-surface-800 cursor-not-allowed opacity-40'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label={`Scroll ${category} right`}
                className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                  canScrollRight
                    ? 'bg-surface-850 hover:bg-surface-800 text-slate-200 hover:text-white border-surface-700 hover:border-surface-600 cursor-pointer shadow-sm'
                    : 'bg-surface-950/50 text-slate-600 border-surface-800 cursor-not-allowed opacity-40'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Cards Carousel */}
      <div className="relative">
        {isVisible ? (
          <div
            ref={rowRef}
            onScroll={checkScrollability}
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          >
            {videos.map((video, idx) => (
              <div
                key={video.id}
                className="w-[280px] sm:w-[320px] shrink-0 snap-start"
              >
                <VideoCard
                  video={video}
                  variant="row"
                  priority={isFirstRow && idx < 2}
                  isFavorite={isFavorite(video.id)}
                  onToggleFavorite={onToggleFavorite}
                  onNavigatePermalink={onNavigatePermalink}
                  reactionCount={getReactionCount ? getReactionCount(video.id) : 0}
                  hasReacted={hasReacted ? hasReacted(video.id) : false}
                  onAddReaction={onAddReaction}
                  onRecordView={onRecordView}
                  onReportBroken={onReportBroken}
                  isBrokenReported={hasReportedBroken ? hasReportedBroken(video.id) : false}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[200px] w-full rounded-2xl bg-surface-850/40 border border-surface-800/40 animate-pulse" />
        )}
      </div>
    </section>
  );
};
