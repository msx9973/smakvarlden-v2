// Supabase REST client — no SDK needed
const SUPABASE_URL = 'https://gwmfhaumkfgoqnnywvag.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3bWZoYXVta2Znb3Fubnl3dmFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NzM4MzgsImV4cCI6MjA5MzA0OTgzOH0.BkC7l2W4wuDD0mgvk5fom2PEn6avhkBOBJ5yK-Aib58';

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
};

export const supabase = {
  from: (table: string) => ({
    insert: (data: Record<string, unknown>) => ({
      then: (cb: () => void) => {
        fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
          method: 'POST',
          headers: { ...headers, 'Prefer': 'return=minimal' },
          body: JSON.stringify(data),
        }).then(cb).catch(() => {});
        return { catch: () => {} };
      },
    }),
    select: (cols = '*') => ({
      order: (_col: string, _opts?: object) => ({
        limit: (_n: number): Promise<{ data: unknown[]; error: string | null }> =>
          fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${cols}&order=visited_at.desc&limit=200`, { headers })
            .then((r): Promise<{ data: unknown[]; error: string | null }> =>
              r.ok
                ? r.json().then((data: unknown[]) => ({ data, error: null as string | null }))
                : Promise.resolve({ data: [] as unknown[], error: 'failed' as string | null }))
            .catch(() => ({ data: [] as unknown[], error: 'failed' as string | null })),
      }),
    }),
  }),
};

export type { };
