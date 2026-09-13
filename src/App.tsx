import { useState, useMemo, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import { Heart, SearchX, RotateCcw, Plus } from 'lucide-react';
import { CATEGORIES, Category } from './data/playlist';
import { PlaylistHeader } from './components/PlaylistHeader';
import { HeroSection } from './components/HeroSection';
import { VideoCard } from './components/VideoCard';
import { CategoryRow } from './components/CategoryRow';
import { SiteFooter } from './components/SiteFooter';
import { SortOption } from './components/SortControl';
import { Video, StationSubmission, CATEGORY_FALLBACK_THUMBNAILS, DEFAULT_FALLBACK_THUMBNAIL } from './types/video';
import { useFavorites } from './hooks/useFavorites';
import { useAdminAuth } from './hooks/useAdminAuth';
import { useVideosData } from './hooks/useVideosData';
import { useSubmissions } from './hooks/useSubmissions';

// Code-split secondary routes and admin panels to shrink public bundle by 80+ KiB
const AdminLogin = lazy(() => import('./components/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AboutModal = lazy(() => import('./components/AboutModal').then(m => ({ default: m.AboutModal })));
const NotFoundPage = lazy(() => import('./components/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const SuggestStationModal = lazy(() => import('./components/SuggestStationModal').then(m => ({ default: m.SuggestStationModal })));
const ShortcutsModal = lazy(() => import('./components/ShortcutsModal').then(m => ({ default: m.ShortcutsModal })));
const StationPermalinkPage = lazy(() => import('./components/StationPermalinkPage').then(m => ({ default: m.StationPermalinkPage })));
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('./components/TermsPage').then(m => ({ default: m.TermsPage })));
const ThankYouPage = lazy(() => import('./components/ThankYouPage').then(m => ({ default: m.ThankYouPage })));
import { SupportSection } from './components/SupportSection';
import { StarCTA } from './components/StarCTA';
import { NewsletterSection } from './components/NewsletterSection';
import { OnboardingBanner } from './components/OnboardingBanner';
import { RecentlyViewedSection } from './components/RecentlyViewedSection';
import { RecommendedSection } from './components/RecommendedSection';
import { BackToTopButton } from './components/BackToTopButton';
import { AmbientBackground } from './components/AmbientBackground';
import { FaqSection } from './components/FaqSection';
import { CookieBanner } from './components/CookieBanner';
import { StickyMobileCTA } from './components/StickyMobileCTA';
import { VideoGridSkeleton } from './components/VideoCardSkeleton';
import { useSiteSettings } from './hooks/useSiteSettings';
import { useKeyboardNav } from './hooks/useKeyboardNav';
import { useReactions } from './hooks/useReactions';
import { useRecentlyViewed } from './hooks/useRecentlyViewed';
import { useLinkHealth } from './hooks/useLinkHealth';
import { useUserAuth } from './hooks/useUserAuth';
import { useRecommendations } from './hooks/useRecommendations';
import { usePageMeta } from './hooks/usePageMeta';
import { loadAnalytics, trackPageView } from './lib/analytics';
import { findStationBySlugOrId, getStationSlug, getCategorySlug, findCategoryBySlug } from './utils/slug';

type AppRoute = 'public' | 'admin' | 'station' | 'category' | 'privacy' | 'terms' | 'thank_you' | 'not_found';

interface RouteState {
  route: AppRoute;
  stationSlug?: string;
  categorySlug?: string;
  submissionType?: string;
  stationName?: string;
}

function parseLocation(): RouteState {
  const path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);

  if (path.startsWith('/admin') || window.location.hash === '#admin') {
    return { route: 'admin' };
  }
  if (path === '/privacy') {
    return { route: 'privacy' };
  }
  if (path === '/terms') {
    return { route: 'terms' };
  }
  if (path === '/thank-you') {
    return {
      route: 'thank_you',
      submissionType: searchParams.get('type') || undefined,
      stationName: searchParams.get('name') || undefined,
    };
  }
  const catMatch = path.match(/^\/category\/([^/?#]+)/i);
  if (catMatch) {
    return { route: 'category', categorySlug: catMatch[1] };
  }
  const entryMatch = path.match(/^\/(?:entry|station)\/([^/?#]+)/i);
  if (entryMatch) {
    return { route: 'station', stationSlug: entryMatch[1] };
  }
  if (path === '/' || path === '/index.html' || path === '') {
    return { route: 'public' };
  }
  return { route: 'not_found' };
}

export function App() {
  const [routeState, setRouteState] = useState<RouteState>(parseLocation);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [currentSort, setCurrentSort] = useState<SortOption>('default');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [shuffleMap, setShuffleMap] = useState<Record<string, number>>({});
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [cookieBannerKey, setCookieBannerKey] = useState(0);

  const { favoriteIds, favoritesCount, toggleFavorite, isFavorite } = useFavorites();
  const { isAuthenticated, loading: authLoading, error: authError, login, logout, isSupabaseConfigured } = useAdminAuth();
  const { videos, loading: videosLoading, updateVideo, deleteVideo, addVideo, reorderVideos } = useVideosData();
  const { submissions, submitStation, updateSubmissionStatus, deleteSubmission } = useSubmissions();
  const { settings: siteSettings, isSupportActive } = useSiteSettings();
  const { addReaction, hasReacted, getReactionCount } = useReactions();
  const { recentlyViewedIds, addRecentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const { reportBrokenLink, hasReportedBroken } = useLinkHealth();
  const { user: signedInUser } = useUserAuth();
  const { recommendedVideos, isPersonalized, topCategoryName } = useRecommendations(
    videos,
    favoriteIds,
    recentlyViewedIds,
    Boolean(signedInUser)
  );

  // Initialize analytics on mount
  useEffect(() => {
    loadAnalytics();
  }, []);

  // Track pageviews on route change
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, [routeState]);

  // Handle URL query params on initial load (?q=... or ?category=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setSearchQuery(q);
    const catParam = params.get('category');
    if (catParam) {
      const match = CATEGORIES.find((c) => c.toLowerCase() === catParam.toLowerCase());
      if (match) setSelectedCategory(match);
    }
  }, []);

  // Synchronize category route with selectedCategory
  useEffect(() => {
    if (routeState.route === 'category' && routeState.categorySlug) {
      const matched = findCategoryBySlug(CATEGORIES, routeState.categorySlug);
      if (matched) {
        setSelectedCategory(matched);
      }
    } else if (routeState.route === 'public' && !window.location.search.includes('category=')) {
      // stay on current category or 'All'
    }
  }, [routeState]);

  // Dynamic SEO meta tags for public / category views (<60 chars title, <160 chars desc)
  const isCategorySelected = selectedCategory !== 'All';
  const currentCategorySlug = isCategorySelected ? getCategorySlug(selectedCategory) : '';

  usePageMeta({
    title: isCategorySelected
      ? `${selectedCategory} · Airwaves Web Radio`
      : 'Airwaves — Curated Web Radio & Soundscapes',
    description: isCategorySelected
      ? `Discover curated ${selectedCategory} independent audio projects, web radios, and soundscapes on Airwaves.`
      : 'A curated single-playlist showcase of 70 independent web radio, audio playlists, and soundscape projects.',
    canonicalPath: isCategorySelected ? `/category/${currentCategorySlug}` : '/',
  });

  // Enable arrow-key card navigation, space activation, and keyboard shortcuts
  useKeyboardNav({
    isEnabled: (routeState.route === 'public' || routeState.route === 'category') && !isAboutOpen && !isSuggestOpen && !isShortcutsOpen,
    onToggleShortcuts: () => setIsShortcutsOpen((prev) => !prev),
  });

  const handleApproveSubmission = async (sub: StationSubmission) => {
    const fallbackThumb = CATEGORY_FALLBACK_THUMBNAILS[sub.category] || DEFAULT_FALLBACK_THUMBNAIL;
    const ok = await addVideo({
      orderIndex: videos.length + 1,
      title: sub.name,
      externalLink: sub.url,
      thumbnailUrl: fallbackThumb,
      category: sub.category as Category,
      accentColor: '#f59e0b',
    });
    if (ok) {
      await updateSubmissionStatus(sub.id, 'approved');
      return true;
    }
    return false;
  };

  // Feature recently added entries in Spotlight (newest take rank #1 and #2), with curated fallback
  const featuredVideos = useMemo(() => {
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const recentEntries = videos
      .filter((v) => {
        if (!v.dateAdded) return false;
        const time = new Date(v.dateAdded).getTime();
        return !isNaN(time) && now - time <= SEVEN_DAYS_MS;
      })
      .sort((a, b) => new Date(b.dateAdded!).getTime() - new Date(a.dateAdded!).getTime());

    const topRecent = recentEntries.slice(0, 2);
    const topRecentIds = new Set(topRecent.map((v) => v.id));

    const defaultSpotlightIds = ['vid-01', 'vid-04', 'vid-23', 'vid-33', 'vid-37'];
    const curatedPool = defaultSpotlightIds
      .map((id) => videos.find((v) => v.id === id))
      .filter((v): v is Video => Boolean(v) && !topRecentIds.has(v!.id));

    const remainingFallback = videos.filter(
      (v) => !topRecentIds.has(v.id) && !curatedPool.some((c) => c.id === v.id)
    );

    const combined = [...topRecent, ...curatedPool, ...remainingFallback];
    return combined.slice(0, 5);
  }, [videos]);

  // Listen to browser navigation (popstate/hashchange)
  useEffect(() => {
    const handleRouteChange = () => {
      setRouteState(parseLocation());
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const navigateToPublic = () => {
    window.history.pushState({}, '', '/');
    setRouteState({ route: 'public' });
    setSelectedCategory('All');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (cat: Category) => {
    if (cat === 'All') {
      navigateToPublic();
      return;
    }
    const slug = getCategorySlug(cat);
    window.history.pushState({}, '', `/category/${slug}`);
    setSelectedCategory(cat);
    setRouteState({ route: 'category', categorySlug: slug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPrivacy = () => {
    window.history.pushState({}, '', '/privacy');
    setRouteState({ route: 'privacy' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTerms = () => {
    window.history.pushState({}, '', '/terms');
    setRouteState({ route: 'terms' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToThankYou = (type = 'submission', name?: string) => {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (name) params.set('name', name);
    const qs = params.toString() ? `?${params.toString()}` : '';
    window.history.pushState({}, '', `/thank-you${qs}`);
    setRouteState({
      route: 'thank_you',
      submissionType: type,
      stationName: name,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchFrom404 = (q: string) => {
    window.history.pushState({}, '', `/?q=${encodeURIComponent(q)}`);
    setSearchQuery(q);
    setSelectedCategory('All');
    setRouteState({ route: 'public' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const lastRandomIdRef = useRef<string | null>(null);

  const navigateToStation = (slug: string) => {
    const station = findStationBySlugOrId(videos, slug);
    if (station) {
      addRecentlyViewed(station.id);
    }
    window.history.pushState({}, '', `/station/${slug}`);
    setRouteState({ route: 'station', stationSlug: slug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Surprise Me - picks a random station without repeating the same one twice in a row
  const handleSurpriseMe = useCallback(() => {
    if (videos.length === 0) return;
    const eligible = videos.length > 1 && lastRandomIdRef.current
      ? videos.filter((v) => v.id !== lastRandomIdRef.current)
      : videos;

    const chosen = eligible[Math.floor(Math.random() * eligible.length)];
    if (!chosen) return;

    lastRandomIdRef.current = chosen.id;
    addRecentlyViewed(chosen.id);
    const slug = getStationSlug(chosen.title);
    window.history.pushState({}, '', `/station/${slug}`);
    setRouteState({ route: 'station', stationSlug: slug });
    const isReducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: isReducedMotion ? 'auto' : 'smooth' });
  }, [videos, addRecentlyViewed]);

  // Trigger new random shuffle ordering on click
  const handleShuffle = useCallback(() => {
    const newMap: Record<string, number> = {};
    const ids = videos.map((v) => v.id);
    
    // Fisher-Yates shuffle
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    
    ids.forEach((id, idx) => {
      newMap[id] = idx;
    });

    setShuffleMap(newMap);
    setCurrentSort('shuffle');
  }, [videos]);

  // Determine active view mode
  const isFilteredGridView = useMemo(() => {
    return (
      searchQuery.trim().length > 0 ||
      selectedCategory !== 'All' ||
      favoritesOnly ||
      currentSort !== 'default'
    );
  }, [searchQuery, selectedCategory, favoritesOnly, currentSort]);

  // Filtered and Sorted Video List (for Flat Grid mode)
  const processedVideos = useMemo(() => {
    const filtered = videos.filter((video) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const cleanDomain = video.externalLink.replace(/^https?:\/\//, '').toLowerCase();
        const matchesTitle = video.title.toLowerCase().includes(q);
        const matchesDomain = cleanDomain.includes(q);
        const matchesCategory = video.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDomain && !matchesCategory) {
          return false;
        }
      }

      if (selectedCategory !== 'All' && video.category !== selectedCategory) {
        return false;
      }

      if (favoritesOnly && !favoriteIds.includes(video.id)) {
        return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (currentSort === 'az') {
        return a.title.localeCompare(b.title);
      }
      if (currentSort === 'za') {
        return b.title.localeCompare(a.title);
      }
      if (currentSort === 'shuffle') {
        return (shuffleMap[a.id] ?? 0) - (shuffleMap[b.id] ?? 0);
      }
      return a.orderIndex - b.orderIndex;
    });
  }, [videos, searchQuery, selectedCategory, favoritesOnly, favoriteIds, currentSort, shuffleMap]);

  // Group videos by category for standard row view
  const categorizedVideos = useMemo(() => {
    return CATEGORIES.filter((c) => c !== 'All').map((cat) => {
      const items = videos.filter((v) => v.category === cat);
      return {
        category: cat,
        videos: items,
      };
    });
  }, [videos]);

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setFavoritesOnly(false);
    setCurrentSort('default');
    if (routeState.route === 'category') {
      navigateToPublic();
    }
  };

  const handleOpenCookieSettings = () => {
    try {
      localStorage.removeItem('airwaves_cookie_consent_v1');
    } catch {
      // ignore
    }
    setCookieBannerKey((prev) => prev + 1);
  };

  // --- Station Dedicated Permalink Route View ---
  if (routeState.route === 'station') {
    const station = findStationBySlugOrId(videos, routeState.stationSlug || '');
    if (station) {
      return (
        <Suspense fallback={<div className="min-h-screen bg-surface-950 flex items-center justify-center text-slate-400 font-mono text-sm">Loading station...</div>}>
          <StationPermalinkPage
            video={station}
            allVideos={videos}
            isFavorite={isFavorite(station.id)}
            onToggleFavorite={toggleFavorite}
            onNavigateHome={navigateToPublic}
            onNavigateStation={navigateToStation}
            onSurpriseMe={handleSurpriseMe}
            reactionCount={getReactionCount(station.id)}
            hasReacted={hasReacted(station.id)}
            onAddReaction={addReaction}
            getReactionCount={getReactionCount}
            hasReactedForId={hasReacted}
            onRecordView={addRecentlyViewed}
            onReportBroken={reportBrokenLink}
            isBrokenReported={hasReportedBroken(station.id)}
          />
          <CookieBanner key={cookieBannerKey} onOpenPrivacy={navigateToPrivacy} />
        </Suspense>
      );
    }
    return (
      <Suspense fallback={<div className="min-h-screen bg-surface-950" />}>
        <NotFoundPage
          onBackToHome={navigateToPublic}
          onSearchFrom404={handleSearchFrom404}
          onSelectCategory={(cat) => navigateToCategory(cat as Category)}
        />
      </Suspense>
    );
  }

  // --- Privacy Policy Route View ---
  if (routeState.route === 'privacy') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-surface-950" />}>
        <PrivacyPolicyPage onBackToHome={navigateToPublic} />
        <CookieBanner key={cookieBannerKey} onOpenPrivacy={navigateToPrivacy} />
      </Suspense>
    );
  }

  // --- Terms of Service Route View ---
  if (routeState.route === 'terms') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-surface-950" />}>
        <TermsPage onBackToHome={navigateToPublic} />
        <CookieBanner key={cookieBannerKey} onOpenPrivacy={navigateToPrivacy} />
      </Suspense>
    );
  }

  // --- Thank-You Confirmation Route View ---
  if (routeState.route === 'thank_you') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-surface-950" />}>
        <ThankYouPage
          onBackToHome={navigateToPublic}
          onSurpriseMe={handleSurpriseMe}
          submissionType={routeState.submissionType}
          stationName={routeState.stationName}
        />
        <CookieBanner key={cookieBannerKey} onOpenPrivacy={navigateToPrivacy} />
      </Suspense>
    );
  }

  // --- 404 Route View ---
  if (routeState.route === 'not_found') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-surface-950" />}>
        <NotFoundPage
          onBackToHome={navigateToPublic}
          onSearchFrom404={handleSearchFrom404}
          onSelectCategory={(cat) => navigateToCategory(cat as Category)}
        />
      </Suspense>
    );
  }

  // --- Admin Route View ---
  if (routeState.route === 'admin') {
    if (!isAuthenticated) {
      return (
        <Suspense fallback={<div className="min-h-screen bg-surface-950 flex items-center justify-center text-slate-400 font-mono text-sm">Loading admin portal...</div>}>
          <AdminLogin
            onLogin={login}
            error={authError}
            loading={authLoading}
            onBackToPublic={navigateToPublic}
            isSupabaseConfigured={isSupabaseConfigured}
          />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<div className="min-h-screen bg-surface-950 flex items-center justify-center text-slate-400 font-mono text-sm">Loading admin dashboard...</div>}>
        <AdminDashboard
          videos={videos}
          submissions={submissions}
          isSupabaseConfigured={isSupabaseConfigured}
          onUpdateVideo={updateVideo}
          onDeleteVideo={deleteVideo}
          onAddVideo={addVideo}
          onReorderVideos={reorderVideos}
          onApproveSubmission={handleApproveSubmission}
          onRejectSubmission={(id) => updateSubmissionStatus(id, 'rejected')}
          onDeleteSubmission={deleteSubmission}
          onLogout={logout}
          onViewPublicSite={navigateToPublic}
        />
      </Suspense>
    );
  }

  // --- Public Single Playlist & Category Views ---
  return (
    <div className="min-h-screen flex flex-col bg-surface-900 text-slate-200 font-sans relative overflow-x-hidden">
      {/* Ambient Light Bloom Motion */}
      <AmbientBackground />

      {/* Sticky Header with Brand Logo and Controls */}
      <PlaylistHeader
        totalItems={videos.length}
        filteredItemsCount={processedVideos.length}
        favoritesCount={favoritesCount}
        favoritesOnly={favoritesOnly}
        onToggleFavoritesOnly={() => setFavoritesOnly((prev) => !prev)}
        selectedCategory={selectedCategory}
        onSelectCategory={navigateToCategory}
        currentSort={currentSort}
        onSelectSort={setCurrentSort}
        onShuffle={handleShuffle}
        onSurpriseMe={handleSurpriseMe}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenSuggest={() => setIsSuggestOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Hero Section with Search Bar, Category Chips, Spotlight Pick, and Above-the-fold CTA */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
        selectedCategory={selectedCategory}
        onSelectCategory={navigateToCategory}
        featuredVideos={featuredVideos}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        onSurpriseMe={handleSurpriseMe}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <OnboardingBanner totalStations={videos.length} />
        
        {/* Recently Viewed Strip (hidden if none) */}
        <RecentlyViewedSection
          recentlyViewedIds={recentlyViewedIds}
          videos={videos}
          onNavigateStation={navigateToStation}
          onClear={clearRecentlyViewed}
        />

        {/* Loading Skeleton State to eliminate blank flashes */}
        {videosLoading && videos.length === 0 ? (
          <div className="py-8">
            <div className="h-6 w-48 bg-surface-800 rounded-md mb-6 animate-pulse" />
            <VideoGridSkeleton count={8} />
          </div>
        ) : isFilteredGridView ? (
          /* VIEW 1: Filtered / Search / Sorted Flat Grid Mode */
          <div>
            {/* Filter Header Context Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-surface-700">
              <div>
                <h2 className="font-sans font-bold text-xl text-white">
                  {favoritesOnly
                    ? searchQuery
                      ? `Favorites matching "${searchQuery}"`
                      : 'My Saved Favorites'
                    : searchQuery
                    ? `Search results for "${searchQuery}"`
                    : selectedCategory !== 'All'
                    ? selectedCategory
                    : 'Filtered playlist'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Showing <span className="text-accent-400 font-bold font-mono">{processedVideos.length}</span> of {videos.length} feeds
                </p>
              </div>

              <button
                onClick={handleClearAllFilters}
                className="px-3.5 py-1.5 rounded-xl bg-surface-850 hover:bg-surface-800 text-slate-300 hover:text-white text-xs font-medium border border-surface-700 hover:border-surface-600 transition-colors self-start sm:self-auto cursor-pointer"
              >
                Reset to all channels
              </button>
            </div>

            {/* Grid of Results */}
            {processedVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                {processedVideos.map((video, idx) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    variant="grid"
                    priority={idx < 4}
                    isFavorite={isFavorite(video.id)}
                    onToggleFavorite={toggleFavorite}
                    onNavigatePermalink={navigateToStation}
                    reactionCount={getReactionCount(video.id)}
                    hasReacted={hasReacted(video.id)}
                    onAddReaction={addReaction}
                    onRecordView={addRecentlyViewed}
                    onReportBroken={reportBrokenLink}
                    isBrokenReported={hasReportedBroken(video.id)}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search / Filter State */
              <div className="max-w-md mx-auto py-16 px-4 text-center">
                {favoritesOnly && favoritesCount === 0 ? (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-accent-500/10 border border-accent-500/30 flex items-center justify-center mx-auto mb-4 text-accent-400 shadow-md">
                      <Heart className="w-7 h-7 fill-accent-500 text-accent-500" />
                    </div>
                    <h2 className="font-sans font-bold text-xl text-white">
                      No favorite stations saved yet
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed max-w-sm mx-auto">
                      Click the heart (<span className="text-accent-400 font-bold">♥</span>) on any station card or permalink page to pin your favorite soundscapes. Saved privately in your browser without requiring an account.
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-3">
                      <button
                        onClick={() => setFavoritesOnly(false)}
                        className="px-4 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-400 text-surface-950 text-xs font-bold transition-all cursor-pointer shadow-md hover:shadow-accent-500/20"
                      >
                        Explore 70 stations
                      </button>
                      <button
                        onClick={handleSurpriseMe}
                        className="px-4 py-2.5 rounded-xl bg-surface-850 hover:bg-surface-800 text-slate-200 hover:text-white border border-surface-700 hover:border-surface-600 text-xs font-medium transition-all cursor-pointer"
                      >
                        🎲 Surprise me
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-surface-850 border border-surface-700 flex items-center justify-center mx-auto mb-4 text-accent-500 shadow-md">
                      <SearchX className="w-7 h-7 text-accent-400" />
                    </div>
                    <h2 className="font-sans font-bold text-xl text-white">
                      {searchQuery
                        ? `No stations match "${searchQuery}"`
                        : `No stations found for this filter`}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed max-w-sm mx-auto">
                      {searchQuery
                        ? `We couldn't find any audio channels matching "${searchQuery}". Try a different term, reset filters, or suggest a new station to our catalog.`
                        : `Try clearing active filters or selecting another category to browse all 70 hand-picked streams.`}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={handleClearAllFilters}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-400 text-surface-950 text-xs font-bold transition-all cursor-pointer shadow-md hover:shadow-accent-500/20"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Clear search & view all</span>
                      </button>
                      <button
                        onClick={handleSurpriseMe}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-850 hover:bg-surface-800 text-slate-200 hover:text-white border border-surface-700 hover:border-surface-600 text-xs font-medium transition-all cursor-pointer"
                      >
                        <span>🎲 Surprise me</span>
                      </button>
                      <button
                        onClick={() => setIsSuggestOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-850 hover:bg-surface-800 text-accent-400 hover:text-accent-300 border border-surface-700 hover:border-surface-600 text-xs font-medium transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Suggest a station</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          /* VIEW 2: Default Row-Based Category Browsing */
          <div className="space-y-10 sm:space-y-14">
            {/* Personalized Recommendations for Signed-In Listeners */}
            {signedInUser && (
              <RecommendedSection
                videos={recommendedVideos}
                isPersonalized={isPersonalized}
                topCategoryName={topCategoryName}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                onNavigatePermalink={navigateToStation}
                getReactionCount={getReactionCount}
                hasReacted={hasReacted}
                onAddReaction={addReaction}
                onRecordView={addRecentlyViewed}
                onReportBroken={reportBrokenLink}
                hasReportedBroken={hasReportedBroken}
              />
            )}

            {categorizedVideos.map(({ category, videos: catVideos }, idx) => (
              <CategoryRow
                key={category}
                category={category}
                videos={catVideos}
                isFirstRow={idx === 0}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                onViewAllCategory={navigateToCategory}
                onNavigatePermalink={navigateToStation}
                getReactionCount={getReactionCount}
                hasReacted={hasReacted}
                onAddReaction={addReaction}
                onRecordView={addRecentlyViewed}
                onReportBroken={reportBrokenLink}
                hasReportedBroken={hasReportedBroken}
              />
            ))}
          </div>
        )}
      </main>

      {/* Monthly Newsletter Dispatch Section */}
      <NewsletterSection
        onNavigateThankYou={() => navigateToThankYou('newsletter')}
      />

      {/* GitHub Open Source & Early Access Star CTA */}
      <StarCTA />

      {/* Admin-Configurable "Support Me" QR Section */}
      <SupportSection
        settings={siteSettings}
        isActive={isSupportActive}
      />

      {/* Expandable FAQs Section */}
      <FaqSection />

      {/* Honest & Transparent Site Footer */}
      <SiteFooter
        totalVideos={videos.length}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenSuggest={() => setIsSuggestOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onNavigatePrivacy={navigateToPrivacy}
        onNavigateTerms={navigateToTerms}
        onSelectCategory={navigateToCategory}
        onOpenCookieSettings={handleOpenCookieSettings}
      />

      {/* Persistent but Dismissible Sticky Mobile CTA */}
      <StickyMobileCTA
        onSurpriseMe={handleSurpriseMe}
        onExplore={navigateToPublic}
      />

      {/* GDPR-Friendly Consent-Gated Cookie Banner */}
      <CookieBanner
        key={cookieBannerKey}
        onOpenPrivacy={navigateToPrivacy}
      />

      {/* Floating Back to Top Button */}
      <BackToTopButton />

      {/* Curation & About Modal */}
      {isAboutOpen && (
        <Suspense fallback={null}>
          <AboutModal
            isOpen={isAboutOpen}
            onClose={() => setIsAboutOpen(false)}
          />
        </Suspense>
      )}

      {/* Suggest Station Modal with Accessible Field Errors & Thank-You flow */}
      {isSuggestOpen && (
        <Suspense fallback={null}>
          <SuggestStationModal
            isOpen={isSuggestOpen}
            onClose={() => setIsSuggestOpen(false)}
            onSubmitStation={submitStation}
            onNavigateThankYou={(name) => navigateToThankYou('submission', name)}
          />
        </Suspense>
      )}

      {/* Keyboard Shortcuts Guide Modal */}
      {isShortcutsOpen && (
        <Suspense fallback={null}>
          <ShortcutsModal
            isOpen={isShortcutsOpen}
            onClose={() => setIsShortcutsOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
