// Supabase REST client — no SDK needed, pure fetch
const SUPABASE_URL = 'https://gwmfhaumkfgoqnnywvag.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3bWZoYXVta2Znb3Fubnl3dmFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NzM4MzgsImV4cCI6MjA5MzA0OTgzOH0.BkC7l2W4wuDD0mgvk5fom2PEn6avhkBOBJ5yK-Aib58';

const H = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
};

type Row = Record<string, unknown>;
type Result = { data: Row[]; error: string | null };

export const supabase = {
  from: (table: string) => ({
    insert: (row: Row) => {
      fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: { ...H, 'Prefer': 'return=minimal' },
        body: JSON.stringify(row),
      }).catch(() => {});
      return { then: (cb: () => void) => { cb(); return { catch: () => {} }; } };
    },
    select: (_cols = '*') => ({
      order: (_col: string, _opts?: object) => ({
        limit: (_n: number): Promise<Result> =>
          fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=visited_at.desc&limit=200`, { headers: H })
            .then(async r => ({ data: r.ok ? (await r.json() as Row[]) : [], error: r.ok ? null : 'failed' }))
            .catch((): Result => ({ data: [], error: 'failed' })),
      }),
    }),
  }),
};
