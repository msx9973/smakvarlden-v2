import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ConsultingLeadForm from '../components/ConsultingLeadForm';
import LogoMark from '../components/LogoMark';

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

const insideApp = [
  {
    title: 'Rätter & produkter',
    body: 'Spara mat, dryck, kaffe, tillbehör och catering. Varje produkt har menypris, råvaror, kostnad och marginal.',
  },
  {
    title: 'Prishistorik',
    body: 'När en faktura uppdaterar ett pris sparas datum och pris så kunden kan se utvecklingen över tid.',
  },
  {
    title: 'Prisändringar',
    body: 'Appen visar vilka produkter som påverkas när exempelvis cola, ost, whiskey, grädde eller takeawaylådor ändras i pris.',
  },
];

const navLinks = [
  ['#produkt', 'Produkt'],
  ['#funktioner', 'Funktioner'],
  ['#kunder', 'Kunder'],
  ['#kunskap', 'Kunskap'],
  ['#om-oss', 'Om oss'],
] as const;

const knowledgeItems = [
  {
    title: 'Menyskanning är ett estimat',
    body: 'En meny visar namn och pris, men inte exakta mängder. Därför ska kunden kunna granska och ändra AI-förslaget.',
  },
  {
    title: 'Fakturaskanning uppdaterar inköpsvaror',
    body: 'En faktura kan uppdatera mat, dryck, kaffe och förpackning i samma flöde.',
  },
  {
    title: 'Privata priser stannar privata',
    body: 'Fakturor, leverantörer och riktiga marginaler visas inte offentligt.',
  },
];

const logoStyle = {
  width: 250,
  maxWidth: '48vw',
  height: 'auto',
  display: 'block',
} as const;

export default function Landing() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const landingLogoStyle = { ...logoStyle, width: isMobile ? 150 : 250, maxWidth: isMobile ? '42vw' : '50vw' };
  const sectionPad = isMobile ? '52px 20px' : '76px 48px';

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: 'var(--cream)', color: 'var(--t1)' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(247,244,239,.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: isMobile ? '0 14px' : '0 40px', minHeight: isMobile ? 62 : 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <Link to="/" aria-label="Smakvärlden home" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/smakvarlden-logo-tight.png" alt="Smakvärlden" style={landingLogoStyle} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 6, flexWrap:'wrap', justifyContent:'flex-end' }}>
          {!isMobile && navLinks.map(([href, label]) => (
            <a key={href} href={href} style={{ fontSize: 13, color: 'var(--t2)', textDecoration: 'none', padding: '8px 10px', fontWeight: 700 }}>
              {label}
            </a>
          ))}
          <a href="#pilot" style={{ fontSize: isMobile ? 12 : 13, color: 'var(--brown)', background:'var(--gold)', textDecoration: 'none', padding: isMobile ? '8px 10px' : '10px 18px', borderRadius:999, fontWeight: 900, whiteSpace: 'nowrap' }}>Gratis pilot</a>
          <Link to="/login" style={{ fontSize: isMobile ? 12 : 13, fontWeight: 800, color: 'var(--white)', background: 'var(--brown)', padding: isMobile ? '8px 10px' : '10px 20px', borderRadius: 999, textDecoration: 'none', whiteSpace: 'nowrap' }}>{isMobile ? 'Demo' : 'Öppna demo'}</Link>
        </div>
      </nav>

      <section id="produkt" style={{ background: 'linear-gradient(135deg, var(--brown) 0%, #160904 100%)', padding: isMobile ? '54px 20px 64px' : '86px 48px 96px', position: 'relative', overflow: 'hidden', scrollMarginTop:90 }}>
        <div style={{ position: 'absolute', top: -260, right: -120, width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(214,184,94,.18) 0%, transparent 68%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1120, margin: '0 auto', display:'grid', gridTemplateColumns:isMobile?'1fr':'minmax(0, 1.05fr) minmax(340px, .95fr)', gap:44, alignItems:'center', position:'relative' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems:'center', gap:8, fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--goldl)', border: '1px solid rgba(214,184,94,.28)', background:'rgba(214,184,94,.08)', padding: '7px 14px', borderRadius: 100, marginBottom: 24 }}>
              Gratis marginalkoll på 5 produkter
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: isMobile ? 42 : 'clamp(42px, 6vw, 76px)', fontWeight: 700, letterSpacing: isMobile ? -0.8 : -2, lineHeight: 1.04, color: '#fff', marginBottom: 22 }}>
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
            <div style={{ display:'inline-flex', flexWrap:'wrap', gap:8, alignItems:'center', padding:'10px 13px', borderRadius:14, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.14)', color:'rgba(255,255,255,.72)', fontSize:13, lineHeight:1.5, marginBottom:22 }}>
              <span style={{ fontWeight:800, color:'var(--goldl)' }}>Demo:</span>
              <span style={{ fontFamily:'DM Mono, monospace' }}>demo@smakvarlden.se</span>
              <span style={{ color:'rgba(255,255,255,.32)' }}>/</span>
              <span style={{ fontFamily:'DM Mono, monospace' }}>demo1234</span>
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

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', background: 'var(--gold)' }}>
        {deliverSteps.map((step, i) => (
          <div key={step.title} style={{ padding: '20px 16px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,.25)' : 'none' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 34, fontWeight: 700, color: 'rgba(255,255,255,.22)', lineHeight: 1 }}>{i + 1}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--brown)', marginTop: 4 }}>{step.title}</div>
            <div style={{ fontSize: 11, color: 'rgba(47,22,13,.7)', marginTop: 4, lineHeight: 1.35 }}>{step.body}</div>
          </div>
        ))}
      </div>

      <section id="funktioner" style={{ padding: isMobile ? '52px 20px 34px' : '76px 48px 40px', maxWidth: 1120, margin: '0 auto', scrollMarginTop:90 }}>
        <div style={{ textAlign:'center', marginBottom:30 }}>
          <div style={{ fontFamily:'DM Mono, monospace', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--gold)', marginBottom:10 }}>Byggt för svenska restauranger</div>
          <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(30px, 4vw, 48px)', color:'var(--t1)', letterSpacing:-1, lineHeight:1.1, marginBottom:12 }}>
            Mat, dryck, kaffe och tillbehör i samma kalkyl.
          </h2>
          <p style={{ fontSize:15, color:'var(--t2)', lineHeight:1.7, maxWidth:650, margin:'0 auto' }}>
            En faktura kan innehålla kyckling, mozzarella, öl, cola, whiskey, kaffebönor och takeawaylådor. Smakvärlden kan samla inköpsraderna och visa vilka produkter som påverkas i kalkylen.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'repeat(4, 1fr)', gap:12 }}>
          {services.map((service) => (
            <div key={service.title} style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:18, padding:'22px', boxShadow:'0 8px 26px var(--shad)' }}>
              <h3 style={{ fontSize:15, fontWeight:900, color:'var(--t1)', marginBottom:8 }}>{service.title}</h3>
              <p style={{ fontSize:13, color:'var(--t2)', lineHeight:1.65 }}>{service.body}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop:22, display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr 1fr', gap:12 }}>
          {insideApp.map((item) => (
            <div key={item.title} style={{ background:'var(--brown)', borderRadius:18, padding:'22px', color:'#fff' }}>
              <div style={{ fontSize:13, fontWeight:900, color:'var(--goldl)', marginBottom:8 }}>{item.title}</div>
              <p style={{ fontSize:13, color:'rgba(255,255,255,.68)', lineHeight:1.65 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="kunder" style={{ padding: isMobile ? '28px 20px 52px' : '34px 48px 72px', maxWidth:1120, margin:'0 auto', scrollMarginTop:90 }}>
        <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:22, padding:isMobile ? 22 : 34, display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:28, alignItems:'start' }}>
          <div>
            <div style={{ fontFamily:'DM Mono, monospace', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--gold)', marginBottom:10 }}>Kunder</div>
            <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(28px, 3vw, 42px)', letterSpacing:-1, lineHeight:1.12, color:'var(--t1)', marginBottom:12 }}>
              För pilotrestauranger som vill testa med egna siffror.
            </h2>
            <p style={{ fontSize:15, color:'var(--t2)', lineHeight:1.7 }}>
              Vi visar inte kundloggor eller påstår resultat innan en restaurang har gett tillstånd. Första steget är en privat pilotgenomgång med meny, faktura och fem produkter.
            </p>
          </div>
          <div style={{ display:'grid', gap:10 }}>
            {[
              ['Passar bra för', 'Restauranger som vill ha koll på vad maten, drycken och varje såld portion faktiskt kostar.'],
              ['Privat data', 'Fakturor, inköpspriser och marginaler delas inte offentligt.'],
              ['Offentliga mallar', 'Kan användas som inspiration utan riktiga kundpriser.'],
            ].map(([title, body]) => (
              <div key={title} style={{ padding:'16px', borderRadius:14, background:'var(--goldbg)', border:'1px solid var(--goldb)' }}>
                <div style={{ fontSize:13, fontWeight:900, color:'var(--brown)', marginBottom:5 }}>{title}</div>
                <div style={{ fontSize:13, color:'var(--t2)', lineHeight:1.5 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pilot" style={{ padding: isMobile ? '46px 20px 62px' : '62px 48px 88px', maxWidth: 1120, margin: '0 auto', scrollMarginTop: 90 }}>
        <div style={{ display: 'grid', gridTemplateColumns:isMobile?'1fr':'minmax(0, 1.1fr) minmax(340px, .9fr)', gap: 42, alignItems: 'start' }}>
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>Gratis pilot i Upplands Väsby</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 700, letterSpacing: -1.2, color: 'var(--t1)', lineHeight: 1.08, marginBottom: 14 }}>
              Skicka en meny och en faktura. Få en tydlig marginalkoll.
            </h2>
            <p style={{ fontSize: 16, color: 'var(--t2)', lineHeight: 1.75, maxWidth: 620, marginBottom: 30 }}>
              Första piloten är enkel: vi kontrollerar 5 produkter och visar en exempelrapport med prisändringar, marginalpåverkan och möjliga nästa steg.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap: 12, marginBottom: 28 }}>
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

            <div style={{ background: 'var(--brown)', borderRadius: 18, padding: isMobile ? '22px 20px' : '28px 34px', color: '#fff' }}>
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

      <section id="kunskap" style={{ background:'var(--white)', padding: sectionPad, scrollMarginTop:90 }}>
        <div style={{ maxWidth:1080, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:26 }}>
            <div style={{ fontFamily:'DM Mono, monospace', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--gold)', marginBottom:10 }}>Kunskap</div>
            <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(28px, 3.5vw, 44px)', color:'var(--t1)', letterSpacing:-1, marginBottom:10 }}>
              Så kan restaurangen förstå kalkylen.
            </h2>
            <p style={{ fontSize:15, color:'var(--t2)', lineHeight:1.7, maxWidth:650, margin:'0 auto' }}>
              Kunskapsdelen ska hjälpa kunden förstå skillnaden mellan AI-estimat, egna mängder och riktiga fakturapriser.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'repeat(3, 1fr)', gap:12 }}>
            {knowledgeItems.map((item) => (
              <div key={item.title} style={{ border:'1px solid var(--border)', borderRadius:16, padding:'20px', background:'var(--cream)' }}>
                <h3 style={{ fontSize:14, fontWeight:900, color:'var(--t1)', marginBottom:8 }}>{item.title}</h3>
                <p style={{ fontSize:13, color:'var(--t2)', lineHeight:1.65 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="om-oss" style={{ padding: sectionPad, maxWidth:1080, margin:'0 auto', scrollMarginTop:90 }}>
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:36, alignItems:'center' }}>
          <div>
            <div style={{ fontFamily:'DM Mono, monospace', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--gold)', marginBottom:10 }}>Om oss</div>
            <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(30px, 4vw, 46px)', color:'var(--t1)', letterSpacing:-1, lineHeight:1.12, marginBottom:14 }}>
              Smakvärlden byggs nära svenska restauranger.
            </h2>
            <p style={{ fontSize:15, color:'var(--t2)', lineHeight:1.75 }}>
              Målet är inte att ersätta kockens erfarenhet. Målet är att ge tydligare siffror när råvarupriser, dryckespriser och förpackningskostnader förändras.
            </p>
          </div>
          <div style={{ background:'var(--goldbg)', border:'1px solid var(--goldb)', borderRadius:20, padding:'26px' }}>
            <div style={{ fontSize:14, fontWeight:900, color:'var(--brown)', marginBottom:10 }}>Senare kan vi lägga till</div>
            <ul style={{ margin:0, paddingLeft:18, color:'var(--t2)', fontSize:13, lineHeight:1.8 }}>
              <li>Separata kunskapssidor.</li>
              <li>Publika produktmallar utan privata priser.</li>
              <li>Kundcase först när restauranger ger tillstånd.</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{ padding: isMobile ? '48px 20px' : '88px 48px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ background: 'var(--brown)', borderRadius: 22, padding: isMobile ? '40px 20px' : '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
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

      <footer style={{ background: '#0A0604', padding: isMobile ? '28px 20px 92px' : '30px 48px', display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap', gap: 20 }}>
        <Link to="/" aria-label="Smakvärlden home" style={{ display: 'inline-flex', alignItems: 'center', gap:10, textDecoration: 'none' }}>
          <LogoMark size={34} decorative />
          <span>
            <span style={{ display:'block', fontFamily:'Playfair Display, Georgia, serif', fontSize:18, lineHeight:1, fontWeight:700, color:'var(--goldl)' }}>Smakvärlden</span>
            <span style={{ display:'block', marginTop:4, fontSize:10, fontWeight:800, letterSpacing:1.2, textTransform:'uppercase', color:'rgba(230,202,121,.58)' }}>Restaurang • Kostnad • Marginal</span>
          </span>
        </Link>
        <div style={{ display: 'flex', gap: 22, flexWrap:'wrap' }}>
          <Link to="/trust" style={{ fontSize: 13, fontWeight:700, color: 'rgba(255,255,255,.64)', textDecoration: 'none' }}>Integritet</Link>
          <Link to="/login" style={{ fontSize: 13, fontWeight:700, color: 'rgba(255,255,255,.64)', textDecoration: 'none' }}>Demo</Link>
          <a href="mailto:chef@smakvarlden.se" style={{ fontSize: 13, fontWeight:700, color: 'rgba(255,255,255,.64)', textDecoration: 'none' }}>Kontakt</a>
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,.38)' }}>© 2026 Smakvärlden</div>
      </footer>
    </div>
  );
}
