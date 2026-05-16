import { useState, useMemo } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { store, buildAlerts, marginColor } from '../store';
import type { IngredientAlert, RecipeImpact } from '../store';

function MarginPill({ pct }: { pct: number }) {
  const col = marginColor(pct);
  const bg  = pct > 62 ? 'rgba(21,128,61,.1)' : pct > 45 ? 'rgba(202,138,4,.1)' : 'rgba(185,28,28,.1)';
  return (
    <span style={{ display:'inline-block', padding:'2px 9px', borderRadius:100, fontSize:11, fontWeight:700, fontFamily:'DM Mono', background:bg, color:col }}>
      {pct.toFixed(1)}%
    </span>
  );
}

function RecipeRow({ impact, ingredientName, isUp }: { impact: RecipeImpact; ingredientName: string; isUp: boolean }) {
  const r = impact.recipe;
  return (
    <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:16, alignItems:'start' }}>
        <div>
          {/* Recipe name + margin change */}
          <div style={{ fontSize:14, fontWeight:600, color:'var(--t1)', marginBottom:8 }}>{r.name}</div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10, flexWrap:'wrap' }}>
            <span style={{ fontSize:12, color:'var(--t2)' }}>Marginal:</span>
            <MarginPill pct={impact.oldMarginPct} />
            <ArrowRight size={12} style={{ color:'var(--t3)' }} />
            <MarginPill pct={impact.newMarginPct} />
            <span className="font-mono" style={{ fontSize:11, fontWeight:700, color: impact.marginDelta < 0 ? 'var(--red)' : 'var(--green)' }}>
              {impact.marginDelta > 0 ? '+' : ''}{impact.marginDelta.toFixed(1)}%
            </span>
          </div>

          {/* Cost impact */}
          <div style={{ display:'flex', gap:16, fontSize:11, color:'var(--t2)', marginBottom: isUp ? 12 : 0 }}>
            <span>Gammal kostnad: <strong className="font-mono" style={{ color:'var(--t1)' }}>{impact.oldCostSek.toFixed(0)} kr</strong></span>
            <span>Ny kostnad: <strong className="font-mono" style={{ color:'var(--t1)' }}>{impact.newCostSek.toFixed(0)} kr</strong></span>
            {impact.profitLostSek > 0 && (
              <span>Förlust/port: <strong className="font-mono" style={{ color:'var(--red)' }}>+{impact.profitLostSek.toFixed(2)} kr</strong></span>
            )}
          </div>

          {/* Actions — only for price increases */}
          {isUp && impact.suggestedPriceIncrease > 0 && (
            <div>
              <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', marginBottom:6 }}>Rekommenderade åtgärder:</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <div style={{ padding:'7px 12px', background:'var(--goldbg)', border:'1px solid var(--goldb)', borderRadius:8, fontSize:12, color:'var(--t1)' }}>
                  💰 Höj menypris <strong className="font-mono" style={{ color:'var(--brown)' }}>+{impact.suggestedPriceIncrease} kr</strong>
                  <span style={{ color:'var(--t3)', marginLeft:4 }}>
                    ({r.sellingPriceSek} → {r.sellingPriceSek + impact.suggestedPriceIncrease} kr)
                  </span>
                </div>
                {impact.suggestedPortionReductionG > 0 && (
                  <div style={{ padding:'7px 12px', background:'rgba(59,130,246,.08)', border:'1px solid rgba(59,130,246,.2)', borderRadius:8, fontSize:12, color:'var(--t1)' }}>
                    ✂️ Minska portion <strong className="font-mono" style={{ color:'#1d4ed8' }}>−{impact.suggestedPortionReductionG}g</strong> av {ingredientName}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Visual bar */}
        <div style={{ width:70, flexShrink:0 }}>
          <div style={{ fontSize:10, color:'var(--t3)', marginBottom:4, textAlign:'center' }}>Ny marginal</div>
          <div style={{ height:56, background:'var(--muted)', borderRadius:8, overflow:'hidden', position:'relative', display:'flex', alignItems:'flex-end' }}>
            <div style={{ width:'100%', background:marginColor(impact.newMarginPct), height:`${Math.min(Math.max(impact.newMarginPct,0),100)}%`, transition:'height .4s' }} />
          </div>
          <div className="font-mono" style={{ fontSize:11, fontWeight:700, color:marginColor(impact.newMarginPct), textAlign:'center', marginTop:4 }}>
            {impact.newMarginPct.toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertCard({ alert, index }: { alert: IngredientAlert; index: number }) {
  const [open, setOpen] = useState(index < 2);
  const isUp = alert.changePct > 0;
  const sev  = alert.severity;
  const borderColor = sev === 'high' ? 'rgba(185,28,28,.35)' : sev === 'medium' ? 'rgba(202,138,4,.3)' : 'rgba(21,128,61,.3)';
  const worstDelta  = alert.affectedRecipes.length > 0
    ? Math.min(...alert.affectedRecipes.map(r => r.marginDelta)) : 0;
  const totalLoss   = alert.affectedRecipes.reduce((s, r) => s + r.profitLostSek * 30, 0);

  return (
    <div style={{ background:'var(--white)', border:`1px solid ${borderColor}`, borderRadius:16, overflow:'hidden' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ width:'100%', display:'flex', alignItems:'center', gap:14, padding:'16px 20px', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>

        <div style={{ width:38, height:38, borderRadius:11, display:'grid', placeItems:'center', flexShrink:0,
          background: isUp ? 'rgba(185,28,28,.1)' : 'rgba(21,128,61,.1)' }}>
          {isUp ? <TrendingUp size={17} style={{ color:'var(--red)' }} /> : <TrendingDown size={17} style={{ color:'var(--green)' }} />}
        </div>

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:3, flexWrap:'wrap' }}>
            <span style={{ fontSize:15, fontWeight:700, color:'var(--t1)' }}>{alert.ingredient.name}</span>
            <span className="font-mono" style={{ fontSize:14, fontWeight:700, color: isUp ? 'var(--red)' : 'var(--green)' }}>
              {isUp ? '+' : ''}{alert.changePct.toFixed(1)}%
            </span>
            {sev === 'high' && (
              <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:100, background:'var(--redbg)', color:'var(--red)', letterSpacing:'.3px' }}>HÖG PRIORITET</span>
            )}
          </div>
          <div style={{ fontSize:12, color:'var(--t2)' }}>
            {alert.ingredient.prevPriceSek.toFixed(0)} → {alert.ingredient.priceSek.toFixed(0)} kr/{alert.ingredient.unit}
            {' · '}{alert.affectedRecipes.length} rätt{alert.affectedRecipes.length !== 1 ? 'er' : ''} påverkade
            {isUp && worstDelta < -1 && (
              <span style={{ color:'var(--red)', marginLeft:8 }}>
                · Marginal ↓ upp till {Math.abs(worstDelta).toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {isUp && totalLoss > 0 && (
          <div style={{ textAlign:'right', flexShrink:0 }}>
            <div className="font-mono" style={{ fontSize:13, fontWeight:700, color:'var(--red)' }}>
              −{totalLoss.toFixed(0)} kr
            </div>
            <div style={{ fontSize:10, color:'var(--t3)' }}>est. per mån</div>
          </div>
        )}

        <div style={{ color:'var(--t3)', flexShrink:0 }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {open && alert.affectedRecipes.length > 0 && (
        <div style={{ borderTop:'1px solid var(--border)' }}>
          {alert.affectedRecipes.map(impact => (
            <RecipeRow
              key={impact.recipe.id}
              impact={impact}
              ingredientName={alert.ingredient.name}
              isUp={isUp}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PriceIntel() {
  const ingredients = store.getIngredients();
  const recipes     = store.getRecipes();
  const alerts      = useMemo(() => buildAlerts(ingredients, recipes, 1), [ingredients, recipes]);

  const increases = alerts.filter(a => a.changePct > 0);
  const decreases = alerts.filter(a => a.changePct < 0);
  const totalRecipesAffected = new Set(alerts.flatMap(a => a.affectedRecipes.map(r => r.recipe.id))).size;
  const totalMonthlyLoss = increases.reduce((s, a) => s + a.affectedRecipes.reduce((ss, r) => ss + r.profitLostSek * 30, 0), 0);

  return (
    <div style={{ padding:'32px 36px', maxWidth:960, margin:'0 auto' }}>

      <div style={{ marginBottom:28 }}>
        <h1 className="font-serif" style={{ fontSize:28, fontWeight:600, letterSpacing:'-.6px', color:'var(--t1)' }}>Prisintelligens</h1>
        <p style={{ fontSize:14, color:'var(--t2)', marginTop:4 }}>
          Ingredient price changed → affected recipes → margin loss → suggested action
        </p>
        <p style={{ fontSize:12, color:'var(--t3)', marginTop:6 }}>Demo data / example calculations. Not live supplier data.</p>
      </div>

      {/* Summary KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
        {[
          { label:'Prisökningar',       value:String(increases.length), color:'var(--red)',   sub:'kräver åtgärd'            },
          { label:'Prissänkningar',     value:String(decreases.length), color:'var(--green)', sub:'marginal förbättras'       },
          { label:'Recept påverkade',   value:String(totalRecipesAffected), color:'var(--t1)', sub:'totalt'                  },
          { label:'Est. månadsförlust', value:totalMonthlyLoss > 0 ? `−${totalMonthlyLoss.toFixed(0)} kr` : '—', color:'var(--red)', sub:'vid 30 kuvert/dag' },
        ].map(k => (
          <div key={k.label} style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:14, padding:'16px 18px' }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', marginBottom:6 }}>{k.label}</div>
            <div className="font-serif" style={{ fontSize:26, fontWeight:600, color:k.color, marginBottom:2 }}>{k.value}</div>
            <div style={{ fontSize:11, color:'var(--t3)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ padding:'12px 16px', background:'rgba(59,130,246,.07)', border:'1px solid rgba(59,130,246,.18)', borderRadius:11, marginBottom:24, fontSize:13, color:'#1d4ed8', lineHeight:1.6 }}>
        💡 <strong>Hur det fungerar:</strong> Gå till{' '}
        <a href="/ingredients" style={{ color:'#1d4ed8', fontWeight:700 }}>Ingredienser</a>
        {' '}och uppdatera ett pris. Systemet jämför mot föregående pris, beräknar exakt påverkan på alla berörda recept och ger konkreta åtgärdsförslag direkt.
      </div>

      {/* Increases */}
      {increases.length > 0 && (
        <div style={{ marginBottom:32 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
            <AlertTriangle size={15} style={{ color:'var(--red)' }} />
            <span style={{ fontSize:14, fontWeight:700, color:'var(--t1)' }}>Prisökningar — kräver åtgärd</span>
            <span style={{ fontSize:11, fontWeight:700, padding:'2px 9px', borderRadius:100, background:'var(--redbg)', color:'var(--red)' }}>{increases.length}</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {increases.map((a, i) => <AlertCard key={a.ingredient.id} alert={a} index={i} />)}
          </div>
        </div>
      )}

      {/* Decreases */}
      {decreases.length > 0 && (
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
            <TrendingDown size={15} style={{ color:'var(--green)' }} />
            <span style={{ fontSize:14, fontWeight:700, color:'var(--t1)' }}>Prissänkningar — marginal förbättras</span>
            <span style={{ fontSize:11, fontWeight:700, padding:'2px 9px', borderRadius:100, background:'var(--greenbg)', color:'var(--green)' }}>{decreases.length}</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {decreases.map((a, i) => <AlertCard key={a.ingredient.id} alert={a} index={i} />)}
          </div>
        </div>
      )}

      {alerts.length === 0 && (
        <div style={{ textAlign:'center', padding:'80px 0' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
          <div style={{ fontSize:16, fontWeight:600, color:'var(--t1)', marginBottom:8 }}>Inga prisförändringar registrerade</div>
          <div style={{ fontSize:14, color:'var(--t2)', maxWidth:380, margin:'0 auto', lineHeight:1.7 }}>
            Gå till <a href="/ingredients" style={{ color:'var(--gold)', fontWeight:600 }}>Ingredienser</a> och ange ett nytt pris på en ingrediens.
            Systemet beräknar automatiskt hur marginalen förändras i alla berörda recept.
          </div>
        </div>
      )}
    </div>
  );
}

