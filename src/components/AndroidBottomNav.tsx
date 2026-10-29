import React from 'react';
import { UtensilsCrossed, Calculator, FileText } from 'lucide-react';
import { ColorTheme } from '../utils/themeColors';

export type AppTab = 'ingredients' | 'formulas' | 'worksheet';

interface AndroidBottomNavProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  rowCount: number;
  unitCostFormatted: string;
  themeColor: ColorTheme;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  currentTab,
  onTabChange,
  rowCount,
  unitCostFormatted,
  themeColor,
}) => {
  return (
    <nav className="android-bottom-nav fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200/90 dark:border-slate-800 shadow-lg transition-colors safe-area-inset-bottom">
      <div className="max-w-md mx-auto grid grid-cols-3 h-16">
        {/* Tab 1: Ingredients & Batch */}
        <button
          type="button"
          onClick={() => onTabChange('ingredients')}
          className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
            currentTab === 'ingredients'
              ? `${themeColor.accentText} font-bold`
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <div
            className={`px-4 py-1 rounded-full transition-colors flex items-center justify-center ${
              currentTab === 'ingredients'
                ? `${themeColor.activeTabBg} ${themeColor.activeTabText}`
                : ''
            }`}
          >
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <span className="text-[11px] tracking-tight">Ingredients</span>
          {rowCount > 0 && (
            <span
              className="absolute top-1.5 right-[22%] px-1.5 py-0.2 rounded-full text-white text-[10px] font-bold"
              style={{ backgroundColor: themeColor.hex }}
            >
              {rowCount}
            </span>
          )}
        </button>

        {/* Tab 2: Formulas & Costing */}
        <button
          type="button"
          onClick={() => onTabChange('formulas')}
          className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
            currentTab === 'formulas'
              ? `${themeColor.accentText} font-bold`
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <div
            className={`px-4 py-1 rounded-full transition-colors flex items-center justify-center ${
              currentTab === 'formulas'
                ? `${themeColor.activeTabBg} ${themeColor.activeTabText}`
                : ''
            }`}
          >
            <Calculator className="w-5 h-5" />
          </div>
          <span className="text-[11px] tracking-tight">Formulas</span>
          {unitCostFormatted && (
            <span className="hidden sm:inline-block absolute top-1.5 right-[18%] px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-900 text-[10px] font-bold">
              {unitCostFormatted}
            </span>
          )}
        </button>

        {/* Tab 3: Official Worksheet */}
        <button
          type="button"
          onClick={() => onTabChange('worksheet')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            currentTab === 'worksheet'
              ? `${themeColor.accentText} font-bold`
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <div
            className={`px-4 py-1 rounded-full transition-colors flex items-center justify-center ${
              currentTab === 'worksheet'
                ? `${themeColor.activeTabBg} ${themeColor.activeTabText}`
                : ''
            }`}
          >
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-[11px] tracking-tight">Worksheet</span>
        </button>
      </div>
    </nav>
  );
};
