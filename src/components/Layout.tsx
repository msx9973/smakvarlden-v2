import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Zap, BookOpen, ShoppingBasket, Calculator, TrendingUp, Trash2, LogOut, Crown } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { store } from '../store';
import type { ReactNode } from 'react';

const NAV = [
  { to:'/',            icon:LayoutDashboard, label:'Dashboard',       hot:false },
  { to:'/price-intel', icon:Zap,             label:'Prisintelligens', hot:true  },
  { to:'/recipes',     icon:BookOpen,        label:'Recept',          hot:false },
  { to:'/ingredients', icon:ShoppingBasket,  label:'Ingredienser',    hot:false },
  { to:'/calculator',  icon:Calculator,      label:'Kalkylator',      hot:false },
  { to:'/analytics',   icon:TrendingUp,      label:'Köksanalys',      hot:false },
  { to:'/waste',       icon:Trash2,          label:'Svinnanalys',     hot:false },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const alertCount = store.getIngredients().filter(i => i.prevPriceSek > 0 && ((i.priceSek - i.prevPriceSek)/i.prevPriceSek*100) > 3).length;

  function handleLogout() { logout(); nav('/login'); }

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <aside style={{ width:224, flexShrink:0, background:'var(--brown)', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:100 }}>
        {/* Logo */}
        <div style={{ padding:'20px 18px 16px', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
          <div className="font-serif" style={{ fontSize:17, fontWeight:600, color:'var(--goldl)', letterSpacing:'-.1px' }}>Smakvärlden</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,.3)', marginTop:3, fontFamily:'DM Mono' }}>Kökets operativsystem</div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'10px 8px', display:'flex', flexDirection:'column', gap:1 }}>
          {NAV.map(({ to, icon: Icon, label, hot }) => (
            <NavLink key={to} to={to} end={to === '/'}
              style={({ isActive }) => ({
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'9px 10px', borderRadius:9,
                fontSize:13.5, fontWeight:500, textDecoration:'none',
                color: isActive ? '#fff' : 'rgba(255,255,255,.5)',
                background: isActive ? 'rgba(255,255,255,.11)' : 'transparent',
                transition:'all .15s',
              })}>
              <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                <Icon size={15} style={{ flexShrink:0 }} />
                {label}
              </div>
              {hot && alertCount > 0 && (
                <span style={{ fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:100, background:'rgba(185,28,28,.8)', color:'#fff', minWidth:18, textAlign:'center' }}>
                  {alertCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding:'10px 8px', borderTop:'1px solid rgba(255,255,255,.08)' }}>
          {user && (
            <div style={{ padding:'10px', borderRadius:9, marginBottom:6, background:'rgba(255,255,255,.06)' }}>
              <div style={{ fontSize:12, fontWeight:600, color:'#fff', textTransform:'capitalize' }}>{user.name}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,.35)', marginTop:1 }}>
                {user.plan === 'pro' ? <span style={{ color:'var(--goldl)' }}>⭐ Pro</span> : <span>Gratisplan</span>}
              </div>
            </div>
          )}
          {user?.plan === 'free' && (
            <NavLink to="/upgrade" style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 10px', borderRadius:9, marginBottom:4, background:'rgba(201,168,76,.14)', border:'1px solid rgba(201,168,76,.2)', textDecoration:'none', fontSize:12, fontWeight:600, color:'var(--goldl)' }}>
              <Crown size={12} /> Uppgradera till Pro
            </NavLink>
          )}
          <button onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'8px 10px', borderRadius:9, border:'none', background:'transparent', fontSize:13, color:'rgba(255,255,255,.4)', cursor:'pointer', textAlign:'left' }}>
            <LogOut size={14} /> Logga ut
          </button>
        </div>
      </aside>

      <main style={{ marginLeft:224, flex:1, minHeight:'100vh', background:'var(--cream)' }}>
        {children}
      </main>
    </div>
  );
}
