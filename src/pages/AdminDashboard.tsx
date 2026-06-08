import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Visit {
  id: string;
  type: 'demo' | 'real';
  email: string;
  visited_at: string;
}

interface Stats {
  demo: number;
  real: number;
  today: number;
  thisWeek: number;
  total: number;
}

export default function AdminDashboard() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [stats, setStats] = useState<Stats>({ demo: 0, real: 0, today: 0, thisWeek: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);

  // Simple password protection
  const ADMIN_PASSWORD = 'smakvarlden2025';

  function handleLogin() {
    if (password === ADMIN_PASSWORD) setAuthed(true);
  }

  useEffect(() => {
    if (!authed) return;
    loadData();
  }, [authed]);

  async function loadData() {
    setLoading(true);
    const { data } = await supabase
      .from('demo_visits')
      .select('*')
      .order('visited_at', { ascending: false })
      .limit(200);

    if (data) {
      setVisits(data);
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      setStats({
        demo:     data.filter(v => v.type === 'demo').length,
        real:     data.filter(v => v.type === 'real').length,
        today:    data.filter(v => v.visited_at.startsWith(todayStr)).length,
        thisWeek: data.filter(v => v.visited_at >= weekAgo).length,
        total:    data.length,
      });
    }
    setLoading(false);
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 40, width: '100%', maxWidth: 380, textAlign: 'center' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: 'var(--brown)', marginBottom: 8 }}>Admin</div>
          <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 28 }}>Smakvärlden dashboard</div>
          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, marginBottom: 12, boxSizing: 'border-box' as const, outline: 'none' }}
          />
          <button
            onClick={handleLogin}
            style={{ width: '100%', padding: '12px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Logga in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', padding: '40px 24px', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: 'var(--brown)' }}>Admin Dashboard</div>
            <div style={{ fontSize: 13, color: 'var(--t3)', marginTop: 4 }}>Smakvärlden · Besöksstatistik</div>
          </div>
          <button onClick={loadData} style={{ padding: '8px 18px', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
            ↺ Uppdatera
          </button>
        </div>

        {/* Stats cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Totalt inloggningar', value: stats.total, color: 'var(--brown)' },
            { label: 'Demo-konton', value: stats.demo, color: '#92400e' },
            { label: 'Riktiga konton', value: stats.real, color: 'var(--green)' },
            { label: 'Idag', value: stats.today, color: 'var(--gold)' },
            { label: 'Denna vecka', value: stats.thisWeek, color: '#1d4ed8' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 700, color: s.color, letterSpacing: -1 }}>{loading ? '—' : s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4, fontFamily: 'DM Mono, monospace', letterSpacing: 0.5 }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Recent visits table */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>Senaste inloggningar</div>
            <div style={{ fontSize: 12, color: 'var(--t3)' }}>Visar {visits.length} senaste</div>
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>Laddar...</div>
          ) : visits.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>Inga besök ännu. Dela länken med restauranger!</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--brown)' }}>
                  {['Typ', 'E-post / Domän', 'Datum', 'Tid'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: 'rgba(255,255,255,.6)', fontWeight: 600, fontSize: 11, letterSpacing: 1, fontFamily: 'DM Mono, monospace' }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visits.map((v, i) => {
                  const date = new Date(v.visited_at);
                  return (
                    <tr key={v.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--white)' : 'var(--cream)' }}>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{
                          background: v.type === 'demo' ? 'rgba(146,64,14,.1)' : 'rgba(21,128,61,.1)',
                          color: v.type === 'demo' ? '#92400e' : 'var(--green)',
                          padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, fontFamily: 'DM Mono, monospace'
                        }}>
                          {v.type === 'demo' ? 'DEMO' : 'RIKTIG'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 16px', color: 'var(--t2)' }}>{v.email || '—'}</td>
                      <td style={{ padding: '10px 16px', color: 'var(--t2)', fontFamily: 'DM Mono, monospace', fontSize: 11 }}>
                        {date.toLocaleDateString('sv-SE')}
                      </td>
                      <td style={{ padding: '10px 16px', color: 'var(--t3)', fontFamily: 'DM Mono, monospace', fontSize: 11 }}>
                        {date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: 'var(--t3)' }}>
          smakvarlden.se · Admin · Data från Supabase
        </div>
      </div>
    </div>
  );
}
