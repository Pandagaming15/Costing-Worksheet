import React, { useState, useEffect, useMemo, useRef } from 'react';
import { IngredientRow, SavedWorksheetRaw } from './types';
import {
  computeCosting,
  formatRawMoney,
  CURRENCIES,
  DEFAULT_CURRENCY,
  CurrencyConfig,
} from './utils/format';
import { COLOR_THEMES, DEFAULT_COLOR_THEME, ColorTheme } from './utils/themeColors';
import { useTheme } from './hooks/useTheme';
import { AndroidAppBar } from './components/AndroidAppBar';
import { AndroidBottomNav, AppTab } from './components/AndroidBottomNav';
import { IngredientsTab } from './components/IngredientsTab';
import { FormulasTab } from './components/FormulasTab';
import { WorksheetTab } from './components/WorksheetTab';
import { DEFAULT_CVE_HEADER } from './assets/header';
import { exportWorksheetToDocx } from './utils/docxGenerator';
import { exportWorksheetToPdf } from './utils/pdfGenerator';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { VercelApkBanner } from './components/VercelApkBanner';
import { Plus } from 'lucide-react';

const STORAGE_KEY = 'cveCookedProductCostingWorksheet_v1';
const COLOR_THEME_KEY = 'food_costing_color_theme_v1';
const CURRENCY_KEY = 'food_costing_currency_v1';
const CUSTOM_HEADER_KEY = 'food_costing_custom_header_v1';

const SAMPLE_ROWS: IngredientRow[] = [
  { id: 'sample-1', qty: '1', unit: 'kg', name: 'chicken', cost: 130 },
  { id: 'sample-2', qty: '1', unit: 'bottle', name: 'oil', cost: 38 },
  { id: 'sample-3', qty: '2', unit: 'cups', name: 'evaporated milk', cost: 18 },
  { id: 'sample-4', qty: '1/2', unit: 'cup', name: 'breadcrumbs', cost: 10 },
  { id: 'sample-5', qty: '1 1/2', unit: 'tsp', name: 'seasoning', cost: 2.5 },
];

function createDefaultRow(): IngredientRow {
  return {
    id: 'row-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    qty: '1',
    unit: 'pcs',
    name: '',
    cost: 0,
  };
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('ingredients');
  const [groupNo, setGroupNo] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [memberNames, setMemberNames] = useState<string>('');
  const [servings, setServings] = useState<number>(10);
  const [markup, setMarkup] = useState<number>(25);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isApkModalOpen, setIsApkModalOpen] = useState<boolean>(false);

  // Theme Mode (Light / Dark / System)
  const { theme, toggleTheme, isDarkEffective } = useTheme();

  // Color Theme (Orange is default!)
  const [themeColor, setThemeColor] = useState<ColorTheme>(() => {
    try {
      const saved = localStorage.getItem(COLOR_THEME_KEY);
      if (saved) {
        const found = COLOR_THEMES.find((c) => c.id === saved);
        if (found) return found;
      }
    } catch {
      // Ignore
    }
    return DEFAULT_COLOR_THEME; // Culinary Orange
  });

  // Currency (Default PHP ₱)
  const [currency, setCurrency] = useState<CurrencyConfig>(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_KEY);
      if (saved) {
        const found = CURRENCIES.find((c) => c.code === saved);
        if (found) return found;
      }
    } catch {
      // Ignore
    }
    return DEFAULT_CURRENCY;
  });

  // Custom User-Uploaded Header Banner (No CVE logo)
  const [customHeaderImage, setCustomHeaderImage] = useState<string | null>(() => {
    try {
      return localStorage.getItem(CUSTOM_HEADER_KEY);
    } catch {
      return null;
    }
  });

  // Ingredient Rows
  const [rows, setRows] = useState<IngredientRow[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: SavedWorksheetRaw = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.rows) && parsed.rows.length > 0) {
          return parsed.rows.map((r, i) => ({
            id: 'saved-' + i + '-' + Date.now(),
            qty: r.qty ?? '1',
            unit: r.unit ?? 'pcs',
            name: r.name ?? '',
            cost: Math.max(0, Number(r.cost) || 0),
          }));
        }
      }
    } catch {
      // Fallback
    }
    return SAMPLE_ROWS;
  });

  const isInitialized = useRef<boolean>(false);

  // Show auto-dismiss toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3000);
  };

  // Restore additional fields on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: SavedWorksheetRaw = JSON.parse(saved);
        if (parsed) {
          if (parsed.groupNo !== undefined) setGroupNo(parsed.groupNo);
          if (parsed.productName !== undefined) setProductName(parsed.productName);
          if (parsed.memberNames !== undefined) setMemberNames(parsed.memberNames);
          if (parsed.servings !== undefined) {
            const parsedServings = Number(parsed.servings);
            if (parsedServings > 0) setServings(parsedServings);
          }
          if (parsed.markup !== undefined) {
            const parsedMarkup = Number(parsed.markup);
            if (parsedMarkup >= 0) setMarkup(parsedMarkup);
          }
          if (parsed.currencyCode) {
            const foundCurr = CURRENCIES.find((c) => c.code === parsed.currencyCode);
            if (foundCurr) setCurrency(foundCurr);
          }
          if (parsed.customHeaderImage) {
            setCustomHeaderImage(parsed.customHeaderImage);
          }
        }
      }
    } catch {
      // Ignore
    }
    isInitialized.current = true;
  }, []);

  // Save to localStorage whenever worksheet changes
  useEffect(() => {
    if (!isInitialized.current) return;
    try {
      const stateToSave = {
        rows: rows.map(({ qty, unit, name, cost }) => ({ qty, unit, name, cost })),
        groupNo,
        productName,
        memberNames,
        servings: servings.toString(),
        markup: markup.toString(),
        currencyCode: currency.code,
        customHeaderImage: customHeaderImage || '',
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // Ignore
    }
  }, [rows, groupNo, productName, memberNames, servings, markup, currency, customHeaderImage]);

  // Handle color theme selection
  const handleSelectThemeColor = (th: ColorTheme) => {
    setThemeColor(th);
    try {
      localStorage.setItem(COLOR_THEME_KEY, th.id);
    } catch {
      // Ignore
    }
    showToast(`Theme updated to ${th.name.replace(' (Default)', '')}`);
  };

  // Handle currency selection
  const handleSelectCurrency = (curr: CurrencyConfig) => {
    setCurrency(curr);
    try {
      localStorage.setItem(CURRENCY_KEY, curr.code);
    } catch {
      // Ignore
    }
    showToast(`Currency set to ${curr.name}`);
  };

  // Handle custom header banner change
  const handleUpdateHeaderImage = (dataUri: string | null) => {
    setCustomHeaderImage(dataUri);
    try {
      if (dataUri) {
        localStorage.setItem(CUSTOM_HEADER_KEY, dataUri);
        showToast('Custom header banner saved');
      } else {
        localStorage.removeItem(CUSTOM_HEADER_KEY);
        showToast('Custom banner removed');
      }
    } catch {
      // Ignore
    }
  };

  // Handle row actions
  const handleAddRow = () => {
    setRows((prev) => [...prev, createDefaultRow()]);
  };

  const handleAddPreset = (preset: { qty: string; unit: string; name: string; cost: number }) => {
    setRows((prev) => [
      ...prev,
      {
        id: 'row-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        qty: preset.qty,
        unit: preset.unit,
        name: preset.name,
        cost: preset.cost,
      },
    ]);
    showToast(`Added ${preset.name}`);
  };

  const handleUpdateRow = (id: string, field: keyof IngredientRow, value: string | number) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleRemoveRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Top control button actions
  const handleLoadSample = () => {
    setRows(
      SAMPLE_ROWS.map((r) => ({
        ...r,
        id: 'sample-' + Math.random().toString(36).substring(2, 7),
      }))
    );
    setServings(10);
    setMarkup(25);
    showToast('Sample recipe loaded (Chicken Fillet)');
  };

  const handleReset = () => {
    setRows([createDefaultRow()]);
    setGroupNo('');
    setProductName('');
    setMemberNames('');
    setServings(10);
    setMarkup(25);
    showToast('Worksheet reset');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportDocx = async () => {
    showToast('Generating Word document (.docx)...');
    try {
      await exportWorksheetToDocx({
        groupNo,
        productName,
        memberNames,
        rows,
        calcs,
        currency,
        headerImageUri: customHeaderImage !== null ? customHeaderImage : DEFAULT_CVE_HEADER,
      });
      showToast('Word document ready! Opening viewer / save...');
    } catch (err) {
      console.error('Word DOCX export failed:', err);
      showToast('Word export failed. Please check device permissions.');
    }
  };

  const handleExportPdf = async () => {
    const el = document.getElementById('printable-worksheet');
    if (!el) {
      setActiveTab('worksheet');
      showToast('Switched to Worksheet tab. Preparing PDF...');
      setTimeout(async () => {
        const delayedEl = document.getElementById('printable-worksheet');
        if (delayedEl) {
          try {
            await exportWorksheetToPdf(delayedEl, productName || 'Cooked_Product');
            showToast('PDF ready! Opening viewer / save...');
          } catch (e) {
            console.error('PDF generation error:', e);
            window.print();
          }
        }
      }, 300);
      return;
    }
    showToast('Generating PDF...');
    try {
      await exportWorksheetToPdf(el, productName || 'Cooked_Product');
      showToast('PDF ready! Opening viewer / save...');
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast('PDF export failed, opening print dialog...');
      window.print();
    }
  };

  // Derived calculations
  const calcs = useMemo(
    () =>
      computeCosting(
        rows.map((r) => r.cost),
        servings,
        markup
      ),
    [rows, servings, markup]
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-orange-200 dark:selection:bg-orange-900/60">
      {/* Android Top App Bar with Theme & Currency controls */}
      <AndroidAppBar
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        onPrint={handlePrint}
        onExportDocx={handleExportDocx}
        onExportPdf={handleExportPdf}
        onOpenWorksheetTab={() => setActiveTab('worksheet')}
        onOpenApkModal={() => setIsApkModalOpen(true)}
        currentCurrency={currency}
        onSelectCurrency={handleSelectCurrency}
        theme={theme}
        isDarkEffective={isDarkEffective}
        onToggleTheme={toggleTheme}
        themeColor={themeColor}
      />

      {/* Main Screen Tab View */}
      <main className="no-print flex-1 max-w-4xl w-full mx-auto p-3 sm:p-5">
        {/* Vercel Deployed Web Banner with direct redirect to GitHub Releases */}
        <VercelApkBanner
          onOpenModal={() => setIsApkModalOpen(true)}
          onShowToast={showToast}
          themeColor={themeColor}
        />
        {activeTab === 'ingredients' && (
          <IngredientsTab
            groupNo={groupNo}
            setGroupNo={setGroupNo}
            productName={productName}
            setProductName={setProductName}
            memberNames={memberNames}
            setMemberNames={setMemberNames}
            servings={servings}
            setServings={setServings}
            markup={markup}
            setMarkup={setMarkup}
            rows={rows}
            onUpdateRow={handleUpdateRow}
            onRemoveRow={handleRemoveRow}
            onAddRow={handleAddRow}
            onAddPreset={handleAddPreset}
            directCost={calcs.directCost}
            currency={currency}
            themeColor={themeColor}
            onSelectThemeColor={handleSelectThemeColor}
          />
        )}

        {activeTab === 'formulas' && (
          <FormulasTab
            calcs={calcs}
            currency={currency}
            themeColor={themeColor}
          />
        )}

        {activeTab === 'worksheet' && (
          <WorksheetTab
            groupNo={groupNo}
            productName={productName}
            memberNames={memberNames}
            rows={rows}
            calcs={calcs}
            currency={currency}
            themeColor={themeColor}
            customHeaderImage={customHeaderImage}
            onUpdateHeaderImage={handleUpdateHeaderImage}
            onPrint={handlePrint}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Print View Wrapper (Always available for @media print) */}
      <div className="print-only-container">
        <WorksheetTab
          groupNo={groupNo}
          productName={productName}
          memberNames={memberNames}
          rows={rows}
          calcs={calcs}
          currency={currency}
          themeColor={themeColor}
          customHeaderImage={customHeaderImage}
          onUpdateHeaderImage={handleUpdateHeaderImage}
          onPrint={handlePrint}
        />
      </div>

      {/* Android Floating Action Button (FAB) on Ingredients tab */}
      {activeTab === 'ingredients' && (
        <button
          type="button"
          onClick={handleAddRow}
          aria-label="Add ingredient"
          className={`android-fab fixed bottom-20 right-5 z-30 w-14 h-14 rounded-2xl ${themeColor.btnBg} shadow-xl active:scale-90 transition-all flex items-center justify-center cursor-pointer border border-white/20`}
        >
          <Plus className="w-7 h-7" />
        </button>
      )}

      {/* Android Bottom Navigation */}
      <AndroidBottomNav
        currentTab={activeTab}
        onTabChange={setActiveTab}
        rowCount={rows.length}
        unitCostFormatted={formatRawMoney(calcs.unitCost, currency)}
        themeColor={themeColor}
      />

      {/* Android APK Download & GitHub Releases Redirect Modal */}
      <ApkDownloadModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 dark:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg backdrop-blur-xs border border-slate-700/50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default App;
