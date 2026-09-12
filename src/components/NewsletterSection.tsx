import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useNewsletter } from '../hooks/useNewsletter';
import { useToast } from './Toast';

interface NewsletterSectionProps {
  onNavigateThankYou?: () => void;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ onNavigateThankYou }) => {
  const { isSubscribed, loading, error, subscribe } = useNewsletter();
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setFieldError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setFieldError('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setFieldError('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    const res = await subscribe(trimmed, honeypot);
    if (res.success) {
      setFeedback(res.message);
      showToast('Subscribed to Monthly Dispatch!');
      setEmail('');
    } else {
      setFeedback(res.message);
      setFieldError(res.message || 'Subscription failed');
      showToast(res.message || 'Subscription failed', 'error');
    }
  };

  return (
    <section aria-label="Newsletter signup" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-surface-850/90 to-surface-900 border border-surface-700/80 p-6 sm:p-8 lg:p-10 shadow-xl">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Column: Heading & Privacy Promise */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-xs font-mono mb-3">
              <Mail className="w-3.5 h-3.5" />
              <span>Monthly Dispatch</span>
            </div>
            
            <h2 className="font-sans font-bold text-xl sm:text-2xl text-white tracking-tight">
              Quiet updates in your inbox.
            </h2>
            
            <p className="text-sm text-slate-400 mt-2 leading-relaxed max-w-xl">
              Receive a monthly digest of newly curated ambient streams, community-suggested radio stations, and quiet sound experiments. 
            </p>

            <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero ads • Zero trackers • One-click unsubscribe anytime</span>
            </div>
          </div>

          {/* Right Column: Interactive Form or Subscribed State */}
          <div className="lg:col-span-5">
            {isSubscribed ? (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-950/80 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-sans font-semibold text-sm text-white">
                    You're on the list
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {feedback || 'Thank you for joining the Airwaves Monthly Dispatch. We will send the next edition on the 1st.'}
                  </p>
                  {onNavigateThankYou && (
                    <button
                      type="button"
                      onClick={onNavigateThankYou}
                      className="mt-2 text-xs text-accent-400 hover:text-accent-300 underline underline-offset-4 cursor-pointer"
                    >
                      View confirmation page &rarr;
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-2.5">
                {/* Anti-Bot Honeypot Field */}
                <input
                  type="text"
                  name="website_hp"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                />

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      placeholder="your.email@domain.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldError) setFieldError(null);
                      }}
                      aria-invalid={Boolean(fieldError)}
                      aria-describedby={fieldError ? 'newsletter-email-error' : undefined}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-950 border text-sm text-slate-100 placeholder-slate-500 transition-all font-sans ${
                        fieldError
                          ? 'border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                          : 'border-surface-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500'
                      }`}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-400 text-surface-950 font-sans text-xs font-bold transition-all cursor-pointer shadow-md hover:shadow-accent-500/20 shrink-0 disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Joining...</span>
                    ) : (
                      <>
                        <span>Join</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {fieldError && (
                  <p id="newsletter-email-error" role="alert" className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldError}</span>
                  </p>
                )}

                {error && !fieldError && (
                  <p role="alert" className="text-xs text-rose-400 font-mono mt-1">
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
