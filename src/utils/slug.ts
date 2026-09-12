import { Video } from '../types/video';

/**
 * Converts a station title into a clean URL-safe slug
 */
export function getStationSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Finds a station in the video list by its slug or ID
 */
export function findStationBySlugOrId(videos: Video[], slugOrId: string): Video | undefined {
  if (!slugOrId) return undefined;
  const cleanTarget = decodeURIComponent(slugOrId).toLowerCase().trim();

  // Match by exact ID first
  const byId = videos.find((v) => v.id.toLowerCase() === cleanTarget);
  if (byId) return byId;

  // Match by title slug
  return videos.find((v) => getStationSlug(v.title) === cleanTarget);
}

/**
 * Converts a category name into a clean URL-safe slug
 */
export function getCategorySlug(category: string): string {
  return category
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Finds a category from a list by its URL slug
 */
export function findCategoryBySlug<T extends string>(categories: readonly T[], slug: string): T | undefined {
  if (!slug) return undefined;
  const cleanTarget = decodeURIComponent(slug).toLowerCase().trim();
  return categories.find((c) => getCategorySlug(c) === cleanTarget);
}

