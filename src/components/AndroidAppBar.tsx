import React, { useState } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { CurrencyConfig, CURRENCIES } from '../utils/format';
import { ThemeMode } from '../hooks/useTheme';
import { ColorTheme } from '../utils/themeColors';
import {
  Printer,
  RotateCcw,
  BookOpen,
  Download,
  Wifi,
  WifiOff,
  MoreVertical,
  ChefHat,
  HelpCircle,
  X,
  Smartphone,
  Sun,
  Moon,
  Coins,
  Check,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { redirectToGitHubReleases } from '../utils/githubRelease';

interface AndroidAppBarProps {
  onLoadSample: () => void;
  onReset: () => void;
  onPrint: () => void;
  onOpenWorksheetTab: () => void;
  currentCurrency: CurrencyConfig;
  onSelectCurrency: (curr: CurrencyConfig) => void;
  theme: ThemeMode;
  isDarkEffective: boolean;
  onToggleTheme: () => void;
  themeColor: ColorTheme;
  onExportDocx?: () => void;
  onExportPdf?: () => void;
  onOpenApkModal?: () => void;
}

export const AndroidAppBar: React.FC<AndroidAppBarProps> = ({
  onLoadSample,
  onReset,
  onPrint,
  onOpenWorksheetTab,
  currentCurrency,
  onSelectCurrency,
  isDarkEffective,
  onToggleTheme,
  themeColor,
  onExportDocx,
  onExportPdf,
  onOpenApkModal,
}) => {
  const isOnline = useOnlineStatus();
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currencyModalOpen, setCurrencyModalOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <>
      <header className={`android-app-bar sticky top-0 z-40 bg-gradient-to-r ${themeColor.gradientFrom} ${themeColor.gradientTo} text-white shadow-md transition-colors`}>
        <div className="max-w-4xl mx-auto px-3 py-2 flex items-center justify-between gap-2">
          {/* App Branding */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/15 dark:bg-white/10 flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
              <ChefHat className="w-5 h-5 text-yellow-300 dark:text-yellow-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-bold tracking-tight truncate leading-tight">
                  Cooked Product Costing
                </h1>
                {/* Offline indicator */}
                {isOnline ? (
                  <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-900/60 text-emerald-200 border border-emerald-500/30">
                    <Wifi className="w-2.5 h-2.5 text-emerald-300" />
                    Offline Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/40 text-amber-200 border border-amber-400/40 animate-pulse">
                    <WifiOff className="w-2.5 h-2.5 text-amber-300" />
                    Offline
                  </span>
                )}
              </div>
              <p className="text-[10.5px] text-emerald-100 dark:text-emerald-300 truncate opacity-90">
                Food Technology • Worksheet Calculator
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Currency Selector Pill */}
            <button
              type="button"
              onClick={() => setCurrencyModalOpen(true)}
              className="inline-flex items-center gap-1 px-2 py-1 bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-lg text-xs font-bold transition border border-white/20 cursor-pointer"
              title="Change Currency"
            >
              <Coins className="w-3.5 h-3.5 text-yellow-300" />
              <span>{currentCurrency.symbol} {currentCurrency.code}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-1.5 text-white/90 hover:text-white hover:bg-white/15 rounded-lg active:scale-95 transition cursor-pointer"
              title={isDarkEffective ? 'Switch to Light mode' : 'Switch to Dark mode'}
              aria-label="Toggle theme"
            >
              {isDarkEffective ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-100" />
              )}
            </button>

            {/* Install button (Android & desktop browsers) */}
            {!isInstalled && isInstallable && (
              <button
                type="button"
                onClick={install}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 bg-yellow-400 text-green-950 text-xs font-bold rounded-lg shadow-sm hover:bg-yellow-300 active:scale-95 transition-all cursor-pointer"
                title="Install Android App"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            )}

            {/* Download Android APK from GitHub Releases */}
            <button
              type="button"
              onClick={onOpenApkModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 hover:bg-white/30 active:scale-95 text-white rounded-lg text-xs font-bold transition border border-white/25 cursor-pointer shadow-xs"
              title="Download Android APK from GitHub Releases"
            >
              <GithubIcon className="w-3.5 h-3.5 text-yellow-300" />
              <span className="hidden xs:inline">Get APK</span>
              <span className="text-[10px] bg-emerald-500/80 text-white font-extrabold px-1 rounded-xs">DL</span>
            </button>

            {/* Quick print button */}
            <button
              type="button"
              onClick={() => {
                onOpenWorksheetTab();
                setTimeout(() => onPrint(), 150);
              }}
              className="p-1.5 text-white/90 hover:text-white hover:bg-white/15 rounded-lg active:scale-95 transition cursor-pointer"
              title="Print / Export PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Overflow menu toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 text-white/90 hover:text-white hover:bg-white/15 rounded-lg active:scale-95 transition cursor-pointer"
                aria-label="More actions"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 w-56 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-xl border border-slate-200/80 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrencyModalOpen(true);
                        setMenuOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-emerald-50 dark:hover:bg-slate-700/60 flex items-center justify-between text-slate-700 dark:text-slate-200 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        Currency Formatter
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {currentCurrency.code}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onLoadSample();
                        setMenuOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-emerald-50 dark:hover:bg-slate-700/60 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Load Module Example
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onReset();
                        setMenuOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:text-red-700 dark:hover:text-red-400 transition cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4 text-red-500" />
                      Reset Worksheet
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        if (onExportDocx) {
                          onExportDocx();
                        } else {
                          onOpenWorksheetTab();
                        }
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-blue-50 dark:hover:bg-slate-700/60 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Save as Word (.docx)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        if (onExportPdf) {
                          onExportPdf();
                        } else {
                          onOpenWorksheetTab();
                        }
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-emerald-50 dark:hover:bg-slate-700/60 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Save as PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenWorksheetTab();
                        setMenuOpen(false);
                        setTimeout(() => onPrint(), 150);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      Print Dialog
                    </button>
                    <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        redirectToGitHubReleases();
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-emerald-50 dark:hover:bg-slate-700/60 flex items-center justify-between text-emerald-800 dark:text-emerald-300 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <GithubIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        Download Android APK
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 opacity-80" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onOpenApkModal?.();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2.5 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                      APK Installation Instructions
                    </button>
                    <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                    <button
                      type="button"
                      onClick={() => {
                        setShowAboutModal(true);
                        setMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 transition cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      App & Offline Guide
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Currency Formatter Selection Modal */}
      {currencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Select Currency</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Updates formulas and printable worksheet</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCurrencyModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3 max-h-72 overflow-y-auto space-y-1">
              {CURRENCIES.map((curr) => {
                const isSelected = curr.code === currentCurrency.code;
                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => {
                      onSelectCurrency(curr);
                      setCurrencyModalOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-sm transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-800'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sm">
                        {curr.symbol}
                      </span>
                      <span>{curr.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setCurrencyModalOpen(false)}
              className="mt-2 w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* About & Guide Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base">Android Offline App</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>
                <strong>Cooked Product Costing</strong> is an offline-capable mobile application
                designed for culinary arts and Food Technology students.
              </p>
              <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                <p className="font-bold text-emerald-950 dark:text-emerald-100">📲 Offline & Features:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Choose your preferred currency (₱, $, €, £, ¥, etc.) from the header.</li>
                  <li>Toggle Dark Mode anytime via the moon/sun button.</li>
                  <li>Upload your own custom school / brand header logo in the Worksheet tab.</li>
                  <li>Works completely offline with automatic local storage saving.</li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 bg-emerald-700 dark:bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
