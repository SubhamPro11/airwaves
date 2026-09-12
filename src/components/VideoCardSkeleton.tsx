import React from 'react';

interface VideoCardSkeletonProps {
  variant?: 'grid' | 'row';
}

export const VideoCardSkeleton: React.FC<VideoCardSkeletonProps> = ({ variant = 'grid' }) => {
  return (
    <div
      aria-hidden="true"
      className={`flex flex-col bg-surface-850 rounded-xl border border-surface-700 overflow-hidden shadow-sm animate-pulse h-full ${
        variant === 'row' ? 'w-[280px] sm:w-[320px] shrink-0' : 'w-full'
      }`}
    >
      {/* 16:9 Thumbnail placeholder */}
      <div className="aspect-video w-full bg-surface-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-surface-700/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>

      {/* Details placeholder */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-3">
        <div className="space-y-2">
          <div className="h-4 bg-surface-800 rounded-md w-4/5" />
          <div className="h-3 bg-surface-800/60 rounded-md w-2/5" />
        </div>

        <div className="pt-2 border-t border-surface-800/80 flex items-center justify-between">
          <div className="h-5 w-20 bg-surface-800 rounded-md" />
          <div className="h-6 w-6 rounded-full bg-surface-800" />
        </div>
      </div>
    </div>
  );
};

export const VideoGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <VideoCardSkeleton key={idx} variant="grid" />
      ))}
    </div>
  );
};
