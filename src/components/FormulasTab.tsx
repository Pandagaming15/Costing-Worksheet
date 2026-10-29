import React from 'react';
import { CostingCalculations, CurrencyConfig, formatMoney, formatRawMoney } from '../utils/format';
import { ColorTheme } from '../utils/themeColors';
import { Calculator, DollarSign, TrendingUp, Layers } from 'lucide-react';

interface FormulasTabProps {
  calcs: CostingCalculations;
  currency: CurrencyConfig;
  themeColor: ColorTheme;
}

export const FormulasTab: React.FC<FormulasTabProps> = ({ calcs, currency, themeColor }) => {
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

  return (
    <div className="space-y-4 pb-24">
      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
            <Layers className={`w-3.5 h-3.5 ${themeColor.accentText}`} />
            <span>Total Cost</span>
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
            {formatMoney(totalCost, currency)}
          </div>
          <div className="text-[10px] text-slate-400">Direct + ½ Indirect</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
            <Calculator className="w-3.5 h-3.5 text-blue-500" />
            <span>Unit Cost</span>
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
            {formatRawMoney(unitCost, currency)}
          </div>
          <div className="text-[10px] text-slate-400">Per serving</div>
        </div>

        <div className={`p-3 rounded-2xl border shadow-xs ${themeColor.accentBg} border-slate-200 dark:border-slate-800`}>
          <div className={`flex items-center gap-1.5 ${themeColor.accentText} text-xs font-semibold mb-1`}>
            <DollarSign className="w-3.5 h-3.5" />
            <span>Selling Price</span>
          </div>
          <div className={`text-lg font-bold ${themeColor.accentText} font-mono`}>
            {formatMoney(roundedPrice, currency)}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">+{markupPercent}% Mark-up</div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-xs">
          <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Total Profit</span>
          </div>
          <div className="text-lg font-bold text-amber-900 dark:text-amber-200 font-mono">
            {formatMoney(batchProfit, currency)}
          </div>
          <div className="text-[10px] text-amber-700 dark:text-amber-400">
            {formatMoney(profitPerServingFromBatch, currency)} / serving
          </div>
        </div>
      </div>

      {/* Step 2: Compute the Unit Cost */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xs border border-slate-200/90 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-6 h-6 rounded-full ${themeColor.activeTabBg} ${themeColor.activeTabText} flex items-center justify-center font-bold text-xs`}>
            2
          </div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Compute the Unit Cost</h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
          The unit cost is the cost incurred to sell the cooked product. Divide the cumulative expenses by the
          number of servings or yield produced.
        </p>

        <div className="formula-box">
          <div className={`text-xs font-bold ${themeColor.accentText} mb-1`}>Module formula:</div>
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

          <div className={`mathline font-bold ${themeColor.accentText}`}>
            <span>=</span> {formatRawMoney(unitCost, currency)} per serving
          </div>
        </div>
      </div>

      {/* Step 3: Pricing the Product */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xs border border-slate-200/90 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-6 h-6 rounded-full ${themeColor.activeTabBg} ${themeColor.activeTabText} flex items-center justify-center font-bold text-xs`}>
            3
          </div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Pricing the Product</h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
          Apply the mark-up to the unit cost to calculate the selling price per serving. Since the unit cost is
          already per serving, do not divide by the number of servings again.
        </p>

        <div className="formula-box">
          <div className={`text-xs font-bold ${themeColor.accentText} mb-1`}>Module worked-example method:</div>
          <div className="formula-name text-slate-800 dark:text-slate-200">
            Selling Price per Serving = Unit Cost × (1 + Mark-up Rate)
          </div>

          <div className="mathline text-slate-800 dark:text-slate-200">
            <span>=</span> {formatRawMoney(unitCost, currency)} × (1 + {markupRate.toFixed(2)})
          </div>

          <div className="mathline text-slate-800 dark:text-slate-200">
            <span>=</span> {formatRawMoney(unitCost, currency)} × {(1 + markupRate).toFixed(2)}
          </div>

          <div className="mathline text-slate-800 dark:text-slate-200">
            <span>=</span> {formatRawMoney(pricePerServing, currency, 5)}
          </div>

          <div className="mathline final-math">
            <span>=</span> {formatMoney(pricePerServing, currency)} per serving
          </div>
        </div>
      </div>

      {/* Step 4: Compute the Profit */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xs border border-slate-200/90 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-6 h-6 rounded-full ${themeColor.activeTabBg} ${themeColor.activeTabText} flex items-center justify-center font-bold text-xs`}>
            4
          </div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Compute the Profit</h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
          Multiply the selling price per serving by the number of servings to find total sales. Then subtract the
          total production cost to find the profit earned from the whole batch.
        </p>

        <div className="formula-box">
          <div className={`text-xs font-bold ${themeColor.accentText} mb-1`}>Profit formula:</div>
          <div className="formula-name text-sm text-slate-800 dark:text-slate-200">
            Total Profit = (Selling Price per Serving × Number of Servings) − Total Production Cost
          </div>

          <div className="mathline text-sm text-slate-800 dark:text-slate-200">
            = {formatMoney(roundedPrice, currency)} × {servings} = {formatMoney(totalSales, currency)} total sales
          </div>

          <div className="mathline text-sm text-slate-800 dark:text-slate-200">
            = {formatMoney(totalSales, currency)} − {formatMoney(totalCost, currency)}
          </div>

          <div className="mathline final-math">
            = {formatMoney(batchProfit, currency)} total profit for the batch
          </div>

          <div className="mathline text-sm text-slate-600 dark:text-slate-400">
            Profit per Serving = Total Profit ÷ Number of Servings = {formatMoney(profitPerServingFromBatch, currency)}
          </div>
        </div>
      </div>

      {/* Step 5: Costing Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xs border border-slate-200/90 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-6 h-6 rounded-full ${themeColor.activeTabBg} ${themeColor.activeTabText} flex items-center justify-center font-bold text-xs`}>
            5
          </div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Costing Summary</h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <th className="py-2.5 px-3 text-left font-medium text-slate-600 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-800/80 w-[65%]">
                  Total ingredient / direct cost
                </th>
                <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                  {formatMoney(directCost, currency)}
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <th className="py-2.5 px-3 text-left font-medium text-slate-600 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-800/80">
                  Indirect cost (½ of ingredient cost)
                </th>
                <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                  {formatMoney(indirectCost, currency)}
                </td>
              </tr>
              <tr className="bg-slate-50/40 dark:bg-slate-800/40">
                <th className="py-2.5 px-3 text-left font-bold text-slate-800 dark:text-slate-100 bg-slate-100/70 dark:bg-slate-800/90">
                  Total production cost
                </th>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                  {formatMoney(totalCost, currency)}
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <th className="py-2.5 px-3 text-left font-medium text-slate-600 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-800/80">
                  Number of servings / yield
                </th>
                <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                  {servings}
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <th className="py-2.5 px-3 text-left font-medium text-slate-600 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-800/80">
                  Unit cost per serving
                </th>
                <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                  {formatRawMoney(unitCost, currency)}
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <th className="py-2.5 px-3 text-left font-medium text-slate-600 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-800/80">
                  Mark-up
                </th>
                <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                  {markupPercent}%
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <th className="py-2.5 px-3 text-left font-medium text-slate-600 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-800/80">
                  Profit per serving
                </th>
                <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                  {formatRawMoney(profitPerServing, currency, 5)}
                </td>
              </tr>
              <tr className="bg-amber-50/40 dark:bg-amber-950/20">
                <th className="py-2.5 px-3 text-left font-bold text-amber-900 dark:text-amber-300 bg-amber-100/50 dark:bg-amber-950/50">
                  Total profit for all servings
                </th>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-900 dark:text-amber-200">
                  {formatMoney(batchProfit, currency)}
                </td>
              </tr>
              <tr className={`${themeColor.accentBg} font-bold text-base`}>
                <th className="py-3 px-3 text-left">
                  Selling price per serving
                </th>
                <td className={`py-3 px-3 text-right font-mono text-base ${themeColor.accentText}`}>
                  {formatMoney(roundedPrice, currency)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
