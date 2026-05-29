import { describe, expect, it } from 'vitest';
import {
  buildAlerts,
  computeImpact,
  margin,
  suggested,
  totalCost,
  type Ingredient,
  type Recipe,
} from './index';

const baseIngredient = (overrides: Partial<Ingredient> = {}): Ingredient => ({
  id: 'i1',
  name: 'Norsk Lax',
  category: 'Fisk',
  unit: 'kg',
  priceSek: 145,
  prevPriceSek: 129,
  supplier: 'Menigo',
  priceHistory: [],
  updatedAt: '2026-05-16',
  ...overrides,
});

const baseRecipe = (overrides: Partial<Recipe> = {}): Recipe => ({
  id: 'r1',
  name: 'Laxpoke Bowl',
  category: 'Huvudrätter',
  servings: 1,
  sellingPriceSek: 139,
  createdAt: '2026-05-10',
  ingredients: [
    { ingredientId: 'i1', name: 'Norsk Lax', quantity: 0.12, unit: 'kg', unitPrice: 129 },
    { ingredientId: 'i2', name: 'Japanskt Ris', quantity: 0.1, unit: 'kg', unitPrice: 59 },
  ],
  ...overrides,
});

describe('store costing helpers', () => {
  it('calculates totalCost and margin from recipe ingredients', () => {
    const recipe = baseRecipe();
    expect(totalCost(recipe)).toBeCloseTo(25.656, 2);
    expect(margin(recipe)).toBeCloseTo(81.54, 1);
  });

  it('suggests a selling price from raw cost', () => {
    expect(suggested(25.44)).toBe(90);
  });
});

describe('computeImpact', () => {
  it('returns only recipes that use the changed ingredient', () => {
    const salmon = baseIngredient();
    const rice = baseIngredient({
      id: 'i2',
      name: 'Japanskt Ris',
      priceSek: 60,
      prevPriceSek: 59,
    });
    const recipes = [
      baseRecipe(),
      baseRecipe({
        id: 'r2',
        name: 'Ris Bowl',
        ingredients: [{ ingredientId: 'i2', name: 'Japanskt Ris', quantity: 0.2, unit: 'kg', unitPrice: 59 }],
      }),
    ];

    const salmonImpact = computeImpact(salmon, recipes, [salmon, rice]);
    const riceImpact = computeImpact(rice, recipes, [salmon, rice]);

    expect(salmonImpact).toHaveLength(1);
    expect(salmonImpact[0].recipe.id).toBe('r1');
    expect(riceImpact).toHaveLength(2);
  });

  it('shows margin loss and profit impact when an ingredient price rises', () => {
    const salmon = baseIngredient({ priceSek: 145, prevPriceSek: 129 });
    const rice = baseIngredient({
      id: 'i2',
      name: 'Japanskt Ris',
      priceSek: 60,
      prevPriceSek: 59,
    });
    const recipe = baseRecipe();
    const [impact] = computeImpact(salmon, [recipe], [salmon, rice]);

    expect(impact.newCostSek).toBeGreaterThan(impact.oldCostSek);
    expect(impact.newMarginPct).toBeLessThan(impact.oldMarginPct);
    expect(impact.marginDelta).toBeLessThan(0);
    expect(impact.profitLostSek).toBeGreaterThan(0);
    expect(impact.suggestedPriceIncrease).toBeGreaterThan(0);
  });

  it('sorts impacts by worst margin delta first', () => {
    const salmon = baseIngredient({ priceSek: 145, prevPriceSek: 129 });
    const rice = baseIngredient({
      id: 'i2',
      name: 'Japanskt Ris',
      priceSek: 60,
      prevPriceSek: 59,
    });
    const recipes = [
      baseRecipe({ id: 'r1', sellingPriceSek: 139 }),
      baseRecipe({
        id: 'r2',
        name: 'Nigiri Lax',
        sellingPriceSek: 95,
        ingredients: [{ ingredientId: 'i1', name: 'Norsk Lax', quantity: 0.08, unit: 'kg', unitPrice: 129 }],
      }),
    ];

    const impacts = computeImpact(salmon, recipes, [salmon, rice]);
    expect(impacts[0].marginDelta).toBeLessThanOrEqual(impacts[1].marginDelta);
  });
});

describe('buildAlerts', () => {
  it('ignores ingredients below the change threshold', () => {
    const stable = baseIngredient({ id: 'i2', name: 'Ris', priceSek: 60, prevPriceSek: 59.8 });
    const alerts = buildAlerts([stable], [baseRecipe()], 5);

    expect(alerts).toHaveLength(0);
  });

  it('ignores ingredients without a previous price', () => {
    const newItem = baseIngredient({ prevPriceSek: 0 });
    const alerts = buildAlerts([newItem], [baseRecipe()]);

    expect(alerts).toHaveLength(0);
  });

  it('builds alerts with severity and affected recipes', () => {
    const salmon = baseIngredient({ priceSek: 145, prevPriceSek: 129 });
    const tryffel = baseIngredient({
      id: 'i6',
      name: 'Tryffel',
      priceSek: 2800,
      prevPriceSek: 2314,
    });
    const recipes = [
      baseRecipe(),
      baseRecipe({
        id: 'r3',
        name: 'Pasta Tryffel',
        ingredients: [{ ingredientId: 'i6', name: 'Tryffel', quantity: 0.01, unit: 'kg', unitPrice: 2314 }],
      }),
    ];

    const alerts = buildAlerts([salmon, tryffel], recipes);

    expect(alerts.length).toBeGreaterThanOrEqual(2);
    expect(alerts[0].severity).toBe('high');
    expect(alerts[0].affectedRecipes.length).toBeGreaterThan(0);
    expect(Math.abs(alerts[0].changePct)).toBeGreaterThan(Math.abs(alerts[1].changePct));
  });

  it('assigns severity bands from price change percentage', () => {
    const low = baseIngredient({ id: 'a', priceSek: 102, prevPriceSek: 100 });
    const medium = baseIngredient({ id: 'b', priceSek: 110, prevPriceSek: 100 });
    const high = baseIngredient({ id: 'c', priceSek: 120, prevPriceSek: 100 });

    const alerts = buildAlerts([low, medium, high], []);

    expect(alerts.find(a => a.ingredient.id === 'a')?.severity).toBe('low');
    expect(alerts.find(a => a.ingredient.id === 'b')?.severity).toBe('medium');
    expect(alerts.find(a => a.ingredient.id === 'c')?.severity).toBe('high');
  });
});
