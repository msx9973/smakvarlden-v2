import { describe, expect, it } from 'vitest';
import {
  calculateLineCost,
  calculateLineCostWithUnits,
  calculateMarginPct,
  calculateRecipeRawCost,
  calculateRecipeTotalCost,
  convertQuantity,
  sanitizeNumber,
  suggestSellingPrice,
} from './calculations';

describe('calculations', () => {
  it('calculates recipe cost and margin from sanitized inputs', () => {
    const rawCost = calculateRecipeRawCost([
      { quantity: 0.12, unit: 'kg', unitPrice: 162 },
      { quantity: 0.1, unit: 'kg', unitPrice: 60 },
      { quantity: 0, unit: 'kg', unitPrice: 999 },
    ]);

    expect(rawCost).toBeCloseTo(25.44, 2);
    expect(calculateRecipeTotalCost(rawCost)).toBeCloseTo(30.528, 3);
    expect(calculateMarginPct(139, calculateRecipeTotalCost(rawCost))).toBeCloseTo(78.04, 2);
  });

  it('converts grams and milliliters to purchase units before costing', () => {
    expect(calculateLineCostWithUnits(120, 'g', 58, 'l')).toBeCloseTo(6.96, 2);
    expect(calculateLineCostWithUnits(200, 'ml', 60, 'l')).toBeCloseTo(12, 2);
    expect(convertQuantity(120, 'g', 'kg')).toBeCloseTo(0.12, 4);
    expect(convertQuantity(250, 'ml', 'l')).toBeCloseTo(0.25, 4);
  });

  it('guards against dirty numeric input', () => {
    expect(sanitizeNumber('162,50 kr')).toBe(162.5);
    expect(calculateLineCost('bad', 162)).toBe(0);
    expect(calculateMarginPct(0, 50)).toBe(0);
    expect(suggestSellingPrice(25.44)).toBe(90);
  });
});
