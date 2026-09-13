export interface Video {
  id: string;
  orderIndex: number;
  title: string;
  externalLink: string;
  thumbnailUrl: string;
  category: string;
  accentColor?: string;
  creator?: string;
  creatorUrl?: string;
  dateAdded?: string;
}

export interface PlaylistData {
  title: string;
  description: string;
  videos: Video[];
}

export const DEFAULT_FALLBACK_THUMBNAIL =
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=75&fm=webp';

export const CATEGORY_FALLBACK_THUMBNAILS: Record<string, string> = {
  'Radio & mixtapes': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=75&fm=webp',
  'Travel & transit': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=75&fm=webp',
  'Folk & regional': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=75&fm=webp',
  'Classical & instrumental': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=75&fm=webp',
  'Nostalgia & retro': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=400&q=75&fm=webp',
  'Devotional & spiritual': 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=400&q=75&fm=webp',
  'Ambient & mood': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=75&fm=webp',
};

export function getOptimizedThumbnailUrl(
  rawUrl?: string,
  width = 400,
  quality = 75,
  format = 'webp'
): string {
  if (!rawUrl || !rawUrl.trim()) return DEFAULT_FALLBACK_THUMBNAIL;
  const url = rawUrl.trim();

  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('w', width.toString());
      parsed.searchParams.set('q', quality.toString());
      parsed.searchParams.set('fm', format);
      parsed.searchParams.set('fit', 'crop');
      parsed.searchParams.set('auto', 'format');
      return parsed.toString();
    } catch {
      return url
        .replace(/w=\d+/, `w=${width}`)
        .replace(/q=\d+/, `q=${quality}`)
        .replace(/fm=[a-z0-9]+/i, `fm=${format}`);
    }
  }
  return url;
}

export function getThumbnailSrcSet(rawUrl?: string, quality = 75): string | undefined {
  if (!rawUrl || !rawUrl.includes('images.unsplash.com')) return undefined;
  return `${getOptimizedThumbnailUrl(rawUrl, 360, quality)} 360w, ${getOptimizedThumbnailUrl(rawUrl, 640, quality)} 640w`;
}

export function getEffectiveThumbnailUrl(video: Partial<Video>): string {
  let url = DEFAULT_FALLBACK_THUMBNAIL;
  if (video.thumbnailUrl && video.thumbnailUrl.trim()) {
    url = video.thumbnailUrl.trim();
  } else if (video.category && CATEGORY_FALLBACK_THUMBNAILS[video.category]) {
    url = CATEGORY_FALLBACK_THUMBNAILS[video.category];
  }

  return getOptimizedThumbnailUrl(url, 400, 75, 'webp');
}

export const NEW_STATION_THRESHOLD_DAYS = 14;

export function isRecentStation(dateAdded?: string, thresholdDays = NEW_STATION_THRESHOLD_DAYS): boolean {
  if (!dateAdded) return false;
  const time = new Date(dateAdded).getTime();
  if (isNaN(time)) return false;
  const ageMs = Date.now() - time;
  return ageMs >= 0 && ageMs <= thresholdDays * 24 * 60 * 60 * 1000;
}

export interface StationSubmission {
  id: string;
  name: string;
  url: string;
  category: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export type HealthStatusType = 'live' | 'redirect' | 'broken' | 'timeout' | 'checking' | 'unknown';

export interface LinkHealthReport {
  videoId: string;
  url: string;
  status: HealthStatusType;
  httpStatus?: number;
  lastChecked: string;
  responseTimeMs?: number;
  error?: string;
}



