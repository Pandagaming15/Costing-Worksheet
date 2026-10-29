import React, { useState } from 'react';
import { Smartphone, ExternalLink, X } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { redirectToGitHubReleases } from '../utils/githubRelease';
import { ColorTheme } from '../utils/themeColors';

interface VercelApkBannerProps {
  onOpenModal: () => void;
  onShowToast: (msg: string) => void;
  themeColor: ColorTheme;
}

const DISMISS_KEY = 'food_costing_apk_banner_dismissed_v1';

export const VercelApkBanner: React.FC<VercelApkBannerProps> = ({
  onOpenModal,
  onShowToast,
  themeColor,
}) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === 'true';
    } catch {
      return false;
    }
  });

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, 'true');
    } catch {
      // Ignore
    }
  };

  return (
    <div className={`relative mb-3 overflow-hidden rounded-2xl bg-gradient-to-r ${themeColor.gradientFrom} ${themeColor.gradientTo} text-white shadow-md transition-all`}>
      {/* Decorative background glow */}
      <div className="absolute -right-6 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

      <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
            <Smartphone className="w-5 h-5 text-yellow-300" />
          </div>
          <div className="min-w-0 pr-6 sm:pr-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm tracking-tight">
                Android APK Available on GitHub
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30">
                <GithubIcon className="w-2.5 h-2.5" />
                Releases
              </span>
            </div>
            <p className="text-xs text-white/90 leading-tight mt-0.5">
              Deployed on Vercel? You can install the standalone offline Android APK directly from GitHub Releases.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end">
          <button
            type="button"
            onClick={onOpenModal}
            className="px-2.5 py-1.5 text-xs font-semibold text-white/90 hover:text-white hover:bg-white/15 rounded-xl transition cursor-pointer"
          >
            Instructions
          </button>

          <button
            type="button"
            onClick={() => redirectToGitHubReleases(onShowToast)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-green-950 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>Redirect to Releases</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-90" />
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/15 rounded-lg transition cursor-pointer ml-1 sm:ml-0"
            title="Dismiss banner for this session"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
