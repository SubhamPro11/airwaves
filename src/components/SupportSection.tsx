import React, { useState } from 'react';
import { Heart, Copy, Check } from 'lucide-react';
import { SiteSettings } from '../types/settings';

interface SupportSectionProps {
  settings: SiteSettings;
  isActive: boolean;
}

export const SupportSection: React.FC<SupportSectionProps> = ({
  settings,
  isActive,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Return null if section is disabled, no QR URL is configured, or image failed to load
  if (!isActive || !settings.supportQrUrl || !settings.supportQrUrl.trim() || imgError) {
    return null;
  }

  const handleCopyUpi = () => {
    if (!settings.supportUpiId) return;
    navigator.clipboard.writeText(settings.supportUpiId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <section
      aria-label="Support the Curator"
      className="max-w-4xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16"
    >
      <div className="relative overflow-hidden rounded-2xl bg-surface-850 border border-surface-700/80 p-6 sm:p-8 shadow-xl">
        {/* Subtle ambient amber background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          {/* QR Code Container */}
          <div className="relative group shrink-0">
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-white p-2.5 shadow-lg border border-surface-700/60 flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-[1.02]">
              <img
                src={settings.supportQrUrl}
                alt={`${settings.supportTitle || 'Curator Support'} QR Code`}
                width={144}
                height={144}
                onError={() => setImgError(true)}
                className="w-full h-full object-contain select-none"
                loading="lazy"
                decoding="async"
              />
            </div>
            <span className="block text-[10px] text-center font-mono text-slate-400 mt-2">
              Scan with any UPI / Pay app
            </span>
          </div>

          {/* Text Information & Optional UPI Handle */}
          <div className="flex-1 text-center sm:text-left flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-[11px] font-mono font-medium tracking-wide uppercase self-center sm:self-start mb-2.5">
              <Heart className="w-3 h-3 fill-accent-500 text-accent-500" />
              <span>Independent &amp; Ad-Free</span>
            </div>

            <h2 className="font-sans font-bold text-lg sm:text-xl text-white tracking-tight">
              {settings.supportTitle || 'Support the Curator'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-xl">
              {settings.supportMessage}
            </p>

            {settings.supportUpiId && (
              <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-900 border border-surface-700 font-mono text-xs text-slate-300 shadow-xs">
                  <span className="text-slate-500 select-none">UPI:</span>
                  <span className="text-accent-300 font-semibold select-all">
                    {settings.supportUpiId}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyUpi}
                  title="Copy UPI ID"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-surface-800 hover:bg-surface-750 text-slate-300 hover:text-white border border-surface-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
