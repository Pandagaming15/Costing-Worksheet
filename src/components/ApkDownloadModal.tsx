import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  ExternalLink,
  Copy,
  Check,
  X,
  PackageCheck,
  ShieldCheck,
  RotateCcw,
  Share2,
  Globe,
  ArrowRight,
  Info,
} from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import {
  DEFAULT_GITHUB_REPO,
  GITHUB_REPO_STORAGE_KEY,
  getGitHubRepoUrl,
  getGitHubReleasesUrl,
  getGitHubLatestReleaseUrl,
  redirectToGitHubReleases,
  redirectToGitHubLatest,
} from '../utils/githubRelease';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [repoUrl, setRepoUrl] = useState<string>(() => getGitHubRepoUrl());
  const [copied, setCopied] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [editUrl, setEditUrl] = useState(repoUrl);

  if (!isOpen) return null;

  const releasesUrl = getGitHubReleasesUrl();
  const latestReleaseUrl = getGitHubLatestReleaseUrl();

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(releasesUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = releasesUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      onShowToast('GitHub Releases link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onShowToast('Failed to copy link');
    }
  };

  const handleSaveCustomRepo = () => {
    let formatted = editUrl.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = 'https://' + formatted;
    }
    setRepoUrl(formatted);
    try {
      localStorage.setItem(GITHUB_REPO_STORAGE_KEY, formatted);
      onShowToast('GitHub repository URL updated');
    } catch {
      // Ignore
    }
    setShowConfig(false);
  };

  const handleResetRepo = () => {
    setEditUrl(DEFAULT_GITHUB_REPO);
    setRepoUrl(DEFAULT_GITHUB_REPO);
    try {
      localStorage.removeItem(GITHUB_REPO_STORAGE_KEY);
      onShowToast(`Reset to default: ${DEFAULT_GITHUB_REPO}`);
    } catch {
      // Ignore
    }
    setShowConfig(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-auto transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                  Download Android APK
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  <GithubIcon className="w-2.5 h-2.5" />
                  GitHub Releases
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Install the standalone Android application for 100% offline access
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="py-4 space-y-4">
          {/* Vercel Web Deployment Note */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-blue-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5 shadow-xs">
              <Globe className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <p className="font-bold text-slate-900 dark:text-slate-100">
                Web App Deployed on Vercel
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                You are currently viewing the live web version. You can redirect to GitHub anytime to download the compiled Android APK package from the project releases.
              </p>
            </div>
          </div>

          {/* Target Repo & Primary Direct Redirect Actions */}
          <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-medium flex items-center gap-1.5">
                <GithubIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                Target GitHub Repository
              </span>
              <button
                type="button"
                onClick={() => {
                  setEditUrl(repoUrl);
                  setShowConfig(!showConfig);
                }}
                className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                {showConfig ? 'Hide Settings' : 'Change Repo'}
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 break-all font-mono text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="truncate">{releasesUrl}</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="shrink-0 p-1 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                title="Copy Releases Link"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Custom Repo Settings Form */}
            {showConfig && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Custom Repository URL:
                </label>
                <input
                  type="text"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  placeholder="https://github.com/Pandagaming15/costing"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleResetRepo}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset to Default
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCustomRepo}
                    className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-xs hover:bg-emerald-700 transition cursor-pointer"
                  >
                    Save URL
                  </button>
                </div>
              </div>
            )}

            {/* Direct Redirect Action Buttons */}
            <div className="space-y-2 mt-4">
              {/* PRIMARY REDIRECT BUTTON */}
              <button
                type="button"
                onClick={() => {
                  redirectToGitHubReleases(onShowToast);
                }}
                className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer"
              >
                <Download className="w-5 h-5 animate-bounce" />
                <span>Redirect to GitHub Releases (Download APK)</span>
                <ExternalLink className="w-4 h-4 opacity-90" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  title={`Direct link: ${latestReleaseUrl}`}
                  onClick={() => {
                    redirectToGitHubLatest(onShowToast);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold text-xs rounded-xl shadow-xs active:scale-98 transition-all cursor-pointer"
                >
                  <PackageCheck className="w-4 h-4 text-emerald-400" />
                  <span>Go to Latest Release</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-80" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const repo = getGitHubRepoUrl();
                    try {
                      window.open(repo, '_blank', 'noopener,noreferrer');
                    } catch {
                      window.location.href = repo;
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl shadow-xs active:scale-98 transition-all cursor-pointer"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>View Repository Code</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Installation Guide */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 rounded-2xl p-4 text-xs space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>How to download and install on your phone:</span>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed pl-1">
              <li>
                Click <strong>Redirect to GitHub Releases</strong> above. GitHub will open in your browser.
              </li>
              <li>
                Under the release <strong>Assets</strong> section, tap the{' '}
                <code className="px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-900 font-mono text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
                  .apk
                </code>{' '}
                file (e.g. <em>cooked-product-costing.apk</em> or <em>app-debug.apk</em>) to begin downloading.
              </li>
              <li>
                When finished, open your Android notification tray or <strong>Downloads</strong> folder, tap the APK, and select <strong>Install</strong>.
              </li>
              <li>
                If Android shows a security warning: tap <em>Settings</em> and toggle <em>Allow from this source</em> to complete installation.
              </li>
            </ol>
          </div>

          {/* Offline benefit reminder */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
            <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p>
              The APK version operates 100% offline without cellular data or Wi-Fi, keeping all formulas, recipe rows, and calculations locally on your Android device.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share Releases Link'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
