import {
  calculateMarginPct,
  calculatePriceChangePct,
  calculateRecipeRawCost,
  calculateRecipeRawCostWithPrices,
  calculateRecipeTotalCost,
  suggestSellingPrice,
} from '../lib/calculations';
import { SEED_ING } from './seed-ingredients';

// ─── TYPES ───────────────────────────────────────────────────────────────────
export interface PricePoint {
  date: string;
  priceSek: number;
}

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  unit: string;
  priceSek: number;
  prevPriceSek: number;
  supplier?: string;
  priceHistory: PricePoint[];
  updatedAt: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  servings: number;
  sellingPriceSek: number;
  ingredients: RecipeIngredient[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro';
}

// ─── IMPACT TYPES ─────────────────────────────────────────────────────────────
export interface RecipeImpact {
  recipe: Recipe;
  oldMarginPct: number;
  newMarginPct: number;
  oldCostSek: number;
  newCostSek: number;
  marginDelta: number;
  profitLostSek: number;
  suggestedPriceIncrease: number;
  suggestedPortionReductionG: number;
}

export interface IngredientAlert {
  ingredient: Ingredient;
  changePct: number;
  changeAbsSek: number;
  affectedRecipes: RecipeImpact[];
  severity: 'low' | 'medium' | 'high';
}

// ─── COMPUTED ────────────────────────────────────────────────────────────────
export function rawCost(r: Recipe): number {
  return calculateRecipeRawCost(r.ingredients);
}
export function totalCost(r: Recipe): number { return calculateRecipeTotalCost(rawCost(r)); }

export function liveRawCost(r: Recipe, ings: Ingredient[]): number {
  return calculateRecipeRawCostWithPrices(r, ings, ing => ing.priceSek);
}
export function prevRawCost(r: Recipe, ings: Ingredient[]): number {
  return calculateRecipeRawCostWithPrices(r, ings, ing => ing.prevPriceSek);
}
export function liveTotalCost(r: Recipe, ings: Ingredient[]): number { return calculateRecipeTotalCost(liveRawCost(r, ings)); }
export function prevTotalCost(r: Recipe, ings: Ingredient[]): number { return calculateRecipeTotalCost(prevRawCost(r, ings)); }

export function liveMargin(r: Recipe, ings: Ingredient[]): number {
  return calculateMarginPct(r.sellingPriceSek, liveTotalCost(r, ings));
}
export function prevMargin(r: Recipe, ings: Ingredient[]): number {
  return calculateMarginPct(r.sellingPriceSek, prevTotalCost(r, ings));
}
export function margin(r: Recipe): number {
  return calculateMarginPct(r.sellingPriceSek, totalCost(r));
}
export function suggested(raw: number, target = 0.66): number {
  return suggestSellingPrice(raw, target);
}
export function marginColor(pct: number): string {
  if (pct > 62) return 'var(--green)';
  if (pct > 45) return '#ca8a04';
  return 'var(--red)';
}

// ─── IMPACT ENGINE ────────────────────────────────────────────────────────────
export function computeImpact(
  ingredient: Ingredient,
  recipes: Recipe[],
  allIngredients: Ingredient[]
): RecipeImpact[] {
  return recipes
    .filter(r => r.ingredients.some(ri => ri.ingredientId === ingredient.id))
    .map(r => {
      const oldCost = prevTotalCost(r, allIngredients);
      const newCost = liveTotalCost(r, allIngredients);
      const sp = r.sellingPriceSek || suggested(liveRawCost(r, allIngredients));
      const oldM = sp > 0 ? ((sp - oldCost) / sp) * 100 : 0;
      const newM = sp > 0 ? ((sp - newCost) / sp) * 100 : 0;
      const target = Math.max(oldM / 100, 0.5);
      const suggestedNewPrice = newCost / (1 - target);
      const suggestedIncrease = Math.max(0, Math.round(suggestedNewPrice - sp));
      const ri = r.ingredients.find(i => i.ingredientId === ingredient.id);
      const gramsToSave = ri && ingredient.priceSek > 0 && suggestedIncrease > 0
        ? Math.round((suggestedIncrease / 1.2 / ingredient.priceSek) * 1000)
        : 0;
      return {
        recipe: r,
        oldMarginPct: oldM,
        newMarginPct: newM,
        oldCostSek: oldCost,
        newCostSek: newCost,
        marginDelta: newM - oldM,
        profitLostSek: Math.max(0, newCost - oldCost),
        suggestedPriceIncrease: suggestedIncrease,
        suggestedPortionReductionG: gramsToSave,
      };
    })
    .sort((a, b) => a.marginDelta - b.marginDelta);
}

export function buildAlerts(
  ingredients: Ingredient[],
  recipes: Recipe[],
  threshold = 1
): IngredientAlert[] {
  return ingredients
    .filter(i => i.prevPriceSek > 0 && Math.abs(((i.priceSek - i.prevPriceSek) / i.prevPriceSek) * 100) >= threshold)
    .map(ing => {
      const pct = calculatePriceChangePct(ing.priceSek, ing.prevPriceSek);
      return {
        ingredient: ing,
        changePct: pct,
        changeAbsSek: ing.priceSek - ing.prevPriceSek,
        affectedRecipes: computeImpact(ing, recipes, ingredients),
        severity: (Math.abs(pct) > 15 ? 'high' : Math.abs(pct) > 5 ? 'medium' : 'low') as IngredientAlert['severity'],
      };
    })
    .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct));
}

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const SEED_REC: Recipe[] = [
  {
    id:'r1', name:'Laxpoke Bowl', category:'Huvudrätter', servings:1, sellingPriceSek:139, createdAt:'2026-05-10',
    ingredients:[
      { ingredientId:'i1',  name:'Norsk Lax',    quantity:0.12, unit:'kg',    unitPrice:129 },
      { ingredientId:'i2',  name:'Japanskt Ris', quantity:0.10, unit:'kg',    unitPrice:59  },
      { ingredientId:'i3',  name:'Avokado',      quantity:0.06, unit:'kg',    unitPrice:83  },
      { ingredientId:'i4',  name:'Edamame',      quantity:0.04, unit:'kg',    unitPrice:78  },
      { ingredientId:'i11', name:'Sojasås',      quantity:0.02, unit:'liter', unitPrice:54  },
    ],
  },
  {
    id:'r2', name:'Beef Tartare', category:'Förrätter', servings:1, sellingPriceSek:175, createdAt:'2026-05-11',
    ingredients:[
      { ingredientId:'i5',  name:'Oxfilé',   quantity:0.15, unit:'kg', unitPrice:380 },
      { ingredientId:'i12', name:'Rucola',   quantity:0.02, unit:'kg', unitPrice:68  },
      { ingredientId:'i8',  name:'Smör 82%', quantity:0.01, unit:'kg', unitPrice:90  },
    ],
  },
  {
    id:'r3', name:'Pasta Tryffel', category:'Huvudrätter', servings:1, sellingPriceSek:245, createdAt:'2026-05-12',
    ingredients:[
      { ingredientId:'i10', name:'Pasta (Torr)',    quantity:0.10, unit:'kg', unitPrice:44   },
      { ingredientId:'i6',  name:'Tryffel (Svart)', quantity:0.01, unit:'kg', unitPrice:2314 },
      { ingredientId:'i8',  name:'Smör 82%',        quantity:0.03, unit:'kg', unitPrice:90   },
      { ingredientId:'i9',  name:'Parmigiano',      quantity:0.03, unit:'kg', unitPrice:213  },
    ],
  },
  {
    id:'r4', name:'Hummerbuljong', category:'Soppor', servings:1, sellingPriceSek:195, createdAt:'2026-05-13',
    ingredients:[
      { ingredientId:'i7', name:'Hummer',   quantity:0.18, unit:'kg', unitPrice:480 },
      { ingredientId:'i8', name:'Smör 82%', quantity:0.02, unit:'kg', unitPrice:90  },
    ],
  },
  {
    id:'r5', name:'Nigiri Lax', category:'Förrätter', servings:1, sellingPriceSek:95, createdAt:'2026-05-14',
    ingredients:[
      { ingredientId:'i1',  name:'Norsk Lax',    quantity:0.08, unit:'kg',    unitPrice:129 },
      { ingredientId:'i2',  name:'Japanskt Ris', quantity:0.08, unit:'kg',    unitPrice:59  },
      { ingredientId:'i11', name:'Sojasås',      quantity:0.01, unit:'liter', unitPrice:54  },
    ],
  },
  {
    id:'r6', name:'Krämig Kycklingpasta', category:'Huvudrätter', servings:1, sellingPriceSek:169, createdAt:'2026-05-15',
    ingredients:[
      { ingredientId:'i14', name:'Kycklingfilé',   quantity:0.16, unit:'kg',    unitPrice:98 },
      { ingredientId:'i10', name:'Pasta (Torr)',   quantity:0.11, unit:'kg',    unitPrice:44 },
      { ingredientId:'i15', name:'Vispgrädde 40%', quantity:0.08, unit:'liter', unitPrice:52 },
      { ingredientId:'i13', name:'Tomat kvist',    quantity:0.06, unit:'kg',    unitPrice:35 },
    ],
  },
];

// ─── STORE ────────────────────────────────────────────────────────────────────
function load<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save<T>(key: string, val: T) { localStorage.setItem(key, JSON.stringify(val)); }

const K = {
  session: 'sv_session',
  users: 'sv_users',
  legacyUser: 'sv_user',
  legacyIng: 'sv_ing4',
  legacyRec: 'sv_rec3',
};

function userKey(userId: string, kind: 'ing' | 'rec') {
  return `sv_${kind}_${userId}`;
}

function cloneSeed<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

function emailKey(email: string) {
  return email.trim().toLowerCase();
}

function getUserRegistry(): Record<string, User> {
  return load(K.users, {});
}

function saveUserRegistry(registry: Record<string, User>) {
  save(K.users, registry);
}

function initUserData(userId: string) {
  save(userKey(userId, 'ing'), cloneSeed(SEED_ING));
  save(userKey(userId, 'rec'), cloneSeed(SEED_REC));
}

function migrateLegacyData(userId: string) {
  if (localStorage.getItem(userKey(userId, 'ing'))) return;

  const legacyUser = load<User | null>(K.legacyUser, null);
  const legacyIng = localStorage.getItem(K.legacyIng);
  const legacyRec = localStorage.getItem(K.legacyRec);
  const shouldMigrate = legacyUser?.id === userId || (!legacyUser && (legacyIng || legacyRec));

  if (!shouldMigrate) return;

  if (legacyIng) save(userKey(userId, 'ing'), JSON.parse(legacyIng));
  else save(userKey(userId, 'ing'), cloneSeed(SEED_ING));

  if (legacyRec) save(userKey(userId, 'rec'), JSON.parse(legacyRec));
  else save(userKey(userId, 'rec'), cloneSeed(SEED_REC));
}

function currentUserId(): string | null {
  return load<User | null>(K.session, null)?.id ?? null;
}

function requireUserId(): string {
  const id = currentUserId();
  if (!id) throw new Error('Du måste vara inloggad.');
  return id;
}

function scanMonthKey(userId: string, kind: 'invoice' | 'recipe') {
  const month = new Date().toISOString().slice(0, 7);
  return kind === 'invoice' ? `sv_scans_${userId}_${month}` : `sv_rscans_${userId}_${month}`;
}

export const store = {
  getUser: (): User | null => {
    const session = load<User | null>(K.session, null);
    if (session) return session;
    const legacy = load<User | null>(K.legacyUser, null);
    if (legacy) {
      save(K.session, legacy);
      return legacy;
    }
    return null;
  },

  getIngredients: (): Ingredient[] => {
    const userId = currentUserId();
    if (!userId) return cloneSeed(SEED_ING);
    migrateLegacyData(userId);
    return load(userKey(userId, 'ing'), cloneSeed(SEED_ING));
  },

  saveIngredient(ing: Ingredient) {
    const userId = requireUserId();
    const key = userKey(userId, 'ing');
    const list = load(key, cloneSeed(SEED_ING));
    const idx  = list.findIndex(x => x.id === ing.id);
    if (idx >= 0) {
      const prev = list[idx];
      ing.prevPriceSek = prev.priceSek;
      ing.priceHistory = [...(prev.priceHistory ?? []), { date: ing.updatedAt, priceSek: ing.priceSek }].slice(-20);
      list[idx] = ing;
    } else {
      ing.prevPriceSek = ing.priceSek;
      ing.priceHistory = [{ date: ing.updatedAt, priceSek: ing.priceSek }];
      list.unshift(ing);
    }
    save(key, list);
  },

  deleteIngredient(id: string) {
    const userId = requireUserId();
    const key = userKey(userId, 'ing');
    save(key, load(key, cloneSeed(SEED_ING)).filter(x => x.id !== id));
  },

  getRecipes: (): Recipe[] => {
    const userId = currentUserId();
    if (!userId) return cloneSeed(SEED_REC);
    migrateLegacyData(userId);
    return load(userKey(userId, 'rec'), cloneSeed(SEED_REC));
  },

  saveRecipe(rec: Recipe) {
    const userId = requireUserId();
    const key = userKey(userId, 'rec');
    const list = load(key, cloneSeed(SEED_REC));
    const idx  = list.findIndex(x => x.id === rec.id);
    if (idx >= 0) list[idx] = rec; else list.unshift(rec);
    save(key, list);
  },

  deleteRecipe(id: string) {
    const userId = requireUserId();
    const key = userKey(userId, 'rec');
    save(key, load(key, cloneSeed(SEED_REC)).filter(x => x.id !== id));
  },

  getInvoiceScansUsed(): number {
    const userId = currentUserId();
    if (!userId) return 0;
    return parseInt(localStorage.getItem(scanMonthKey(userId, 'invoice')) || '0', 10);
  },

  incrementInvoiceScans() {
    const userId = requireUserId();
    const key = scanMonthKey(userId, 'invoice');
    localStorage.setItem(key, String(this.getInvoiceScansUsed() + 1));
  },

  getRecipeScansUsed(): number {
    const userId = currentUserId();
    if (!userId) return 0;
    return parseInt(localStorage.getItem(scanMonthKey(userId, 'recipe')) || '0', 10);
  },

  incrementRecipeScans() {
    const userId = requireUserId();
    const key = scanMonthKey(userId, 'recipe');
    localStorage.setItem(key, String(this.getRecipeScansUsed() + 1));
  },

  login(email: string, pw: string): User {
    if (!email.includes('@') || pw.length < 4) throw new Error('Ogiltig e-post eller lösenord');

    const registry = getUserRegistry();
    const key = emailKey(email);
    let user = registry[key];

    if (!user) {
      user = {
        id: crypto.randomUUID(),
        name: email.split('@')[0],
        email: email.trim(),
        plan: email.includes('pro') ? 'pro' : 'free',
      };
      registry[key] = user;
      saveUserRegistry(registry);
      initUserData(user.id);
    } else {
      user = {
        ...user,
        plan: email.includes('pro') ? 'pro' : user.plan,
      };
      registry[key] = user;
      saveUserRegistry(registry);
      migrateLegacyData(user.id);
    }

    save(K.session, user);
    return user;
  },

  register(name: string, email: string, pw: string): User {
    if (!name || !email.includes('@') || pw.length < 6) throw new Error('Fyll i alla fält (lösenord minst 6 tecken)');

    const registry = getUserRegistry();
    const key = emailKey(email);
    if (registry[key]) throw new Error('Det finns redan ett konto med den e-posten. Logga in i stället.');

    const user: User = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      plan: 'free',
    };
    registry[key] = user;
    saveUserRegistry(registry);
    initUserData(user.id);
    save(K.session, user);
    return user;
  },

  logout() {
    localStorage.removeItem(K.session);
  },
};
