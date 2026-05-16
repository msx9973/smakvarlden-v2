import { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, BarChart2 } from 'lucide-react';
import { store, margin, totalCost, marginColor } from '../store';

export default function Analytics() {
  const recipes     = store.getRecipes();
  const ingredients = store.getIngredients();

  const alerts = useMemo(() =>
    ingredients
      .map(i => ({ ...i, pct: i.prevPriceSek > 0 ? ((i.priceSek - i.prevPriceSek) / i.prevPriceSek) * 100 : 0 }))
      .filter(i => Math.abs(i.pct) > 1)
      .sort((a,b) => Math.abs(b.pct) - Math.abs(a.pct)),
  [ingredients]);

  const ranked = useMemo(() =>
    recipes.map(r => ({ ...r, m: margin(r), tc: totalCost(r) }))
      .sort((a,b) => b.m - a.m),
  [recipes]);

  const avgMargin   = recipes.length ? recipes.reduce((s,r) => s+margin(r),0)/recipes.length : 0;
  const avgFoodCost = recipes.length ? recipes.reduce((s,r) => s+(totalCost(r)/(r.sellingPriceSek||1))*100,0)/recipes.length : 0;

  const catStats = useMemo(() => {
    const map: Record<string, {count:number;total:number}> = {};
    ingredients.forEach(i => {
      if (!map[i.category]) map[i.category] = {count:0,total:0};
      map[i.category].count++;
      map[i.category].total += i.priceSek;
    });
    return Object.entries(map).map(([cat,{count,total}]) => ({ cat, count, avg: total/count }))
      .sort((a,b)=>b.avg-a.avg);
  }, [ingredients]);

  function Stat({ label, value, sub, ok }: {label:string;value:string;sub:string;ok?:boolean}) {
    return (
      <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:14, padding:'16px 18px' }}>
        <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', marginBottom:6 }}>{label}</div>
        <div className="font-serif" style={{ fontSize:26, fontWeight:600, color:'var(--t1)', marginBottom:4 }}>{value}</div>
        <div style={{ fontSize:11, fontWeight:600, color: ok===undefined?'var(--t3)':ok?'var(--green)':'var(--red)' }}>{sub}</div>
      </div>
    );
  }

  return (
    <div style={{ padding:'32px 36px', maxWidth:1040, margin:'0 auto' }}>
      <div style={{ marginBottom:28 }}>
        <h1 className="font-serif" style={{ fontSize:28, fontWeight:600, letterSpacing:'-.6px', color:'var(--t1)' }}>Köksanalys</h1>
        <p style={{ fontSize:14, color:'var(--t2)', marginTop:4 }}>Råvarukostnader, prisvarningar och lönsamhetsranking</p>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:28 }}>
        <Stat label="Snittmarginal"   value={`${avgMargin.toFixed(1)}%`}    sub={avgMargin>62?'↑ Över mål 62%':'↓ Under mål'}      ok={avgMargin>62} />
        <Stat label="Råvarukostnad %" value={`${avgFoodCost.toFixed(1)}%`}  sub={avgFoodCost<30?'↓ Under 30% mål':'↑ Över mål'}   ok={avgFoodCost<30} />
        <Stat label="Prisvarningar"   value={`${alerts.filter(i=>i.pct>0).length}`} sub="Ingredient(er) stigit >1%" ok={alerts.filter(i=>i.pct>0).length===0} />
        <Stat label="Recept totalt"   value={`${recipes.length}`}            sub="Alla kategorier" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:16 }}>
        {/* PRICE ALERTS */}
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:'var(--t1)', marginBottom:12, display:'flex', alignItems:'center', gap:8 }}>
            <AlertTriangle size={14} style={{ color:'var(--red)' }} />
            Prisrörelser
          </div>
          <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
            {alerts.length === 0 ? (
              <div style={{ padding:'28px', textAlign:'center', fontSize:13, color:'var(--t3)' }}>✅ Inga signifikanta prisrörelser</div>
            ) : alerts.map((ing, idx) => {
              const affected = recipes.filter(r => r.ingredients.some(i=>i.ingredientId===ing.id));
              return (
                <div key={ing.id} style={{ padding:'14px 18px', borderBottom: idx<alerts.length-1?'1px solid var(--border)':'none' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      {ing.pct>0
                        ? <TrendingUp size={13} style={{ color:'var(--red)' }} />
                        : <TrendingDown size={13} style={{ color:'var(--green)' }} />}
                      <span style={{ fontSize:13, fontWeight:600, color:'var(--t1)' }}>{ing.name}</span>
                    </div>
                    <span className="font-mono" style={{ fontSize:13, fontWeight:700, color:ing.pct>0?'var(--red)':'var(--green)' }}>
                      {ing.pct>0?'+':''}{ing.pct.toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ fontSize:12, color:'var(--t3)', marginBottom:4 }}>
                    {ing.priceSek} kr/{ing.unit} · Leverantör: {ing.supplier||'—'}
                  </div>
                  {affected.length > 0 && (
                    <div style={{ fontSize:11, color:'var(--t2)', marginBottom:6 }}>
                      Påverkar: {affected.map(r=>r.name).join(' · ')}
                    </div>
                  )}
                  {ing.pct > 3 && (
                    <div style={{ fontSize:11, color:'var(--t2)', background:'var(--goldbg)', border:'1px solid var(--goldb)', borderRadius:7, padding:'5px 10px', display:'inline-block' }}>
                      💡 Höj menypris ca +{Math.round(ing.priceSek * ing.pct / 100 * 0.3 / 0.34)} kr
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* MARGIN RANKING */}
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:'var(--t1)', marginBottom:12, display:'flex', alignItems:'center', gap:8 }}>
            <BarChart2 size={14} style={{ color:'var(--green)' }} />
            Marginalranking
          </div>
          <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
            {ranked.length === 0 ? (
              <div style={{ padding:'28px', textAlign:'center', fontSize:13, color:'var(--t3)' }}>Inga recept ännu.</div>
            ) : ranked.map((r,idx) => (
              <div key={r.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 18px', borderBottom:idx<ranked.length-1?'1px solid var(--border)':'none' }}>
                <span className="font-mono" style={{ fontSize:11, color:'var(--t3)', width:18, flexShrink:0 }}>{String(idx+1).padStart(2,'0')}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:'var(--t1)', marginBottom:2 }}>{r.name}</div>
                  <div style={{ fontSize:10, color:'var(--t3)' }}>Kostnad: {r.tc.toFixed(0)} kr · Pris: {r.sellingPriceSek} kr</div>
                </div>
                <div style={{ width:52, height:4, background:'var(--muted)', borderRadius:100, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${Math.min(r.m,100)}%`, background:marginColor(r.m), borderRadius:100 }} />
                </div>
                <span className="font-mono" style={{ fontSize:12, fontWeight:700, color:marginColor(r.m), width:36, textAlign:'right' }}>
                  {r.m.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category stats */}
      <div style={{ marginTop:24 }}>
        <div style={{ fontSize:13, fontWeight:600, color:'var(--t1)', marginBottom:12 }}>Snittpris per kategori</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
          {catStats.map(c => (
            <div key={c.cat} style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:12, padding:'14px 16px' }}>
              <div style={{ fontSize:11, color:'var(--t3)', marginBottom:4 }}>{c.cat}</div>
              <div className="font-mono" style={{ fontSize:18, fontWeight:600, color:'var(--t1)' }}>{c.avg.toFixed(0)} kr</div>
              <div style={{ fontSize:11, color:'var(--t3)', marginTop:2 }}>{c.count} ingrediens{c.count!==1?'er':''}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
