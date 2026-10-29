export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  locale: string;
  decimalPlaces: number;
}

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso (₱)', locale: 'en-PH', decimalPlaces: 2 },
  { code: 'USD', symbol: '$', name: 'US Dollar ($)', locale: 'en-US', decimalPlaces: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro (€)', locale: 'de-DE', decimalPlaces: 2 },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)', locale: 'en-GB', decimalPlaces: 2 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)', locale: 'ja-JP', decimalPlaces: 0 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CA$)', locale: 'en-CA', decimalPlaces: 2 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (A$)', locale: 'en-AU', decimalPlaces: 2 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (S$)', locale: 'en-SG', decimalPlaces: 2 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)', locale: 'en-IN', decimalPlaces: 2 },
];

export const DEFAULT_CURRENCY = CURRENCIES[0]; // PHP ₱

export const formatMoney = (n: number, currency: CurrencyConfig = DEFAULT_CURRENCY): string => {
  const val = Number.isFinite(n) ? n : 0;
  return `${currency.symbol}${val.toLocaleString(currency.locale, {
    minimumFractionDigits: currency.decimalPlaces,
    maximumFractionDigits: currency.decimalPlaces,
  })}`;
};

export const formatRawMoney = (
  n: number,
  currency: CurrencyConfig = DEFAULT_CURRENCY,
  maxDigits: number = 3
): string => {
  const val = Number.isFinite(n) ? n : 0;
  return `${currency.symbol}${val.toLocaleString(currency.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: Math.max(currency.decimalPlaces, maxDigits),
  })}`;
};

export interface CostingCalculations {
  directCost: number;
  indirectCost: number;
  totalCost: number;
  servings: number;
  markupPercent: number;
  markupRate: number;
  unitCost: number;
  profitPerServing: number;
  pricePerServing: number;
  roundedPrice: number;
  totalSales: number;
  batchProfit: number;
  profitPerServingFromBatch: number;
}

export function computeCosting(
  ingredientCosts: number[],
  servingsCount: number,
  markupPercentage: number
): CostingCalculations {
  const directCost = ingredientCosts.reduce((sum, cost) => sum + (cost || 0), 0);
  const indirectCost = directCost / 2;
  const totalCost = directCost + indirectCost;
  const servings = servingsCount > 0 ? servingsCount : 10;
  const markupPercent = markupPercentage >= 0 ? markupPercentage : 0;
  const markupRate = markupPercent / 100;

  const unitCost = servings > 0 ? totalCost / servings : 0;
  const profitPerServing = unitCost * markupRate;
  const pricePerServing = unitCost + profitPerServing;
  const roundedPrice = Math.round((pricePerServing + Number.EPSILON) * 100) / 100;
  const totalSales = roundedPrice * servings;
  const batchProfit = totalSales - totalCost;
  const profitPerServingFromBatch = servings > 0 ? batchProfit / servings : 0;

  return {
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
  };
}
