import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash2, ChevronRight, ScanLine, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { store, margin, totalCost, marginColor, suggested } from '../store';
import type { Recipe } from '../store';

const CATS = ['Alla','Förrätter','Huvudrätter','Desserter','Soppor','Sallader'];
const SCAN_LIMIT = 2;
const SCAN_KEY = 'sv_scans_' + new Date().toISOString().slice(0,7);

function getScansUsed(): number {
  return parseInt(localStorage.getItem(SCAN_KEY) || '0');
}
function incrementScans() {
  localStorage.setItem(SCAN_KEY, String(getScansUsed() + 1));
}

export default function Recipes() {
  const [recipes, setRecipes] = useState(() => store.getRecipes());
  const [search, setSearch]   = useState('');
  const [cat, setCat]         = useState('Alla');
  const [showNew, setShowNew] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

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
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => setShowScanner(true)}
            style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:11, border:'1.5px solid var(--border)', background:'var(--white)', fontSize:13.5, fontWeight:600, color:'var(--brown)', cursor:'pointer' }}>
            <ScanLine size={15} /> Skanna faktura
          </button>
          <button className="btn-brown" onClick={() => setShowNew(true)} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px' }}>
            <Plus size={15} /> Nytt recept
          </button>
        </div>
      </div>

      <div style={{ background:'linear-gradient(135deg, var(--brown) 0%, hsl(17 47% 20%) 100%)', borderRadius:14, padding:'16px 20px', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:'rgba(255,255,255,.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <ScanLine size={20} color="var(--goldl)" />
          </div>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:2 }}>Fakturaskanning</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.55)' }}>
              Ta en bild eller ladda upp PDF på din leveransfaktura — vi uppdaterar alla ingredienspriser automatiskt.
              {' '}<span style={{ color:'var(--goldl)' }}>{SCAN_LIMIT - getScansUsed()} av {SCAN_LIMIT} gratisskanning kvar.</span>
            </div>
          </div>
        </div>
        <button onClick={() => setShowScanner(true)}
          style={{ padding:'9px 18px', borderRadius:9, background:'var(--gold)', border:'none', color:'var(--brown)', fontSize:13, fontWeight:700, cursor:'pointer', flexShrink:0 }}>
          Skanna nu
        </button>
      </div>

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

      {showNew && <NewRecipeModal onClose={() => { setShowNew(false); setRecipes(store.getRecipes()); }} />}
      {showScanner && <InvoiceScanner onClose={() => { setShowScanner(false); setRecipes(store.getRecipes()); }} />}
    </div>
  );
}

type ScanResult = { name: string; price: number; unit: string; matched: boolean; ingredientId?: string };
type ScanState = 'idle' | 'uploading' | 'scanning' | 'done' | 'error' | 'limit';

function InvoiceScanner({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<ScanState>(getScansUsed() >= SCAN_LIMIT ? 'limit' : 'idle');
  const [file, setFile]   = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied]   = useState(false);

  function handleFile(f: File) {
    setFile(f);
    if (f.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(f));
    } else { setPreview(null); }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function scan() {
    if (!file) return;
    setState('scanning'); setError('');
    try {
      const base64 = await new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res((reader.result as string).split(',')[1]);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      const isPdf = file.type === 'application/pdf';
      const mediaType = isPdf ? 'application/pdf' : file.type as 'image/jpeg'|'image/png'|'image/webp';
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `Du är ett system som läser leveransfakturor från svenska livsmedelsgrossister. Extrahera ALLA ingredienser med pris och enhet. Svara ENDAST med giltig JSON: {"items":[{"name":"Norsk Lax","price":145,"unit":"kg"}]}. Ignorera frakt, moms, rabatter.`,
          messages: [{ role: 'user', content: [
            { type: isPdf ? 'document' : 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
            { type: 'text', text: 'Läs denna faktura och extrahera alla ingredienser med priser.' }
          ]}]
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'API-fel');
      const clean = data.content[0].text.trim().replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      const existing = store.getIngredients();
      const matched: ScanResult[] = (parsed.items || []).map((item: {name:string;price:number;unit:string}) => {
        const found = existing.find(i =>
          i.name.toLowerCase().includes(item.name.toLowerCase()) ||
          item.name.toLowerCase().includes(i.name.toLowerCase())
        );
        return { name: item.name, price: item.price, unit: item.unit, matched: !!found, ingredientId: found?.id };
      });
      incrementScans();
      setResults(matched);
      setState('done');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Något gick fel. Försök igen.');
      setState('error');
    }
  }

  function applyPrices() {
    setApplying(true);
    const ingredients = store.getIngredients();
    results.forEach(r => {
      if (r.matched && r.ingredientId) {
        const ing = ingredients.find(i => i.id === r.ingredientId);
        if (ing) store.saveIngredient({ ...ing, priceSek: r.price, updatedAt: new Date().toISOString().slice(0,10) });
      }
    });
    setApplying(false); setApplied(true);
  }

  const matchedCount = results.filter(r => r.matched).length;

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(20,14,8,.5)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'var(--white)', borderRadius:24, width:'100%', maxWidth:600, maxHeight:'90vh', overflow:'auto', boxShadow:'0 32px 80px rgba(20,14,8,.3)' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <ScanLine size={18} color="var(--gold)" />
            <h2 className="font-serif" style={{ fontSize:20, fontWeight:600, color:'var(--t1)' }}>Skanna faktura</h2>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--t3)', padding:4 }}><X size={18} /></button>
        </div>
        <div style={{ padding:'24px' }}>
          {state === 'limit' && (
            <div style={{ textAlign:'center', padding:'40px 20px' }}>
              <div style={{ fontSize:40, marginBottom:16 }}>⏳</div>
              <div style={{ fontSize:16, fontWeight:700, color:'var(--t1)', marginBottom:8 }}>Månadens gratisskanning är slut</div>
              <div style={{ fontSize:13, color:'var(--t2)', lineHeight:1.6, marginBottom:24 }}>Du har använt dina {SCAN_LIMIT} gratisskanning denna månad.<br />Uppgradera till Pro för obegränsad skanning.</div>
              <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
                <button onClick={onClose} style={{ padding:'10px 20px', borderRadius:10, border:'1px solid var(--border)', background:'none', cursor:'pointer', fontSize:13, color:'var(--t2)' }}>Stäng</button>
                <Link to="/upgrade" onClick={onClose} style={{ padding:'10px 20px', borderRadius:10, background:'var(--brown)', color:'#fff', fontSize:13, fontWeight:600, textDecoration:'none' }}>Uppgradera till Pro</Link>
              </div>
            </div>
          )}
          {state === 'idle' && (
            <>
              <div style={{ fontSize:13, color:'var(--t2)', marginBottom:20, lineHeight:1.6 }}>
                Ladda upp en bild eller PDF på din leveransfaktura. Vi läser av alla priser automatiskt.
                <span style={{ color:'var(--gold)', fontWeight:600 }}> {SCAN_LIMIT - getScansUsed()} av {SCAN_LIMIT} gratisskanning kvar.</span>
              </div>
              <div onDrop={handleDrop} onDragOver={e => e.preventDefault()}
                style={{ border:'2px dashed var(--border)', borderRadius:16, padding:'40px 20px', textAlign:'center', marginBottom:16, cursor:'pointer', transition:'all .2s' }}
                onClick={() => document.getElementById('invoice-file-input')?.click()}
                onMouseEnter={e => (e.currentTarget.style.borderColor='var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor='var(--border)')}>
                <input id="invoice-file-input" type="file" accept="image/*,application/pdf" style={{ display:'none' }}
                  onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                <Upload size={28} color="var(--t3)" style={{ marginBottom:12 }} />
                <div style={{ fontSize:14, fontWeight:600, color:'var(--t1)', marginBottom:4 }}>Dra hit din faktura eller klicka för att välja</div>
                <div style={{ fontSize:12, color:'var(--t3)' }}>JPG, PNG eller PDF</div>
              </div>
              {preview && <div style={{ marginBottom:16, borderRadius:12, overflow:'hidden', border:'1px solid var(--border)' }}><img src={preview} alt="Faktura" style={{ width:'100%', maxHeight:200, objectFit:'cover' }} /></div>}
              {file && !preview && <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', background:'var(--goldbg)', borderRadius:10, marginBottom:16 }}><span style={{ fontSize:20 }}>📄</span><span style={{ fontSize:13, color:'var(--t1)', fontWeight:600 }}>{file.name}</span></div>}
              <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
                <button onClick={onClose} style={{ padding:'10px 20px', borderRadius:10, border:'1px solid var(--border)', background:'none', cursor:'pointer', fontSize:13, color:'var(--t2)' }}>Avbryt</button>
                <button onClick={scan} disabled={!file} style={{ padding:'10px 24px', borderRadius:10, background:file?'var(--brown)':'var(--border)', border:'none', color:file?'#fff':'var(--t3)', fontSize:13, fontWeight:600, cursor:file?'pointer':'not-allowed' }}>
                  <ScanLine size={14} style={{ display:'inline', marginRight:6 }} />Skanna faktura
                </button>
              </div>
            </>
          )}
          {state === 'scanning' && (
            <div style={{ textAlign:'center', padding:'48px 20px' }}>
              <div style={{ width:48, height:48, border:'3px solid var(--border)', borderTopColor:'var(--gold)', borderRadius:'50%', margin:'0 auto 20px', animation:'spin 1s linear infinite' }} />
              <div style={{ fontSize:16, fontWeight:600, color:'var(--t1)', marginBottom:8 }}>Läser fakturan...</div>
              <div style={{ fontSize:13, color:'var(--t2)' }}>AI analyserar priser och ingredienser</div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
          {state === 'error' && (
            <div style={{ textAlign:'center', padding:'40px 20px' }}>
              <AlertCircle size={40} color="var(--red)" style={{ marginBottom:12 }} />
              <div style={{ fontSize:15, fontWeight:600, color:'var(--t1)', marginBottom:8 }}>Något gick fel</div>
              <div style={{ fontSize:13, color:'var(--t2)', marginBottom:24 }}>{error}</div>
              <button onClick={() => setState('idle')} style={{ padding:'10px 24px', borderRadius:10, background:'var(--brown)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>Försök igen</button>
            </div>
          )}
          {state === 'done' && (
            applied ? (
              <div style={{ textAlign:'center', padding:'40px 20px' }}>
                <CheckCircle size={48} color="var(--green)" style={{ marginBottom:12 }} />
                <div style={{ fontSize:16, fontWeight:700, color:'var(--t1)', marginBottom:8 }}>Priser uppdaterade!</div>
                <div style={{ fontSize:13, color:'var(--t2)', marginBottom:24 }}>{matchedCount} ingredienser har fått nya priser.</div>
                <button onClick={onClose} style={{ padding:'10px 24px', borderRadius:10, background:'var(--brown)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>Stäng och se recept</button>
              </div>
            ) : (
              <>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                  <CheckCircle size={18} color="var(--green)" />
                  <span style={{ fontSize:14, fontWeight:600, color:'var(--t1)' }}>Hittade {results.length} ingredienser — {matchedCount} matchade dina befintliga</span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:20, maxHeight:300, overflow:'auto' }}>
                  {results.map((r, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderRadius:10, background:r.matched?'var(--goldbg)':'var(--muted)', border:'1px solid var(--border)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{ fontSize:14 }}>{r.matched?'✅':'⚪'}</span>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:'var(--t1)' }}>{r.name}</div>
                          <div style={{ fontSize:11, color:'var(--t3)' }}>{r.matched?'Matchar din ingrediens':'Ej i din databas'}</div>
                        </div>
                      </div>
                      <div className="font-mono" style={{ fontSize:14, fontWeight:700, color:'var(--brown)' }}>{r.price} kr/{r.unit}</div>
                    </div>
                  ))}
                </div>
                {matchedCount === 0 && <div style={{ padding:'12px 16px', background:'rgba(185,28,28,.06)', border:'1px solid rgba(185,28,28,.15)', borderRadius:10, fontSize:13, color:'var(--red)', marginBottom:16 }}>Inga ingredienser matchade. Lägg till ingredienserna i din databas först.</div>}
                <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
                  <button onClick={onClose} style={{ padding:'10px 20px', borderRadius:10, border:'1px solid var(--border)', background:'none', cursor:'pointer', fontSize:13, color:'var(--t2)' }}>Avbryt</button>
                  <button onClick={applyPrices} disabled={matchedCount===0||applying}
                    style={{ padding:'10px 24px', borderRadius:10, background:matchedCount>0?'var(--brown)':'var(--border)', border:'none', color:matchedCount>0?'#fff':'var(--t3)', fontSize:13, fontWeight:600, cursor:matchedCount>0?'pointer':'not-allowed' }}>
                    {applying?'Uppdaterar...':(`Uppdatera ${matchedCount} priser`)}
                  </button>
                </div>
              </>
            )
          )}
        </div>
      </div>
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
      id: 'r' + Date.now(), name: name.trim(), category: cat,
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
                <input className="inp" type="number" placeholder="Mängd" value={line.qty} onChange={e=>setLine(i,'qty',e.target.value)} style={{ flex:1 }} />
                {i>0 && <button onClick={()=>removeLine(i)} style={{ padding:'0 12px', borderRadius:9, border:'1px solid var(--border)', background:'none', cursor:'pointer', color:'var(--t3)' }}>✕</button>}
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
