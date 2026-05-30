import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Search, Trash2, ChevronRight, ScanLine, Upload, X, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import { store, margin, totalCost, marginColor, suggested } from '../store';
import type { Recipe, RecipeVisibility } from '../store';
import { parseInvoiceData, createIngredientFromInvoiceItem } from '../lib/invoice-parser';
import type { ParsedInvoiceItem } from '../lib/invoice-parser';
import { useAuth } from '../lib/auth-context';
import RecipeVisibilityPicker from '../components/RecipeVisibilityPicker';
import { SimpleTip } from '../components/SimpleGuide';
import { fileToBase64, fetchScanHealth, scanDocument } from '../lib/scan-api';
import { calculateLineCostWithUnits, convertQuantity, inferPurchaseUnit } from '../lib/calculations';

const CATS = ['Alla','Förrätter','Huvudrätter','Desserter','Soppor','Sallader'];
const SCAN_LIMIT = 2;

function getRecipeScansUsed(): number { return store.getRecipeScansUsed(); }
function incrementRecipeScans() { store.incrementRecipeScans(); }

function getScansUsed(): number {
  return store.getInvoiceScansUsed();
}
function incrementScans() {
  store.incrementInvoiceScans();
}

function canScan(used: number, isPro: boolean): boolean {
  return isPro || used < SCAN_LIMIT;
}

function useScanServiceStatus() {
  const [status, setStatus] = useState<'checking' | 'ready' | 'missing' | 'offline'>('checking');

  useEffect(() => {
    let active = true;
    fetchScanHealth()
      .then((health) => {
        if (!active) return;
        if (health.ok && health.scanConfigured) setStatus('ready');
        else if (health.ok) setStatus('missing');
        else setStatus('offline');
      })
      .catch(() => {
        if (active) setStatus('offline');
      });
    return () => { active = false; };
  }, []);

  return status;
}

function ScanServiceNotice({ status }: { status: ReturnType<typeof useScanServiceStatus> }) {
  if (status === 'checking' || status === 'ready') return null;

  const message = status === 'missing'
    ? 'Skanningstjänsten körs men ANTHROPIC_API_KEY saknas. Lägg till nyckeln i Netlify (scope: Functions) och deploya om.'
    : 'Skanningstjänsten svarar inte. Kontrollera att sidan är deployad på Netlify med funktionen scan, eller kör npm run dev:netlify lokalt.';

  return (
    <div style={{ padding:'12px 16px', background:'rgba(185,28,28,.06)', border:'1px solid rgba(185,28,28,.15)', borderRadius:10, fontSize:13, color:'var(--red)', marginBottom:16, lineHeight:1.5 }}>
      {message}
    </div>
  );
}

export default function Recipes() {
  const { user } = useAuth();
  const isPro = user?.plan === 'pro';
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<'mine' | 'public'>('mine');
  const [recipes, setRecipes] = useState(() => store.getRecipes());
  const [publicRecipes, setPublicRecipes] = useState(() => store.getPublicRecipesFromOthers());
  const [search, setSearch]   = useState('');
  const [cat, setCat]         = useState('Alla');
  const [showNew, setShowNew] = useState(false);
  const [showScanner, setShowScanner]       = useState(false);
  const [showRecipeScanner, setShowRecipeScanner] = useState(false);

  useEffect(() => {
    const scan = searchParams.get('scan');
    const isNew = searchParams.get('new');
    if (scan === 'invoice') setShowScanner(true);
    if (scan === 'recipe') setShowRecipeScanner(true);
    if (isNew === '1') setShowNew(true);
    if (scan || isNew) setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const activeRecipes = view === 'mine' ? recipes : publicRecipes;

  const filtered = activeRecipes.filter(r =>
    (cat === 'Alla' || r.category === cat) &&
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  function refreshLists() {
    setRecipes(store.getRecipes());
    setPublicRecipes(store.getPublicRecipesFromOthers());
  }

  function del(id: string) {
    if (!confirm('Ta bort receptet?')) return;
    store.deleteRecipe(id);
    refreshLists();
  }

  return (
    <div style={{ padding:'32px 36px', maxWidth:1040, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 className="font-serif" style={{ fontSize:28, fontWeight:600, letterSpacing:'-.6px', color:'var(--t1)' }}>Dina rätter</h1>
          <p style={{ fontSize:15, color:'var(--t2)', marginTop:6, lineHeight:1.5 }}>
            Här sparar du rätter och ser om priset på menyn räcker.
          </p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => setShowRecipeScanner(true)}
            style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 16px', borderRadius:11, border:'1.5px solid var(--border)', background:'var(--white)', fontSize:13, fontWeight:600, color:'var(--brown)', cursor:'pointer' }}>
            <Camera size={14} /> Fota recept
          </button>
          <button onClick={() => setShowScanner(true)}
            style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 16px', borderRadius:11, border:'1.5px solid var(--border)', background:'var(--white)', fontSize:13, fontWeight:600, color:'var(--brown)', cursor:'pointer' }}>
            <ScanLine size={14} /> Fota faktura
          </button>
          <button className="btn-brown" onClick={() => setShowNew(true)} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px' }}>
            <Plus size={15} /> Ny rätt
          </button>
        </div>
      </div>

      <div style={{ marginBottom:16 }}>
        <SimpleTip>
          <strong>Tips:</strong> Fota fakturan först — då får rätt pris på ingredienser. Sedan lägger du in rätter.
        </SimpleTip>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {([
          ['mine', 'Mina rätter'],
          ['public', 'Andras rätter'],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => { setView(id); if (id === 'public') setPublicRecipes(store.getPublicRecipesFromOthers()); }}
            style={{
              padding:'8px 16px',
              borderRadius:999,
              border:'none',
              cursor:'pointer',
              fontSize:13,
              fontWeight:600,
              background: view === id ? 'var(--brown)' : 'var(--white)',
              color: view === id ? '#fff' : 'var(--t2)',
              boxShadow: view === id ? 'none' : '0 1px 4px var(--shad)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {view === 'mine' && (
      <div style={{ background:'linear-gradient(135deg, var(--brown) 0%, hsl(17 47% 20%) 100%)', borderRadius:14, padding:'16px 20px', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:'rgba(255,255,255,.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <ScanLine size={20} color="var(--goldl)" />
          </div>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:2 }}>Uppdatera priser från faktura</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.6)', lineHeight:1.45 }}>
              Fota leveransfakturan — vi skriver in priserna åt dig.
              {' '}<span style={{ color:'var(--goldl)' }}>{SCAN_LIMIT - getScansUsed()} gratis kvar den här månaden.</span>
            </div>
          </div>
        </div>
        <button onClick={() => setShowScanner(true)}
          style={{ padding:'9px 18px', borderRadius:9, background:'var(--gold)', border:'none', color:'var(--brown)', fontSize:13, fontWeight:700, cursor:'pointer', flexShrink:0 }}>
          Skanna nu
        </button>
      </div>
      )}

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
          {view === 'public'
            ? 'Inga offentliga recept från andra konton ännu.'
            : <>Inga recept hittades.{' '}
          <button onClick={() => setShowNew(true)} style={{ color:'var(--gold)', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>
            Skapa ett
          </button></>}
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
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2, flexWrap:'wrap' }}>
                      <span style={{ fontSize:14, fontWeight:600, color:'var(--t1)' }}>{r.name}</span>
                      {r.visibility === 'public' && (
                        <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:999, background:'var(--goldbg)', color:'hsl(44 54% 35%)' }}>Offentligt</span>
                      )}
                    </div>
                    <div style={{ fontSize:12, color:'var(--t3)' }}>
                      {r.category} · {r.ingredients.length} ingredienser
                      {view === 'public' && r.ownerName && <> · av {r.ownerName}</>}
                    </div>
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
                {view === 'mine' && (
                <button onClick={() => del(r.id)}
                  style={{ padding:'0 18px', height:'100%', minHeight:64, background:'none', border:'none', borderLeft:'1px solid var(--border)', cursor:'pointer', color:'var(--t3)', display:'flex', alignItems:'center' }}
                  title="Ta bort">
                  <Trash2 size={14} />
                </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showNew && <NewRecipeModal onClose={() => { setShowNew(false); refreshLists(); }} />}
      {showScanner && <InvoiceScanner isPro={isPro} onClose={() => { setShowScanner(false); refreshLists(); }} />}
      {showRecipeScanner && <RecipeScanner isPro={isPro} onClose={() => { setShowRecipeScanner(false); refreshLists(); }} />}
    </div>
  );
}


interface ScannedIng { name:string; quantity:number|null; unit:string; matchedId?:string; priceSek?:number; }
interface ScannedRec { name:string; category:string; sellingPrice:number|null; servings:number; ingredients:ScannedIng[]; }
type RSState = 'idle'|'scanning'|'review'|'done'|'error'|'limit';

function RecipeScanner({ isPro, onClose }:{ isPro:boolean; onClose:()=>void }) {
  const scanStatus = useScanServiceStatus();
  const [state,setState]=useState<RSState>(canScan(getRecipeScansUsed(), isPro)?'idle':'limit');
  const [file,setFile]=useState<File|null>(null);
  const [preview,setPreview]=useState<string|null>(null);
  const [scanned,setScanned]=useState<ScannedRec|null>(null);
  const [error,setError]=useState('');
  const [rName,setRName]=useState('');
  const [rCat,setRCat]=useState('Huvudrätter');
  const [rPrice,setRPrice]=useState('');
  const [rServ,setRServ]=useState('1');
  const [rVisibility,setRVisibility]=useState<RecipeVisibility>('private');
  const [ings,setIngs]=useState<ScannedIng[]>([]);

  function handleFile(f:File){setFile(f);if(f.type.startsWith('image/'))setPreview(URL.createObjectURL(f));else setPreview(null);}
  function handleDrop(e:React.DragEvent){e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleFile(f);}

  async function scan(){
    if(!file)return; setState('scanning'); setError('');
    try{
      const { base64, mediaType } = await fileToBase64(file);
      const data = await scanDocument({ type: 'recipe', base64, mediaType }) as ScannedRec;
      const si=store.getIngredients();
      const matched=data.ingredients.map(x=>{const f=si.find(s=>s.name.toLowerCase().includes(x.name.toLowerCase())||x.name.toLowerCase().includes(s.name.toLowerCase()));return{...x,matchedId:f?.id,priceSek:f?.priceSek};});
      if (!isPro) incrementRecipeScans();
      setScanned({...data,ingredients:matched});
      setRName(data.name); setRCat(data.category||'Huvudrätter');
      setRPrice(data.sellingPrice?String(data.sellingPrice):''); setRServ(String(data.servings||1)); setIngs(matched);
      setState('review');
    }catch(e:unknown){setError(e instanceof Error?e.message:'Något gick fel.');setState('error');}
  }

  function updIng(i:number,f:keyof ScannedIng,v:string|number){setIngs(p=>p.map((x,j)=>j===i?{...x,[f]:v}:x));}
  function remIng(i:number){setIngs(p=>p.filter((_,j)=>j!==i));}
  function addIng(){setIngs(p=>[...p,{name:'',quantity:null,unit:'g'}]);}

  function saveRecipe(){
    if(!rName.trim())return;
    const si=store.getIngredients();
    const ri=ings.filter(x=>x.name&&(x.quantity||0)>0).map(x=>{
      const f=x.matchedId?si.find(s=>s.id===x.matchedId):si.find(s=>s.name.toLowerCase().includes(x.name.toLowerCase())||x.name.toLowerCase().includes(s.name.toLowerCase()));
      const purchaseUnit = f?.unit ?? inferPurchaseUnit(x.unit);
      const quantity = convertQuantity(x.quantity || 0, x.unit, purchaseUnit);
      return{ingredientId:f?.id||'u_'+x.name,name:x.name,quantity,unit:purchaseUnit,unitPrice:f?.priceSek||0};
    });
    const raw=ri.reduce((s,x)=>s+calculateLineCostWithUnits(x.quantity,x.unit,x.unitPrice,x.unit),0);
    store.saveRecipe({id:crypto.randomUUID(),name:rName.trim(),category:rCat,servings:parseInt(rServ)||1,sellingPriceSek:parseFloat(rPrice)||suggested(raw),ingredients:ri,createdAt:new Date().toISOString().slice(0,10),visibility:rVisibility});
    setState('done');
  }

  const mq=ings.filter(x=>!x.quantity).length;
  const mp=ings.filter(x=>!x.matchedId&&(x.quantity||0)>0).length;

  return(
    <div style={{position:'fixed',inset:0,background:'rgba(20,14,8,.55)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:'var(--white)',borderRadius:24,width:'100%',maxWidth:640,maxHeight:'92vh',overflow:'auto',boxShadow:'0 32px 80px rgba(20,14,8,.3)'}}>
        <div style={{padding:'20px 24px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,background:'var(--white)',zIndex:10}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}><Camera size={18} color="var(--gold)"/><h2 className="font-serif" style={{fontSize:20,fontWeight:600,color:'var(--t1)'}}>{state==='review'?'Granska & spara':'Skanna recept'}</h2></div>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'var(--t3)',padding:4}}><X size={18}/></button>
        </div>
        <div style={{padding:'24px'}}>
          {state==='limit'&&<div style={{textAlign:'center',padding:'40px 20px'}}><div style={{fontSize:40,marginBottom:16}}>⏳</div><div style={{fontSize:16,fontWeight:700,color:'var(--t1)',marginBottom:16}}>Månadens skanning är slut</div><Link to="/upgrade" onClick={onClose} style={{padding:'10px 24px',borderRadius:10,background:'var(--brown)',color:'#fff',fontSize:13,fontWeight:600,textDecoration:'none'}}>Uppgradera till Pro</Link></div>}
          {state==='idle'&&(<>
            <ScanServiceNotice status={scanStatus} />
            <div style={{fontSize:13,color:'var(--t2)',lineHeight:1.6,marginBottom:20}}>Ta en bild på ett recept — handskrivet eller tryckt. <strong>Inga krav på snygg handstil.</strong> AI läser ingredienser och mängder. Om något saknas frågar vi dig.<span style={{color:'var(--gold)',fontWeight:600}}> {isPro ? 'Pro — obegränsat' : `${SCAN_LIMIT-getRecipeScansUsed()} av ${SCAN_LIMIT} gratisskanning kvar`}.</span></div>
            <div onDrop={handleDrop} onDragOver={e=>e.preventDefault()} style={{border:'2px dashed var(--border)',borderRadius:16,padding:'40px 20px',textAlign:'center',marginBottom:16,cursor:'pointer',transition:'all .2s'}} onClick={()=>document.getElementById('rfi')?.click()} onMouseEnter={e=>(e.currentTarget.style.borderColor='var(--gold)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--border)')}>
              <input id="rfi" type="file" accept="image/*,application/pdf" style={{display:'none'}} onChange={e=>e.target.files?.[0]&&handleFile(e.target.files[0])}/>
              <Camera size={28} color="var(--t3)" style={{marginBottom:12}}/>
              <div style={{fontSize:14,fontWeight:600,color:'var(--t1)',marginBottom:4}}>Dra hit receptet eller klicka</div>
              <div style={{fontSize:12,color:'var(--t3)'}}>Foto eller PDF — handskrivet fungerar!</div>
            </div>
            {preview&&<div style={{marginBottom:16,borderRadius:12,overflow:'hidden',border:'1px solid var(--border)'}}><img src={preview} alt="Recept" style={{width:'100%',maxHeight:220,objectFit:'cover'}}/></div>}
            {file&&!preview&&<div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',background:'var(--goldbg)',borderRadius:10,marginBottom:16}}><span>📄</span><span style={{fontSize:13,fontWeight:600}}>{file.name}</span></div>}
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <button onClick={onClose} style={{padding:'10px 20px',borderRadius:10,border:'1px solid var(--border)',background:'none',cursor:'pointer',fontSize:13,color:'var(--t2)'}}>Avbryt</button>
              <button onClick={scan} disabled={!file} style={{padding:'10px 24px',borderRadius:10,background:file?'var(--brown)':'var(--border)',border:'none',color:file?'#fff':'var(--t3)',fontSize:13,fontWeight:600,cursor:file?'pointer':'not-allowed'}}><Camera size={14} style={{display:'inline',marginRight:6}}/>Skanna recept</button>
            </div>
          </>)}
          {state==='scanning'&&<div style={{textAlign:'center',padding:'48px 20px'}}><div style={{width:48,height:48,border:'3px solid var(--border)',borderTopColor:'var(--gold)',borderRadius:'50%',margin:'0 auto 20px',animation:'spin 1s linear infinite'}}/><div style={{fontSize:16,fontWeight:600,color:'var(--t1)',marginBottom:8}}>Läser receptet...</div><div style={{fontSize:13,color:'var(--t2)'}}>AI analyserar ingredienser och mängder</div><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>}
          {state==='error'&&<div style={{textAlign:'center',padding:'40px 20px'}}><AlertCircle size={40} color="var(--red)" style={{marginBottom:12}}/><div style={{fontSize:15,fontWeight:600,color:'var(--t1)',marginBottom:8}}>Något gick fel</div><div style={{fontSize:13,color:'var(--t2)',marginBottom:24}}>{error}</div><button onClick={()=>setState('idle')} style={{padding:'10px 24px',borderRadius:10,background:'var(--brown)',border:'none',color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer'}}>Försök igen</button></div>}
          {state==='done'&&<div style={{textAlign:'center',padding:'40px 20px'}}><CheckCircle size={48} color="var(--green)" style={{marginBottom:12}}/><div style={{fontSize:16,fontWeight:700,color:'var(--t1)',marginBottom:8}}>Recept sparat! 🎉</div><div style={{fontSize:13,color:'var(--t2)',marginBottom:24}}><strong>{rName}</strong> är nu sparat med kalkyl. Skanna din faktura för att uppdatera priserna och se marginalen.</div><button onClick={onClose} style={{padding:'10px 24px',borderRadius:10,background:'var(--brown)',border:'none',color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer'}}>Stäng och se recept</button></div>}
          {state==='review'&&scanned&&(<>
            {mq>0&&<div style={{padding:'12px 16px',background:'rgba(201,168,76,.1)',border:'1px solid rgba(201,168,76,.3)',borderRadius:10,fontSize:13,color:'hsl(44 54% 35%)',marginBottom:16}}>⚠️ <strong>{mq} ingrediens{mq>1?'er':''}</strong> saknar mängd — fyll i dem nedan så blir kalkylen rätt.</div>}
            {mp>0&&<div style={{padding:'12px 16px',background:'rgba(185,28,28,.06)',border:'1px solid rgba(185,28,28,.15)',borderRadius:10,fontSize:13,color:'var(--red)',marginBottom:16}}>ℹ️ <strong>{mp} ingrediens{mp>1?'er':''}</strong> finns inte i din ingrediensdatabas än. Lägg till dem under Ingredienser för att få rätt kalkyl.</div>}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
              <div style={{gridColumn:'1/-1'}}><label style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.6px',color:'var(--t3)',display:'block',marginBottom:6}}>Receptnamn</label><input className="inp" value={rName} onChange={e=>setRName(e.target.value)}/></div>
              <div><label style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.6px',color:'var(--t3)',display:'block',marginBottom:6}}>Kategori</label><select className="inp" value={rCat} onChange={e=>setRCat(e.target.value)}>{CATS.filter(c=>c!=='Alla').map(c=><option key={c}>{c}</option>)}</select></div>
              <div><label style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.6px',color:'var(--t3)',display:'block',marginBottom:6}}>Portioner</label><input className="inp" type="number" min="1" value={rServ} onChange={e=>setRServ(e.target.value)}/></div>
              <div style={{gridColumn:'1/-1'}}><label style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.6px',color:'var(--t3)',display:'block',marginBottom:6}}>Försäljningspris (kr) — lämna tomt = auto</label><input className="inp" type="number" placeholder="t.ex. 139" value={rPrice} onChange={e=>setRPrice(e.target.value)}/></div>
              <div style={{gridColumn:'1/-1'}}><RecipeVisibilityPicker value={rVisibility} onChange={setRVisibility} /></div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.6px',color:'var(--t3)',marginBottom:10}}>Ingredienser — kontrollera mängder</div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {ings.map((x,i)=>(
                  <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 90px 70px auto',gap:8,alignItems:'center',padding:'10px 12px',borderRadius:10,background:x.quantity?(x.matchedId?'var(--goldbg)':'var(--muted)'):'rgba(185,28,28,.05)',border:`1px solid ${x.quantity?'var(--border)':'rgba(185,28,28,.2)'}`}}>
                    <div><input className="inp" value={x.name} onChange={e=>updIng(i,'name',e.target.value)} style={{padding:'6px 10px',fontSize:13}}/>{x.matchedId&&<div style={{fontSize:10,color:'var(--green)',marginTop:2,fontWeight:600}}>✓ Matchar din databas</div>}{!x.matchedId&&x.name&&<div style={{fontSize:10,color:'var(--t3)',marginTop:2}}>Ej i din databas</div>}</div>
                    <input className="inp" type="number" placeholder="Mängd" value={x.quantity??''} onChange={e=>updIng(i,'quantity',parseFloat(e.target.value)||0)} style={{padding:'6px 10px',fontSize:13,textAlign:'center',borderColor:!x.quantity?'rgba(185,28,28,.4)':'var(--border)'}}/>
                    <select className="inp" value={x.unit} onChange={e=>updIng(i,'unit',e.target.value)} style={{padding:'6px 8px',fontSize:12}}>{['g','kg','ml','liter','styck','msk','tsk'].map(u=><option key={u}>{u}</option>)}</select>
                    <button onClick={()=>remIng(i)} style={{padding:'6px 10px',borderRadius:8,border:'1px solid var(--border)',background:'none',cursor:'pointer',color:'var(--t3)',fontSize:12}}>✕</button>
                  </div>
                ))}
              </div>
              <button onClick={addIng} style={{fontSize:13,color:'var(--gold)',background:'none',border:'none',cursor:'pointer',fontWeight:600,marginTop:10}}>+ Lägg till ingrediens</button>
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <button onClick={onClose} style={{padding:'10px 20px',borderRadius:10,border:'1px solid var(--border)',background:'none',cursor:'pointer',fontSize:13,color:'var(--t2)'}}>Avbryt</button>
              <button onClick={saveRecipe} disabled={!rName.trim()} style={{padding:'10px 24px',borderRadius:10,background:rName.trim()?'var(--brown)':'var(--border)',border:'none',color:rName.trim()?'#fff':'var(--t3)',fontSize:13,fontWeight:600,cursor:rName.trim()?'pointer':'not-allowed'}}>Spara recept</button>
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}

type ScanResult = ParsedInvoiceItem;
type ScanState = 'idle' | 'uploading' | 'scanning' | 'done' | 'error' | 'limit';

function InvoiceScanner({ isPro, onClose }: { isPro: boolean; onClose: () => void }) {
  const scanStatus = useScanServiceStatus();
  const [state, setState] = useState<ScanState>(canScan(getScansUsed(), isPro) ? 'idle' : 'limit');
  const [file, setFile]   = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied]   = useState(false);
  const [applySummary, setApplySummary] = useState({ updated: 0, added: 0 });

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
      const { base64, mediaType } = await fileToBase64(file);
      const data = await scanDocument({ type: 'invoice', base64, mediaType });
      const existing = store.getIngredients();
      const matched = parseInvoiceData(data, 'demo-restaurant', existing);
      if (!isPro) incrementScans();
      setResults(matched);
      setState('done');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Något gick fel. Försök igen.');
      setState('error');
    }
  }

  function applyPrices() {
    setApplying(true);
    let updated = 0;
    let added = 0;

    results.forEach(r => {
      if (r.unitPrice <= 0 || !r.itemName.trim()) return;

      if (r.matched && r.ingredientId) {
        const ing = store.getIngredients().find(i => i.id === r.ingredientId);
        if (ing) {
          store.saveIngredient({
            ...ing,
            priceSek: r.unitPrice,
            supplier: r.supplierName,
            updatedAt: new Date().toISOString().slice(0, 10),
          });
          updated++;
        }
        return;
      }

      store.saveIngredient(createIngredientFromInvoiceItem(r));
      added++;
    });

    setApplySummary({ updated, added });
    setApplying(false);
    setApplied(true);
  }

  const matchedCount = results.filter(r => r.matched).length;
  const newCount = results.filter(r => !r.matched && r.unitPrice > 0 && r.itemName.trim()).length;
  const actionableCount = matchedCount + newCount;

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
              <ScanServiceNotice status={scanStatus} />
              <div style={{ fontSize:13, color:'var(--t2)', marginBottom:20, lineHeight:1.6 }}>
                Ladda upp en bild eller PDF på din leveransfaktura. Vi läser av alla priser automatiskt.
                <span style={{ color:'var(--gold)', fontWeight:600 }}> {isPro ? 'Pro — obegränsat' : `${SCAN_LIMIT - getScansUsed()} av ${SCAN_LIMIT} gratisskanning kvar`}.</span>
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
                <div style={{ fontSize:16, fontWeight:700, color:'var(--t1)', marginBottom:8 }}>Faktura importerad!</div>
                <div style={{ fontSize:13, color:'var(--t2)', marginBottom:24, lineHeight:1.6 }}>
                  {applySummary.updated > 0 && <span>{applySummary.updated} priser uppdaterade.<br /></span>}
                  {applySummary.added > 0 && <span>{applySummary.added} nya ingredienser tillagda.<br /></span>}
                  {applySummary.updated === 0 && applySummary.added === 0 && 'Inga rader kunde sparas.'}
                </div>
                <button onClick={onClose} style={{ padding:'10px 24px', borderRadius:10, background:'var(--brown)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>Stäng och se ingredienser</button>
              </div>
            ) : (
              <>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                  <CheckCircle size={18} color="var(--green)" />
                  <span style={{ fontSize:14, fontWeight:600, color:'var(--t1)' }}>
                    Hittade {results.length} rader — {matchedCount} matchade, {newCount} nya
                  </span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:20, maxHeight:300, overflow:'auto' }}>
                  {results.map((r, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderRadius:10, background:r.matched?'var(--goldbg)':'var(--muted)', border:'1px solid var(--border)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{ fontSize:14 }}>{r.matched ? '✅' : '➕'}</span>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:'var(--t1)' }}>{r.itemName}</div>
                          <div style={{ fontSize:11, color:'var(--t3)' }}>{r.matched ? 'Uppdaterar pris' : 'Läggs till som ny'} · {r.quantity} {r.unit} · {r.supplierName}</div>
                        </div>
                      </div>
                      <div className="font-mono" style={{ fontSize:14, fontWeight:700, color:'var(--brown)' }}>{r.unitPrice} kr/{r.unit}</div>
                    </div>
                  ))}
                </div>
                {actionableCount === 0 && (
                  <div style={{ padding:'12px 16px', background:'rgba(185,28,28,.06)', border:'1px solid rgba(185,28,28,.15)', borderRadius:10, fontSize:13, color:'var(--red)', marginBottom:16 }}>
                    Inga rader kunde importeras. Kontrollera att fakturan innehåller produkter med pris.
                  </div>
                )}
                <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
                  <button onClick={onClose} style={{ padding:'10px 20px', borderRadius:10, border:'1px solid var(--border)', background:'none', cursor:'pointer', fontSize:13, color:'var(--t2)' }}>Avbryt</button>
                  <button onClick={applyPrices} disabled={actionableCount === 0 || applying}
                    style={{ padding:'10px 24px', borderRadius:10, background:actionableCount > 0 ? 'var(--brown)' : 'var(--border)', border:'none', color:actionableCount > 0 ? '#fff' : 'var(--t3)', fontSize:13, fontWeight:600, cursor:actionableCount > 0 ? 'pointer' : 'not-allowed' }}>
                    {applying ? 'Sparar...' : newCount > 0 && matchedCount > 0
                      ? `Uppdatera ${matchedCount} och lägg till ${newCount}`
                      : newCount > 0
                        ? `Lägg till ${newCount} ingredienser`
                        : `Uppdatera ${matchedCount} priser`}
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
  const [visibility, setVisibility] = useState<RecipeVisibility>('private');
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
    const raw = recipeIngredients.reduce(
      (s, i) => s + calculateLineCostWithUnits(i.quantity, i.unit, i.unitPrice, i.unit),
      0,
    );
    const sp  = parseFloat(price) || suggested(raw);
    const rec: Recipe = {
      id: crypto.randomUUID(), name: name.trim(), category: cat,
      servings: parseInt(servings) || 1, sellingPriceSek: sp,
      ingredients: recipeIngredients, createdAt: new Date().toISOString().slice(0,10),
      visibility,
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
          <RecipeVisibilityPicker value={visibility} onChange={setVisibility} />
        </div>
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button className="btn-outline" onClick={onClose}>Avbryt</button>
          <button className="btn-brown" onClick={save}>Spara recept</button>
        </div>
      </div>
    </div>
  );
}
