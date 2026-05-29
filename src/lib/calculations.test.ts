import { describe, expect, it } from 'vitest';
import {
  calculateLineCost,
  calculateMarginPct,
  calculateRecipeRawCost,
  calculateRecipeTotalCost,
  sanitizeNumber,
  suggestSellingPrice,
} from './calculations';

describe('calculations', () => {
  it('calculates recipe cost and margin from sanitized inputs', () => {
    const rawCost = calculateRecipeRawCost([
      { quantity: 0.12, unitPrice: 162 },
      { quantity: '0,10' as unknown as number, unitPrice: '60 kr' as unknown as number },
      { quantity: -3, unitPrice: 999 },
    ]);

    expect(rawCost).toBeCloseTo(25.44, 2);
    expect(calculateRecipeTotalCost(rawCost)).toBeCloseTo(30.528, 3);
    expect(calculateMarginPct(139, calculateRecipeTotalCost(rawCost))).toBeCloseTo(78.04, 2);
  });

  it('guards against dirty numeric input', () => {
    expect(sanitizeNumber('162,50 kr')).toBe(162.5);
    expect(calculateLineCost('bad', 162)).toBe(0);
    expect(calculateMarginPct(0, 50)).toBe(0);
    expect(suggestSellingPrice(25.44)).toBe(90);
  });
});
