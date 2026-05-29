type PricePoint = { date: string; priceSek: number };

export type SeedIngredient = {
  id: string;
  name: string;
  category: string;
  unit: string;
  priceSek: number;
  prevPriceSek: number;
  supplier?: string;
  priceHistory: PricePoint[];
  updatedAt: string;
};

function hist(current: number, prev: number): PricePoint[] {
  const pts: PricePoint[] = [];
  const now = new Date('2026-05-16');
  for (let w = 8; w >= 0; w--) {
    const d = new Date(now);
    d.setDate(d.getDate() - w * 7);
    const t = (8 - w) / 8;
    const p = prev + (current - prev) * t + (Math.random() - 0.5) * (current * 0.02);
    pts.push({ date: d.toISOString().slice(0, 10), priceSek: Math.round(p * 100) / 100 });
  }
  pts[pts.length - 1].priceSek = current;
  return pts;
}

/** name, category, unit, priceSek, prevPriceSek, supplier */
type Row = [string, string, string, number, number, string];

const ROWS: Row[] = [
  // Fisk (15)
  ['Norsk Lax', 'Fisk', 'kg', 145, 129, 'Menigo'],
  ['Laxfilé ASC', 'Fisk', 'kg', 138, 125, 'Martin & Servera'],
  ['Torskfilé', 'Fisk', 'kg', 185, 172, 'Menigo'],
  ['Sejfilé', 'Fisk', 'kg', 95, 88, 'Snabbgross'],
  ['Röding', 'Fisk', 'kg', 220, 205, 'Martin & Servera'],
  ['Tonfisk (färsk)', 'Fisk', 'kg', 280, 265, 'Menigo'],
  ['Räkor skalade', 'Fisk', 'kg', 320, 305, 'Snabbgross'],
  ['Krabbstavar', 'Fisk', 'kg', 89, 85, 'Menigo'],
  ['Sillfilé', 'Fisk', 'kg', 65, 62, 'Snabbgross'],
  ['Makrillfilé', 'Fisk', 'kg', 78, 72, 'Menigo'],
  ['Kolja', 'Fisk', 'kg', 82, 79, 'Martin & Servera'],
  ['Regnbågsforell', 'Fisk', 'kg', 165, 158, 'Menigo'],
  ['Bläckfisk', 'Fisk', 'kg', 195, 188, 'Snabbgross'],
  ['Musslor', 'Fisk', 'kg', 145, 140, 'Menigo'],
  ['Ansjovis', 'Fisk', 'kg', 420, 400, 'Martin & Servera'],

  // Kött & fågel (18)
  ['Oxfilé', 'Kött', 'kg', 368, 380, 'Martin & Servera'],
  ['Kycklingfilé', 'Kött', 'kg', 112, 98, 'Menigo'],
  ['Kycklingbröst', 'Kött', 'kg', 108, 96, 'Snabbgross'],
  ['Nötfärs 18%', 'Kött', 'kg', 125, 118, 'Menigo'],
  ['Fläskfilé', 'Kött', 'kg', 98, 92, 'Martin & Servera'],
  ['Lammlägg', 'Kött', 'kg', 285, 275, 'Menigo'],
  ['Entrecôte', 'Kött', 'kg', 245, 238, 'Martin & Servera'],
  ['Högrev', 'Kött', 'kg', 115, 108, 'Snabbgross'],
  ['Bacon', 'Kött', 'kg', 145, 138, 'Menigo'],
  ['Chorizo', 'Kött', 'kg', 165, 158, 'Snabbgross'],
  ['Anka bröst', 'Kött', 'kg', 195, 188, 'Menigo'],
  ['Vilt innerfilé', 'Kött', 'kg', 320, 310, 'Martin & Servera'],
  ['Kalkonbröst', 'Kött', 'kg', 135, 128, 'Menigo'],
  ['Fläsksida', 'Kött', 'kg', 78, 75, 'Snabbgross'],
  ['Nötbuljong', 'Kött', 'liter', 28, 27, 'Menigo'],
  ['Kalvfond', 'Kött', 'liter', 38, 36, 'Martin & Servera'],
  ['Prinskorv', 'Kött', 'kg', 78, 75, 'Snabbgross'],
  ['Cabanossy', 'Kött', 'kg', 185, 178, 'Menigo'],

  // Grönsaker (28)
  ['Avokado', 'Grönsaker', 'kg', 90, 83, 'Martin & Servera'],
  ['Edamame', 'Grönsaker', 'kg', 80, 78, 'Menigo'],
  ['Rucola', 'Grönsaker', 'kg', 70, 68, 'Martin & Servera'],
  ['Tomat kvist', 'Grönsaker', 'kg', 42, 35, 'Martin & Servera'],
  ['Krossade tomater', 'Grönsaker', 'kg', 28, 26, 'Snabbgross'],
  ['Soltorkade tomater', 'Grönsaker', 'kg', 185, 172, 'Menigo'],
  ['Potatis', 'Grönsaker', 'kg', 12, 11, 'Snabbgross'],
  ['Gul lök', 'Grönsaker', 'kg', 18, 17, 'Menigo'],
  ['Rödlök', 'Grönsaker', 'kg', 22, 20, 'Martin & Servera'],
  ['Vitlök', 'Grönsaker', 'kg', 85, 82, 'Menigo'],
  ['Morot', 'Grönsaker', 'kg', 16, 15, 'Snabbgross'],
  ['Purjolök', 'Grönsaker', 'kg', 35, 32, 'Martin & Servera'],
  ['Champinjoner', 'Grönsaker', 'kg', 68, 65, 'Menigo'],
  ['Zucchini', 'Grönsaker', 'kg', 38, 36, 'Snabbgross'],
  ['Aubergine', 'Grönsaker', 'kg', 45, 42, 'Martin & Servera'],
  ['Paprika röd', 'Grönsaker', 'kg', 55, 52, 'Menigo'],
  ['Gurka', 'Grönsaker', 'kg', 28, 26, 'Snabbgross'],
  ['Spenat färsk', 'Grönsaker', 'kg', 95, 88, 'Martin & Servera'],
  ['Blandad sallad', 'Grönsaker', 'kg', 85, 80, 'Menigo'],
  ['Basilika färsk', 'Grönsaker', 'kg', 180, 165, 'Martin & Servera'],
  ['Dill färsk', 'Grönsaker', 'kg', 120, 110, 'Menigo'],
  ['Persilja färsk', 'Grönsaker', 'kg', 95, 90, 'Snabbgross'],
  ['Lime', 'Grönsaker', 'kg', 65, 58, 'Menigo'],
  ['Citron', 'Grönsaker', 'kg', 45, 42, 'Martin & Servera'],
  ['Ingefära färsk', 'Grönsaker', 'kg', 95, 88, 'Snabbgross'],
  ['Kapris', 'Grönsaker', 'kg', 220, 210, 'Menigo'],
  ['Oliven svarta', 'Grönsaker', 'kg', 95, 88, 'Martin & Servera'],
  ['Broccoli', 'Grönsaker', 'kg', 48, 45, 'Snabbgross'],

  // Mejeri (18)
  ['Smör 82%', 'Mejeri', 'kg', 95, 90, 'Martin & Servera'],
  ['Parmigiano Reggiano', 'Mejeri', 'kg', 220, 213, 'Menigo'],
  ['Grana Padano', 'Mejeri', 'kg', 198, 188, 'Snabbgross'],
  ['Vispgrädde 40%', 'Mejeri', 'liter', 58, 52, 'Snabbgross'],
  ['Matlagningsgrädde', 'Mejeri', 'liter', 52, 48, 'Menigo'],
  ['Crème fraiche', 'Mejeri', 'liter', 62, 58, 'Martin & Servera'],
  ['Cheddar riven', 'Mejeri', 'kg', 145, 138, 'Snabbgross'],
  ['Mozzarella', 'Mejeri', 'kg', 125, 118, 'Menigo'],
  ['Fetaost', 'Mejeri', 'kg', 165, 158, 'Martin & Servera'],
  ['Ricotta', 'Mejeri', 'kg', 98, 92, 'Menigo'],
  ['Mascarpone', 'Mejeri', 'kg', 145, 138, 'Snabbgross'],
  ['Brie', 'Mejeri', 'kg', 165, 158, 'Menigo'],
  ['Getost', 'Mejeri', 'kg', 220, 210, 'Martin & Servera'],
  ['Matlagningsyoghurt', 'Mejeri', 'liter', 42, 40, 'Snabbgross'],
  ['Ägg L', 'Mejeri', 'kg', 38, 36, 'Menigo'],
  ['Kvarg naturell', 'Mejeri', 'kg', 45, 42, 'Snabbgross'],
  ['Blue Stilton', 'Mejeri', 'kg', 285, 275, 'Menigo'],
  ['Comté', 'Mejeri', 'kg', 245, 235, 'Martin & Servera'],

  // Torrvaror (16)
  ['Japanskt Ris', 'Torrvaror', 'kg', 60, 59, 'Snabbgross'],
  ['Pasta (Torr)', 'Torrvaror', 'kg', 45, 44, 'Snabbgross'],
  ['Spaghetti', 'Torrvaror', 'kg', 42, 40, 'Menigo'],
  ['Basmatiris', 'Torrvaror', 'kg', 52, 50, 'Martin & Servera'],
  ['Couscous', 'Torrvaror', 'kg', 38, 36, 'Snabbgross'],
  ['Bulgur', 'Torrvaror', 'kg', 42, 40, 'Menigo'],
  ['Vetemjöl', 'Torrvaror', 'kg', 12, 11, 'Snabbgross'],
  ['Ströbröd', 'Torrvaror', 'kg', 22, 21, 'Menigo'],
  ['Panko', 'Torrvaror', 'kg', 45, 42, 'Martin & Servera'],
  ['Valnötter', 'Torrvaror', 'kg', 185, 178, 'Snabbgross'],
  ['Pinjenötter', 'Torrvaror', 'kg', 420, 400, 'Menigo'],
  ['Mandlar skalade', 'Torrvaror', 'kg', 165, 158, 'Martin & Servera'],
  ['Havregryn', 'Torrvaror', 'kg', 18, 17, 'Snabbgross'],
  ['Polenta', 'Torrvaror', 'kg', 48, 45, 'Menigo'],
  ['Röda linser', 'Torrvaror', 'kg', 55, 52, 'Snabbgross'],
  ['Kikärtor torkade', 'Torrvaror', 'kg', 42, 40, 'Menigo'],

  // Kryddor & oljor (16)
  ['Sojasås', 'Kryddor', 'liter', 55, 54, 'Menigo'],
  ['Olivolja extra virgin', 'Kryddor', 'liter', 95, 88, 'Martin & Servera'],
  ['Rapsolja', 'Kryddor', 'liter', 28, 26, 'Snabbgross'],
  ['Sesamolja', 'Kryddor', 'liter', 185, 175, 'Menigo'],
  ['Balsamvinäger', 'Kryddor', 'liter', 125, 118, 'Martin & Servera'],
  ['Vit balsamvinäger', 'Kryddor', 'liter', 68, 65, 'Snabbgross'],
  ['Dijonsenap', 'Kryddor', 'kg', 78, 75, 'Menigo'],
  ['Tomatpuré', 'Kryddor', 'kg', 45, 42, 'Snabbgross'],
  ['Sambal oelek', 'Kryddor', 'kg', 85, 82, 'Menigo'],
  ['Currypaste röd', 'Kryddor', 'kg', 95, 88, 'Martin & Servera'],
  ['Honung', 'Kryddor', 'kg', 85, 82, 'Snabbgross'],
  ['Havssalt', 'Kryddor', 'kg', 18, 17, 'Menigo'],
  ['Svartpeppar hel', 'Kryddor', 'kg', 220, 210, 'Martin & Servera'],
  ['Paprikapulver rökt', 'Kryddor', 'kg', 145, 138, 'Snabbgross'],
  ['Vaniljextrakt', 'Kryddor', 'liter', 420, 400, 'Menigo'],
  ['Fiskfond', 'Kryddor', 'liter', 32, 30, 'Martin & Servera'],

  // Skaldjur (8)
  ['Hummer', 'Skaldjur', 'kg', 468, 480, 'Snabbgross'],
  ['Räkor stora', 'Skaldjur', 'kg', 385, 368, 'Menigo'],
  ['Hummerfond', 'Skaldjur', 'liter', 245, 238, 'Martin & Servera'],
  ['Blåmusslor', 'Skaldjur', 'kg', 65, 62, 'Snabbgross'],
  ['Krabba kokt', 'Skaldjur', 'kg', 520, 498, 'Menigo'],
  ['Räkor i skal', 'Skaldjur', 'kg', 185, 172, 'Snabbgross'],
  ['Scampi', 'Skaldjur', 'kg', 420, 405, 'Menigo'],
  ['Löjrom', 'Skaldjur', 'kg', 890, 850, 'Martin & Servera'],

  // Svamp (5)
  ['Tryffel (Svart)', 'Svamp', 'kg', 2800, 2314, 'Menigo'],
  ['Karl Johan torkad', 'Svamp', 'kg', 850, 820, 'Martin & Servera'],
  ['Shiitake färsk', 'Svamp', 'kg', 285, 265, 'Menigo'],
  ['Portabello', 'Svamp', 'kg', 125, 118, 'Snabbgross'],
  ['Kantarell färsk', 'Svamp', 'kg', 320, 295, 'Menigo'],
];

export const SEED_ING: SeedIngredient[] = ROWS.map(([name, category, unit, priceSek, prevPriceSek, supplier], index) => ({
  id: `i${index + 1}`,
  name,
  category,
  unit,
  priceSek,
  prevPriceSek,
  supplier,
  priceHistory: hist(priceSek, prevPriceSek),
  updatedAt: '2026-05-16',
}));
