export const DEFAULT_PRODUCT_CATEGORY = 'Mat';

export const PRODUCT_CATEGORIES = [
  'Mat',
  'Dryck',
  'Kaffe',
  'Dessert',
  'Tillbehör',
  'Catering',
  // Keep legacy dish categories visible for existing saved demo data.
  'Förrätter',
  'Huvudrätter',
  'Soppor',
  'Sallader',
] as const;

export const PRODUCT_CATEGORY_FILTERS = ['Alla', ...PRODUCT_CATEGORIES] as const;
