import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gwmfhaumkfgoqnnywvag.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3bWZoYXVta2Znb3Fubnl3dmFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NzM4MzgsImV4cCI6MjA5MzA0OTgzOH0.BkC7l2W4wuDD0mgvk5fom2PEn6avhkBOBJ5yK-Aib58';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── TYPES ──────────────────────────────────────────
export interface Restaurant {
  id: string;
  email: string;
  name?: string;
  restaurant_name?: string;
  city?: string;
  plan: 'free' | 'pro' | 'enterprise';
  scan_count_invoice: number;
  scan_count_recipe: number;
  scan_reset_date: string;
  created_at: string;
}

export interface Ingredient {
  id: string;
  restaurant_id: string;
  name: string;
  unit: string;
  current_price: number;
  created_at: string;
}

export interface PriceHistory {
  id: string;
  ingredient_id: string;
  restaurant_id: string;
  old_price: number;
  new_price: number;
  source: string;
  recorded_at: string;
}

export interface Recipe {
  id: string;
  restaurant_id: string;
  name: string;
  category: string;
  servings: number;
  selling_price?: number;
  food_cost: number;
  margin: number;
  created_at: string;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
}

// ── RESTAURANT ─────────────────────────────────────
export async function getOrCreateRestaurant(email: string, name?: string): Promise<Restaurant | null> {
  // Try to get existing restaurant
  const { data: existing } = await supabase
    .from('restaurants')
    .select('*')
    .eq('email', email)
    .single();

  if (existing) return existing;

  // Create new
  const { data, error } = await supabase
    .from('restaurants')
    .insert({ email, name })
    .select()
    .single();

  if (error) { console.error('Error creating restaurant:', error); return null; }
  return data;
}

// ── INGREDIENTS ────────────────────────────────────
export async function getIngredients(restaurantId: string): Promise<Ingredient[]> {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('name');
  if (error) { console.error('Error fetching ingredients:', error); return []; }
  return data || [];
}

export async function upsertIngredient(
  restaurantId: string,
  name: string,
  unit: string,
  price: number
): Promise<Ingredient | null> {
  // Check if ingredient exists
  const { data: existing } = await supabase
    .from('ingredients')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('name', name)
    .single();

  if (existing) {
    // Record price history if changed
    if (existing.current_price !== price) {
      await supabase.from('price_history').insert({
        ingredient_id: existing.id,
        restaurant_id: restaurantId,
        old_price: existing.current_price,
        new_price: price,
        source: 'invoice_scan'
      });
    }
    // Update price
    const { data, error } = await supabase
      .from('ingredients')
      .update({ current_price: price, unit, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) { console.error('Error updating ingredient:', error); return null; }
    return data;
  }

  // Create new
  const { data, error } = await supabase
    .from('ingredients')
    .insert({ restaurant_id: restaurantId, name, unit, current_price: price })
    .select()
    .single();
  if (error) { console.error('Error creating ingredient:', error); return null; }
  return data;
}

// ── RECIPES ────────────────────────────────────────
export async function getRecipes(restaurantId: string): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('name');
  if (error) { console.error('Error fetching recipes:', error); return []; }
  return data || [];
}

export async function saveRecipe(
  restaurantId: string,
  recipe: Omit<Recipe, 'id' | 'restaurant_id' | 'created_at'>
): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from('recipes')
    .insert({ ...recipe, restaurant_id: restaurantId })
    .select()
    .single();
  if (error) { console.error('Error saving recipe:', error); return null; }
  return data;
}

// ── PRICE HISTORY ──────────────────────────────────
export async function getPriceHistory(restaurantId: string, limit = 50): Promise<PriceHistory[]> {
  const { data, error } = await supabase
    .from('price_history')
    .select('*, ingredients(name, unit)')
    .eq('restaurant_id', restaurantId)
    .order('recorded_at', { ascending: false })
    .limit(limit);
  if (error) { console.error('Error fetching price history:', error); return []; }
  return data || [];
}

// ── SCAN COUNTER ───────────────────────────────────
export async function incrementScanCount(
  restaurantId: string,
  type: 'invoice' | 'recipe'
): Promise<void> {
  const col = type === 'invoice' ? 'scan_count_invoice' : 'scan_count_recipe';
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('scan_count_invoice, scan_count_recipe, scan_reset_date, plan')
    .eq('id', restaurantId)
    .single();

  if (!restaurant) return;

  // Reset monthly counter if new month
  const lastReset = new Date(restaurant.scan_reset_date);
  const now = new Date();
  if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
    await supabase.from('restaurants').update({
      scan_count_invoice: 0,
      scan_count_recipe: 0,
      scan_reset_date: now.toISOString().split('T')[0]
    }).eq('id', restaurantId);
    return;
  }

  await supabase.from('restaurants')
    .update({ [col]: (restaurant[col] || 0) + 1 })
    .eq('id', restaurantId);
}

export async function canScan(
  restaurantId: string,
  type: 'invoice' | 'recipe'
): Promise<boolean> {
  const { data } = await supabase
    .from('restaurants')
    .select('scan_count_invoice, scan_count_recipe, plan')
    .eq('id', restaurantId)
    .single();

  if (!data) return false;
  if (data.plan === 'pro' || data.plan === 'enterprise') return true;

  const count = type === 'invoice' ? data.scan_count_invoice : data.scan_count_recipe;
  return (count || 0) < 2;
}
