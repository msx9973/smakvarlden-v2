import { describe, expect, it } from 'vitest';
import {
  createIngredientFromInvoiceItem,
  normalizePurchaseUnit,
  parseInvoiceData,
} from './invoice-parser';
import type { ParsedInvoiceItem } from './invoice-parser';

describe('invoice parser import helpers', () => {
  it('normalizes invoice units to purchase units', () => {
    expect(normalizePurchaseUnit('L')).toBe('liter');
    expect(normalizePurchaseUnit('kg')).toBe('kg');
    expect(normalizePurchaseUnit('st')).toBe('st');
    expect(normalizePurchaseUnit('g')).toBe('kg');
  });

  it('creates a new ingredient from an unmatched invoice row', () => {
    const row: ParsedInvoiceItem = {
      id: 'x',
      restaurantId: 'demo',
      invoiceId: 'inv-1',
      itemName: 'Soltorkade tomater',
      normalizedName: 'soltorkade tomater',
      category: 'Grönsaker',
      quantity: 2,
      unit: 'kg',
      unitPrice: 185,
      totalPrice: 370,
      date: new Date('2026-05-16'),
      supplierName: 'Menigo',
      source: 'invoice_scan',
      confidence: 0.9,
      matched: false,
    };

    const ing = createIngredientFromInvoiceItem(row);
    expect(ing.name).toBe('Soltorkade tomater');
    expect(ing.priceSek).toBe(185);
    expect(ing.unit).toBe('kg');
    expect(ing.supplier).toBe('Menigo');
  });

  it('matches existing ingredients when names overlap', () => {
    const parsed = parseInvoiceData(
      {
        supplierName: 'Menigo',
        items: [{ name: 'Kycklingfilé', quantity: 5, unit: 'kg', unitPrice: 112 }],
      },
      'demo',
      [{ id: 'i14', name: 'Kycklingfilé', category: 'Kött', unit: 'kg', priceSek: 98, prevPriceSek: 90, priceHistory: [], updatedAt: '2026-05-16' }],
    );

    expect(parsed).toHaveLength(1);
    expect(parsed[0].matched).toBe(true);
    expect(parsed[0].ingredientId).toBe('i14');
  });
});
