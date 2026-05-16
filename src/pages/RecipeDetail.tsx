import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { store, rawCost, margin, suggested } from '../store';

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const recipe = store.getRecipes().find(r => r.id === id);

  if (!recipe) return (
    <div style={{ padding:'60px 36px', textAlign:'center' }}>
      <p style={{ color:'var(--t2)' }}>Receptet hittades inte.</p>
      <Link to="/recipes" style={{ color:'var(--gold)', fontWeight:600 }}>← Tillbaka</Link>
    </div>
  );

  const raw   = rawCost(recipe);
  const waste = raw * 0.20;
  const total = raw + waste;
  const sp    = recipe.sellingPriceSek || suggested(raw);
  const m     = margin(recipe);
  const profit = sp - total;

  return (
    <div style={{ padding:'32px 36px', maxWidth:900, margin:'0 auto' }}>
      <Link to="/recipes" style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:'var(--t2)', textDecoration:'none', marginBottom:24, fontWeight:500 }}>
        <ArrowLeft size={14} /> Tillbaka till recept
      </Link>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
        {/* LEFT — info + ingredients */}
        <div>
          <div style={{ marginBottom:20 }}>
            <h1 className="font-serif" style={{ fontSize:32, fontWeight:600, letterSpacing:'-.8px', color:'var(--t1)', marginBottom:4 }}>
              {recipe.name}
            </h1>
            <div style={{ fontSize:13, color:'var(--t2)' }}>
              {recipe.category} · {recipe.servings} portion{recipe.servings>1?'er':''}
            </div>
            <p style={{ fontSize:12, color:'var(--t3)', marginTop:6 }}>Demo data / example calculations. Ingredient price changed → affected recipes → margin loss → suggested action.</p>
          </div>

          {/* Ingredient breakdown */}
          <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
            <div style={{ padding:'13px 18px', borderBottom:'1px solid var(--border)', background:'var(--brown)' }}>
              <span style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.7px', color:'rgba(255,255,255,.45)' }}>Ingredienser</span>
            </div>
            {recipe.ingredients.map((ing, i) => {
              const lineCost = ing.quantity * ing.unitPrice;
              const share    = raw > 0 ? (lineCost / raw) * 100 : 0;
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 18px', borderBottom: i < recipe.ingredients.length-1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:500, color:'var(--t1)' }}>{ing.name}</div>
                    <div style={{ fontSize:11, color:'var(--t3)', marginTop:1 }}>{ing.quantity} {ing.unit} × {ing.unitPrice} kr</div>
                  </div>
                  <div style={{ width:60 }}>
                    <div style={{ height:3, background:'var(--muted)', borderRadius:100, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${share}%`, background:'var(--gold)', borderRadius:100 }} />
                    </div>
                  </div>
                  <div className="font-mono" style={{ fontSize:13, fontWeight:600, color:'var(--t1)', width:52, textAlign:'right' }}>
                    {lineCost.toFixed(0)} kr
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — cost breakdown */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Dark cost card */}
          <div style={{ background:'var(--brown)', borderRadius:16, overflow:'hidden' }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
              <span style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.7px', color:'rgba(255,255,255,.35)' }}>Kostnadsanalys</span>
            </div>
            <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:4 }}>
              {[
                { k:'Råvarukostnad',          v:`${raw.toFixed(2)} kr`,   dim:false },
                { k:'Svinn (+20%)',            v:`+${waste.toFixed(2)} kr`,dim:false, red:true },
              ].map(row => (
                <div key={row.k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', borderRadius:8, fontSize:13 }}>
                  <span style={{ color:'rgba(255,255,255,.5)' }}>{row.k}</span>
                  <span className="font-mono" style={{ color: row.red ? '#fca5a5' : '#fff', fontWeight:500 }}>{row.v}</span>
                </div>
              ))}
              <div style={{ height:1, background:'rgba(255,255,255,.07)', margin:'4px 0' }} />
              <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', borderRadius:8, fontSize:13 }}>
                <span style={{ color:'rgba(255,255,255,.5)' }}>Totalkostnad / portion</span>
                <span className="font-mono" style={{ color:'#fff', fontWeight:500 }}>{total.toFixed(2)} kr</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'9px 12px', borderRadius:9, fontSize:14, background:'rgba(201,148,76,.15)', border:'1px solid rgba(201,148,76,.22)' }}>
                <span style={{ color:'var(--goldl)' }}>Föreslaget försäljningspris</span>
                <span className="font-mono" style={{ color:'var(--goldl)', fontWeight:600, fontSize:16 }}>{sp} kr</span>
              </div>
            </div>
            {/* Margin bar */}
            <div style={{ padding:'14px 20px', borderTop:'1px solid rgba(255,255,255,.07)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <span style={{ fontSize:11, fontFamily:'DM Mono', textTransform:'uppercase', letterSpacing:'.6px', color:'rgba(255,255,255,.3)' }}>Vinstmarginal</span>
                <span className="font-mono" style={{ fontSize:18, fontWeight:600, color: m > 62 ? '#4ade80' : m > 45 ? '#fbbf24' : '#f87171' }}>
                  {m.toFixed(1)}%
                </span>
              </div>
              <div style={{ height:6, background:'rgba(255,255,255,.08)', borderRadius:100, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${Math.min(m,100)}%`, borderRadius:100, background: m>62 ? 'linear-gradient(90deg,#15803d,#4ade80)' : m>45 ? '#fbbf24' : '#f87171', transition:'width .6s ease' }} />
              </div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.3)', marginTop:6 }}>
                {m > 62 ? '✓ Utmärkt marginal' : m > 45 ? '⚠ Acceptabel — kan förbättras' : '✗ För låg — se över priset'}
              </div>
            </div>
          </div>

          {/* Summary cards */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { label:'Bruttovinst / port', value:`${profit > 0 ? '+' : ''}${profit.toFixed(0)} kr`, color: profit>0?'var(--green)':'var(--red)' },
              { label:'Råvarukostnad %',    value:`${((total/sp)*100).toFixed(1)}%`,                   color:'var(--t1)' },
            ].map(c => (
              <div key={c.label} style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:12, padding:'14px 16px' }}>
                <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', marginBottom:6 }}>{c.label}</div>
                <div className="font-mono font-serif" style={{ fontSize:22, fontWeight:600, color:c.color }}>{c.value}</div>
              </div>
            ))}
          </div>

          {profit < 0 && (
            <div style={{ padding:'12px 16px', background:'var(--redbg)', border:'1px solid rgba(185,28,28,.2)', borderRadius:12, fontSize:13, color:'var(--red)' }}>
              ⚠️ Negativt resultat. Höj priset till minst <strong>{suggested(raw)} kr</strong> för 66% marginal.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

