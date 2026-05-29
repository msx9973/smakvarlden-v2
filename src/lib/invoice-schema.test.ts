import { describe, expect, it } from 'vitest';
import { invoiceItemSchema, parsedInvoiceItemSchema } from './invoice-schema';

const validInvoiceItem = {
  id: 'item-1',
  restaurantId: 'restaurant-1',
  invoiceId: 'invoice-1',
  itemName: 'Laxfile',
  normalizedName: 'laxfile',
  category: 'Fisk',
  quantity: 5,
  unit: 'kg',
  unitPrice: 162,
  totalPrice: 810,
  date: new Date('2026-05-29'),
  supplierName: 'Martin & Servera',
  source: 'invoice_scan' as const,
  confidence: 0.92,
};

describe('invoiceItemSchema', () => {
  it('accepts a valid invoice item', () => {
    expect(invoiceItemSchema.safeParse(validInvoiceItem).success).toBe(true);
  });

  it.each([
    ['empty itemName', { itemName: '' }],
    ['empty restaurantId', { restaurantId: '   ' }],
    ['zero quantity', { quantity: 0 }],
    ['negative quantity', { quantity: -2 }],
    ['zero unitPrice', { unitPrice: 0 }],
    ['negative totalPrice', { totalPrice: -10 }],
    ['invalid date', { date: '2026-05-29' }],
    ['unknown source', { source: 'ocr' }],
    ['confidence below zero', { confidence: -0.1 }],
    ['confidence above one', { confidence: 1.1 }],
  ])('rejects %s', (_caseName, override) => {
    const result = invoiceItemSchema.safeParse({ ...validInvoiceItem, ...override });

    expect(result.success).toBe(false);
  });
});

describe('parsedInvoiceItemSchema', () => {
  it('requires a boolean matched flag', () => {
    const result = parsedInvoiceItemSchema.safeParse({
      ...validInvoiceItem,
      matched: 'yes',
    });

    expect(result.success).toBe(false);
  });

  it('accepts a matched invoice item with an ingredient id', () => {
    const result = parsedInvoiceItemSchema.safeParse({
      ...validInvoiceItem,
      matched: true,
      ingredientId: 'ingredient-1',
    });

    expect(result.success).toBe(true);
  });
});
