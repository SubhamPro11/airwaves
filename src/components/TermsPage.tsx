import { ArrowLeft, FileText, ShieldAlert, Radio, HelpCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { AmbientBackground } from './AmbientBackground';
import { usePageMeta } from '../hooks/usePageMeta';

interface TermsPageProps {
  onBackToHome: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBackToHome }) => {
  usePageMeta({
    title: 'Terms of Service · Airwaves Web Radio',
    description: 'Usage rules, third-party audio content disclaimers, and curation rights for the Airwaves web radio and soundscape showcase.',
    canonicalPath: '/terms',
  });

  return (
    <div className="min-h-screen flex flex-col bg-surface-900 text-slate-200 font-sans relative overflow-x-hidden">
      <AmbientBackground />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-surface-900/95 backdrop-blur-md border-b border-surface-700 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div onClick={onBackToHome} className="cursor-pointer">
            <BrandLogo />
          </div>
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-850 hover:bg-surface-800 text-slate-300 hover:text-white border border-surface-700 hover:border-surface-600 text-xs font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to directory</span>
          </button>
        </div>
      </header>

      {/* Main Legal Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-xs font-mono mb-4">
          <FileText className="w-3.5 h-3.5" />
          <span>Legal &amp; Usage</span>
        </div>

        <h1 className="font-sans font-black text-3xl sm:text-4xl text-white tracking-tight">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-mono mt-2 mb-8">
          Last updated: September 2026 · Governing use of the Airwaves web directory
        </p>

        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-300">
          {/* Section 1 */}
          <section className="bg-surface-850 border border-surface-700 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Radio className="w-5 h-5 text-accent-400" />
              <span>1. Curated Directory Model</span>
            </h2>
            <p className="text-slate-300 mb-3">
              Airwaves is a human-curated educational index and directory pointing to independent web radio feeds, audio projects, highway mixtapes, and regional soundscapes.
            </p>
            <p className="text-slate-400 text-sm">
              We provide direct outbound links for listeners to discover audio creators in their native web browsers. Airwaves does not alter, re-encode, or monetize the original broadcasts.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-surface-850 border border-surface-700 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-accent-400" />
              <span>2. Content Disclaimer &amp; Third-Party Rights</span>
            </h2>
            <p className="text-slate-300 mb-3">
              - <strong>No audio is hosted on our servers:</strong> All audio streams, broadcasts, podcasts, and recordings linked in the Airwaves directory reside on their respective external hosts. Airwaves maintains zero server-side audio storage.<br />
              - <strong>Intellectual property:</strong> All trademarks, station identities, logos, audio streams, and broadcast artworks remain the exclusive property of their respective creators and stations.<br />
              - <strong>Takedown &amp; Removal requests:</strong> If you are the owner or authorized representative of any linked stream and wish to update metadata, replace an image, or remove your link, please contact us immediately at{' '}
              <a href="mailto:contact@airwaves.dpdns.org" className="text-accent-400 underline underline-offset-4">
                contact@airwaves.dpdns.org
              </a>. All legitimate removal requests are honored promptly within 24–48 hours without friction.
            </p>
          </section>

          {/* Section 3 */}
          <section className="bg-surface-850 border border-surface-700 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-accent-400" />
              <span>3. Permitted Use &amp; Limitations of Liability</span>
            </h2>
            <p className="text-slate-300 mb-3">
              Airwaves is provided on an "as-is" and "as-available" basis. While we make reasonable efforts to verify streaming health and uptime, we make no warranties regarding uninterrupted stream availability or external server stability.
            </p>
            <p className="text-slate-400 text-sm">
              In no event shall the Airwaves curators, contributors, or developers be liable for any indirect, incidental, or consequential damages arising out of the use or inability to access external third-party streams.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-surface-850 border border-surface-700 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-3">
              4. Open-Source Contributions
            </h2>
            <p className="text-slate-300 mb-3">
              The Airwaves web interface code is open source under the MIT License. Contributions, station additions, and improvements can be submitted via GitHub pull requests.
            </p>
            <p className="text-slate-400 text-sm">
              Questions or notices may be sent to{' '}
              <a href="mailto:contact@airwaves.dpdns.org" className="text-accent-400 underline underline-offset-4">
                contact@airwaves.dpdns.org
              </a>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-700 bg-surface-950 py-6 px-4 text-center text-xs text-slate-500 font-mono">
        Airwaves · Curated Independent Audio &amp; Web Radio · contact@airwaves.dpdns.org
      </footer>
    </div>
  );
};
