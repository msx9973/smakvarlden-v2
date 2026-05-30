import { Link } from 'react-router-dom';
import ConsultingLeadForm from '../components/ConsultingLeadForm';

const services = [
  {
    title: 'Menyskanner',
    body: 'Skanna menyn och få snabba, redigerbara estimat för mat, dryck, kaffe, tillbehör och catering.',
  },
  {
    title: 'Fakturaskanner',
    body: 'Uppdatera inköpspriser från en leverantörsfaktura och se gammalt pris mot nytt pris.',
  },
  {
    title: 'Rätter & produkter',
    body: 'Räkna på pizza, pasta, öl, whiskey, cola, cappuccino, lunchlådor och andra produkter.',
  },
  {
    title: 'Marginalbeslut',
    body: 'Få underlag för om pris, portion eller kalkyl bör ses över.',
  },
];

const deliverSteps = [
  { title: 'Skanna meny', body: 'AI hittar produkter, priser och sannolika ingredienser.' },
  { title: 'Granska', body: 'Kunden justerar mängder, dryckesmått och priser.' },
  { title: 'Skanna faktura', body: 'Riktiga inköpspriser ersätter estimat.' },
  { title: 'Se påverkan', body: 'Appen visar ett underlag med prisändringar, historik och marginal.' },
];

const stats = [
  { label: 'Gratis pilot', value: '5 produkter' },
  { label: 'App självservice', value: '59 kr/mån' },
  { label: 'Exempelprodukter', value: 'Mat + dryck' },
  { label: 'Första genomgång', value: 'Meny + faktura' },
];

export default function Landing() {
  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: 'var(--cream)', color: 'var(--t1)' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(247,244,239,.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0 40px', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:12, textDecoration:'none' }}>
          <img src="/logo-mark.svg" alt="Smakvärlden" width={42} height={42} style={{ borderRadius:12, flexShrink:0 }} />
          <div>
            <div style={{ fontFamily:'Playfair Display, Georgia, serif', fontSize:22, fontWeight:700, color:'var(--brown)', letterSpacing:'-.4px' }}>Smakvärlden</div>
            <div style={{ fontFamily:'DM Mono, monospace', fontSize:10, letterSpacing:1.4, textTransform:'uppercase', color:'var(--gold)', marginTop:1 }}>Koll på matkostnaden</div>
          </div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="#pilot" style={{ fontSize: 13, color: 'var(--t2)', textDecoration: 'none', padding: '8px 16px', fontWeight: 700 }}>Gratis pilot</a>
          <Link to="/login" style={{ fontSize: 13, fontWeight: 800, color: 'var(--white)', background: 'var(--brown)', padding: '10px 20px', borderRadius: 999, textDecoration: 'none' }}>Öppna demo</Link>
        </div>
      </nav>

      <section style={{ background: 'linear-gradient(135deg, var(--brown) 0%, #160904 100%)', padding: '86px 48px 96px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -260, right: -120, width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(214,184,94,.18) 0%, transparent 68%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1120, margin: '0 auto', display:'grid', gridTemplateColumns:'minmax(0, 1.05fr) minmax(340px, .95fr)', gap:44, alignItems:'center', position:'relative' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems:'center', gap:8, fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--goldl)', border: '1px solid rgba(214,184,94,.28)', background:'rgba(214,184,94,.08)', padding: '7px 14px', borderRadius: 100, marginBottom: 24 }}>
              Gratis marginalkoll på 5 produkter
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(42px, 6vw, 76px)', fontWeight: 700, letterSpacing: -2, lineHeight: 1.04, color: '#fff', marginBottom: 22 }}>
              Se vad varje produkt <span style={{ color: 'var(--goldl)', fontStyle: 'italic' }}>egentligen kostar.</span>
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,.68)', lineHeight: 1.78, maxWidth: 650, marginBottom: 34 }}>
              Skanna meny, recept och fakturor. Smakvärlden kan visa gamla och nya inköpspriser, prishistorik och vilka rätter, drycker eller produkter som kan behöva ses över.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom:28 }}>
              <a href="#pilot" style={{ background: 'var(--gold)', color: 'var(--brown)', padding: '14px 28px', borderRadius: 999, fontSize: 14, fontWeight: 900, textDecoration: 'none' }}>
                Få gratis marginalkoll
              </a>
              <Link to="/login" style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.86)', padding: '14px 24px', borderRadius: 999, fontSize: 14, fontWeight: 800, textDecoration: 'none', border: '1px solid rgba(255,255,255,.16)' }}>
                Testa demo
              </Link>
            </div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {['Menyskanner', 'Fakturaskanner', 'Rätter & produkter'].map(item => (
                <span key={item} style={{ padding:'6px 11px', borderRadius:999, background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.1)', color:'rgba(255,255,255,.62)', fontSize:12, fontWeight:700 }}>{item}</span>
              ))}
            </div>
          </div>
          <div style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)', borderRadius:26, padding:22, boxShadow:'0 28px 70px rgba(0,0,0,.22)' }}>
            <div style={{ background:'var(--white)', borderRadius:20, overflow:'hidden' }}>
              <div style={{ padding:'16px 18px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ fontSize:13, fontWeight:900, color:'var(--t1)' }}>Prisändringar</div>
                <span style={{ fontSize:10, fontWeight:900, color:'var(--red)', background:'var(--redbg)', padding:'4px 8px', borderRadius:999 }}>Exempel</span>
              </div>
              {[
                ['Coca-Cola 33cl', '7.80 → 8.60 kr/st', '+10.3%'],
                ['Whiskey 4cl', '14.20 → 15.95 kr', '+12.3%'],
                ['Lunchlåda takeaway', '46 → 52 kr', 'granska'],
              ].map(([name, price, change], i) => (
                <div key={name} style={{ padding:'15px 18px', borderBottom:i < 2 ? '1px solid var(--border)' : 'none', display:'grid', gridTemplateColumns:'1fr auto', gap:12, alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:800, color:'var(--t1)' }}>{name}</div>
                    <div style={{ fontSize:12, color:'var(--t3)', marginTop:3 }}>{price}</div>
                  </div>
                  <div style={{ fontFamily:'DM Mono, monospace', fontSize:12, fontWeight:900, color: change === 'granska' ? 'var(--gold)' : 'var(--red)' }}>{change}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: 'var(--gold)' }}>
        {deliverSteps.map((step, i) => (
          <div key={step.title} style={{ padding: '20px 16px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,.25)' : 'none' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 34, fontWeight: 700, color: 'rgba(255,255,255,.22)', lineHeight: 1 }}>{i + 1}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--brown)', marginTop: 4 }}>{step.title}</div>
          </div>
        ))}
      </div>

      <section style={{ padding: '76px 48px 40px', maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:30 }}>
          <div style={{ fontFamily:'DM Mono, monospace', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--gold)', marginBottom:10 }}>Byggt för svenska restauranger</div>
          <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(30px, 4vw, 48px)', color:'var(--t1)', letterSpacing:-1, lineHeight:1.1, marginBottom:12 }}>
            Mat, dryck, kaffe och tillbehör i samma kalkyl.
          </h2>
          <p style={{ fontSize:15, color:'var(--t2)', lineHeight:1.7, maxWidth:650, margin:'0 auto' }}>
            En faktura kan innehålla kyckling, mozzarella, öl, cola, whiskey, kaffebönor och takeawaylådor. Smakvärlden kan samla inköpsraderna och visa vilka produkter som påverkas i kalkylen.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12 }}>
          {services.map((service) => (
            <div key={service.title} style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:18, padding:'22px', boxShadow:'0 8px 26px var(--shad)' }}>
              <h3 style={{ fontSize:15, fontWeight:900, color:'var(--t1)', marginBottom:8 }}>{service.title}</h3>
              <p style={{ fontSize:13, color:'var(--t2)', lineHeight:1.65 }}>{service.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pilot" style={{ padding: '62px 48px 88px', maxWidth: 1120, margin: '0 auto', scrollMarginTop: 90 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(340px, .9fr)', gap: 42, alignItems: 'start' }}>
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>Gratis pilot i Upplands Väsby</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 700, letterSpacing: -1.2, color: 'var(--t1)', lineHeight: 1.08, marginBottom: 14 }}>
              Skicka en meny och en faktura. Få en tydlig marginalkoll.
            </h2>
            <p style={{ fontSize: 16, color: 'var(--t2)', lineHeight: 1.75, maxWidth: 620, marginBottom: 30 }}>
              Första piloten är enkel: vi kontrollerar 5 produkter och visar en exempelrapport med prisändringar, marginalpåverkan och möjliga nästa steg.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
              {[
                ['1 meny', 'Foto, PDF eller länk till menyn.'],
                ['1 faktura', 'Senaste fakturan från leverantör.'],
                ['5 produkter', 'Mat, dryck, kaffe eller tillbehör.'],
                ['1 rapport', 'Gammal kostnad, ny kostnad och marginal.'],
              ].map(([title, body]) => (
                <div key={title} style={{ background: 'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding: '20px' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', marginBottom: 8 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.65 }}>{body}</p>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--brown)', borderRadius: 18, padding: '28px 34px', color: '#fff' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: 'var(--goldl)', marginBottom: 8 }}>Integritet först</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.64)', lineHeight: 1.7 }}>
                Fakturor, inköpspriser och marginaler är privata. Offentliga mallar delar aldrig era riktiga priser eller leverantörer.
              </p>
            </div>
          </div>

          <div>
            <ConsultingLeadForm source="landing" />
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--white)', padding: '88px 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>Så fungerar demon</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, letterSpacing: -1.2, color: 'var(--t1)', lineHeight: 1.1, marginBottom: 14 }}>
              Fyra steg till <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>bättre beslut</span>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--t2)', lineHeight: 1.75, marginBottom: 34 }}>Ingen tung installation. Börja med en meny, en faktura och några viktiga produkter.</p>
            <div style={{ display: 'grid', gap: 14 }}>
              {deliverSteps.map((step, i) => (
                <div key={step.title} style={{ display: 'grid', gridTemplateColumns: '42px 1fr', gap: 16, alignItems: 'start' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--brown)', color: 'var(--goldl)', fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', marginBottom: 5 }}>{step.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.65 }}>{step.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--goldbg)', border: '1px solid var(--border)', borderRadius: 18, padding: 34 }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: 'var(--t1)', letterSpacing: -.5, marginBottom: 20 }}>Det här visar pilotgenomgången</h3>
            {stats.map((row, i) => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: i < stats.length - 1 ? '1px solid var(--border)' : 'none', fontSize: 13 }}>
                <span style={{ color: 'var(--t2)' }}>{row.label}</span>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 800, color: '#15803d' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '88px 48px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ background: 'var(--brown)', borderRadius: 22, padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 18 }}>Redo att testa?</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 700, color: '#fff', letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 16 }}>
            Börja med fem produkter<br />
            <span style={{ color: 'var(--goldl)', fontStyle: 'italic' }}>i fakturans finstilta.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.58)', lineHeight: 1.65, maxWidth: 520, margin: '0 auto 38px' }}>
            Skicka en meny och en faktura så gör vi en försiktig exempelanalys på 5 produkter.
          </p>
          <a href="#pilot" style={{ background: 'var(--gold)', color: 'var(--brown)', padding: '13px 30px', borderRadius: 999, fontSize: 14, fontWeight: 900, textDecoration: 'none' }}>
            Boka gratis marginalkoll
          </a>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,.28)', letterSpacing: .5, marginTop: 24 }}>chef@smakvarlden.se · smakvarlden.se · Upplands Väsby, Sweden</div>
        </div>
      </section>

      <footer style={{ background: '#0A0604', padding: '32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--goldl)', fontWeight: 700 }}>Smakvärlden</div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: 1.4, color: 'rgba(201,168,76,.55)', textTransform: 'uppercase', marginTop: 3 }}>Koll på matkostnaden</div>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link to="/trust" style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>Integritet</Link>
          <Link to="/login" style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>Demo</Link>
          <a href="mailto:chef@smakvarlden.se" style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>Kontakt</a>
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,.18)' }}>© 2026 Smakvärlden</div>
      </footer>
    </div>
  );
}
