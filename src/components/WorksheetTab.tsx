import React, { useRef, useState } from 'react';
import { IngredientRow } from '../types';
import { CostingCalculations, CurrencyConfig, formatMoney, formatRawMoney } from '../utils/format';
import { ColorTheme } from '../utils/themeColors';
import { DEFAULT_CVE_HEADER } from '../assets/header';
import { exportWorksheetToPdf } from '../utils/pdfGenerator';
import { exportWorksheetToDocx } from '../utils/docxGenerator';
import { Printer, Download, Upload, Trash2, RotateCcw, Loader2, FileCheck, FileText, ExternalLink } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { redirectToGitHubReleases } from '../utils/githubRelease';

interface WorksheetTabProps {
  groupNo: string;
  productName: string;
  memberNames: string;
  rows: IngredientRow[];
  calcs: CostingCalculations;
  currency: CurrencyConfig;
  themeColor: ColorTheme;
  customHeaderImage: string | null;
  onUpdateHeaderImage: (dataUri: string | null) => void;
  onPrint: () => void;
  onShowToast?: (msg: string) => void;
}

export const WorksheetTab: React.FC<WorksheetTabProps> = ({
  groupNo,
  productName,
  memberNames,
  rows,
  calcs,
  currency,
  themeColor,
  customHeaderImage,
  onUpdateHeaderImage,
  onPrint,
  onShowToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const printableAreaRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);

  // Use either the user's custom header or the provided default CVE Colleges header
  const currentBanner = customHeaderImage !== null ? customHeaderImage : DEFAULT_CVE_HEADER;

  const {
    directCost,
    indirectCost,
    totalCost,
    servings,
    markupPercent,
    markupRate,
    unitCost,
    profitPerServing,
    pricePerServing,
    roundedPrice,
    totalSales,
    batchProfit,
    profitPerServingFromBatch,
  } = calcs;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onUpdateHeaderImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadDocx = async () => {
    setIsGeneratingDocx(true);
    onShowToast?.('Generating Word document (.docx)...');
    try {
      await exportWorksheetToDocx({
        groupNo,
        productName,
        memberNames,
        rows,
        calcs,
        currency,
        headerImageUri: currentBanner,
      });
      onShowToast?.('Word document ready! Opening viewer/save...');
    } catch (err) {
      console.error('Word DOCX export failed:', err);
      onShowToast?.('Failed to export Word document. Please check device permissions.');
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!printableAreaRef.current) return;
    setIsGeneratingPdf(true);
    onShowToast?.('Generating PDF...');
    try {
      await exportWorksheetToPdf(printableAreaRef.current, productName || 'Cooked_Product');
      onShowToast?.('PDF ready! Opening viewer/save...');
    } catch (err) {
      console.error('PDF export failed, falling back to print dialog:', err);
      onPrint();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top action and header controls bar - Screen only */}
      <div className="no-print bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Official School Worksheet & Export
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Save directly to phone directory or open in Word, Google Docs, WPS Office, or PDF viewer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Word Document (.docx) Export */}
            <button
              type="button"
              disabled={isGeneratingDocx}
              onClick={handleDownloadDocx}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Save to device or open in Microsoft Word, WPS Office, Google Docs"
            >
              {isGeneratingDocx ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating DOCX...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Word (.docx)</span>
                </>
              )}
            </button>

            {/* Direct PDF File Download */}
            <button
              type="button"
              disabled={isGeneratingPdf}
              onClick={handleDownloadPdf}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 ${themeColor.btnBg} text-xs font-bold rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer`}
              title="Generate and download PDF file directly to your device"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Save PDF</span>
                </>
              )}
            </button>

            {/* Print / System PDF Dialog */}
            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
              title="Open system print and PDF dialog"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            {/* Download Android APK from GitHub Releases */}
            <button
              type="button"
              onClick={() => redirectToGitHubReleases(onShowToast)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
              title="Redirect to GitHub to download Android APK"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Download APK</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </button>
          </div>
        </div>

        {/* Banner Management Controls */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              Header: <strong>{currentBanner ? 'CVE Colleges Official Header' : 'None'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition cursor-pointer"
            >
              <Upload className="w-3 h-3" />
              Upload Other
            </button>

            {customHeaderImage && (
              <button
                type="button"
                onClick={() => onUpdateHeaderImage(null)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition cursor-pointer"
                title="Reset back to default CVE Colleges header"
              >
                <RotateCcw className="w-3 h-3 text-orange-600" />
                Reset to CVE
              </button>
            )}

            {currentBanner && (
              <button
                type="button"
                onClick={() => onUpdateHeaderImage('')}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-xs font-medium transition cursor-pointer"
                title="Remove banner completely"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* The Printable Worksheet Card (captured by jsPDF & rendered for @media print) */}
      <div
        ref={printableAreaRef}
        id="printable-worksheet"
        className="worksheet-paper rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 bg-white"
      >
        {/* Header Banner */}
        {currentBanner ? (
          <div className="custom-header-banner w-full mb-3 text-center" aria-label="School Header Banner">
            <img
              alt="CVE Colleges, Inc. Header"
              src={currentBanner}
              className="block w-full h-auto max-h-[105px] object-contain object-center mx-auto"
            />
          </div>
        ) : null}

        <h1 className="text-center font-serif text-[23px] font-bold text-slate-900 dark:text-white mb-0.5">
          Costing and Pricing of Cooked Products
        </h1>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-4">
          Food Technology
        </p>

        {/* Identity Details */}
        <div
          className="my-3 pb-3 border-b border-slate-400 dark:border-slate-700 text-[10.5pt] space-y-1.5"
          aria-label="Group, product, and member details"
        >
          <p className="my-1 text-slate-800 dark:text-slate-200">
            <strong>Group No.:</strong>{' '}
            <span className="font-mono">{groupNo.trim() || '________________'}</span>
          </p>
          <p className="my-1 text-slate-800 dark:text-slate-200">
            <strong>Product Name:</strong>{' '}
            <span className="font-semibold">{productName.trim() || '________________'}</span>
          </p>
          <p className="my-1 text-slate-800 dark:text-slate-200">
            <strong>Members:</strong>{' '}
            <span className="whitespace-pre-line">{memberNames.trim() || '________________'}</span>
          </p>
        </div>

        {/* Executive KPI Summary Metric Banner (Identical to app header) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
          <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Cost</div>
            <div className="text-base font-bold text-slate-900 dark:text-white font-mono">{formatMoney(totalCost, currency)}</div>
            <div className="text-[9px] text-slate-400">Direct + ½ Indirect</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">Unit Cost</div>
            <div className="text-base font-bold text-blue-700 dark:text-blue-400 font-mono">{formatRawMoney(unitCost, currency)}</div>
            <div className="text-[9px] text-slate-400">{servings} servings yield</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950/30 p-2.5 rounded-xl border border-orange-200 dark:border-orange-900/40 text-center">
            <div className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-0.5">Selling Price</div>
            <div className="text-base font-bold text-orange-600 font-mono">{formatMoney(roundedPrice, currency)}</div>
            <div className="text-[9px] text-orange-700 dark:text-orange-400">+{markupPercent}% Mark-up</div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40 text-center">
            <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-0.5">Batch Profit</div>
            <div className="text-base font-bold text-amber-800 dark:text-amber-300 font-mono">{formatMoney(batchProfit, currency)}</div>
            <div className="text-[9px] text-amber-600 dark:text-amber-400">{formatMoney(profitPerServingFromBatch, currency)} / serv.</div>
          </div>
        </div>

        {/* Section 1: Establish the Cost */}
        <section className="my-4">
          <div className="flex items-center gap-2 border-b border-slate-400 dark:border-slate-700 pb-1 mt-4 mb-2">
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white font-bold text-xs shrink-0"
              style={{ backgroundColor: themeColor.hex }}
            >
              1
            </span>
            <h2 className="text-[17px] font-bold text-slate-900 dark:text-white m-0 p-0">
              Establish the Cost
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 my-1.5">
            The direct expenses incurred to purchase the necessary ingredients for the recipe.
          </p>

          <table className="w-full border-collapse my-2 text-sm border border-slate-300 dark:border-slate-700">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80">
                <th className="border border-slate-400 dark:border-slate-700 p-2 text-left w-[12%] text-slate-800 dark:text-slate-200">Qty</th>
                <th className="border border-slate-400 dark:border-slate-700 p-2 text-left w-[15%] text-slate-800 dark:text-slate-200">Unit</th>
                <th className="border border-slate-400 dark:border-slate-700 p-2 text-left text-slate-800 dark:text-slate-200">Particulars</th>
                <th className="border border-slate-400 dark:border-slate-700 p-2 text-right w-[24%] text-slate-800 dark:text-slate-200">
                  Total ({currency.symbol})
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="dark:text-slate-200">
                  <td className="border border-slate-400 dark:border-slate-700 p-1.5">{row.qty || '—'}</td>
                  <td className="border border-slate-400 dark:border-slate-700 p-1.5">{row.unit || '—'}</td>
                  <td className="border border-slate-400 dark:border-slate-700 p-1.5 font-medium">{row.name || '—'}</td>
                  <td className="border border-slate-400 dark:border-slate-700 p-1.5 text-right font-mono">
                    {formatMoney(row.cost, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 dark:bg-slate-800/80 font-bold">
                <th colSpan={3} className="border border-slate-400 dark:border-slate-700 p-2 text-right text-slate-900 dark:text-white">
                  Total Cost / Ingredient Cost
                </th>
                <th className="border border-slate-400 dark:border-slate-700 p-2 text-right font-mono text-slate-900 dark:text-white">
                  {formatMoney(directCost, currency)}
                </th>
              </tr>
            </tfoot>
          </table>

          <div className="formula-box" style={{ borderLeftColor: themeColor.hex }}>
            <div className="formula-tag" style={{ color: themeColor.hex }}>Direct Cost Formula:</div>
            <strong className="text-sm text-slate-800 dark:text-slate-200">Total Direct Cost = Add all ingredient costs</strong>
            <div className="mathline text-slate-800 dark:text-slate-200">
              {rows.length > 0
                ? rows.map((r) => formatMoney(r.cost, currency)).join(' + ') + ' = ' + formatMoney(directCost, currency)
                : formatMoney(0, currency) + ' = ' + formatMoney(0, currency)}
            </div>
            <div className="formula-result-badge" style={{ borderLeftColor: themeColor.hex }}>
              <span className="font-bold text-xs uppercase tracking-wide text-slate-700 dark:text-slate-300">Total Ingredient Cost:</span>
              <span className="font-bold font-mono text-base" style={{ color: themeColor.hex }}>
                {formatMoney(directCost, currency)}
              </span>
            </div>
          </div>
        </section>

        {/* Section 2: Compute the Unit Cost */}
        <section className="my-4">
          <div className="flex items-center gap-2 border-b border-slate-400 dark:border-slate-700 pb-1 mt-4 mb-2">
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white font-bold text-xs shrink-0"
              style={{ backgroundColor: themeColor.hex }}
            >
              2
            </span>
            <h2 className="text-[17px] font-bold text-slate-900 dark:text-white m-0 p-0">
              Compute the Unit Cost
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 my-1.5">
            The unit cost is the cost incurred to sell the cooked product. Divide the cumulative expenses by the
            number of servings or yield produced.
          </p>

          <div className="formula-box" style={{ borderLeftColor: themeColor.hex }}>
            <div className="formula-tag" style={{ color: themeColor.hex }}>Module formula:</div>
            <div className="formula-name text-slate-800 dark:text-slate-200">
              Unit Cost ={' '}
              <span className="fraction">
                <span className="numerator">Ingredient Cost + ½ of cost of ingredients</span>
                <span className="denominator">No. of yields or servings</span>
              </span>
            </div>
            <div className="mathline text-slate-800 dark:text-slate-200">
              <span>=</span>
              <span className="fraction">
                <span className="numerator">
                  {formatMoney(directCost, currency)} + {formatMoney(indirectCost, currency)}
                </span>
                <span className="denominator">{servings} servings</span>
              </span>
            </div>
            <div className="mathline text-slate-800 dark:text-slate-200">
              <span>=</span>
              <span className="fraction">
                <span className="numerator">{formatMoney(totalCost, currency)}</span>
                <span className="denominator">{servings}</span>
              </span>
            </div>
            <div className="formula-result-badge" style={{ borderLeftColor: themeColor.hex }}>
              <span className="font-bold text-xs uppercase tracking-wide text-slate-700 dark:text-slate-300">Unit Cost Result:</span>
              <span className="font-bold font-mono text-base" style={{ color: themeColor.hex }}>
                = {formatRawMoney(unitCost, currency)} per serving
              </span>
            </div>
          </div>
        </section>

        {/* Section 3: Pricing the Product (Page 2 break in print) */}
        <section className="my-4 page-break-section">
          <div className="flex items-center gap-2 border-b border-slate-400 dark:border-slate-700 pb-1 mt-4 mb-2">
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white font-bold text-xs shrink-0"
              style={{ backgroundColor: themeColor.hex }}
            >
              3
            </span>
            <h2 className="text-[17px] font-bold text-slate-900 dark:text-white m-0 p-0">
              Pricing the Product
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 my-1.5">
            Apply the mark-up to the unit cost to calculate the selling price per serving. Since the unit cost is
            already per serving, do not divide by the number of servings again.
          </p>

          <div className="formula-box" style={{ borderLeftColor: themeColor.hex }}>
            <div className="formula-tag" style={{ color: themeColor.hex }}>Module worked-example method:</div>
            <div className="formula-name text-slate-800 dark:text-slate-200">
              Selling Price per Serving = Unit Cost × (1 + Mark-up Rate)
            </div>
            <div className="mathline text-slate-800 dark:text-slate-200">
              <span>=</span> {formatRawMoney(unitCost, currency)} × (1 + {markupRate.toFixed(2)})
            </div>
            <div className="mathline text-slate-800 dark:text-slate-200">
              <span>=</span> {formatRawMoney(unitCost, currency)} × {(1 + markupRate).toFixed(2)}
            </div>
            <div className="mathline text-slate-600 dark:text-slate-400">
              <span>=</span> {formatRawMoney(pricePerServing, currency, 5)}
            </div>
            <div className="formula-result-badge" style={{ borderLeftColor: themeColor.hex }}>
              <span className="font-bold text-xs uppercase tracking-wide text-slate-700 dark:text-slate-300">Final Selling Price:</span>
              <span className="font-bold font-mono text-base" style={{ color: themeColor.hex }}>
                = {formatMoney(pricePerServing, currency)} per serving
              </span>
            </div>
          </div>
        </section>

        {/* Section 4: Compute the Profit */}
        <section className="my-4">
          <div className="flex items-center gap-2 border-b border-slate-400 dark:border-slate-700 pb-1 mt-4 mb-2">
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white font-bold text-xs shrink-0"
              style={{ backgroundColor: themeColor.hex }}
            >
              4
            </span>
            <h2 className="text-[17px] font-bold text-slate-900 dark:text-white m-0 p-0">
              Compute the Profit
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 my-1.5">
            Multiply the selling price per serving by the number of servings to find total sales. Then subtract
            the total production cost to find the profit earned from the whole batch.
          </p>

          <div className="formula-box" style={{ borderLeftColor: themeColor.hex }}>
            <div className="formula-tag" style={{ color: themeColor.hex }}>Profit formula:</div>
            <div className="formula-name text-slate-800 dark:text-slate-200">
              Total Profit = (Selling Price per Serving × Number of Servings) − Total Production Cost
            </div>
            <div className="mathline text-slate-800 dark:text-slate-200">
              = {formatMoney(roundedPrice, currency)} × {servings} = {formatMoney(totalSales, currency)} total sales
            </div>
            <div className="mathline text-slate-800 dark:text-slate-200">
              = {formatMoney(totalSales, currency)} − {formatMoney(totalCost, currency)}
            </div>
            <div className="formula-result-badge amber">
              <span className="font-bold text-xs uppercase tracking-wide text-amber-900 dark:text-amber-200">Total Batch Profit:</span>
              <span className="font-bold font-mono text-base text-amber-700 dark:text-amber-300">
                = {formatMoney(batchProfit, currency)}
              </span>
            </div>
            <div className="mathline text-sm text-slate-600 dark:text-slate-400 mt-2">
              Profit per Serving = Total Profit ÷ Number of Servings = {formatMoney(profitPerServingFromBatch, currency)}
            </div>
          </div>
        </section>

        {/* Section 5: Costing Summary Table */}
        <section className="my-4">
          <div className="flex items-center gap-2 border-b border-slate-400 dark:border-slate-700 pb-1 mt-4 mb-2">
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white font-bold text-xs shrink-0"
              style={{ backgroundColor: themeColor.hex }}
            >
              5
            </span>
            <h2 className="text-[17px] font-bold text-slate-900 dark:text-white m-0 p-0">
              Costing Summary
            </h2>
          </div>

          <table className="w-full border-collapse my-2 text-sm border border-slate-300 dark:border-slate-700">
            <tbody>
              <tr>
                <th className="border border-slate-400 dark:border-slate-700 p-2 text-left bg-slate-100 dark:bg-slate-800/80 w-[70%] text-slate-800 dark:text-slate-200">
                  Total ingredient / direct cost
                </th>
                <td className="border border-slate-400 dark:border-slate-700 p-2 text-right font-mono dark:text-slate-200">
                  {formatMoney(directCost, currency)}
                </td>
              </tr>
              <tr>
                <th className="border border-slate-400 dark:border-slate-700 p-2 text-left bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200">
                  Indirect cost (½ of ingredient cost)
                </th>
                <td className="border border-slate-400 dark:border-slate-700 p-2 text-right font-mono dark:text-slate-200">
                  {formatMoney(indirectCost, currency)}
                </td>
              </tr>
              <tr>
                <th className="border border-slate-400 dark:border-slate-700 p-2 text-left bg-slate-100 dark:bg-slate-800/80 font-bold text-slate-900 dark:text-white">
                  Total production cost
                </th>
                <td className="border border-slate-400 dark:border-slate-700 p-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                  {formatMoney(totalCost, currency)}
                </td>
              </tr>
              <tr>
                <th className="border border-slate-400 dark:border-slate-700 p-2 text-left bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200">
                  Number of servings / yield
                </th>
                <td className="border border-slate-400 dark:border-slate-700 p-2 text-right font-mono dark:text-slate-200">{servings}</td>
              </tr>
              <tr>
                <th className="border border-slate-400 dark:border-slate-700 p-2 text-left bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200">
                  Unit cost per serving
                </th>
                <td className="border border-slate-400 dark:border-slate-700 p-2 text-right font-mono dark:text-slate-200">{formatRawMoney(unitCost, currency)}</td>
              </tr>
              <tr>
                <th className="border border-slate-400 dark:border-slate-700 p-2 text-left bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200">Mark-up</th>
                <td className="border border-slate-400 dark:border-slate-700 p-2 text-right font-mono dark:text-slate-200">{markupPercent}%</td>
              </tr>
              <tr>
                <th className="border border-slate-400 dark:border-slate-700 p-2 text-left bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200">Profit per serving</th>
                <td className="border border-slate-400 dark:border-slate-700 p-2 text-right font-mono dark:text-slate-200">
                  {formatRawMoney(profitPerServing, currency, 5)}
                </td>
              </tr>
              <tr className="bg-amber-50/70 dark:bg-amber-950/30">
                <th className="border border-slate-400 dark:border-slate-700 p-2 text-left font-bold text-amber-900 dark:text-amber-200">
                  Total profit for all servings
                </th>
                <td className="border border-slate-400 dark:border-slate-700 p-2 text-right font-mono font-bold text-amber-800 dark:text-amber-300">
                  {formatMoney(batchProfit, currency)}
                </td>
              </tr>
              <tr className="bg-orange-50/80 dark:bg-orange-950/40 font-bold text-base">
                <th className="border border-slate-400 dark:border-slate-700 p-2 text-left text-orange-950 dark:text-orange-200">
                  Selling price per serving
                </th>
                <td className="border border-slate-400 dark:border-slate-700 p-2 text-right font-mono font-bold text-base text-orange-600 dark:text-orange-400">
                  {formatMoney(roundedPrice, currency)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};
