import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';
import { store, margin, totalCost, marginColor, buildAlerts } from '../store';
import { useAuth } from '../lib/auth-context';

// buildAlerts from store handles impact computation

export default function Dashboard() {
  const { user } = useAuth();
  const recipes     = store.getRecipes();
  const ingredients = store.getIngredients();
  const alerts      = useMemo(() => buildAlerts(ingredients, recipes, 3), [ingredients, recipes]);

  const ranked = useMemo(() =>
    recipes.map(r => ({ ...r, m: margin(r), tc: totalCost(r) })).sort((a,b) => b.m - a.m),
  [recipes]);

  const avgMargin   = recipes.length ? recipes.reduce((s,r) => s+margin(r),0)/recipes.length : 0;
  const avgFoodCost = recipes.length ? recipes.reduce((s,r) => s+(totalCost(r)/(r.sellingPriceSek||1))*100,0)/recipes.length : 0;
  const totalAlerts = alerts.filter(a => a.changePct > 0).length;

  return (
    <div style={{ padding:'32px 36px', maxWidth:1040, margin:'0 auto' }}>

      {/* Greeting */}
      <div style={{ marginBottom:28 }}>
        <h1 className="font-serif" style={{ fontSize:28, fontWeight:600, letterSpacing:'-.6px', color:'var(--t1)' }}>
          God dag{user?.name ? `, ${user.name}` : ''} 👨‍🍳
        </h1>
        <p style={{ fontSize:14, color:'var(--t2)', marginTop:4 }}>Kökets lönsamhetsöverblick</p>
        <p style={{ fontSize:12, color:'var(--t3)', marginTop:6 }}>Demo data / example calculations. Ingredient price changed → affected recipes → margin loss → suggested action.</p>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
        {[
          { label:'Snittmarginal',    value:`${avgMargin.toFixed(1)}%`,    sub: avgMargin>62?'✓ Över mål (62%)':'↓ Under mål', ok:avgMargin>62 },
          { label:'Råvarukostnad',    value:`${avgFoodCost.toFixed(1)}%`,  sub: avgFoodCost<30?'✓ Under 30% mål':'↑ Över mål',  ok:avgFoodCost<30 },
          { label:'Aktiva recept',    value:`${recipes.length}`,            sub:'Totalt sparade', ok:undefined },
          { label:'Prisvarningar',    value:`${totalAlerts}`,               sub: totalAlerts>0?'Kräver åtgärd':'Inga varningar', ok:totalAlerts===0 },
        ].map(k => (
          <div key={k.label} style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:14, padding:'16px 18px' }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', marginBottom:6 }}>{k.label}</div>
            <div className="font-serif" style={{ fontSize:26, fontWeight:600, color:'var(--t1)', marginBottom:3 }}>{k.value}</div>
            <div style={{ fontSize:11, fontWeight:600, color: k.ok===undefined?'var(--t3)':k.ok?'var(--green)':'var(--red)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* PRICE INTELLIGENCE — hero widget */}
      {alerts.length > 0 && (
        <div style={{ background:'var(--white)', border:'1.5px solid rgba(185,28,28,.22)', borderRadius:16, overflow:'hidden', marginBottom:20 }}>
          <div style={{ padding:'14px 20px', background:'rgba(185,28,28,.05)', borderBottom:'1px solid rgba(185,28,28,.12)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:9 }}>
              <AlertTriangle size={15} style={{ color:'var(--red)' }} />
              <span style={{ fontSize:13, fontWeight:700, color:'var(--t1)' }}>Prisintelligens — åtgärd krävs</span>
              <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:100, background:'var(--redbg)', color:'var(--red)' }}>{alerts.length} varningar</span>
            </div>
            <Link to="/price-intel" style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, fontWeight:600, color:'var(--gold)', textDecoration:'none' }}>
              Se fullständig analys <ArrowRight size={13} />
            </Link>
          </div>
          {alerts.filter(a=>a.changePct>0).slice(0,3).map((alert, idx) => {
            const worstDelta = alert.affectedRecipes.length > 0 ? Math.min(...alert.affectedRecipes.map(r => r.marginDelta)) : 0;
            const maxIncrease = alert.affectedRecipes.length > 0 ? Math.max(...alert.affectedRecipes.map(r => r.suggestedPriceIncrease)) : 0;
            return (
              <div key={alert.ingredient.id} style={{ padding:'14px 20px', borderBottom: idx<Math.min(alerts.filter(a=>a.changePct>0).length,3)-1?'1px solid var(--border)':'none', display:'grid', gridTemplateColumns:'1fr auto', gap:16, alignItems:'center' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                    <TrendingUp size={13} style={{ color:'var(--red)', flexShrink:0 }} />
                    <span style={{ fontSize:14, fontWeight:600, color:'var(--t1)' }}>{alert.ingredient.name}</span>
                    <span className="font-mono" style={{ fontSize:13, fontWeight:700, color:'var(--red)' }}>
                      +{alert.changePct.toFixed(1)}%
                    </span>
                    <span style={{ fontSize:11, color:'var(--t3)' }}>
                      → {alert.ingredient.priceSek.toFixed(0)} kr/{alert.ingredient.unit}
                    </span>
                  </div>
                  <div style={{ fontSize:12, color:'var(--t2)', marginBottom:6 }}>
                    Påverkar: {alert.affectedRecipes.map(r => r.recipe.name).join(' · ')}
                  </div>
                  {worstDelta < -1 && (
                    <div style={{ fontSize:12, color:'var(--t2)' }}>
                      Marginal sjunker upp till <span style={{ color:'var(--red)', fontWeight:700 }}>{Math.abs(worstDelta).toFixed(1)}%</span>
                      {' '}· Rekommenderat: höj pris <span style={{ color:'var(--brown)', fontWeight:700 }}>+{maxIncrease} kr</span>
                    </div>
                  )}
                </div>
                <Link to="/price-intel" style={{ padding:'7px 14px', borderRadius:9, background:'var(--goldbg)', border:'1px solid var(--goldb)', fontSize:12, fontWeight:600, color:'var(--brown)', textDecoration:'none', whiteSpace:'nowrap' }}>
                  Åtgärda →
                </Link>
              </div>
            );
          })}
          {alerts.filter(a=>a.changePct>0).length > 3 && (
            <div style={{ padding:'10px 20px', textAlign:'center' }}>
              <Link to="/price-intel" style={{ fontSize:13, color:'var(--gold)', fontWeight:600, textDecoration:'none' }}>
                +{alerts.filter(a=>a.changePct>0).length-3} fler varningar — se alla →
              </Link>
            </div>
          )}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:16 }}>
        {/* MARGIN RANKING */}
        <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:16 }}>
          <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <TrendingUp size={14} style={{ color:'var(--green)' }} />
              <span style={{ fontSize:13, fontWeight:600, color:'var(--t1)' }}>Bäst marginal</span>
            </div>
            <Link to="/recipes" style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'var(--gold)', textDecoration:'none', fontWeight:600 }}>
              Alla recept <ArrowRight size={12} />
            </Link>
          </div>
          {ranked.length === 0 ? (
            <div style={{ padding:'32px', textAlign:'center', fontSize:13, color:'var(--t3)' }}>
              Inga recept ännu —{' '}
              <Link to="/recipes" style={{ color:'var(--gold)', fontWeight:600 }}>skapa ett</Link>
            </div>
          ) : ranked.slice(0,6).map((r,idx) => (
            <Link key={r.id} to={`/recipes/${r.id}`} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 18px', borderBottom:idx<Math.min(ranked.length,6)-1?'1px solid var(--border)':'none', textDecoration:'none' }}>
              <span className="font-mono" style={{ fontSize:11, color:'var(--t3)', width:18 }}>{String(idx+1).padStart(2,'0')}</span>
              <span style={{ flex:1, fontSize:13, fontWeight:500, color:'var(--t1)' }}>{r.name}</span>
              <div style={{ width:60, height:4, background:'var(--muted)', borderRadius:100, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${Math.min(r.m,100)}%`, background:marginColor(r.m), borderRadius:100 }} />
              </div>
              <span className="font-mono" style={{ fontSize:12, fontWeight:700, color:marginColor(r.m), width:36, textAlign:'right' }}>
                {r.m.toFixed(0)}%
              </span>
            </Link>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {[
            { to:'/price-intel',  emoji:'⚡', title:'Prisintelligens',  desc:'Se hur prisförändringar påverkar dina marginaler', hot:alerts.length>0 },
            { to:'/calculator',   emoji:'🧮', title:'Kalkylera ny rätt', desc:'Beräkna kostnad och marginal direkt' },
            { to:'/recipes',      emoji:'🍽️', title:'Mina recept',       desc:'Hantera och analysera dina rätter' },
            { to:'/ingredients',  emoji:'🥬', title:'Uppdatera priser',  desc:'Ange nya leverantörspriser — påverkan beräknas auto' },
          ].map(({ to, emoji, title, desc, hot }) => (
            <Link key={to} to={to}
              style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 18px', background:'var(--white)', border:`1px solid ${hot?'rgba(185,28,28,.25)':'var(--border)'}`, borderRadius:14, textDecoration:'none', transition:'all .2s' }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow='0 4px 16px var(--shadmd)'; (e.currentTarget as HTMLElement).style.transform='translateY(-1px)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow='none'; (e.currentTarget as HTMLElement).style.transform='none'}}
            >
              <span style={{ fontSize:22, flexShrink:0 }}>{emoji}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:'var(--t1)' }}>{title}</span>
                  {hot && <span style={{ fontSize:10, fontWeight:700, padding:'1px 7px', borderRadius:100, background:'var(--redbg)', color:'var(--red)' }}>{alerts.length} varningar</span>}
                </div>
                <div style={{ fontSize:12, color:'var(--t3)', marginTop:1 }}>{desc}</div>
              </div>
              <ArrowRight size={14} style={{ color:'var(--t3)', flexShrink:0 }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

