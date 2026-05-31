import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ConsultingLeadForm from '../components/ConsultingLeadForm';

const services = [
  {
    title: 'Menyskanner',
    body: 'Skanna menyn och fÃ¥ snabba, redigerbara estimat fÃ¶r mat, dryck, kaffe, tillbehÃ¶r och catering.',
  },
  {
    title: 'Fakturaskanner',
    body: 'Uppdatera inkÃ¶pspriser frÃ¥n en leverantÃ¶rsfaktura och se gammalt pris mot nytt pris.',
  },
  {
    title: 'RÃ¤tter & produkter',
    body: 'RÃ¤kna pÃ¥ pizza, pasta, Ã¶l, whiskey, cola, cappuccino, lunchlÃ¥dor och andra produkter.',
  },
  {
    title: 'Marginalbeslut',
    body: 'FÃ¥ underlag fÃ¶r om pris, portion eller kalkyl bÃ¶r ses Ã¶ver.',
  },
];

const deliverSteps = [
  { title: 'Skanna meny', body: 'AI hittar produkter, priser och sannolika ingredienser.' },
  { title: 'Granska', body: 'Kunden justerar mÃ¤ngder, dryckesmÃ¥tt och priser.' },
  { title: 'Skanna faktura', body: 'Riktiga inkÃ¶pspriser ersÃ¤tter estimat.' },
  { title: 'Se pÃ¥verkan', body: 'Appen visar ett underlag med prisÃ¤ndringar, historik och marginal.' },
];

const insideApp = [
  {
    title: 'RÃ¤tter & produkter',
    body: 'Spara mat, dryck, kaffe, tillbehÃ¶r och catering. Varje produkt har menypris, rÃ¥varor, kostnad och marginal.',
  },
  {
    title: 'Prishistorik',
    body: 'NÃ¤r en faktura uppdaterar ett pris sparas datum och pris sÃ¥ kunden kan se utvecklingen Ã¶ver tid.',
  },
  {
    title: 'PrisÃ¤ndringar',
    body: 'Appen visar vilka produkter som pÃ¥verkas nÃ¤r exempelvis cola, ost, whiskey, grÃ¤dde eller takeawaylÃ¥dor Ã¤ndras i pris.',
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
    title: 'Menyskanning Ã¤r ett estimat',
    body: 'En meny visar namn och pris, men inte exakta mÃ¤ngder. DÃ¤rfÃ¶r ska kunden kunna granska och Ã¤ndra AI-fÃ¶rslaget.',
  },
  {
    title: 'Fakturaskanning uppdaterar inkÃ¶psvaror',
    body: 'En faktura kan uppdatera mat, dryck, kaffe och fÃ¶rpackning i samma flÃ¶de.',
  },
  {
    title: 'Privata priser stannar privata',
    body: 'Fakturor, leverantÃ¶rer och riktiga marginaler visas inte offentligt.',
  },
];

const logoStyle = {
  width: 210,
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
  const landingLogoStyle = { ...logoStyle, width: isMobile ? 142 : 210, maxWidth: isMobile ? '42vw' : '48vw' };
  const sectionPad = isMobile ? '52px 20px' : '76px 48px';

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: 'var(--cream)', color: 'var(--t1)' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(247,244,239,.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: isMobile ? '0 14px' : '0 40px', minHeight: isMobile ? 62 : 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <Link to="/" aria-label="Smakvärlden home" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/smakvarlden-logo.png" alt="Smakvärlden" style={landingLogoStyle} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 6, flexWrap:'wrap', justifyContent:'flex-end' }}>
          {!isMobile && navLinks.map(([href, label]) => (
            <a key={href} href={href} style={{ fontSize: 13, color: 'var(--t2)', textDecoration: 'none', padding: '8px 10px', fontWeight: 700 }}>
              {label}
            </a>
          ))}
          <a href="#pilot" style={{ fontSize: isMobile ? 12 : 13, color: 'var(--brown)', background:'var(--gold)', textDecoration: 'none', padding: isMobile ? '8px 10px' : '10px 18px', borderRadius:999, fontWeight: 900, whiteSpace: 'nowrap' }}>Gratis pilot</a>
          <Link to="/login" style={{ fontSize: isMobile ? 12 : 13, fontWeight: 800, color: 'var(--white)', background: 'var(--brown)', padding: isMobile ? '8px 10px' : '10px 20px', borderRadius: 999, textDecoration: 'none', whiteSpace: 'nowrap' }}>{isMobile ? 'Demo' : 'Ãppna demo'}</Link>
        </div>
      </nav>

      <section id="produkt" style={{ background: 'linear-gradient(135deg, var(--brown) 0%, #160904 100%)', padding: isMobile ? '54px 20px 64px' : '86px 48px 96px', position: 'relative', overflow: 'hidden', scrollMarginTop:90 }}>
        <div style={{ position: 'absolute', top: -260, right: -120, width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(214,184,94,.18) 0%, transparent 68%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1120, margin: '0 auto', display:'grid', gridTemplateColumns:isMobile?'1fr':'minmax(0, 1.05fr) minmax(340px, .95fr)', gap:44, alignItems:'center', position:'relative' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems:'center', gap:8, fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--goldl)', border: '1px solid rgba(214,184,94,.28)', background:'rgba(214,184,94,.08)', padding: '7px 14px', borderRadius: 100, marginBottom: 24 }}>
              Gratis marginalkoll pÃ¥ 5 produkter
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: isMobile ? 42 : 'clamp(42px, 6vw, 76px)', fontWeight: 700, letterSpacing: isMobile ? -0.8 : -2, lineHeight: 1.04, color: '#fff', marginBottom: 22 }}>
              Se vad varje produkt <span style={{ color: 'var(--goldl)', fontStyle: 'italic' }}>egentligen kostar.</span>
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,.68)', lineHeight: 1.78, maxWidth: 650, marginBottom: 34 }}>
              Skanna meny, recept och fakturor. SmakvÃ¤rlden kan visa gamla och nya inkÃ¶pspriser, prishistorik och vilka rÃ¤tter, drycker eller produkter som kan behÃ¶va ses Ã¶ver.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom:28 }}>
              <a href="#pilot" style={{ background: 'var(--gold)', color: 'var(--brown)', padding: '14px 28px', borderRadius: 999, fontSize: 14, fontWeight: 900, textDecoration: 'none' }}>
                FÃ¥ gratis marginalkoll
              </a>
              <Link to="/login" style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.86)', padding: '14px 24px', borderRadius: 999, fontSize: 14, fontWeight: 800, textDecoration: 'none', border: '1px solid rgba(255,255,255,.16)' }}>
                Testa demo
              </Link>
            </div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {['Menyskanner', 'Fakturaskanner', 'RÃ¤tter & produkter'].map(item => (
                <span key={item} style={{ padding:'6px 11px', borderRadius:999, background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.1)', color:'rgba(255,255,255,.62)', fontSize:12, fontWeight:700 }}>{item}</span>
              ))}
            </div>
          </div>
          <div style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)', borderRadius:26, padding:22, boxShadow:'0 28px 70px rgba(0,0,0,.22)' }}>
            <div style={{ background:'var(--white)', borderRadius:20, overflow:'hidden' }}>
              <div style={{ padding:'16px 18px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ fontSize:13, fontWeight:900, color:'var(--t1)' }}>PrisÃ¤ndringar</div>
                <span style={{ fontSize:10, fontWeight:900, color:'var(--red)', background:'var(--redbg)', padding:'4px 8px', borderRadius:999 }}>Exempel</span>
              </div>
              {[
                ['Coca-Cola 33cl', '7.80 â 8.60 kr/st', '+10.3%'],
                ['Whiskey 4cl', '14.20 â 15.95 kr', '+12.3%'],
                ['LunchlÃ¥da takeaway', '46 â 52 kr', 'granska'],
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
          <div style={{ fontFamily:'DM Mono, monospace', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--gold)', marginBottom:10 }}>Byggt fÃ¶r svenska restauranger</div>
          <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(30px, 4vw, 48px)', color:'var(--t1)', letterSpacing:-1, lineHeight:1.1, marginBottom:12 }}>
            Mat, dryck, kaffe och tillbehÃ¶r i samma kalkyl.
          </h2>
          <p style={{ fontSize:15, color:'var(--t2)', lineHeight:1.7, maxWidth:650, margin:'0 auto' }}>
            En faktura kan innehÃ¥lla kyckling, mozzarella, Ã¶l, cola, whiskey, kaffebÃ¶nor och takeawaylÃ¥dor. SmakvÃ¤rlden kan samla inkÃ¶psraderna och visa vilka produkter som pÃ¥verkas i kalkylen.
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
              FÃ¶r pilotrestauranger som vill testa med egna siffror.
            </h2>
            <p style={{ fontSize:15, color:'var(--t2)', lineHeight:1.7 }}>
              Vi visar inte kundloggor eller pÃ¥stÃ¥r resultat innan en restaurang har gett tillstÃ¥nd. FÃ¶rsta steget Ã¤r en privat pilotgenomgÃ¥ng med meny, faktura och fem produkter.
            </p>
          </div>
          <div style={{ display:'grid', gap:10 }}>
            {[
              ['Passar bra fÃ¶r', 'Restauranger som vill ha koll pÃ¥ vad maten, drycken och varje sÃ¥ld portion faktiskt kostar.'],
              ['Privat data', 'Fakturor, inkÃ¶pspriser och marginaler delas inte offentligt.'],
              ['Offentliga mallar', 'Kan anvÃ¤ndas som inspiration utan riktiga kundpriser.'],
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
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>Gratis pilot i Upplands VÃ¤sby</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 700, letterSpacing: -1.2, color: 'var(--t1)', lineHeight: 1.08, marginBottom: 14 }}>
              Skicka en meny och en faktura. FÃ¥ en tydlig marginalkoll.
            </h2>
            <p style={{ fontSize: 16, color: 'var(--t2)', lineHeight: 1.75, maxWidth: 620, marginBottom: 30 }}>
              FÃ¶rsta piloten Ã¤r enkel: vi kontrollerar 5 produkter och visar en exempelrapport med prisÃ¤ndringar, marginalpÃ¥verkan och mÃ¶jliga nÃ¤sta steg.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap: 12, marginBottom: 28 }}>
              {[
                ['1 meny', 'Foto, PDF eller lÃ¤nk till menyn.'],
                ['1 faktura', 'Senaste fakturan frÃ¥n leverantÃ¶r.'],
                ['5 produkter', 'Mat, dryck, kaffe eller tillbehÃ¶r.'],
                ['1 rapport', 'Gammal kostnad, ny kostnad och marginal.'],
              ].map(([title, body]) => (
                <div key={title} style={{ background: 'var(--white)', border:'1px solid var(--border)', borderRadius:16, padding: '20px' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', marginBottom: 8 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.65 }}>{body}</p>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--brown)', borderRadius: 18, padding: isMobile ? '22px 20px' : '28px 34px', color: '#fff' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: 'var(--goldl)', marginBottom: 8 }}>Integritet fÃ¶rst</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.64)', lineHeight: 1.7 }}>
                Fakturor, inkÃ¶pspriser och marginaler Ã¤r privata. Offentliga mallar delar aldrig era riktiga priser eller leverantÃ¶rer.
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
              SÃ¥ kan restaurangen fÃ¶rstÃ¥ kalkylen.
            </h2>
            <p style={{ fontSize:15, color:'var(--t2)', lineHeight:1.7, maxWidth:650, margin:'0 auto' }}>
              Kunskapsdelen ska hjÃ¤lpa kunden fÃ¶rstÃ¥ skillnaden mellan AI-estimat, egna mÃ¤ngder och riktiga fakturapriser.
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
              SmakvÃ¤rlden byggs nÃ¤ra svenska restauranger.
            </h2>
            <p style={{ fontSize:15, color:'var(--t2)', lineHeight:1.75 }}>
              MÃ¥let Ã¤r inte att ersÃ¤tta kockens erfarenhet. MÃ¥let Ã¤r att ge tydligare siffror nÃ¤r rÃ¥varupriser, dryckespriser och fÃ¶rpackningskostnader fÃ¶rÃ¤ndras.
            </p>
          </div>
          <div style={{ background:'var(--goldbg)', border:'1px solid var(--goldb)', borderRadius:20, padding:'26px' }}>
            <div style={{ fontSize:14, fontWeight:900, color:'var(--brown)', marginBottom:10 }}>Senare kan vi lÃ¤gga till</div>
            <ul style={{ margin:0, paddingLeft:18, color:'var(--t2)', fontSize:13, lineHeight:1.8 }}>
              <li>Separata kunskapssidor.</li>
              <li>Publika produktmallar utan privata priser.</li>
              <li>Kundcase fÃ¶rst nÃ¤r restauranger ger tillstÃ¥nd.</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{ padding: isMobile ? '48px 20px' : '88px 48px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ background: 'var(--brown)', borderRadius: 22, padding: isMobile ? '40px 20px' : '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 18 }}>Redo att testa?</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 700, color: '#fff', letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 16 }}>
            BÃ¶rja med fem produkter<br />
            <span style={{ color: 'var(--goldl)', fontStyle: 'italic' }}>i fakturans finstilta.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.58)', lineHeight: 1.65, maxWidth: 520, margin: '0 auto 38px' }}>
            Skicka en meny och en faktura sÃ¥ gÃ¶r vi en fÃ¶rsiktig exempelanalys pÃ¥ 5 produkter.
          </p>
          <a href="#pilot" style={{ background: 'var(--gold)', color: 'var(--brown)', padding: '13px 30px', borderRadius: 999, fontSize: 14, fontWeight: 900, textDecoration: 'none' }}>
            Boka gratis marginalkoll
          </a>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,.28)', letterSpacing: .5, marginTop: 24 }}>chef@smakvarlden.se Â· smakvarlden.se Â· Upplands VÃ¤sby, Sweden</div>
        </div>
      </section>

      <footer style={{ background: '#0A0604', padding: isMobile ? '28px 20px 92px' : '32px 48px', display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap', gap: 14 }}>
        <Link to="/" aria-label="Smakvärlden home" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', background: '#fff', borderRadius: 8, padding: '4px 8px' }}>
          <img src="/smakvarlden-logo.png" alt="Smakvärlden" style={{ ...logoStyle, width: 170 }} />
        </Link>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link to="/trust" style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>Integritet</Link>
          <Link to="/login" style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>Demo</Link>
          <a href="mailto:chef@smakvarlden.se" style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>Kontakt</a>
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,.18)' }}>Â© 2026 SmakvÃ¤rlden</div>
      </footer>
    </div>
  );
}
