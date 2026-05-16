import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash2, ChevronRight } from 'lucide-react';
import { store, margin, totalCost, marginColor, suggested } from '../store';
import type { Recipe } from '../store';

const CATS = ['Alla','Förrätter','Huvudrätter','Desserter','Soppor','Sallader'];

export default function Recipes() {
  const [recipes, setRecipes] = useState(() => store.getRecipes());
  const [search, setSearch]   = useState('');
  const [cat, setCat]         = useState('Alla');
  const [showNew, setShowNew] = useState(false);

  const filtered = recipes.filter(r =>
    (cat === 'Alla' || r.category === cat) &&
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  function del(id: string) {
    if (!confirm('Ta bort receptet?')) return;
    store.deleteRecipe(id);
    setRecipes(store.getRecipes());
  }

  return (
    <div style={{ padding:'32px 36px', maxWidth:1040, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 className="font-serif" style={{ fontSize:28, fontWeight:600, letterSpacing:'-.6px', color:'var(--t1)' }}>Recept</h1>
          <p style={{ fontSize:14, color:'var(--t2)', marginTop:4 }}>{recipes.length} recept · klicka för att se kalkyl</p>
          <p style={{ fontSize:12, color:'var(--t3)', marginTop:6 }}>Demo data / example calculations. Ingredient price changed → affected recipes → margin loss → suggested action.</p>
        </div>
        <button className="btn-brown" onClick={() => setShowNew(true)} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px' }}>
          <Plus size={15} /> Nytt recept
        </button>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--t3)' }} />
          <input className="inp" style={{ paddingLeft:36 }} placeholder="Sök recept..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding:'7px 14px', borderRadius:9, border:'none', font:'500 13px DM Sans', cursor:'pointer', transition:'.15s',
                background: cat===c ? 'var(--brown)' : 'var(--white)',
                color: cat===c ? 'var(--cream)' : 'var(--t2)',
                boxShadow: cat===c ? 'none' : '0 1px 4px var(--shad)',
              }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', color:'var(--t3)', fontSize:14 }}>
          Inga recept hittades.{' '}
          <button onClick={() => setShowNew(true)} style={{ color:'var(--gold)', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>
            Skapa ett
          </button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(r => {
            const m  = margin(r);
            const tc = totalCost(r);
            return (
              <div key={r.id} style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:14, display:'flex', alignItems:'center', gap:0, overflow:'hidden', transition:'all .2s' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow='0 4px 16px var(--shadmd)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow='none')}>
                <Link to={`/recipes/${r.id}`} style={{ flex:1, display:'flex', alignItems:'center', gap:16, padding:'16px 20px', textDecoration:'none' }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:'var(--t1)', marginBottom:2 }}>{r.name}</div>
                    <div style={{ fontSize:12, color:'var(--t3)' }}>{r.category} · {r.ingredients.length} ingredienser</div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div className="font-mono" style={{ fontSize:13, fontWeight:700, color:marginColor(m) }}>{m.toFixed(1)}%</div>
                    <div style={{ fontSize:11, color:'var(--t3)' }}>marginal</div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div className="font-mono" style={{ fontSize:13, fontWeight:600, color:'var(--t1)' }}>{tc.toFixed(0)} kr</div>
                    <div style={{ fontSize:11, color:'var(--t3)' }}>kostnad</div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div className="font-mono" style={{ fontSize:13, fontWeight:600, color:'var(--t1)' }}>{r.sellingPriceSek} kr</div>
                    <div style={{ fontSize:11, color:'var(--t3)' }}>pris</div>
                  </div>
                  <ChevronRight size={15} style={{ color:'var(--t3)', flexShrink:0 }} />
                </Link>
                <button onClick={() => del(r.id)}
                  style={{ padding:'0 18px', height:'100%', minHeight:64, background:'none', border:'none', borderLeft:'1px solid var(--border)', cursor:'pointer', color:'var(--t3)', display:'flex', alignItems:'center' }}
                  title="Ta bort">
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* New recipe modal */}
      {showNew && <NewRecipeModal onClose={() => { setShowNew(false); setRecipes(store.getRecipes()); }} />}
    </div>
  );
}

function NewRecipeModal({ onClose }: { onClose: () => void }) {
  const ingredients = store.getIngredients();
  const [name, setName]   = useState('');
  const [cat, setCat]     = useState('Huvudrätter');
  const [price, setPrice] = useState('');
  const [servings, setServings] = useState('1');
  const [lines, setLines] = useState<{ingId:string;qty:string}[]>([{ingId:'',qty:''}]);
  const [err, setErr]     = useState('');

  function addLine()    { setLines(p => [...p, {ingId:'',qty:''}]); }
  function removeLine(i:number) { setLines(p => p.filter((_,j) => j!==i)); }
  function setLine(i:number, f:'ingId'|'qty', v:string) {
    setLines(p => p.map((l,j) => j===i ? {...l,[f]:v} : l));
  }

  function save() {
    if (!name.trim()) { setErr('Ange ett namn'); return; }
    const recipeIngredients = lines
      .filter(l => l.ingId && parseFloat(l.qty) > 0)
      .map(l => {
        const ing = ingredients.find(i => i.id === l.ingId)!;
        return { ingredientId:ing.id, name:ing.name, quantity:parseFloat(l.qty), unit:ing.unit, unitPrice:ing.priceSek };
      });
    if (recipeIngredients.length === 0) { setErr('Lägg till minst en ingrediens'); return; }
    const raw = recipeIngredients.reduce((s,i) => s + i.quantity * i.unitPrice, 0);
    const sp  = parseFloat(price) || suggested(raw);
    const rec: Recipe = {
      id: crypto.randomUUID(), name: name.trim(), category: cat,
      servings: parseInt(servings) || 1, sellingPriceSek: sp,
      ingredients: recipeIngredients, createdAt: new Date().toISOString().slice(0,10),
    };
    store.saveRecipe(rec);
    onClose();
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(20,14,8,.45)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'var(--white)', borderRadius:20, width:'100%', maxWidth:560, maxHeight:'90vh', overflow:'auto', boxShadow:'0 24px 60px rgba(20,14,8,.25)' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)' }}>
          <h2 className="font-serif" style={{ fontSize:20, fontWeight:600, color:'var(--t1)' }}>Nytt recept</h2>
        </div>
        <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:14 }}>
          {err && <div style={{ padding:'10px 14px', background:'var(--redbg)', border:'1px solid rgba(185,28,28,.2)', borderRadius:9, fontSize:13, color:'var(--red)' }}>{err}</div>}

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', display:'block', marginBottom:6 }}>Namn</label>
              <input className="inp" placeholder="Receptnamn" value={name} onChange={e=>setName(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', display:'block', marginBottom:6 }}>Kategori</label>
              <select className="inp" value={cat} onChange={e=>setCat(e.target.value)}>
                {CATS.filter(c=>c!=='Alla').map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', display:'block', marginBottom:6 }}>Portioner</label>
              <input className="inp" type="number" min="1" value={servings} onChange={e=>setServings(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', display:'block', marginBottom:6 }}>Försäljningspris (kr/port)</label>
              <input className="inp" type="number" placeholder="Lämna tomt = auto" value={price} onChange={e=>setPrice(e.target.value)} />
            </div>
          </div>

          <div>
            <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', display:'block', marginBottom:8 }}>Ingredienser</label>
            {lines.map((line, i) => (
              <div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}>
                <select className="inp" value={line.ingId} onChange={e=>setLine(i,'ingId',e.target.value)} style={{ flex:2 }}>
                  <option value="">Välj ingrediens...</option>
                  {ingredients.map(ing=><option key={ing.id} value={ing.id}>{ing.name} ({ing.priceSek} kr/{ing.unit})</option>)}
                </select>
                <input className="inp" type="number" placeholder="Mängd" value={line.qty} onChange={e=>setLine(i,'qty',e.target.value)}
                  style={{ flex:1 }} />
                {i>0 && (
                  <button onClick={()=>removeLine(i)} style={{ padding:'0 12px', borderRadius:9, border:'1px solid var(--border)', background:'none', cursor:'pointer', color:'var(--t3)' }}>✕</button>
                )}
              </div>
            ))}
            <button onClick={addLine} style={{ fontSize:13, color:'var(--gold)', background:'none', border:'none', cursor:'pointer', fontWeight:600, marginTop:4 }}>+ Lägg till ingrediens</button>
          </div>
        </div>
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button className="btn-outline" onClick={onClose}>Avbryt</button>
          <button className="btn-brown" onClick={save}>Spara recept</button>
        </div>
      </div>
    </div>
  );
}

