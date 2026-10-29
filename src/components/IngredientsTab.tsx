import React from 'react';
import { IngredientRow } from '../types';
import { CurrencyConfig, formatMoney } from '../utils/format';
import { ColorTheme, COLOR_THEMES } from '../utils/themeColors';
import {
  Plus,
  Trash2,
  Users,
  PieChart,
  ShoppingBag,
  Sparkles,
  Minus,
  Palette,
} from 'lucide-react';

interface IngredientsTabProps {
  groupNo: string;
  setGroupNo: (val: string) => void;
  productName: string;
  setProductName: (val: string) => void;
  memberNames: string;
  setMemberNames: (val: string) => void;
  servings: number;
  setServings: (val: number) => void;
  markup: number;
  setMarkup: (val: number) => void;
  rows: IngredientRow[];
  onUpdateRow: (id: string, field: keyof IngredientRow, value: string | number) => void;
  onRemoveRow: (id: string) => void;
  onAddRow: () => void;
  onAddPreset: (item: { qty: string; unit: string; name: string; cost: number }) => void;
  directCost: number;
  currency: CurrencyConfig;
  themeColor: ColorTheme;
  onSelectThemeColor: (theme: ColorTheme) => void;
}

const COMMON_PRESETS = [
  { qty: '1', unit: 'kg', name: 'Chicken', cost: 130 },
  { qty: '1', unit: 'bottle', name: 'Cooking Oil', cost: 38 },
  { qty: '2', unit: 'cups', name: 'Evaporated Milk', cost: 18 },
  { qty: '1/2', unit: 'cup', name: 'Breadcrumbs', cost: 10 },
  { qty: '1', unit: 'pouch', name: 'Seasoning', cost: 5 },
  { qty: '1', unit: 'pc', name: 'Onion', cost: 6 },
  { qty: '1', unit: 'head', name: 'Garlic', cost: 8 },
  { qty: '2', unit: 'pcs', name: 'Eggs', cost: 16 },
  { qty: '1', unit: 'cup', name: 'All-Purpose Flour', cost: 12 },
];

export const IngredientsTab: React.FC<IngredientsTabProps> = ({
  groupNo,
  setGroupNo,
  productName,
  setProductName,
  memberNames,
  setMemberNames,
  servings,
  setServings,
  markup,
  setMarkup,
  rows,
  onUpdateRow,
  onRemoveRow,
  onAddRow,
  onAddPreset,
  directCost,
  currency,
  themeColor,
  onSelectThemeColor,
}) => {
  return (
    <div className="space-y-4 pb-24">
      {/* 1. Theme Color Selector Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 shadow-xs border border-slate-200/90 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <div className={`p-1.5 rounded-lg ${themeColor.accentBg}`}>
              <Palette className={`w-4 h-4 ${themeColor.accentText}`} />
            </div>
            <span className="text-xs font-bold">App Color Theme</span>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Current: <strong className={themeColor.accentText}>{themeColor.name}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {COLOR_THEMES.map((th) => {
            const isSelected = th.id === themeColor.id;
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => onSelectThemeColor(th)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  isSelected
                    ? `${th.accentBg} ${th.accentText} border-current shadow-xs`
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: th.hex }}
                />
                <span>{th.name.replace(' (Default)', '')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Group & Product Information Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xs border border-slate-200/90 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-3 text-slate-800 dark:text-slate-100">
          <div className={`p-1.5 rounded-lg ${themeColor.accentBg}`}>
            <Users className={`w-4 h-4 ${themeColor.accentText}`} />
          </div>
          <h2 className="text-sm font-bold tracking-tight">Student & Group Details</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Group No.</label>
            <input
              type="text"
              value={groupNo}
              onChange={(e) => setGroupNo(e.target.value)}
              placeholder="e.g. Group 1"
              className={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 outline-hidden transition ${themeColor.ringFocus}`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Cooked Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Fried Chicken Fillet"
              className={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 outline-hidden transition ${themeColor.ringFocus}`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Member Names</label>
            <input
              type="text"
              value={memberNames}
              onChange={(e) => setMemberNames(e.target.value)}
              placeholder="e.g. Maria, Juan, Carlos"
              className={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 outline-hidden transition ${themeColor.ringFocus}`}
            />
          </div>
        </div>
      </div>

      {/* 3. Batch Settings: Servings Yield & Mark-up % */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xs border border-slate-200/90 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-3 text-slate-800 dark:text-slate-100">
          <div className={`p-1.5 rounded-lg ${themeColor.accentBg}`}>
            <PieChart className={`w-4 h-4 ${themeColor.accentText}`} />
          </div>
          <h2 className="text-sm font-bold tracking-tight">Batch Yield & Mark-Up</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Servings Stepper */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Yield / Number of Servings
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="w-9 h-9 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 active:scale-95 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={servings}
                onChange={(e) => setServings(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="flex-1 text-center font-bold text-base py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 outline-hidden"
              />
              <button
                type="button"
                onClick={() => setServings(servings + 1)}
                className="w-9 h-9 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 active:scale-95 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Servings obtained from this batch recipe</p>
          </div>

          {/* Mark-up Rate */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Mark-up Percentage (%)</label>
              <span className={`text-xs font-bold ${themeColor.accentText}`}>{markup}%</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="0.5"
                inputMode="decimal"
                value={markup}
                onChange={(e) => setMarkup(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-24 text-center font-bold text-base py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 outline-hidden"
              />
              {/* Quick preset chips */}
              <div className="flex flex-wrap gap-1">
                {[20, 25, 30, 40].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setMarkup(rate)}
                    className={`px-2 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                      markup === rate
                        ? `${themeColor.btnBg}`
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Standard worked example uses 25%</p>
          </div>
        </div>
      </div>

      {/* 4. Ingredients Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xs border border-slate-200/90 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${themeColor.accentBg}`}>
              <ShoppingBag className={`w-4 h-4 ${themeColor.accentText}`} />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">
                1. Establish the Cost (Ingredients)
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Enter quantity, unit, particulars, and cost in {currency.symbol} ({currency.code}).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onAddRow}
            className={`inline-flex items-center gap-1 px-3 py-1.5 ${themeColor.btnBg} text-xs font-bold rounded-xl shadow-xs active:scale-95 transition cursor-pointer`}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Row
          </button>
        </div>

        {/* Quick Recipe Chips */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Quick add common ingredients:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
            {COMMON_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => onAddPreset(preset)}
                className={`shrink-0 px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ${themeColor.btnHover} border border-slate-200/80 dark:border-slate-700 transition cursor-pointer`}
              >
                + {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Table view for tablets & desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-y border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold">
                <th className="py-2.5 px-3 text-left w-[12%]">Qty</th>
                <th className="py-2.5 px-3 text-left w-[15%]">Unit</th>
                <th className="py-2.5 px-3 text-left">Particulars / Ingredient</th>
                <th className="py-2.5 px-3 text-right w-[20%]">Cost ({currency.symbol})</th>
                <th className="py-2.5 px-3 text-center w-[10%]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.qty}
                      aria-label="Quantity"
                      onChange={(e) => onUpdateRow(row.id, 'qty', e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.unit}
                      aria-label="Unit"
                      onChange={(e) => onUpdateRow(row.id, 'unit', e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.name}
                      aria-label="Particulars"
                      onChange={(e) => onUpdateRow(row.id, 'name', e.target.value)}
                      placeholder="Ingredient name"
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100"
                    />
                  </td>
                  <td className="p-2 text-right">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      inputMode="decimal"
                      value={row.cost === 0 ? '' : row.cost}
                      aria-label={`Cost in ${currency.code}`}
                      placeholder="0.00"
                      onChange={(e) =>
                        onUpdateRow(row.id, 'cost', Math.max(0, parseFloat(e.target.value) || 0))
                      }
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-right font-mono text-slate-900 dark:text-slate-100"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => onRemoveRow(row.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 active:scale-95 transition cursor-pointer"
                      title="Remove row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={`border-t-2 ${themeColor.accentBg} font-bold text-slate-800 dark:text-slate-100`}>
                <td colSpan={3} className="py-3 px-3 text-right text-sm">
                  Total Direct Cost (Ingredient Cost):
                </td>
                <td className={`py-3 px-3 text-right font-mono text-base ${themeColor.accentText}`}>
                  {formatMoney(directCost, currency)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobile touch cards */}
        <div className="sm:hidden space-y-2.5">
          {rows.map((row, index) => (
            <div
              key={row.id}
              className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/90 dark:border-slate-700 relative"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                <button
                  type="button"
                  onClick={() => onRemoveRow(row.id)}
                  className="p-1 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                  aria-label="Delete ingredient"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-2">
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
                  Particulars / Ingredient Name
                </label>
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => onUpdateRow(row.id, 'name', e.target.value)}
                  placeholder="e.g. Chicken, Oil, Milk"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">Qty</label>
                  <input
                    type="text"
                    value={row.qty}
                    onChange={(e) => onUpdateRow(row.id, 'qty', e.target.value)}
                    placeholder="1"
                    className="w-full px-2 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">Unit</label>
                  <input
                    type="text"
                    value={row.unit}
                    onChange={(e) => onUpdateRow(row.id, 'unit', e.target.value)}
                    placeholder="kg / cup"
                    className="w-full px-2 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
                    Cost ({currency.symbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    value={row.cost === 0 ? '' : row.cost}
                    onChange={(e) =>
                      onUpdateRow(row.id, 'cost', Math.max(0, parseFloat(e.target.value) || 0))
                    }
                    placeholder="0.00"
                    className={`w-full px-2 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs text-right font-mono font-bold ${themeColor.accentText}`}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Mobile Direct Cost total banner */}
          <div className={`p-3 rounded-xl ${themeColor.accentBg} border border-slate-200 dark:border-slate-800 flex items-center justify-between font-bold text-sm`}>
            <span className="text-slate-800 dark:text-slate-200">Total Ingredient Cost:</span>
            <span className={`text-base font-mono ${themeColor.accentText}`}>
              {formatMoney(directCost, currency)}
            </span>
          </div>
        </div>

        {/* Direct Cost Formula Box */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
          <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Total Direct Cost Formula:</p>
          <p className="text-slate-500 dark:text-slate-400 mb-1.5">Direct Cost = Add all ingredient costs</p>
          <div className="font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 overflow-x-auto whitespace-nowrap">
            {rows.length > 0
              ? rows.map((r) => formatMoney(r.cost, currency)).join(' + ') + ' = ' + formatMoney(directCost, currency)
              : formatMoney(0, currency) + ' = ' + formatMoney(0, currency)}
          </div>
        </div>
      </div>
    </div>
  );
};
