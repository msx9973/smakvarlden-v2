import type { Ingredient, Recipe, RecipeIngredient } from '../store';

export const DEFAULT_COST_MULTIPLIER = 1.2;
export const DEFAULT_TARGET_MARGIN = 0.66;

export function sanitizeNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  const parsed = Number(String(value ?? '').replace(',', '.').replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function positiveNumber(value: unknown, fallback = 0): number {
  return Math.max(0, sanitizeNumber(value, fallback));
}

export function normalizeUnit(unit: string): string {
  const u = unit.toLowerCase().trim();
  if (['g', 'gram', 'gr'].includes(u)) return 'g';
  if (['kg', 'kilo', 'kilogram'].includes(u)) return 'kg';
  if (['ml', 'milliliter'].includes(u)) return 'ml';
  if (['cl', 'centiliter'].includes(u)) return 'cl';
  if (['dl', 'deciliter'].includes(u)) return 'dl';
  if (['l', 'liter', 'litre', 'lt'].includes(u)) return 'l';
  if (['st', 'styck', 'stycke', 'pcs'].includes(u)) return 'st';
  if (['msk', 'matsked', 'tbsp'].includes(u)) return 'msk';
  if (['tsk', 'tesked', 'tsp'].includes(u)) return 'tsk';
  return u;
}

export function inferPurchaseUnit(recipeUnit: string): string {
  const u = normalizeUnit(recipeUnit);
  if (u === 'g' || u === 'kg') return 'kg';
  if (u === 'ml' || u === 'cl' || u === 'dl' || u === 'l' || u === 'msk' || u === 'tsk') return 'l';
  return u;
}

export function convertQuantity(quantity: number, fromUnit: string, toUnit: string): number {
  const from = normalizeUnit(fromUnit);
  const to = normalizeUnit(toUnit);
  if (from === to) return quantity;

  const toKg = (q: number, u: string): number | null => {
    if (u === 'kg') return q;
    if (u === 'g') return q / 1000;
    return null;
  };

  const toLiter = (q: number, u: string): number | null => {
    if (u === 'l') return q;
    if (u === 'ml') return q / 1000;
    if (u === 'cl') return q / 100;
    if (u === 'dl') return q / 10;
    if (u === 'msk') return (q * 15) / 1000;
    if (u === 'tsk') return (q * 5) / 1000;
    return null;
  };

  const fromBase = toKg(quantity, from) ?? toLiter(quantity, from);
  if (fromBase === null) return quantity;

  if (to === 'kg') return fromBase;
  if (to === 'g') return fromBase * 1000;

  const asLiter = toKg(quantity, from) !== null ? null : toLiter(quantity, from);
  if (asLiter === null) {
    // Kitchen shortcut: grams of liquids are treated like milliliters (120 g ≈ 120 ml)
    if (from === 'g' && to === 'l') return quantity / 1000;
    if (from === 'l' && to === 'g') return quantity * 1000;
    return quantity;
  }

  if (to === 'l') return asLiter;
  if (to === 'ml') return asLiter * 1000;
  if (to === 'cl') return asLiter * 100;
  if (to === 'dl') return asLiter * 10;

  return quantity;
}

export function calculateLineCostWithUnits(
  quantity: unknown,
  recipeUnit: string,
  unitPrice: unknown,
  purchaseUnit: string,
): number {
  const qty = positiveNumber(quantity);
  const price = positiveNumber(unitPrice);
  const normalizedQty = convertQuantity(qty, recipeUnit, purchaseUnit);
  return normalizedQty * price;
}

export function calculateLineCost(quantity: unknown, unitPrice: unknown): number {
  return positiveNumber(quantity) * positiveNumber(unitPrice);
}

export function calculateRecipeRawCost(items: Pick<RecipeIngredient, 'quantity' | 'unit' | 'unitPrice'>[]): number {
  return items.reduce((sum, item) => {
    const purchaseUnit = inferPurchaseUnit(item.unit);
    return sum + calculateLineCostWithUnits(item.quantity, item.unit, item.unitPrice, purchaseUnit);
  }, 0);
}

export function calculateRecipeTotalCost(rawCost: unknown, multiplier = DEFAULT_COST_MULTIPLIER): number {
  return positiveNumber(rawCost) * positiveNumber(multiplier, DEFAULT_COST_MULTIPLIER);
}

export function calculateMarginPct(sellingPrice: unknown, totalCost: unknown): number {
  const price = positiveNumber(sellingPrice);
  if (price <= 0) return 0;

  return ((price - positiveNumber(totalCost)) / price) * 100;
}

export function suggestSellingPrice(rawCost: unknown, targetMargin = DEFAULT_TARGET_MARGIN): number {
  const target = Math.min(Math.max(sanitizeNumber(targetMargin, DEFAULT_TARGET_MARGIN), 0), 0.95);
  return Math.round(calculateRecipeTotalCost(rawCost) / (1 - target));
}

export function calculateRecipeRawCostWithPrices(
  recipe: Recipe,
  ingredients: Ingredient[],
  priceSelector: (ingredient: Ingredient) => number
): number {
  return recipe.ingredients.reduce((sum, recipeIngredient) => {
    const ingredient = ingredients.find(item => item.id === recipeIngredient.ingredientId);
    const unitPrice = ingredient ? priceSelector(ingredient) : recipeIngredient.unitPrice;
    const purchaseUnit = ingredient?.unit ?? inferPurchaseUnit(recipeIngredient.unit);
    return sum + calculateLineCostWithUnits(
      recipeIngredient.quantity,
      recipeIngredient.unit,
      unitPrice,
      purchaseUnit,
    );
  }, 0);
}

export function calculatePriceChangePct(currentPrice: unknown, previousPrice: unknown): number {
  const previous = positiveNumber(previousPrice);
  if (previous <= 0) return 0;

  return ((positiveNumber(currentPrice) - previous) / previous) * 100;
}
