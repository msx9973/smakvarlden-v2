import type { Ingredient } from '../store';

export interface InvoiceItem {
  id: string;
  restaurantId: string;
  invoiceId: string;
  itemName: string;
  normalizedName: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  date: Date;
  supplierName: string;
  source: 'manual' | 'invoice_scan';
  confidence: number;
}

export interface ParsedInvoiceItem extends InvoiceItem {
  matched: boolean;
  ingredientId?: string;
}

const NON_PRODUCT_TERMS = [
  'moms',
  'vat',
  'total',
  'summa',
  'subtotal',
  'frakt',
  'rabatt',
  'att betala',
  'ocr',
  'bankgiro',
  'plusgiro',
  'fakturanr',
  'invoice',
];

export function normalizeName(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const parsed = Number(String(value ?? '').replace(',', '.').replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isLikelyProductLine(line: Record<string, unknown>): boolean {
  const text = normalizeName(line.name ?? line.itemName ?? line.text ?? line.description);
  if (!text) return false;
  if (NON_PRODUCT_TERMS.some(term => text.includes(normalizeName(term)))) return false;

  const unitPrice = toNumber(line.unitPrice ?? line.price ?? line.unit_price);
  const totalPrice = toNumber(line.totalPrice ?? line.total ?? line.amount);
  return unitPrice > 0 || totalPrice > 0;
}

function guessCategory(name: string): string {
  const n = normalizeName(name);
  if (/(lax|fisk|torsk|tonfisk|sej|roding|kolja|sill|makrill)/.test(n)) return 'Fisk';
  if (/(oxfile|not|kyckling|flask|lamm|kott|bacon|korv|anka|vilt|kalv|gris)/.test(n)) return 'Kött';
  if (/(rak|hummer|mussl|skaldjur|scampi|krabba|rom)/.test(n)) return 'Skaldjur';
  if (/(smor|gradde|mjolk|ost|parmigiano|yoghurt|feta|mozzarella|brie|comte)/.test(n)) return 'Mejeri';
  if (/(ris|pasta|mjol|socker|olja|soja|bulgur|couscous|not|linser|kikart)/.test(n)) return 'Torrvaror';
  if (/(tryffel|svamp|kantarell|shiitake|portabello|champignon)/.test(n)) return 'Svamp';
  if (/(avokado|rucola|tomat|gurka|potatis|morot|lok|gronsak|spenat|salad|basilika|dill|persilja|broccoli|paprika)/.test(n)) return 'Grönsaker';
  if (/(olja|vinager|senap|krydda|salt|peppar|fond|sas|sås|honung)/.test(n)) return 'Kryddor';
  return 'Torrvaror';
}

export function normalizePurchaseUnit(unit: string): string {
  const u = unit.toLowerCase().trim();
  if (u === 'l' || u === 'lt' || u === 'liter' || u === 'litre') return 'liter';
  if (u === 'ml' || u === 'cl' || u === 'dl') return 'liter';
  if (u === 'kg' || u === 'kilo' || u === 'kilogram') return 'kg';
  if (u === 'g' || u === 'gram' || u === 'gr') return 'kg';
  if (u === 'st' || u === 'styck' || u === 'stycke' || u === 'pcs') return 'st';
  return 'kg';
}

export function createIngredientFromInvoiceItem(item: ParsedInvoiceItem): Ingredient {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: crypto.randomUUID(),
    name: item.itemName.trim(),
    category: item.category === 'Gronsaker' ? 'Grönsaker' : item.category === 'Kott' ? 'Kött' : item.category,
    unit: normalizePurchaseUnit(item.unit),
    priceSek: item.unitPrice,
    prevPriceSek: item.unitPrice,
    supplier: item.supplierName || undefined,
    priceHistory: [{ date: today, priceSek: item.unitPrice }],
    updatedAt: today,
  };
}

function findMatch(itemName: string, ingredients: Ingredient[]): Ingredient | undefined {
  const normalizedItem = normalizeName(itemName);
  if (!normalizedItem) return undefined;

  return ingredients.find(ingredient => {
    const normalizedIngredient = normalizeName(ingredient.name);
    return (
      normalizedIngredient === normalizedItem ||
      normalizedIngredient.includes(normalizedItem) ||
      normalizedItem.includes(normalizedIngredient)
    );
  });
}

export function parseInvoiceData(
  apiResponse: unknown,
  restaurantId: string,
  ingredients: Ingredient[] = []
): ParsedInvoiceItem[] {
  const response = (apiResponse ?? {}) as Record<string, unknown>;
  const rawLines = Array.isArray(response.items)
    ? response.items
    : Array.isArray(response.lines)
      ? response.lines
      : [];

  const supplierName = String(response.supplierName ?? response.supplier ?? 'Unknown supplier');
  const invoiceId = String(response.invoiceId ?? response.invoiceNumber ?? crypto.randomUUID());
  const invoiceDate = response.invoiceDate ? new Date(String(response.invoiceDate)) : new Date();

  return rawLines
    .filter((line): line is Record<string, unknown> => typeof line === 'object' && line !== null)
    .filter(isLikelyProductLine)
    .map(line => {
      const itemName = String(line.name ?? line.itemName ?? line.text ?? line.description ?? '').trim();
      const quantity = Math.max(0, toNumber(line.quantity ?? line.qty, 1));
      const unit = String(line.unit ?? line.uom ?? 'st').trim() || 'st';
      const unitPrice = toNumber(line.unitPrice ?? line.price ?? line.unit_price);
      const totalPrice = toNumber(line.totalPrice ?? line.total ?? line.amount, quantity * unitPrice);
      const matchedIngredient = findMatch(itemName, ingredients);

      return {
        id: crypto.randomUUID(),
        restaurantId,
        invoiceId,
        itemName,
        normalizedName: normalizeName(itemName),
        category: guessCategory(itemName),
        quantity,
        unit,
        unitPrice,
        totalPrice,
        date: Number.isNaN(invoiceDate.getTime()) ? new Date() : invoiceDate,
        supplierName,
        source: 'invoice_scan' as const,
        confidence: toNumber(line.confidence ?? response.confidence),
        matched: Boolean(matchedIngredient),
        ingredientId: matchedIngredient?.id,
      };
    });
}
