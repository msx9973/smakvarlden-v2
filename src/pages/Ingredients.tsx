import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { store } from '../store';
import type { Ingredient } from '../store';

const CATS = ['Alla','Fisk','Kött','Grönsaker','Mejeri','Torrvaror','Kryddor','Skaldjur','Svamp'];

export default function Ingredients() {
  const [ingredients, setIngredients] = useState(() => store.getIngredients());
  const [search, setSearch]   = useState('');
  const [cat, setCat]         = useState('Alla');
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [showNew, setShowNew] = useState(false);

  const withPct = ingredients.map(i => ({
    ...i,
    priceChangePct: i.prevPriceSek > 0 ? ((i.priceSek - i.prevPriceSek) / i.prevPriceSek) * 100 : 0
  }));
  const filtered = withPct.filter(i =>
    (cat === 'Alla' || i.category === cat) &&
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  function del(id: string) {
    if (!confirm('Ta bort ingrediensen?')) return;
    store.deleteIngredient(id);
    setIngredients(store.getIngredients());
  }

  function refresh() { setIngredients(store.getIngredients()); }

  return (
    <div style={{ padding:'32px 36px', maxWidth:1040, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 className="font-serif" style={{ fontSize:28, fontWeight:600, letterSpacing:'-.6px', color:'var(--t1)' }}>Ingredienser</h1>
          <p style={{ fontSize:14, color:'var(--t2)', marginTop:4 }}>{ingredients.length} ingredienser · priser uppdateras när du redigerar</p>
          <p style={{ fontSize:12, color:'var(--t3)', marginTop:6 }}>Demo data / example calculations. Ingredient price changed → affected recipes → margin loss → suggested action.</p>
        </div>
        <button className="btn-brown" onClick={() => setShowNew(true)} style={{ display:'flex', alignItems:'center', gap:8 }}>
          <Plus size={15} /> Ny ingrediens
        </button>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--t3)' }} />
          <input className="inp" style={{ paddingLeft:36 }} placeholder="Sök ingrediens..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
          {CATS.map(c => (
            <button key={c} onClick={()=>setCat(c)}
              style={{ padding:'7px 13px', borderRadius:9, border:'none', font:'500 12px DM Sans', cursor:'pointer', transition:'.15s',
                background: cat===c?'var(--brown)':'var(--white)',
                color: cat===c?'var(--cream)':'var(--t2)',
                boxShadow: cat===c?'none':'0 1px 4px var(--shad)',
              }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts strip */}
      {withPct.filter(i=>i.priceChangePct>5).length > 0 && (
        <div style={{ padding:'11px 16px', background:'var(--redbg)', border:'1px solid rgba(185,28,28,.18)', borderRadius:11, marginBottom:16, fontSize:13, color:'var(--red)', display:'flex', alignItems:'center', gap:8 }}>
          <TrendingUp size={14} />
          <strong>{withPct.filter(i=>i.priceChangePct>5).length} ingredienser</strong> har stigit mer än 5% — kontrollera dina recept.
        </div>
      )}

      {/* Table */}
      <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 100px 90px 100px 120px 80px', padding:'10px 18px', background:'var(--muted)', borderBottom:'1px solid var(--border)' }}>
          {['Ingrediens','Kategori','Pris/enhet','Förändring','Leverantör',''].map((h,i)=>(
            <div key={i} style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)' }}>{h}</div>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding:'40px', textAlign:'center', color:'var(--t3)', fontSize:14 }}>Inga ingredienser hittades.</div>
        ) : filtered.map((ing, i) => (
          <div key={ing.id} style={{ display:'grid', gridTemplateColumns:'1fr 100px 90px 100px 120px 80px', padding:'12px 18px', alignItems:'center', borderTop: i>0?'1px solid var(--border)':'none' }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--t1)' }}>{ing.name}</div>
              <div style={{ fontSize:11, color:'var(--t3)', marginTop:1 }}>Uppdaterad: {ing.updatedAt}</div>
            </div>
            <div style={{ fontSize:12, color:'var(--t2)' }}>{ing.category}</div>
            <div className="font-mono" style={{ fontSize:13, fontWeight:600, color:'var(--t1)' }}>{ing.priceSek} kr/{ing.unit}</div>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
              {ing.priceChangePct > 0
                ? <TrendingUp size={12} style={{ color:'var(--red)' }} />
                : ing.priceChangePct < 0
                  ? <TrendingDown size={12} style={{ color:'var(--green)' }} />
                  : null}
              <span className="font-mono" style={{ fontSize:12, fontWeight:700, color: ing.priceChangePct>0?'var(--red)':ing.priceChangePct<0?'var(--green)':'var(--t3)' }}>
                {ing.priceChangePct>0?'+':''}{ing.priceChangePct.toFixed(1)}%
              </span>
            </div>
            <div style={{ fontSize:12, color:'var(--t2)' }}>{ing.supplier || '—'}</div>
            <div style={{ display:'flex', gap:6, justifyContent:'flex-end' }}>
              <button onClick={()=>setEditing(ing)} style={{ width:28, height:28, borderRadius:7, border:'1px solid var(--border)', background:'var(--white)', cursor:'pointer', color:'var(--t2)', display:'grid', placeItems:'center' }} title="Redigera">
                <Pencil size={12} />
              </button>
              <button onClick={()=>{ del(ing.id); }} style={{ width:28, height:28, borderRadius:7, border:'1px solid var(--border)', background:'var(--white)', cursor:'pointer', color:'var(--t3)', display:'grid', placeItems:'center' }} title="Ta bort">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(showNew || editing) && (
        <IngredientModal
          ing={editing}
          onClose={() => { setEditing(null); setShowNew(false); refresh(); }}
        />
      )}
    </div>
  );
}

function IngredientModal({ ing, onClose }: { ing: Ingredient|null; onClose:()=>void }) {
  const isEdit = !!ing;
  const [name, setName]         = useState(ing?.name || '');
  const [cat, setCat]           = useState(ing?.category || 'Fisk');
  const [unit, setUnit]         = useState(ing?.unit || 'kg');
  const [price, setPrice]       = useState(ing?.priceSek?.toString() || '');
  const [supplier, setSupplier] = useState(ing?.supplier || '');
  const [err, setErr]           = useState('');

  const CATS2 = ['Fisk','Kött','Grönsaker','Mejeri','Torrvaror','Kryddor','Skaldjur','Svamp'];
  const UNITS = ['kg','g','liter','dl','st','klyfta'];

  function save() {
    if (!name.trim() || !price) { setErr('Namn och pris krävs'); return; }
    const existing = ing ? store.getIngredients().find(i=>i.id===ing.id) : null;
    const newPrice = parseFloat(price);
    const newIng: Ingredient = {
      id:           ing?.id || crypto.randomUUID(),
      name:         name.trim(),
      category:     cat,
      unit,
      priceSek:     newPrice,
      prevPriceSek: existing ? existing.priceSek : newPrice,
      supplier:     supplier || undefined,
      priceHistory: existing ? existing.priceHistory : [],
      updatedAt:    new Date().toISOString().slice(0,10),
    };
    store.saveIngredient(newIng);
    onClose();
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(20,14,8,.45)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:'var(--white)', borderRadius:18, width:'100%', maxWidth:460, boxShadow:'0 24px 60px rgba(20,14,8,.25)' }}>
        <div style={{ padding:'18px 22px', borderBottom:'1px solid var(--border)' }}>
          <h2 className="font-serif" style={{ fontSize:18, fontWeight:600, color:'var(--t1)' }}>{isEdit?'Redigera ingrediens':'Ny ingrediens'}</h2>
        </div>
        <div style={{ padding:'18px 22px', display:'flex', flexDirection:'column', gap:12 }}>
          {err && <div style={{ padding:'9px 13px', background:'var(--redbg)', borderRadius:8, fontSize:13, color:'var(--red)' }}>{err}</div>}
          <div>
            <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', display:'block', marginBottom:6 }}>Namn</label>
            <input className="inp" placeholder="T.ex. Norsk Lax" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', display:'block', marginBottom:6 }}>Kategori</label>
              <select className="inp" value={cat} onChange={e=>setCat(e.target.value)}>
                {CATS2.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', display:'block', marginBottom:6 }}>Enhet</label>
              <select className="inp" value={unit} onChange={e=>setUnit(e.target.value)}>
                {UNITS.map(u=><option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', display:'block', marginBottom:6 }}>Pris per {unit} (kr)</label>
            <input className="inp" type="number" min="0" step="0.01" placeholder="0.00" value={price} onChange={e=>setPrice(e.target.value)} />
            {isEdit && price && (
              <div style={{ fontSize:11, color:'var(--t2)', marginTop:5 }}>
                Förändring från {ing!.priceSek} kr → {parseFloat(price)||0} kr
                {' '}({((((parseFloat(price)||0)-ing!.priceSek)/ing!.priceSek)*100).toFixed(1)}%)
              </div>
            )}
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--t3)', display:'block', marginBottom:6 }}>Leverantör (valfritt)</label>
            <input className="inp" placeholder="T.ex. Menigo" value={supplier} onChange={e=>setSupplier(e.target.value)} />
          </div>
        </div>
        <div style={{ padding:'14px 22px', borderTop:'1px solid var(--border)', display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button className="btn-outline" onClick={onClose}>Avbryt</button>
          <button className="btn-brown" onClick={save}>Spara</button>
        </div>
      </div>
    </div>
  );
}

