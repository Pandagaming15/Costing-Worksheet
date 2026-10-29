export interface IngredientRow {
  id: string;
  qty: string;
  unit: string;
  name: string;
  cost: number;
}

export interface SavedWorksheetRaw {
  groupNo?: string;
  productName?: string;
  memberNames?: string;
  servings?: string | number;
  markup?: string | number;
  currencyCode?: string;
  customHeaderImage?: string;
  rows?: Array<{
    qty?: string;
    unit?: string;
    name?: string;
    cost?: number | string;
  }>;
}

export interface WorksheetState {
  groupNo: string;
  productName: string;
  memberNames: string;
  servings: number;
  markup: number;
  currencyCode: string;
  customHeaderImage: string;
  rows: IngredientRow[];
}
