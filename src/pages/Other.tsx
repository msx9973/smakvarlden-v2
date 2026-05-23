import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Crown, Check } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { store } from '../store';

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ WASTE PAGE ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
export function WastePage() {
  const ings = store.getIngredients();
  const RATES: Record<string,number> = { Fisk:12, KÃÂÃÂ¶tt:10, GrÃÂÃÂ¶nsaker:20, Mejeri:8, Torrvaror:4, Kryddor:6, Skaldjur:14, Svamp:18 };
  const rows = ings.map(i => ({
    ...i,
    wastePct: RATES[i.category] ?? 10,
    wasteCostDay: i.priceSek * ((RATES[i.category]??10)/100) * 0.5,
  })).sort((a,b) => b.wasteCostDay - a.wasteCostDay);
  const totalDay = rows.reduce((s,r) => s+r.wasteCostDay, 0);

  return (
    <div style={{ padding:'32px 36px', maxWidth:900, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 className="font-serif" style={{ fontSize:28, fontWeight:600, letterSpacing:'-.6px', color:'var(--t1)' }}>Demo data</h1>
        <p style={{ fontSize:14, color:'var(--t2)', marginTop:4 }}>Estimerade svinncostnader ÃÂ¢ÃÂÃÂ branschschabloner, inte verkliga mÃÂÃÂ¤tningar</p>
      </div>
      <div style={{ padding:'12px 16px', background:'rgba(59,130,246,.07)', border:'1px solid rgba(59,130,246,.18)', borderRadius:11, marginBottom:20, fontSize:13, color:'#1d4ed8' }}>
        ÃÂ¢ÃÂÃÂ¹ÃÂ¯ÃÂ¸ÃÂ Alla siffror ÃÂÃÂ¤r estimat baserade pÃÂÃÂ¥ branschschabloner per kategori ÃÂ¢ÃÂÃÂ inte uppmÃÂÃÂ¤tta vÃÂÃÂ¤rden.
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:24 }}>
        {[
          { label:'Est. svinn / dag',   value:`~${totalDay.toFixed(0)} kr` },
          { label:'Est. svinn / mÃÂÃÂ¥nad', value:`~${(totalDay*30).toFixed(0)} kr` },
          { label:'Est. svinn / ÃÂÃÂ¥r',    value:`~${(totalDay*365).toFixed(0)} kr` },
        ].map(s => (
          <div key={s.label} style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:14, padding:'16px 18px' }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', marginBottom:6 }}>{s.label}</div>
            <div className="font-serif" style={{ fontSize:24, fontWeight:600, color:'var(--red)' }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 90px 120px', padding:'9px 18px', background:'var(--muted)', borderBottom:'1px solid var(--border)' }}>
          {['Ingrediens','Kategori','Svinn %','Est. kostnad/dag'].map(h=>(
            <span key={h} style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)' }}>{h}</span>
          ))}
        </div>
        {rows.slice(0,12).map((r,i) => (
          <div key={r.id} style={{ display:'grid', gridTemplateColumns:'1fr 80px 90px 120px', padding:'11px 18px', borderBottom:i<11?'1px solid var(--border)':'none', alignItems:'center' }}>
            <span style={{ fontSize:13, fontWeight:500, color:'var(--t1)' }}>{r.name}</span>
            <span style={{ fontSize:12, color:'var(--t2)' }}>{r.category}</span>
            <span className="font-mono" style={{ fontSize:12, color:'var(--red)' }}>{r.wastePct}%</span>
            <span className="font-mono" style={{ fontSize:13, fontWeight:600, color:'var(--red)' }}>~{r.wasteCostDay.toFixed(0)} kr</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ LOGIN PAGE ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
export function LoginPage() {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const [mode, setMode]   = useState<'login'|'register'>('login');
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw]       = useState('');
  const [show, setShow]   = useState(false);
  const [err, setErr]     = useState('');
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      if (mode==='login') login(email, pw);
      else register(name, email, pw);
      nav('/dashboard');
    } catch(ex: unknown) { setErr(ex instanceof Error ? ex.message : 'Fel uppstod'); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:400 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:44, height:44, background:'var(--brown)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
            <svg width="20" height="20" viewBox="0 0 15 15" fill="none" stroke="hsl(44 54% 50%)" strokeWidth="1.6" strokeLinecap="round">
              <path d="M7.5 1.5v5M5 3.5l2.5 3 2.5-3M2 9.5h11M3.5 9.5V13M11.5 9.5V13"/>
            </svg>
          </div>
          <h1 className="font-serif" style={{ fontSize:22, fontWeight:600, color:'var(--brown)' }}>SmakvÃÂÃÂ¤rlden</h1>
          <p style={{ fontSize:13, color:'var(--t3)', marginTop:4 }}>Demo mode fÃÂÃÂ¶r kÃÂÃÂ¶kets operativsystem</p>
        </div>
        <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:20, padding:'28px', boxShadow:'0 8px 32px var(--shadmd)' }}>
          <div style={{ padding:'11px 13px', borderRadius:11, background:'rgba(59,130,246,.07)', border:'1px solid rgba(59,130,246,.18)', color:'#1d4ed8', fontSize:12.5, lineHeight:1.5, marginBottom:16 }}>
            <strong>Demo only.</strong> This login is local browser demo access, not real account security. Demo data / example calculations are used throughout the app.
          </div>
          <div style={{ display:'flex', gap:2, padding:4, background:'var(--muted)', borderRadius:12, marginBottom:22 }}>
            {(['login','register'] as const).map(m => (
              <button key={m} onClick={()=>{setMode(m);setErr('');}}
                style={{ flex:1, padding:'8px', borderRadius:9, border:'none', font:'600 13px DM Sans', cursor:'pointer', transition:'.15s',
                  background:mode===m?'var(--white)':'transparent', color:mode===m?'var(--t1)':'var(--t2)',
                  boxShadow:mode===m?'0 1px 4px var(--shad)':'none' }}>
                {m==='login'?'Logga in':'Skapa konto'}
              </button>
            ))}
          </div>
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {mode==='register' && (
              <div>
                <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', display:'block', marginBottom:6 }}>Namn</label>
                <input className="inp" placeholder="Ditt namn" value={name} onChange={e=>setName(e.target.value)} />
              </div>
            )}
            <div>
              <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', display:'block', marginBottom:6 }}>E-post</label>
              <input className="inp" type="email" placeholder="din@email.se" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', display:'block', marginBottom:6 }}>LÃÂÃÂ¶senord</label>
              <div style={{ position:'relative' }}>
                <input className="inp" type={show?'text':'password'} placeholder={mode==='register'?'Minst 6 tecken':'ÃÂ¢ÃÂÃÂ¢ÃÂ¢ÃÂÃÂ¢ÃÂ¢ÃÂÃÂ¢ÃÂ¢ÃÂÃÂ¢ÃÂ¢ÃÂÃÂ¢ÃÂ¢ÃÂÃÂ¢ÃÂ¢ÃÂÃÂ¢ÃÂ¢ÃÂÃÂ¢'} value={pw} onChange={e=>setPw(e.target.value)} required style={{ paddingRight:40 }} />
                <button type="button" onClick={()=>setShow(v=>!v)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--t3)' }}>
                  {show ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
            </div>
            {err && <div style={{ padding:'9px 13px', background:'var(--redbg)', border:'1px solid rgba(185,28,28,.2)', borderRadius:9, fontSize:13, color:'var(--red)' }}>{err}</div>}
            <button type="submit" className="btn-brown" disabled={loading} style={{ marginTop:4, padding:13, fontSize:15 }}>
              {loading ? 'Laddar...' : mode==='login' ? 'Logga in' : 'Skapa konto'}
            </button>
          </form>
          {mode==='login' && (
            <p style={{ textAlign:'center', marginTop:14, fontSize:12, color:'var(--t3)' }}>
              Demo: use any email + password with 4+ characters.
            </p>
          )}
          <div style={{ display:'flex', justifyContent:'center', gap:10, marginTop:16, fontSize:12 }}>
            <Link to="/privacy" style={{ color:'var(--gold)', fontWeight:600 }}>Privacy</Link>
            <Link to="/terms" style={{ color:'var(--gold)', fontWeight:600 }}>Terms</Link>
            <Link to="/contact" style={{ color:'var(--gold)', fontWeight:600 }}>Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ UPGRADE PAGE ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
export function TrustPage() {
  const sections = [
    {
      title: 'Integritet',
      body: 'SmakvÃ¤rlden sparar dina recept, ingredienser och priser lokalt i din webblÃ¤sare. Ingen information skickas till nÃ¥gon server. Din data stannar hos dig.',
    },
    {
      title: 'Villkor',
      body: 'SmakvÃ¤rlden Ã¤r ett verktyg fÃ¶r restauranger som vill ha koll pÃ¥ sina kostnader och marginaler. Kalkyler och prisuppgifter Ã¤r vÃ¤gledande och ersÃ¤tter inte professionell redovisningsrÃ¥dgivning.',
    },
    {
      title: 'DatasÃ¤kerhet',
      body: 'All data sparas i din webblÃ¤sare och fÃ¶rsvinner om du rensar din historik. Vi rekommenderar att du inte lagrar kÃ¤nslig affÃ¤rsinformation i demoversionen.',
    },
    {
      title: 'Kontakt',
      body: 'Har du frÃ¥gor eller vill komma i kontakt med oss? Skriv till chef@smakvarlden.se sÃ¥ Ã¥terkommer vi sÃ¥ snart vi kan.',
    },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', padding:'32px 20px' }}>
      <div style={{ maxWidth:880, margin:'0 auto' }}>
        <Link to="/login" style={{ display:'inline-flex', marginBottom:24, color:'var(--gold)', fontWeight:700, textDecoration:'none' }}>ÃÂ¢ÃÂÃÂ Back to demo login</Link>
        <div style={{ background:'var(--brown)', color:'#fff', borderRadius:20, padding:'30px', marginBottom:18 }}>
          <div className="font-serif" style={{ fontSize:34, fontWeight:600, color:'var(--goldl)', marginBottom:10 }}>Integritet & villkor</div>
          <p style={{ color:'rgba(255,255,255,.72)', fontSize:15, maxWidth:660, lineHeight:1.7 }}>
            SmakvÃ¤rlden hjÃ¤lper restauranger att hÃ¥lla koll pÃ¥ ingredienspriser, receptkostnader och marginaler â allt pÃ¥ ett stÃ¤lle.
          </p>
        </div>
        <div className="trust-grid" style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
          {sections.map(section => (
            <section key={section.title} style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:'20px' }}>
              <h2 className="font-serif" style={{ fontSize:22, fontWeight:600, color:'var(--t1)', marginBottom:8 }}>{section.title}</h2>
              <p style={{ color:'var(--t2)', fontSize:14, lineHeight:1.7 }}>{section.body}</p>
            </section>
          ))}
        </div>
      </div>
        <p style={{ textAlign:'center', marginTop:28, fontSize:12, color:'var(--t3)' }}>
          © 2026 Smakvärlden. Alla rättigheter förbehållna.
        </p>
    </div>
  );
}

export function UpgradePage() {
  const { user } = useAuth();
  const plans = [
    { name:'Gratis', price:'0 kr', per:'fÃÂÃÂ¶r alltid', featured:false,
      feats:['Upp till 10 recept','Receptkalkylator','Ingrediensdatabas','Prisintelligens','Demo data'],
      btn:'Nuvarande plan', disabled:user?.plan==='free' },
    { name:'Pro KÃÂÃÂ¶k', price:'59 kr', per:'/mÃÂÃÂ¥nad ÃÂÃÂ· 7 dagar gratis', featured:true,
      feats:['ObegrÃÂÃÂ¤nsade recept','LiveprisÃÂÃÂ¶vervakning','Prisvarningar','MarginalfÃÂÃÂ¶rlust per recept','FÃÂÃÂ¶reslagna prisÃÂÃÂ¥tgÃÂÃÂ¤rder','Prioriterad support'],
      btn:user?.plan==='pro'?'ÃÂ¢ÃÂÃÂ Aktiv plan':'Starta 7 dagar gratis', disabled:user?.plan==='pro' },
    { name:'FÃÂÃÂ¶retag', price:'Offert', per:'Flera anlÃÂÃÂ¤ggningar', featured:false,
      feats:['Allt i Pro','Flera kÃÂÃÂ¶k','Teamkonton','LeverantÃÂÃÂ¶rsintegrationer','Dedikerad support'],
      btn:'Kontakta oss', disabled:false },
  ];
  return (
    <div style={{ padding:'32px 36px', maxWidth:900, margin:'0 auto' }}>
      <div style={{ textAlign:'center', marginBottom:40 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'5px 14px', borderRadius:100, background:'var(--goldbg)', border:'1px solid var(--goldb)', fontSize:12, fontWeight:600, color:'var(--gold)', marginBottom:16 }}>
          <Crown size={13}/> Early Access
        </div>
        <h1 className="font-serif" style={{ fontSize:36, fontWeight:600, letterSpacing:'-1px', color:'var(--t1)', marginBottom:12 }}>Enkelt. Inga ÃÂÃÂ¶verraskningar.</h1>
        <p style={{ fontSize:16, color:'var(--t2)', maxWidth:420, margin:'0 auto' }}>BÃÂÃÂ¶rja gratis. Uppgradera nÃÂÃÂ¤r kÃÂÃÂ¶ket ÃÂÃÂ¤r redo.</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {plans.map(p => (
          <div key={p.name} style={{ borderRadius:16, padding:'26px', border:p.featured?'1.5px solid rgba(201,148,58,.5)':'1px solid var(--border)', background:p.featured?'var(--brown)':'var(--white)', position:'relative' }}>
            {p.featured && <div style={{ position:'absolute', top:-1, left:'50%', transform:'translateX(-50%)', background:'var(--gold)', color:'var(--brown)', fontSize:10, fontWeight:700, padding:'3px 12px', borderRadius:'0 0 8px 8px', letterSpacing:'.5px' }}>REKOMMENDERAT</div>}
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.8px', textTransform:'uppercase', color:p.featured?'rgba(255,255,255,.35)':'var(--t3)', marginBottom:14 }}>{p.name}</div>
            <div className="font-serif" style={{ fontSize:36, fontWeight:600, color:p.featured?'var(--goldl)':'var(--t1)', letterSpacing:'-.5px', marginBottom:4 }}>{p.price}</div>
            <div style={{ fontSize:12, color:p.featured?'rgba(255,255,255,.3)':'var(--t3)', marginBottom:22 }}>{p.per}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:22 }}>
              {p.feats.map(f => (
                <div key={f} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:p.featured?'rgba(255,255,255,.7)':'var(--t2)' }}>
                  <Check size={13} style={{ color:'var(--green)', flexShrink:0 }}/> {f}
                </div>
              ))}
            </div>
            <button disabled={p.disabled} style={{ width:'100%', padding:12, borderRadius:10, border:'none', font:'600 13.5px DM Sans', cursor:p.disabled?'default':'pointer', transition:'.2s', background:p.featured?'var(--gold)':p.disabled?'var(--muted)':'var(--muted)', color:p.featured?'var(--brown)':'var(--t2)', opacity:p.disabled&&!p.featured ? .7 : 1 }}>
              {p.btn}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

