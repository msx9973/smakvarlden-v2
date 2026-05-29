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

export function calculateLineCost(quantity: unknown, unitPrice: unknown): number {
  return positiveNumber(quantity) * positiveNumber(unitPrice);
}

export function calculateRecipeRawCost(items: Pick<RecipeIngredient, 'quantity' | 'unitPrice'>[]): number {
  return items.reduce((sum, item) => sum + calculateLineCost(item.quantity, item.unitPrice), 0);
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
    return sum + calculateLineCost(recipeIngredient.quantity, unitPrice);
  }, 0);
}

export function calculatePriceChangePct(currentPrice: unknown, previousPrice: unknown): number {
  const previous = positiveNumber(previousPrice);
  if (previous <= 0) return 0;

  return ((positiveNumber(currentPrice) - previous) / previous) * 100;
}
