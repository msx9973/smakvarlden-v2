import { useState, useMemo } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { store, suggested } from '../store';
import type { Recipe, RecipeIngredient } from '../store';

const CATS = ['Förrätter','Huvudrätter','Desserter','Soppor','Sallader'];

interface Line { ingId: string; qty: string; }

export default function Calculator() {
  const ingredients = store.getIngredients();
  const [lines, setLines]       = useState<Line[]>([{ ingId:'', qty:'' }]);
  const [name, setName]         = useState('');
  const [cat, setCat]           = useState('Huvudrätter');
  const [servings, setServings] = useState('1');
  const [priceIn, setPriceIn]   = useState('');
  const [saved, setSaved]       = useState(false);
  const [err, setErr]           = useState('');

  const recipeIngs = useMemo((): RecipeIngredient[] =>
    lines
      .filter(l => l.ingId && parseFloat(l.qty) > 0)
      .map(l => {
        const ing = ingredients.find(i => i.id === l.ingId)!;
        return { ingredientId: ing.id, name: ing.name, quantity: parseFloat(l.qty), unit: ing.unit, unitPrice: ing.priceSek };
      }),
  [lines, ingredients]);

  const rawCostTotal = recipeIngs.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const wasteCost    = rawCostTotal * 0.20;
  const totalCost    = rawCostTotal + wasteCost;
  const sp           = parseFloat(priceIn) || suggested(rawCostTotal);
  const marginPct    = sp > 0 && totalCost > 0 ? ((sp - totalCost) / sp) * 100 : 0;
  const profit       = sp - totalCost;

  function addLine()         { setLines(p => [...p, { ingId:'', qty:'' }]); }
  function removeLine(i:number) { setLines(p => p.filter((_,j) => j!==i)); }
  function setLine(i:number, f:keyof Line, v:string) {
    setLines(p => p.map((l,j) => j===i ? {...l,[f]:v} : l));
  }

  function saveRecipe() {
    setErr('');
    if (!name.trim()) { setErr('Ange ett receptnamn'); return; }
    if (recipeIngs.length === 0) { setErr('Lägg till minst en ingrediens'); return; }
    const rec: Recipe = {
      id: crypto.randomUUID(), name: name.trim(), category: cat,
      servings: parseInt(servings)||1, sellingPriceSek: sp,
      ingredients: recipeIngs, createdAt: new Date().toISOString().slice(0,10),
    };
    store.saveRecipe(rec);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div style={{ padding:'32px 36px', maxWidth:1040, margin:'0 auto' }}>
      <div style={{ marginBottom:28 }}>
        <h1 className="font-serif" style={{ fontSize:28, fontWeight:600, letterSpacing:'-.6px', color:'var(--t1)' }}>Kalkylator</h1>
        <p style={{ fontSize:14, color:'var(--t2)', marginTop:4 }}>Bygg en rätt, se kostnad och marginal direkt</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:24, alignItems:'start' }}>
        {/* LEFT — build */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Recipe info */}
          <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding:'20px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
              <div>
                <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', display:'block', marginBottom:6 }}>Receptnamn</label>
                <input className="inp" placeholder="T.ex. Laxpoke Bowl" value={name} onChange={e=>setName(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', display:'block', marginBottom:6 }}>Kategori</label>
                <select className="inp" value={cat} onChange={e=>setCat(e.target.value)}>
                  {CATS.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', display:'block', marginBottom:6 }}>Portioner</label>
                <input className="inp" type="number" min="1" value={servings} onChange={e=>setServings(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', display:'block', marginBottom:6 }}>Försäljningspris / port (kr)</label>
                <input className="inp" type="number" placeholder={`Auto: ${suggested(rawCostTotal)} kr`} value={priceIn} onChange={e=>setPriceIn(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
            <div style={{ padding:'13px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:13, fontWeight:600, color:'var(--t1)' }}>Ingredienser</span>
              <button onClick={addLine} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:8, border:'none', background:'var(--goldbg)', color:'var(--gold)', fontWeight:600, fontSize:12, cursor:'pointer' }}>
                <Plus size={12} /> Lägg till
              </button>
            </div>

            {/* Header */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 90px 70px 70px 36px', gap:8, padding:'8px 18px', background:'var(--muted)', borderBottom:'1px solid var(--border)' }}>
              {['Ingrediens','Mängd','Enhet','Kostnad',''].map((h,i) => (
                <span key={i} style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)' }}>{h}</span>
              ))}
            </div>

            {lines.map((line, idx) => {
              const ing = ingredients.find(i => i.id === line.ingId);
              const lineCost = ing && parseFloat(line.qty) > 0 ? parseFloat(line.qty) * ing.priceSek : 0;
              return (
                <div key={idx} style={{ display:'grid', gridTemplateColumns:'1fr 90px 70px 70px 36px', gap:8, padding:'10px 18px', alignItems:'center', borderBottom:'1px solid var(--border)' }}>
                  <select className="inp" value={line.ingId} onChange={e=>setLine(idx,'ingId',e.target.value)} style={{ padding:'8px 10px', fontSize:13 }}>
                    <option value="">Välj...</option>
                    {ingredients.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                  <input className="inp" type="number" min="0" step="0.01" placeholder="0" value={line.qty} onChange={e=>setLine(idx,'qty',e.target.value)} style={{ padding:'8px 10px', fontSize:13 }} />
                  <div style={{ fontSize:12, color:'var(--t3)', textAlign:'center' }}>{ing?.unit || '—'}</div>
                  <div className="font-mono" style={{ fontSize:12, fontWeight:600, color: lineCost>0?'var(--t1)':'var(--t3)', textAlign:'right' }}>
                    {lineCost > 0 ? `${lineCost.toFixed(0)} kr` : '—'}
                  </div>
                  <button onClick={()=>removeLine(idx)} style={{ width:28, height:28, borderRadius:7, border:'none', background:'none', cursor:'pointer', color:'var(--t3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}

            {recipeIngs.length > 0 && (
              <div style={{ display:'flex', justifyContent:'space-between', padding:'11px 18px', background:'var(--muted)', fontSize:13, fontWeight:600 }}>
                <span style={{ color:'var(--t2)' }}>Total råvarukostnad</span>
                <span className="font-mono" style={{ color:'var(--t1)' }}>{rawCostTotal.toFixed(2)} kr</span>
              </div>
            )}
          </div>

          {err && <div style={{ padding:'10px 14px', background:'var(--redbg)', border:'1px solid rgba(185,28,28,.2)', borderRadius:9, fontSize:13, color:'var(--red)' }}>{err}</div>}

          <button className="btn-brown" onClick={saveRecipe} style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center', padding:'13px' }}>
            <Save size={15} />
            {saved ? '✓ Sparat!' : 'Spara som recept'}
          </button>
        </div>

        {/* RIGHT — live result */}
        <div style={{ position:'sticky', top:24 }}>
          <div style={{ background:'var(--brown)', borderRadius:18, overflow:'hidden' }}>
            <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
              <span style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.7px', color:'rgba(255,255,255,.35)' }}>Kalkylresultat</span>
            </div>
            <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:4 }}>
              <Row k="Råvarukostnad"        v={`${rawCostTotal.toFixed(2)} kr`} />
              <Row k="Svinn (+20%)"         v={`+${wasteCost.toFixed(2)} kr`} red />
              <div style={{ height:1, background:'rgba(255,255,255,.07)', margin:'4px 0' }} />
              <Row k="Totalkostnad / port"  v={`${totalCost.toFixed(2)} kr`} />
              <Row k="Försäljningspris"     v={`${sp} kr`} gold />
            </div>

            {/* Margin */}
            <div style={{ padding:'14px 20px', borderTop:'1px solid rgba(255,255,255,.07)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <span style={{ fontSize:11, fontFamily:'DM Mono', textTransform:'uppercase', letterSpacing:'.6px', color:'rgba(255,255,255,.3)' }}>Vinstmarginal</span>
                <span className="font-mono" style={{ fontSize:24, fontWeight:600, color: recipeIngs.length===0?'rgba(255,255,255,.2)': marginPct>62?'#4ade80':marginPct>45?'#fbbf24':'#f87171' }}>
                  {recipeIngs.length===0 ? '—' : `${marginPct.toFixed(1)}%`}
                </span>
              </div>
              <div style={{ height:7, background:'rgba(255,255,255,.08)', borderRadius:100, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${Math.min(Math.max(marginPct,0),100)}%`, borderRadius:100, background: marginPct>62?'linear-gradient(90deg,#15803d,#4ade80)':marginPct>45?'#fbbf24':'#f87171', transition:'width .4s ease' }} />
              </div>
              {recipeIngs.length > 0 && (
                <div style={{ fontSize:11, color:'rgba(255,255,255,.3)', marginTop:6 }}>
                  {marginPct > 62 ? '✓ Utmärkt marginal' : marginPct > 45 ? '⚠ Acceptabel marginal' : '✗ För låg — höj priset'}
                </div>
              )}
            </div>

            {/* Profit */}
            {recipeIngs.length > 0 && (
              <div style={{ margin:'0 16px 16px', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.08)', borderRadius:12, padding:'14px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontSize:12, color:'rgba(255,255,255,.4)' }}>Bruttovinst / port</span>
                  <span className="font-mono" style={{ fontSize:14, fontWeight:700, color: profit>0?'#4ade80':'#f87171' }}>
                    {profit>0?'+':''}{profit.toFixed(2)} kr
                  </span>
                </div>
                {sp !== parseFloat(priceIn) && priceIn === '' && (
                  <div style={{ fontSize:11, color:'rgba(255,255,255,.3)', lineHeight:1.5 }}>
                    Pris beräknat automatiskt vid 66% målmarginal
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Ingredient breakdown mini */}
          {recipeIngs.length > 0 && (
            <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:14, marginTop:12, overflow:'hidden' }}>
              <div style={{ padding:'11px 16px', borderBottom:'1px solid var(--border)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)' }}>Kostnad per ingrediens</div>
              {recipeIngs.map((ing, i) => {
                const cost  = ing.quantity * ing.unitPrice;
                const share = rawCostTotal > 0 ? (cost/rawCostTotal)*100 : 0;
                return (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 16px', borderBottom: i<recipeIngs.length-1?'1px solid var(--border)':'none' }}>
                    <div style={{ flex:1, fontSize:12, color:'var(--t1)', fontWeight:500 }}>{ing.name}</div>
                    <div style={{ width:44, height:3, background:'var(--muted)', borderRadius:100, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${share}%`, background:'var(--gold)', borderRadius:100 }} />
                    </div>
                    <div className="font-mono" style={{ fontSize:12, fontWeight:600, color:'var(--t1)', width:48, textAlign:'right' }}>{cost.toFixed(0)} kr</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, red, gold }: { k:string; v:string; red?:boolean; gold?:boolean }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', borderRadius:8, fontSize:13, background: gold?'rgba(201,148,76,.15)':undefined, border: gold?'1px solid rgba(201,148,76,.22)':undefined }}>
      <span style={{ color: gold?'var(--goldl)':'rgba(255,255,255,.5)' }}>{k}</span>
      <span className="font-mono" style={{ fontWeight:600, color: red?'#fca5a5':gold?'var(--goldl)':'#fff', fontSize:gold?15:13 }}>{v}</span>
    </div>
  );
}
