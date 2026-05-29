import { z } from 'zod';

const nonEmptyString = z.string().trim().min(1);

export const invoiceItemSchema = z.object({
  id: nonEmptyString,
  restaurantId: nonEmptyString,
  invoiceId: nonEmptyString,
  itemName: nonEmptyString,
  normalizedName: nonEmptyString,
  category: nonEmptyString,
  quantity: z.number().finite().positive(),
  unit: nonEmptyString,
  unitPrice: z.number().finite().positive(),
  totalPrice: z.number().finite().positive(),
  date: z.date(),
  supplierName: nonEmptyString,
  source: z.enum(['manual', 'invoice_scan']),
  confidence: z.number().finite().min(0).max(1),
});

export const parsedInvoiceItemSchema = invoiceItemSchema.extend({
  matched: z.boolean(),
  ingredientId: nonEmptyString.optional(),
});

export type ValidatedInvoiceItem = z.infer<typeof invoiceItemSchema>;
export type ValidatedParsedInvoiceItem = z.infer<typeof parsedInvoiceItemSchema>;
