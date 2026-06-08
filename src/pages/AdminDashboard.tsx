import { useEffect, useState } from 'react';

const SUPABASE_URL = 'https://gwmfhaumkfgoqnnywvag.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3bWZoYXVta2Znb3Fubnl3dmFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NzM4MzgsImV4cCI6MjA5MzA0OTgzOH0.BkC7l2W4wuDD0mgvk5fom2PEn6avhkBOBJ5yK-Aib58';
const H = { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` };

interface Visit {
  id: string;
  type: 'demo' | 'real';
  email: string;
  visited_at: string;
}

const ADMIN_PASSWORD = 'smakvarlden2025';

function StatCard({ label, value, sub, color = 'var(--brown)' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 16px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color, letterSpacing: -1 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4, fontFamily: 'DM Mono, monospace', letterSpacing: 0.5, textTransform: 'uppercase' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--gold)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<'overview' | 'customers' | 'usage' | 'logins'>('overview');

  useEffect(() => { if (authed) loadData(); }, [authed]);

  async function loadData() {
    setLoading(true);
    const r = await fetch(`${SUPABASE_URL}/rest/v1/demo_visits?select=*&order=visited_at.desc&limit=500`, { headers: H });
    const data: Visit[] = r.ok ? await r.json() : [];
    setVisits(data);
    setLoading(false);
  }

  // Computed stats
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const demoVisits = visits.filter(v => v.type === 'demo');
  const realVisits = visits.filter(v => v.type === 'real');
  const todayVisits = visits.filter(v => v.visited_at.startsWith(todayStr));
  const weekVisits = visits.filter(v => v.visited_at >= weekAgo);
  const monthVisits = visits.filter(v => v.visited_at >= monthAgo);

  // Unique real customers by email domain
  const realDomains = [...new Set(realVisits.map(v => v.email).filter(Boolean))];
  const demoDomains = [...new Set(demoVisits.map(v => v.email).filter(Boolean))];

  // Customer table — unique real users with visit count and last seen
  const customerMap: Record<string, { count: number; last: string; first: string }> = {};
  realVisits.forEach(v => {
    const key = v.email || 'unknown';
    if (!customerMap[key]) customerMap[key] = { count: 0, last: v.visited_at, first: v.visited_at };
    customerMap[key].count++;
    if (v.visited_at > customerMap[key].last) customerMap[key].last = v.visited_at;
    if (v.visited_at < customerMap[key].first) customerMap[key].first = v.visited_at;
  });
  const customers = Object.entries(customerMap).sort((a, b) => b[1].last.localeCompare(a[1].last));

  // Usage by day (last 7 days)
  const dayLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
    return d.toISOString().split('T')[0];
  });
  const dayData = dayLabels.map(day => ({
    day: day.slice(5),
    demo: demoVisits.filter(v => v.visited_at.startsWith(day)).length,
    real: realVisits.filter(v => v.visited_at.startsWith(day)).length,
  }));
  const maxDay = Math.max(...dayData.map(d => d.demo + d.real), 1);

  const btnStyle = (active: boolean) => ({
    padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
    fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
    background: active ? 'var(--brown)' : 'transparent',
    color: active ? '#fff' : 'var(--t2)',
    borderBottom: active ? 'none' : '2px solid transparent',
  });

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 40, width: '100%', maxWidth: 360, textAlign: 'center' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: 'var(--brown)', marginBottom: 6 }}>Smakvärlden</div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 28, fontFamily: 'DM Mono, monospace', letterSpacing: 1 }}>ADMIN DASHBOARD</div>
          <input type="password" placeholder="Lösenord" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && password === ADMIN_PASSWORD && setAuthed(true)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, marginBottom: 12, boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
          />
          <button onClick={() => password === ADMIN_PASSWORD && setAuthed(true)}
            style={{ width: '100%', padding: 13, background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            Logga in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'DM Sans, sans-serif' }}>

      {/* Header */}
      <div style={{ background: 'var(--brown)', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: 'var(--goldl)' }}>Smakvärlden Admin</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', fontFamily: 'DM Mono, monospace', marginTop: 2 }}>DASHBOARD · {new Date().toLocaleDateString('sv-SE')}</div>
        </div>
        <button onClick={loadData} style={{ padding: '8px 16px', background: 'rgba(255,255,255,.1)', color: 'var(--goldl)', border: '1px solid rgba(201,168,76,.3)', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'DM Mono, monospace' }}>
          ↺ UPPDATERA
        </button>
      </div>

      {/* Tabs */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '0 32px', display: 'flex', gap: 4 }}>
        {(['overview', 'customers', 'usage', 'logins'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={btnStyle(tab === t)}>
            {t === 'overview' ? '📊 Översikt' : t === 'customers' ? '🍽️ Kunder' : t === 'usage' ? '📈 Användning' : '🔐 Inloggningar'}
          </button>
        ))}
      </div>

      <div style={{ padding: '32px', maxWidth: 1100, margin: '0 auto' }}>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
              <StatCard label="Totalt besök" value={loading ? '—' : visits.length} />
              <StatCard label="Demo-besök" value={loading ? '—' : demoVisits.length} color="#92400e" />
              <StatCard label="Riktiga konton" value={loading ? '—' : realDomains.length} color="var(--green)" sub="unika användare" />
              <StatCard label="Idag" value={loading ? '—' : todayVisits.length} color="var(--gold)" />
              <StatCard label="Denna vecka" value={loading ? '—' : weekVisits.length} color="#1d4ed8" />
              <StatCard label="Denna månad" value={loading ? '—' : monthVisits.length} color="#7c3aed" />
            </div>

            {/* Business stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
              <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginBottom: 16 }}>📋 Kontoöversikt</div>
                {[
                  { label: 'Free konton', value: realDomains.length, color: 'var(--t2)' },
                  { label: 'Pro konton', value: 0, color: 'var(--green)' },
                  { label: 'MRR (kr)', value: '0 kr', color: 'var(--gold)' },
                  { label: 'Målet (10 Pro)', value: `${realDomains.length}/10`, color: 'var(--brown)' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', fontSize: 13 }}>
                    <span style={{ color: 'var(--t2)' }}>{r.label}</span>
                    <span style={{ fontWeight: 700, color: r.color }}>{r.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginBottom: 16 }}>🎯 Konvertering</div>
                {[
                  { label: 'Demo-besökare', value: demoDomains.length },
                  { label: 'Registrerade (real)', value: realDomains.length },
                  { label: 'Konverteringsgrad', value: demoDomains.length > 0 ? `${Math.round(realDomains.length / demoDomains.length * 100)}%` : '0%' },
                  { label: 'Pilot-kund (Koh Chang)', value: realDomains.some(e => e.includes('kohchang') || e.includes('koh')) ? '✓ Aktiv' : '⏳ Väntar' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', fontSize: 13 }}>
                    <span style={{ color: 'var(--t2)' }}>{r.label}</span>
                    <span style={{ fontWeight: 700, color: 'var(--brown)' }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* CUSTOMERS TAB */}
        {tab === 'customers' && (
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>🍽️ Registrerade kunder</div>
              <div style={{ fontSize: 12, color: 'var(--t3)' }}>{customers.length} kunder</div>
            </div>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>Laddar...</div>
            ) : customers.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🍽️</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Inga riktiga kunder ännu</div>
                <div style={{ fontSize: 12, marginTop: 8 }}>Skicka välkomstmejlet till Koh Chang!</div>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--brown)' }}>
                    {['E-post / Domän', 'Plan', 'Inloggningar', 'Första besök', 'Senaste besök', 'Status'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: 'rgba(255,255,255,.6)', fontWeight: 600, fontSize: 10, letterSpacing: 1, fontFamily: 'DM Mono, monospace' }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.map(([email, stats], i) => {
                    const daysSinceLastVisit = Math.floor((now.getTime() - new Date(stats.last).getTime()) / (1000 * 60 * 60 * 24));
                    const isActive = daysSinceLastVisit <= 7;
                    return (
                      <tr key={email} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--white)' : 'var(--cream)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--brown)' }}>{email}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ background: 'rgba(21,128,61,.1)', color: 'var(--green)', padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }}>FREE</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--t2)' }}>{stats.count}x</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--t3)' }}>{new Date(stats.first).toLocaleDateString('sv-SE')}</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--t3)' }}>{new Date(stats.last).toLocaleDateString('sv-SE')}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ background: isActive ? 'rgba(21,128,61,.1)' : 'rgba(107,94,82,.1)', color: isActive ? 'var(--green)' : 'var(--t3)', padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }}>
                            {isActive ? '✓ Aktiv' : `${daysSinceLastVisit}d sedan`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* USAGE TAB */}
        {tab === 'usage' && (
          <>
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginBottom: 20 }}>📈 Besök senaste 7 dagarna</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
                {dayData.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'flex-end', height: 120 }}>
                      {d.real > 0 && (
                        <div style={{ width: '100%', height: `${(d.real / maxDay) * 60}px`, background: 'var(--green)', borderRadius: '4px 4px 0 0', minHeight: 4 }} title={`${d.real} riktiga`} />
                      )}
                      {d.demo > 0 && (
                        <div style={{ width: '100%', height: `${(d.demo / maxDay) * 60}px`, background: 'var(--gold)', borderRadius: d.real > 0 ? 0 : '4px 4px 0 0', minHeight: 4 }} title={`${d.demo} demo`} />
                      )}
                      {d.demo === 0 && d.real === 0 && (
                        <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 2 }} />
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'DM Mono, monospace' }}>{d.day}</div>
                    <div style={{ fontSize: 10, color: 'var(--t2)', fontWeight: 600 }}>{d.demo + d.real}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--t2)' }}>
                  <div style={{ width: 12, height: 12, background: 'var(--gold)', borderRadius: 2 }} />Demo
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--t2)' }}>
                  <div style={{ width: 12, height: 12, background: 'var(--green)', borderRadius: 2 }} />Riktiga konton
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <StatCard label="Besök idag" value={todayVisits.length} color="var(--gold)" />
              <StatCard label="Denna vecka" value={weekVisits.length} color="#1d4ed8" />
              <StatCard label="Denna månad" value={monthVisits.length} color="#7c3aed" />
            </div>
          </>
        )}

        {/* LOGINS TAB */}
        {tab === 'logins' && (
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>🔐 Alla inloggningar</div>
              <div style={{ fontSize: 12, color: 'var(--t3)' }}>Visar {visits.length} senaste</div>
            </div>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>Laddar...</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--brown)' }}>
                    {['Typ', 'E-post / Domän', 'Datum', 'Tid'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: 'rgba(255,255,255,.6)', fontWeight: 600, fontSize: 10, letterSpacing: 1, fontFamily: 'DM Mono, monospace' }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visits.map((v, i) => {
                    const date = new Date(v.visited_at);
                    return (
                      <tr key={v.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--white)' : 'var(--cream)' }}>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ background: v.type === 'demo' ? 'rgba(146,64,14,.1)' : 'rgba(21,128,61,.1)', color: v.type === 'demo' ? '#92400e' : 'var(--green)', padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, fontFamily: 'DM Mono, monospace' }}>
                            {v.type === 'demo' ? 'DEMO' : 'RIKTIG'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px', color: 'var(--t2)' }}>{v.email || '—'}</td>
                        <td style={{ padding: '10px 16px', color: 'var(--t3)', fontFamily: 'DM Mono, monospace', fontSize: 11 }}>{date.toLocaleDateString('sv-SE')}</td>
                        <td style={{ padding: '10px 16px', color: 'var(--t3)', fontFamily: 'DM Mono, monospace', fontSize: 11 }}>{date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
