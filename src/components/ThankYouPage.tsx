import { CheckCircle2, ArrowLeft, Home, Star } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { AmbientBackground } from './AmbientBackground';
import { usePageMeta } from '../hooks/usePageMeta';

const REPO_URL = 'https://github.com/SubhamPro11/airwaves';

interface ThankYouPageProps {
  onBackToHome: () => void;
  onSurpriseMe?: () => void;
  submissionType?: string;
  stationName?: string;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({
  onBackToHome,
  onSurpriseMe,
  submissionType,
  stationName,
}) => {
  usePageMeta({
    title: 'Thank You · Airwaves Radio',
    description: 'Submission confirmed. Thank you for contributing to the Airwaves curated web radio and soundscapes directory.',
    canonicalPath: '/thank-you',
  });

  const isNewsletter = submissionType === 'newsletter';
  const isContact = submissionType === 'contact';

  const heading = isNewsletter
    ? 'Subscribed to Monthly Dispatch'
    : isContact
    ? 'Message Received'
    : 'Station Suggested for Curation';

  const description = isNewsletter
    ? "You're all set! On the 1st of every month, we'll send a quiet dispatch highlighting newly discovered ambient streams, independent web radios, and community gems."
    : isContact
    ? 'Thank you for reaching out. We review community messages regularly and will get back to you soon.'
    : stationName
    ? `Thank you for suggesting "${stationName}". Our team tests each feed for streaming stability, HTTPS compliance, and curation alignment within 48-72 hours.`
    : 'Thank you for submitting a new audio project. We hand-test each stream for sound quality, uptime, and honest web principles within 48-72 hours.';

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

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center justify-center text-center">
        {/* Animated Badge Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl mb-6">
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
        </div>

        {/* Badge */}
        <span className="inline-flex items-center px-3 py-1 rounded-md bg-accent-500/10 border border-accent-500/30 text-accent-400 font-mono text-xs font-bold uppercase tracking-wider mb-4">
          Confirmation · Action Received
        </span>

        <h1 className="font-sans font-bold text-2xl sm:text-4xl text-white tracking-tight">
          {heading}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 mt-3 sm:mt-4 leading-relaxed max-w-lg">
          {description}
        </p>

        {/* Steps Box */}
        <div className="w-full max-w-md mt-8 p-4 rounded-xl bg-surface-850 border border-surface-700 text-left text-xs text-slate-300 space-y-2">
          <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px] font-mono text-accent-400">
            What happens next
          </div>
          <p className="leading-relaxed text-slate-400">
            1. All catalog entries are 100% human-verified with zero automated scraping.
          </p>
          <p className="leading-relaxed text-slate-400">
            2. Approved links are permanently pinned with high-res broadcast artwork.
          </p>
          <p className="leading-relaxed text-slate-400">
            3. You can track open changes directly on our public GitHub repository.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
          <button
            type="button"
            onClick={onBackToHome}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-400 text-surface-950 font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to directory</span>
          </button>

          {onSurpriseMe && (
            <button
              type="button"
              onClick={onSurpriseMe}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface-850 hover:bg-surface-800 text-slate-200 border border-surface-700 text-xs font-medium transition-all cursor-pointer"
            >
              <span>🎲 Surprise me</span>
            </button>
          )}

          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface-850 hover:bg-surface-800 text-accent-400 border border-surface-700 text-xs font-medium transition-all cursor-pointer"
          >
            <Star className="w-3.5 h-3.5" />
            <span>Star on GitHub</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-700 bg-surface-950 py-6 px-4 text-center text-xs text-slate-500 font-mono">
        Airwaves · Curated Independent Audio &amp; Web Radio
      </footer>
    </div>
  );
};
