import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User as UserIcon, CheckCircle2 } from 'lucide-react';
import { useUserAuth } from '../hooks/useUserAuth';

export const UserAuthControl: React.FC = () => {
  const { user, loading, signInWithGoogle, signOut } = useUserAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-xl bg-surface-850 border border-surface-700 animate-pulse" />
    );
  }

  // --- SIGNED-IN STATE ---
  if (user) {
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Listener';
    const firstName = fullName.split(' ')[0];

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-surface-850 hover:bg-surface-800 border border-surface-700 hover:border-surface-600 transition-all cursor-pointer group"
          title={`Signed in as ${fullName}`}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`Listener profile avatar for ${fullName}`}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-accent-500/40"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-accent-500/20 text-accent-400 flex items-center justify-center text-[10px] font-bold">
              {firstName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-xs font-medium text-slate-200 group-hover:text-white max-w-[80px] sm:max-w-[110px] truncate">
            {firstName}
          </span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-surface-900 border border-surface-700 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center gap-3 pb-3 border-b border-surface-800">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`Profile picture for ${fullName}`}
                  className="w-9 h-9 rounded-full ring-2 ring-accent-500/40 object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-accent-500/20 text-accent-400 flex items-center justify-center font-bold text-sm">
                  {firstName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{fullName}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>

            <div className="py-2.5">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Signed in with Google</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Thank you for supporting Airwaves! Recommendations are tuned to your favorite listening habits.
              </p>
            </div>

            <div className="pt-2 border-t border-surface-800">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- SIGNED-OUT STATE ---
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-surface-850 hover:bg-surface-800 border border-surface-700 hover:border-accent-500/50 transition-all cursor-pointer group shadow-xs"
        title="Sign in with Google (Optional)"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.56 0 2.96.54 4.07 1.59l3.05-3.05C17.27 1.83 14.82 1 12 1 7.39 1 3.49 3.66 1.63 7.54l3.66 2.84C6.17 7.38 8.84 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.17-2 3.71-4.96 3.71-8.7z"
          />
          <path
            fill="#FBBC05"
            d="M5.29 14.62c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26L1.63 7.54C.59 9.61 0 11.95 0 14.62c0 2.67.59 5.01 1.63 7.08l3.66-2.84z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.07.72-2.44 1.16-4.22 1.16-3.16 0-5.83-2.38-6.71-5.38L1.63 15.82C3.49 19.7 7.39 23 12 23z"
          />
        </svg>
        <span className="hidden sm:inline">Sign in</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-surface-900 border border-surface-700 shadow-2xl p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent-500/10 border border-accent-500/30 flex items-center justify-center text-accent-400">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Sign in to Airwaves</h4>
              <span className="text-[10px] text-accent-400 font-medium">100% Optional</span>
            </div>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed bg-surface-850 p-3 rounded-xl border border-surface-750 mb-4">
            You can also use the website without signing in — but signing in motivates the developer to keep improving it.
          </p>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              signInWithGoogle();
            }}
            className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-surface-950 text-xs font-bold transition-all cursor-pointer shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.56 0 2.96.54 4.07 1.59l3.05-3.05C17.27 1.83 14.82 1 12 1 7.39 1 3.49 3.66 1.63 7.54l3.66 2.84C6.17 7.38 8.84 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.17-2 3.71-4.96 3.71-8.7z"
              />
              <path
                fill="#FBBC05"
                d="M5.29 14.62c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26L1.63 7.54C.59 9.61 0 11.95 0 14.62c0 2.67.59 5.01 1.63 7.08l3.66-2.84z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.07.72-2.44 1.16-4.22 1.16-3.16 0-5.83-2.38-6.71-5.38L1.63 15.82C3.49 19.7 7.39 23 12 23z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      )}
    </div>
  );
};
