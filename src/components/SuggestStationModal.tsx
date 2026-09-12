import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Radio } from 'lucide-react';
import { CATEGORIES } from '../data/playlist';
import { useToast } from './Toast';

interface SuggestStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitStation: (
    name: string,
    url: string,
    category: string,
    notes?: string,
    honeypot?: string
  ) => Promise<{ success: boolean; message: string }>;
  onNavigateThankYou?: (stationName: string) => void;
}

export const SuggestStationModal: React.FC<SuggestStationModalProps> = ({
  isOpen,
  onClose,
  onSubmitStation,
  onNavigateThankYou,
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<string>('Radio & mixtapes');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const { showToast } = useToast();
  
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; url?: string }>({});

  const realCategories = CATEGORIES.filter((c) => c !== 'All');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      setFeedback(null);
      setFieldErrors({});
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // Field-level validations
    const errors: { name?: string; url?: string } = {};
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();

    if (!trimmedName) {
      errors.name = 'Please enter a station or audio project name.';
    }

    if (!trimmedUrl) {
      errors.url = 'Please enter the direct stream or website URL.';
    } else if (!/^https?:\/\//i.test(trimmedUrl)) {
      errors.url = 'URL must begin with https:// or http://';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    setFeedback(null);

    const result = await onSubmitStation(trimmedName, trimmedUrl, category, notes, honeypot);
    setSubmitting(false);

    if (result.success) {
      setFeedback({ type: 'success', message: result.message });
      showToast('Station submitted for review! Thank you.');
      setName('');
      setUrl('');
      setNotes('');
      setHoneypot('');

      if (onNavigateThankYou) {
        setTimeout(() => {
          onClose();
          onNavigateThankYou(trimmedName);
        }, 600);
      }
    } else {
      setFeedback({ type: 'error', message: result.message });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="suggest-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-surface-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-surface-900 border border-surface-700 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 text-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close suggest modal"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-surface-800 border border-surface-700 flex items-center justify-center text-accent-500 shadow-sm">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 id="suggest-modal-title" className="font-sans font-bold text-xl sm:text-2xl text-white">
              Suggest a Station
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Recommend an independent web radio or soundscape project
            </p>
          </div>
        </div>

        {/* Success / Error Feedback Banner */}
        {feedback && (
          <div
            role="alert"
            className={`p-3.5 rounded-xl text-xs mb-5 flex items-start gap-2.5 border ${
              feedback.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                : 'bg-rose-950/40 border-rose-800 text-rose-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            )}
            <div className="flex-1 leading-relaxed">{feedback.message}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Invisible Bot Honeypot */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website_verification">Leave this field blank</label>
            <input
              type="text"
              id="website_verification"
              name="website_verification"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Station Name */}
          <div>
            <label htmlFor="suggest-station-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Station or Project Name <span className="text-accent-500">*</span>
            </label>
            <input
              id="suggest-station-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
              }}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'station-name-error' : undefined}
              placeholder="e.g. Saloon WTF Radio"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-850 border text-white placeholder:text-slate-500 text-xs sm:text-sm transition-colors ${
                fieldErrors.name
                  ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
                  : 'border-surface-700 focus:border-accent-500 focus:outline-none'
              }`}
            />
            {fieldErrors.name && (
              <p id="station-name-error" role="alert" className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.name}</span>
              </p>
            )}
          </div>

          {/* External URL */}
          <div>
            <label htmlFor="suggest-station-url" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Live Web Stream / Site URL <span className="text-accent-500">*</span>
            </label>
            <input
              id="suggest-station-url"
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (fieldErrors.url) setFieldErrors((prev) => ({ ...prev, url: undefined }));
              }}
              aria-invalid={Boolean(fieldErrors.url)}
              aria-describedby={fieldErrors.url ? 'station-url-error' : undefined}
              placeholder="https://saloon.wtf"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-850 border text-white placeholder:text-slate-500 text-xs sm:text-sm font-mono transition-colors ${
                fieldErrors.url
                  ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
                  : 'border-surface-700 focus:border-accent-500 focus:outline-none'
              }`}
            />
            {fieldErrors.url && (
              <p id="station-url-error" role="alert" className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.url}</span>
              </p>
            )}
          </div>

          {/* Suggested Category */}
          <div>
            <label htmlFor="suggest-station-category" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Primary Channel / Genre
            </label>
            <select
              id="suggest-station-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-850 border border-surface-700 focus:border-accent-500 focus:outline-none text-white text-xs sm:text-sm cursor-pointer"
            >
              {realCategories.map((cat) => (
                <option key={cat} value={cat} className="bg-surface-900 text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Submitter Notes */}
          <div>
            <label htmlFor="suggest-station-notes" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Why should this be added? (Optional note)
            </label>
            <textarea
              id="suggest-station-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Brief context, creator name, or audio vibe..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-850 border border-surface-700 focus:border-accent-500 focus:outline-none text-white placeholder:text-slate-500 text-xs sm:text-sm resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-surface-850 hover:bg-surface-800 text-slate-300 text-xs font-medium border border-surface-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-400 disabled:opacity-50 text-surface-950 font-bold text-xs transition-all shadow-md cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit Proposal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
