import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BookOpen, ShoppingBasket, Calculator, LogOut, Crown, ShieldCheck, Languages } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { useLanguage } from '../lib/language';
import { store } from '../store';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { lang, setLang, isEnglish } = useLanguage();
  const nav = useNavigate();
  const NAV = [
    { to:'/dashboard', icon:Home, label:isEnglish ? 'Home' : 'Hem' },
    { to:'/recipes', icon:BookOpen, label:isEnglish ? 'Dishes' : 'Rätter' },
    { to:'/ingredients', icon:ShoppingBasket, label:isEnglish ? 'Prices' : 'Priser' },
    { to:'/calculator', icon:Calculator, label:isEnglish ? 'Calculator' : 'Räkna' },
  ];
  const alertCount = store.getIngredients().filter(i =>
    i.prevPriceSek > 0 && ((i.priceSek - i.prevPriceSek) / i.prevPriceSek * 100) > 3
  ).length;

  function handleLogout() { logout(); nav('/login'); }

  return (
    <div className="app-shell">
      <aside className="app-sidebar">

        <div style={{ padding:'20px 18px 16px', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
          <div className="font-serif" style={{ fontSize:17, fontWeight:600, color:'var(--goldl)', letterSpacing:'-.1px' }}>Smakvärlden</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.45)', marginTop:4, lineHeight:1.4 }}>
            {isEnglish ? 'Food prices and margin control' : 'Hjälp med matpriser och marginal'}
          </div>
        </div>

        <nav className="app-nav">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className="app-nav-link"
              style={({ isActive }) => ({
                position:'relative',
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'10px 12px', borderRadius:9,
                fontSize:14, fontWeight:600, textDecoration:'none',
                color: isActive ? '#fff' : 'rgba(255,255,255,.55)',
                background: isActive ? 'rgba(255,255,255,.11)' : 'transparent',
                transition:'all .15s',
              })}>
              <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                <Icon size={16} style={{ flexShrink:0 }} />
                <span className="app-nav-label">{label}</span>
              </div>
              {to === '/ingredients' && alertCount > 0 && (
                <span className="app-nav-badge" style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:100, background:'rgba(185,28,28,.85)', color:'#fff' }}>
                  {alertCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="app-user" style={{ padding:'10px 8px', borderTop:'1px solid rgba(255,255,255,.08)' }}>
          {user && (
            <div style={{ padding:'10px', borderRadius:9, marginBottom:6, background:'rgba(255,255,255,.06)' }}>
              <div style={{ fontSize:12, fontWeight:600, color:'#fff' }}>{user.name}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,.35)', marginTop:1 }}>
                {user.plan === 'pro' ? <span style={{ color:'var(--goldl)' }}>⭐ Pro</span> : isEnglish ? 'Free' : 'Gratis'}
              </div>
            </div>
          )}
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 8px', borderRadius:9, marginBottom:6, background:'rgba(255,255,255,.05)', color:'rgba(255,255,255,.5)' }}>
            <Languages size={13} />
            <button onClick={() => setLang('sv')} style={{ flex:1, padding:'5px 0', borderRadius:7, border:'none', cursor:'pointer', background:lang === 'sv' ? 'rgba(255,255,255,.14)' : 'transparent', color:lang === 'sv' ? '#fff' : 'rgba(255,255,255,.42)', fontSize:12, fontWeight:700 }}>SV</button>
            <button onClick={() => setLang('en')} style={{ flex:1, padding:'5px 0', borderRadius:7, border:'none', cursor:'pointer', background:lang === 'en' ? 'rgba(255,255,255,.14)' : 'transparent', color:lang === 'en' ? '#fff' : 'rgba(255,255,255,.42)', fontSize:12, fontWeight:700 }}>EN</button>
          </div>
          {user?.plan === 'free' && (
            <NavLink to="/upgrade" style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 10px', borderRadius:9, marginBottom:4, background:'rgba(201,168,76,.14)', border:'1px solid rgba(201,168,76,.2)', textDecoration:'none', fontSize:12, fontWeight:600, color:'var(--goldl)' }}>
              <Crown size={12} /> {isEnglish ? 'More scans (Pro)' : 'Fler skanningar (Pro)'}
            </NavLink>
          )}
          <NavLink to="/trust" style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 10px', borderRadius:9, marginBottom:3, textDecoration:'none', fontSize:12, color:'rgba(255,255,255,.3)' }}>
            <ShieldCheck size={12} /> {isEnglish ? 'Privacy' : 'Integritet'}
          </NavLink>
          <button onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'8px 10px', borderRadius:9, border:'none', background:'transparent', fontSize:13, color:'rgba(255,255,255,.4)', cursor:'pointer', textAlign:'left' }}>
            <LogOut size={14} /> {isEnglish ? 'Log out' : 'Logga ut'}
          </button>
        </div>
      </aside>

      <main className="app-main">
        {children}
      </main>
    </div>
  );
}
