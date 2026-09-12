import React from 'react';
import { ArrowLeft, Shield, Lock, EyeOff, Server, Mail } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { AmbientBackground } from './AmbientBackground';
import { usePageMeta } from '../hooks/usePageMeta';

interface PrivacyPolicyPageProps {
  onBackToHome: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBackToHome }) => {
  usePageMeta({
    title: 'Privacy Policy · Airwaves Web Radio',
    description: 'Learn how Airwaves respects your privacy with zero ad tracking, local storage favorites, and consent-gated minimal analytics.',
    canonicalPath: '/privacy',
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
          <Shield className="w-3.5 h-3.5" />
          <span>Trust &amp; Transparency</span>
        </div>

        <h1 className="font-sans font-black text-3xl sm:text-4xl text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-mono mt-2 mb-8">
          Last updated: September 2026 · Effective immediately for all visitors
        </p>

        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-300">
          {/* Section 1 */}
          <section className="bg-surface-850 border border-surface-700 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-accent-400" />
              <span>1. Honest Web &amp; Zero-Surveillance Promise</span>
            </h2>
            <p className="text-slate-300 mb-3">
              Airwaves is built on honest web principles. We do not run third-party advertising networks, data brokers, or cross-site fingerprinting scripts. We believe listening to independent radio and soundscapes should remain a peaceful, private sanctuary.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-surface-850 border border-surface-700 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-accent-400" />
              <span>2. Local Storage Usage</span>
            </h2>
            <p className="text-slate-300 mb-3">
              We store preferences locally in your browser (HTML5 LocalStorage) so you don't need to create an account:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400 text-sm">
              <li><strong>Saved Favorites:</strong> Your pinned stations are saved in your browser storage and never uploaded to our servers unless you explicitly sign in.</li>
              <li><strong>Theme Preference:</strong> Dark/light mode preference.</li>
              <li><strong>Recently Viewed:</strong> The list of recently previewed stations.</li>
              <li><strong>Cookie &amp; Notice Dismissals:</strong> Whether you accepted or dismissed informational banners.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-surface-850 border border-surface-700 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Server className="w-5 h-5 text-accent-400" />
              <span>3. Analytics &amp; Cookies</span>
            </h2>
            <p className="text-slate-300 mb-3">
              We use lightweight, privacy-focused analytics (such as Cloudflare Web Analytics) exclusively to understand aggregate traffic numbers (e.g. total listeners, popular categories).
            </p>
            <p className="text-slate-400 text-sm mb-3">
              - <strong>No tracking cookies:</strong> Analytics scripts do not place persistent tracking cookies or collect personal identifiers.<br />
              - <strong>Consent-Gated:</strong> Analytics scripts are only initialized if you consent via the Cookie banner. If you choose "Decline", no analytics beacons are loaded.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-surface-850 border border-surface-700 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-accent-400" />
              <span>4. Submissions &amp; Communications</span>
            </h2>
            <p className="text-slate-300 mb-3">
              - <strong>Station Suggestions:</strong> When you suggest an audio project, we record the suggested project name, URL, and category for editorial evaluation.<br />
              - <strong>Monthly Dispatch Newsletter:</strong> If you voluntarily join our dispatch, your email is stored securely solely for receiving quiet monthly updates. We will never sell, rent, or spam your address. Every dispatch includes a 1-click unsubscribe option.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-surface-850 border border-surface-700 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-3">
              5. Contact &amp; Data Rights
            </h2>
            <p className="text-slate-300 mb-3">
              Under GDPR, CCPA, and worldwide privacy regulations, you have the right to request deletion or review of any data voluntarily submitted to us.
            </p>
            <p className="text-slate-400 text-sm">
              For any privacy inquiries, reach our curation team directly at{' '}
              <a href="mailto:contact@airwaves.dpdns.org" className="text-accent-400 underline underline-offset-4">
                contact@airwaves.dpdns.org
              </a>{' '}
              or submit an issue on our public repository at{' '}
              <a href="https://github.com/SubhamPro11/airwaves" target="_blank" rel="noopener noreferrer" className="text-accent-400 underline underline-offset-4">
                github.com/SubhamPro11/airwaves
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
