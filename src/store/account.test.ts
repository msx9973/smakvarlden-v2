import { beforeEach, describe, expect, it, vi } from 'vitest';
import { store } from './index';

describe('per-account store', () => {
  beforeEach(() => {
    const memory: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem(key: string) {
        return memory[key] ?? null;
      },
      setItem(key: string, value: string) {
        memory[key] = value;
      },
      removeItem(key: string) {
        delete memory[key];
      },
    });
    vi.stubGlobal('crypto', {
      randomUUID: () => `id-${Math.random().toString(36).slice(2, 9)}`,
    });
  });

  it('keeps ingredients and recipes separate per account', () => {
    const userA = store.register('Anna', 'anna@test.se', 'secret1');
    store.saveIngredient({
      ...store.getIngredients()[0],
      name: 'Annas Lax',
      priceSek: 999,
    });

    store.logout();
    const userB = store.register('Bengt', 'bengt@test.se', 'secret2');

    expect(userA.id).not.toBe(userB.id);
    expect(store.getIngredients()[0].name).not.toBe('Annas Lax');

    store.login('anna@test.se', 'secret1');
    expect(store.getIngredients().some(i => i.name === 'Annas Lax')).toBe(true);
  });

  it('tracks scan limits per user', () => {
    store.register('Chef', 'chef@test.se', 'secret1');
    store.incrementInvoiceScans();
    expect(store.getInvoiceScansUsed()).toBe(1);

    store.logout();
    store.register('Other', 'other@test.se', 'secret2');
    expect(store.getInvoiceScansUsed()).toBe(0);
  });

  it('syncs public recipes to shared catalog', () => {
    store.register('Anna', 'anna@test.se', 'secret1');
    const recipe = {
      id: 'pub-recipe-1',
      name: 'Annas Pasta',
      category: 'Huvudrätter',
      servings: 1,
      sellingPriceSek: 120,
      ingredients: [],
      createdAt: '2026-05-30',
      visibility: 'public' as const,
    };
    store.saveRecipe(recipe);

    expect(store.getPublicRecipes()).toHaveLength(1);
    expect(store.getPublicRecipes()[0].ownerName).toBe('Anna');

    store.logout();
    store.register('Bengt', 'bengt@test.se', 'secret2');
    expect(store.getPublicRecipesFromOthers()).toHaveLength(1);
    expect(store.getRecipeById('pub-recipe-1')?.name).toBe('Annas Pasta');

    store.login('anna@test.se', 'secret1');
    store.saveRecipe({ ...recipe, visibility: 'private' });
    expect(store.getPublicRecipes()).toHaveLength(0);
  });
});
