import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Calculator,
  Camera,
  Check,
  CircleDollarSign,
  ExternalLink,
  Languages,
  LineChart,
  LockKeyhole,
  Menu,
  PackageCheck,
  ReceiptText,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  TrendingDown,
  Utensils,
  X,
  Zap,
} from 'lucide-react';
import './InvestorPresentation.css';

type Lang = 'sv' | 'en';
type PanelId = 'market' | 'product' | 'scanners' | 'price' | 'suppliers' | 'demo' | 'consulting' | 'ask';

const COPY = {
  sv: {
    badge: 'Interaktiv investerarpresentation',
    nav: ['Behov', 'Produkt', 'Skanning', 'Prisintelligens', 'Leverantörer', 'Demo', 'Konsulting', 'Kontakt'],
    langLabel: 'Svenska',
    heroTitle: 'Kitchen OS för svenska restauranger',
    heroText:
      'SmakvÃÂÃÂÃÂÃÂ¤rlden hjÃÂÃÂÃÂÃÂ¤lper kockar se verklig food cost, prisÃÂÃÂÃÂÃÂ¤ndringar, svinn och marginalrisk innan vinsten fÃÂÃÂÃÂÃÂ¶rsvinner.',
    primary: 'Testa demon',
    secondary: 'Se starkaste funktionen',
    statIntro: 'Svenska restauranger behÃÂÃÂÃÂÃÂ¶ver spara pengar och tid nu',
    stats: [
      { value: '+0,5%', label: 'fÃÂÃÂÃÂÃÂ¶rsÃÂÃÂÃÂÃÂ¤ljningsvolym 2025', detail: 'Svag volymtillvÃÂÃÂÃÂÃÂ¤xt gÃÂÃÂÃÂÃÂ¶r varje marginalbeslut viktigare.' },
      { value: '+3,7%', label: 'restaurangpriser 2025', detail: 'Kunder mÃÂÃÂÃÂÃÂ¤rker hÃÂÃÂÃÂÃÂ¶gre priser samtidigt som kostnaderna stiger.' },
      { value: '29 300', label: 'restaurang- och cateringfÃÂÃÂÃÂÃÂ¶retag', detail: 'En stor marknad med samma praktiska problem i kÃÂÃÂÃÂÃÂ¶ket.' },
    ],
    pressureTitle: 'Kockar pressas frÃÂÃÂÃÂÃÂ¥n alla hÃÂÃÂÃÂÃÂ¥ll',
    pressureItems: ['LeverantÃÂÃÂÃÂÃÂ¶rspriser', 'Svinn', 'Personal', 'Hyra', 'Energi', 'LÃÂÃÂÃÂÃÂ¥ngsamma kalkylblad'],
    productTitle: 'En dashboard fÃÂÃÂÃÂÃÂ¶r food cost, svinn och vinst',
    productText:
      'Byggd fÃÂÃÂÃÂÃÂ¶r trÃÂÃÂÃÂÃÂ¶tta kÃÂÃÂÃÂÃÂ¶k: snabb att skanna, enkel att agera pÃÂÃÂÃÂÃÂ¥ och fokuserad pÃÂÃÂÃÂÃÂ¥ beslut som skyddar marginalen.',
    productCards: [
      { title: 'Food cost', text: 'Se verklig kostnad per rÃÂÃÂÃÂÃÂ¤tt.' },
      { title: 'PrisÃÂÃÂÃÂÃÂ¤ndringar', text: 'Se vad som ÃÂÃÂÃÂÃÂ¤ndrats och vilka recept som pÃÂÃÂÃÂÃÂ¥verkas.' },
      { title: 'Vinstskydd', text: 'FÃÂÃÂÃÂÃÂ¥ fÃÂÃÂÃÂÃÂ¶rslag innan marginalen fÃÂÃÂÃÂÃÂ¶rsvinner.' },
    ],
    scannerTitle: 'Senaste uppdateringen: recept- och fakturaskanning',
    scannerText:
      'Kocken kan fotografera ett recept eller en leverantÃÂÃÂÃÂÃÂ¶rsfaktura. Appen lÃÂÃÂÃÂÃÂ¤ser ingredienser, mÃÂÃÂÃÂÃÂ¤ngder och priser sÃÂÃÂÃÂÃÂ¥ kalkylen uppdateras snabbare.',
    scannerCards: [
      { title: 'Receptscanner', text: 'GÃÂÃÂÃÂÃÂ¶r handskrivna eller tryckta recept till sparade kalkyler med ingredienser och mÃÂÃÂÃÂÃÂ¤ngder.' },
      { title: 'Fakturascanner', text: 'LÃÂÃÂÃÂÃÂ¤ser priser frÃÂÃÂÃÂÃÂ¥n fakturor, till exempel Martin & Servera, Menigo och andra grossister.' },
      { title: '2 gratisskanningar', text: 'Gratisversionen kan testa flÃÂÃÂÃÂÃÂ¶det. Pro-planen kan byggas runt mer frekvent skanning.' },
    ],
    priceTitle: 'Ingredienspris ÃÂÃÂÃÂÃÂ¤ndras -> recept pÃÂÃÂÃÂÃÂ¥verkas -> marginal tappas -> ÃÂÃÂÃÂÃÂ¥tgÃÂÃÂÃÂÃÂ¤rd',
    alert: 'Laxpris +12%',
    affected: 'PÃÂÃÂÃÂÃÂ¥verkade rÃÂÃÂÃÂÃÂ¤tter',
    dishes: ['Salmon poke', 'Nigiri', 'Laxpasta'],
    margin: 'Marginal',
    action: 'FÃÂÃÂÃÂÃÂ¶reslagen ÃÂÃÂÃÂÃÂ¥tgÃÂÃÂÃÂÃÂ¤rd',
    actionText: '+6-9 kr menypris eller byt ingrediens',
    suppliersTitle: 'Byggt runt svensk leverantÃÂÃÂÃÂÃÂ¶rsverklighet',
    suppliersText:
      'SmakvÃÂÃÂÃÂÃÂ¤rlden ÃÂÃÂÃÂÃÂ¤r inte en generisk receptapp. Produkten byggs runt inkÃÂÃÂÃÂÃÂ¶pskanaler svenska restauranger redan anvÃÂÃÂÃÂÃÂ¤nder.',
    supplierCards: ['Martin & Servera', 'Menigo', 'Lokala leverantÃÂÃÂÃÂÃÂ¶rer', 'Prisimporter'],
    calculatorTitle: 'Varje recept blir ett affÃÂÃÂÃÂÃÂ¤rsbeslut',
    calculatorRows: [
      ['Lax', '16 kr'],
      ['Ris', '6 kr'],
      ['Avokado', '9 kr'],
      ['Food cost', '39 kr'],
      ['Svinn +20%', '7,8 kr'],
      ['Total kostnad', '46,8 kr'],
      ['FÃÂÃÂÃÂÃÂ¶rsÃÂÃÂÃÂÃÂ¤ljningspris', '139 kr'],
    ],
    demoTitle: 'Demo som investerare kan testa direkt',
    demoSteps: ['Logga in med demo@smakvarlden.se / demo1234', 'GÃÂÃÂÃÂÃÂ¥ till Dashboard', 'ÃÂÃÂÃÂÃÂppna Price Intelligence'],
    demoButton: 'ÃÂÃÂÃÂÃÂppna appdemo',
    roadmapTitle: 'Lansera starkaste versionen fÃÂÃÂÃÂÃÂ¶rst',
    roadmap: ['Dashboard', 'Price Intelligence', 'Ingredienser', 'Recept', 'Kalkylator', 'Pricing / Upgrade'],
    askTitle: 'Byggt av kockar. Gjort fÃÂÃÂÃÂÃÂ¶r moderna svenska kÃÂÃÂÃÂÃÂ¶k.',
    askText:
      'SmakvÃÂÃÂÃÂÃÂ¤rlden hjÃÂÃÂÃÂÃÂ¤lper restauranger fÃÂÃÂÃÂÃÂ¶rstÃÂÃÂÃÂÃÂ¥ verklig food cost, skydda vinst och fatta bÃÂÃÂÃÂÃÂ¤ttre menybeslut.',
    contact: 'Kontakt',
    email: 'chef@smakvarlden.se',
    phone: '',
    trust: 'Demo data / exempelberÃÂÃÂÃÂÃÂ¤kningar. Riktig produktion krÃÂÃÂÃÂÃÂ¤ver backend-auth, dataskydd och leverantÃÂÃÂÃÂÃÂ¶rsavtal.',
  },
  en: {
    badge: 'Interactive investor presentation',
    nav: ['Need', 'Product', 'Scanners', 'Price Intel', 'Suppliers', 'Demo', 'Consulting', 'Contact'],
    langLabel: 'English',
    heroTitle: 'Kitchen OS for Swedish restaurants',
    heroText:
      'Smakvarlden helps chefs see real food cost, price changes, waste and margin risk before profit disappears.',
    primary: 'Try the demo',
    secondary: 'See strongest feature',
    statIntro: 'Swedish restaurants need to save money and time now',
    stats: [
      { value: '+0.5%', label: 'sales volume 2025', detail: 'Weak volume growth makes every margin decision matter more.' },
      { value: '+3.7%', label: 'restaurant prices 2025', detail: 'Guests feel higher prices while kitchens absorb rising costs.' },
      { value: '29,300', label: 'restaurant and catering companies', detail: 'A large market with the same practical kitchen problem.' },
    ],
    pressureTitle: 'Chefs are squeezed from every side',
    pressureItems: ['Supplier prices', 'Waste', 'Staff', 'Rent', 'Energy', 'Slow spreadsheets'],
    productTitle: 'One dashboard for food cost, waste and profit',
    productText:
      'Built for tired kitchens: fast to scan, simple to act on, and focused on decisions that protect margin.',
    productCards: [
      { title: 'Food cost', text: 'See the real cost of every dish.' },
      { title: 'Price changes', text: 'See what changed and which recipes are affected.' },
      { title: 'Profit protection', text: 'Get suggested actions before margin disappears.' },
    ],
    scannerTitle: 'Latest update: recipe and invoice scanning',
    scannerText:
      'The chef can photograph a recipe or supplier invoice. The app reads ingredients, quantities and prices so calculations update faster.',
    scannerCards: [
      { title: 'Recipe scanner', text: 'Turns handwritten or printed recipes into saved calculations with ingredients and quantities.' },
      { title: 'Invoice scanner', text: 'Reads supplier invoice prices, including Martin & Servera, Menigo and other wholesalers.' },
      { title: '2 free scans', text: 'The free version can test the flow. The Pro plan can be built around more frequent scanning.' },
    ],
    priceTitle: 'Ingredient price changes -> recipes affected -> margin loss -> action',
    alert: 'Salmon price +12%',
    affected: 'Affected dishes',
    dishes: ['Salmon poke', 'Nigiri', 'Salmon pasta'],
    margin: 'Margin',
    action: 'Suggested action',
    actionText: '+6-9 kr menu price or replace ingredient',
    suppliersTitle: 'Built around Swedish supplier reality',
    suppliersText:
      'Smakvarlden is not a generic recipe app. The product is built around purchasing channels Swedish restaurants already use.',
    supplierCards: ['Martin & Servera', 'Menigo', 'Local suppliers', 'Price imports'],
    calculatorTitle: 'Every recipe becomes a business decision',
    calculatorRows: [
      ['Salmon', '16 kr'],
      ['Rice', '6 kr'],
      ['Avocado', '9 kr'],
      ['Food cost', '39 kr'],
      ['Waste +20%', '7.8 kr'],
      ['Total cost', '46.8 kr'],
      ['Selling price', '139 kr'],
    ],
    demoTitle: 'Demo investors can test directly',
    demoSteps: ['Log in with demo@smakvarlden.se / demo1234', 'Go to Dashboard', 'Open Price Intelligence'],
    demoButton: 'Open app demo',
    roadmapTitle: 'Launch the strongest version first',
    roadmap: ['Dashboard', 'Price Intelligence', 'Ingredients', 'Recipes', 'Calculator', 'Pricing / Upgrade'],
    askTitle: 'Built by chefs. Made for modern Swedish kitchens.',
    askText:
      'Smakvarlden helps restaurants understand real food cost, protect profit and make better menu decisions.',
    contact: 'Contact',
    email: 'chef@smakvarlden.se',
    phone: '',
    trust: 'Demo data / example calculations. Real production requires backend auth, data security and supplier agreements.',
  },
};

const sectionIds: PanelId[] = ['market', 'product', 'scanners', 'price', 'suppliers', 'demo', 'consulting', 'ask'];

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function InvestorPresentation() {
  const [lang, setLang] = useState<Lang>('sv');
  const [menuOpen, setMenuOpen] = useState(false);
  const t = COPY[lang];
  const alternate = lang === 'sv' ? 'en' : 'sv';

  const activeCards = useMemo(() => t.stats.map((stat, index) => ({ ...stat, icon: [BarChart3, TrendingDown, Utensils][index] })), [t]);

  return (
    <main className="ip">
      <header className="ip-nav">
        <button className="ip-logo" onClick={() => goTo('top')} aria-label="Smakvarlden">
          <span>SmakvÃÂÃÂÃÂÃÂ¤rlden</span>
          <small>Kitchen OS</small>
        </button>

        <nav className={menuOpen ? 'open' : ''}>
          {t.nav.map((item, index) => (
            <button key={item} onClick={() => { goTo(sectionIds[index]); setMenuOpen(false); }}>
              {item}
            </button>
          ))}
        </nav>

        <div className="ip-actions">
          <button className="ip-lang" onClick={() => setLang(alternate)} aria-label="Switch language">
            <Languages size={16} />
            {COPY[alternate].langLabel}
          </button>
          <button className="ip-menu" onClick={() => setMenuOpen((value) => !value)} aria-label="Menu">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <section id="top" className="ip-hero">
        <div className="ip-hero-copy">
          <div className="ip-badge"><Sparkles size={15} /> {t.badge}</div>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroText}</p>
          <div className="ip-hero-buttons">
            <a className="ip-primary" href="/login">
              {t.primary} <ArrowRight size={17} />
            </a>
            <button className="ip-secondary" onClick={() => goTo('price')}>
              {t.secondary}
            </button>
          </div>
        </div>

        <div className="ip-dashboard" aria-label="Smakvarlden dashboard mockup">
          <div className="ip-window-top">
            <span />
            <span />
            <span />
          </div>
          <div className="ip-dash-grid">
            <div className="ip-dash-card wide">
              <small>Price Intelligence</small>
              <strong>{t.alert}</strong>
              <div className="ip-mini-bars">
                <i style={{ height: '42%' }} />
                <i style={{ height: '72%' }} />
                <i style={{ height: '54%' }} />
                <i style={{ height: '88%' }} />
              </div>
            </div>
            <div className="ip-dash-card">
              <small>Food cost</small>
              <strong>39 kr</strong>
            </div>
            <div className="ip-dash-card">
              <small>Margin</small>
              <strong>66%</strong>
            </div>
            <div className="ip-dash-card alert">
              <small>Action</small>
              <strong>+6-9 kr</strong>
            </div>
          </div>
        </div>
      </section>

      <section id="market" className="ip-section">
        <div className="ip-section-head">
          <span>01</span>
          <h2>{t.statIntro}</h2>
        </div>
        <div className="ip-stat-grid">
          {activeCards.map(({ value, label, detail, icon: Icon }) => (
            <article className="ip-stat" key={label}>
              <Icon size={22} />
              <strong>{value}</strong>
              <h3>{label}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
        <div className="ip-pressure">
          <h3>{t.pressureTitle}</h3>
          <div>
            {t.pressureItems.map((item) => (
              <span key={item}><Check size={14} /> {item}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="product" className="ip-section ip-split">
        <div>
          <div className="ip-section-head">
            <span>02</span>
            <h2>{t.productTitle}</h2>
          </div>
          <p className="ip-lead">{t.productText}</p>
          <div className="ip-feature-list">
            {t.productCards.map((card, index) => {
              const Icon = [Calculator, LineChart, CircleDollarSign][index];
              return (
                <article key={card.title}>
                  <Icon size={20} />
                  <strong>{card.title}</strong>
                  <p>{card.text}</p>
                </article>
              );
            })}
          </div>
        </div>
        <div className="ip-phone">
          <div className="ip-phone-screen">
            <div className="ip-phone-row top"><span>Dashboard</span><b>Live</b></div>
            <div className="ip-phone-metric"><span>Food cost</span><strong>39 kr</strong></div>
            <div className="ip-phone-metric"><span>Waste</span><strong>+20%</strong></div>
            <div className="ip-phone-alert"><Zap size={18} /> {t.alert}</div>
          </div>
        </div>
      </section>

      <section id="scanners" className="ip-section">
        <div className="ip-section-head">
          <span>03</span>
          <h2>{t.scannerTitle}</h2>
        </div>
        <p className="ip-lead">{t.scannerText}</p>
        <div className="ip-feature-list">
          {t.scannerCards.map((card, index) => {
            const Icon = [Camera, ReceiptText, Sparkles][index];
            return (
              <article key={card.title}>
                <Icon size={20} />
                <strong>{card.title}</strong>
                <p>{card.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="price" className="ip-section ip-price">
        <div className="ip-section-head">
          <span>04</span>
          <h2>{t.priceTitle}</h2>
        </div>
        <div className="ip-alert-board">
          <article className="ip-alert-main">
            <div><Zap size={22} /> {t.alert}</div>
            <p>{t.affected}</p>
            <ul>
              {t.dishes.map((dish) => <li key={dish}>{dish}</li>)}
            </ul>
          </article>
          <article>
            <span>{t.margin}</span>
            <strong>72% {'->'} 61%</strong>
            <div className="ip-loss-line"><i /></div>
          </article>
          <article className="ip-action-card">
            <span>{t.action}</span>
            <strong>{t.actionText}</strong>
          </article>
        </div>
      </section>

      <section id="suppliers" className="ip-section ip-split reverse">
        <div className="ip-supplier-map">
          {t.supplierCards.map((supplier, index) => (
            <div key={supplier} className={index === 0 ? 'primary' : ''}>
              <PackageCheck size={18} />
              {supplier}
            </div>
          ))}
          <ArrowRight className="ip-map-arrow" size={36} />
          <div className="engine"><LockKeyhole size={18} /> Margin engine</div>
        </div>
        <div>
          <div className="ip-section-head">
            <span>05</span>
            <h2>{t.suppliersTitle}</h2>
          </div>
          <p className="ip-lead">{t.suppliersText}</p>
        </div>
      </section>

      <section className="ip-section ip-calculator">
        <div className="ip-section-head">
          <span>06</span>
          <h2>{t.calculatorTitle}</h2>
        </div>
        <div className="ip-calc-card">
          {t.calculatorRows.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
          <div className="total">
            <span>Margin</span>
            <strong>66%</strong>
          </div>
        </div>
      </section>

      <section id="demo" className="ip-section ip-demo">
        <div>
          <div className="ip-section-head">
            <span>07</span>
            <h2>{t.demoTitle}</h2>
          </div>
          <ol>
            {t.demoSteps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>
        <div className="ip-demo-card">
          <ShoppingBasket size={25} />
          <strong>demo@smakvarlden.se</strong>
          <span>demo1234</span>
          <a className="ip-primary" href="/login">{t.demoButton} <ExternalLink size={16} /></a>
        </div>
      </section>

      <section className="ip-section">
        <div className="ip-section-head">
          <span>08</span>
          <h2>{t.roadmapTitle}</h2>
        </div>
        <div className="ip-roadmap">
          {t.roadmap.map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>

      
      <section id="consulting" className="ip-panel">
        <div className="ip-panel-inner">
          <span className="ip-badge">{lang === 'sv' ? 'Konsulttjänst' : 'Consulting Service'}</span>
          <h2>{lang === 'sv' ? 'Ditt kök, vår prioritet' : 'Your Kitchen, Our Priority'}</h2>
          <p className="ip-lead">
            {lang === 'sv'
              ? 'Teknologi är bara halva lösningen. Vi erbjuder en praktisk Profit Optimization-tjänst som tar bördan från dina axlar. Vi ger dig resultat, inte bara verktyg.'
              : 'Technology is only half the battle. We offer a hands-on Profit Optimization Service to take the burden off your shoulders. We give you results, not just tools.'}
          </p>
          <div className="ip-grid-2">
            {[
              {icon:'🔍', sv:'Djup fakturagranskning', en:'Deep Invoice Audit', svb:'Vi granskar dina leverantörsfakturor personligen och hittar dolda prisökningar som kostar dig tusentals kronor varje vecka.', enb:'We personally review your supplier invoices to identify hidden price increases quietly draining your margins every week.'},
              {icon:'🤝', sv:'Förhandlingsstöd', en:'Supplier Negotiation Support', svb:'Vi ger dig exakt data för att förhandla bättre avtal med Martin & Servera och Menigo.', enb:'We give you exact data to negotiate better deals with Martin & Servera and Menigo.'},
              {icon:'⚙️', sv:'Systemuppsättning', en:'System Setup', svb:'Vi hanterar den initiala uppsättningen av dina receptkostnader så du börjar spara från dag ett.', enb:'We handle the initial setup of your recipe costs and ingredient database so you start saving from day one.'},
              {icon:'🎯', sv:'Konkreta åtgärder', en:'Actionable Insights', svb:'Vi omvandlar komplex data till enkla steg: Höj detta pris. Byt denna ingrediens. Minska denna portion.', enb:'We turn complex data into simple steps: Raise this price. Swap this ingredient. Reduce this portion.'},
            ].map((c,i) => (
              <div key={i} className="ip-feature-card">
                <span className="ip-feature-icon">{c.icon}</span>
                <h3>{lang === 'sv' ? c.sv : c.en}</h3>
                <p>{lang === 'sv' ? c.svb : c.enb}</p>
              </div>
            ))}
          </div>
          <div className="ip-guarantee">
            <span>✦</span>
            <div>
              <h3>{lang === 'sv' ? 'Framgångsgaranti' : 'Success Guarantee'}</h3>
              <p>{lang === 'sv' ? 'Om vi inte hittar möjligheter till vinstförbättring kostar den initiala konsultationen dig ingenting.' : "If we don't find opportunities for profit improvement, our initial consultation costs you nothing."}</p>
            </div>
          </div>
          <div className="ip-price-row">
            {[
              {sv:'Startpaket', en:'Starter Audit', price:'990 kr', note:lang==='sv'?'engångs':'one-time'},
              {sv:'Månadsvis Pro', en:'Monthly Pro', price:'590 kr/mån', note:''},
              {sv:'Full Optimize', en:'Full Optimize', price:'1 490 kr/mån', note:''},
            ].map((p,i) => (
              <div key={i} className={`ip-price-card${i===1?' ip-price-card--featured':''}`}>
                <div className="ip-price-label">{lang==='sv'?p.sv:p.en}</div>
                {p.note && <div className="ip-price-note">{p.note}</div>}
                <div className="ip-price-value">{p.price}</div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:32}}>
            <a href="mailto:chef@smakvarlden.se?subject=Konsultförfrågan" className="ip-cta-btn">
              {lang === 'sv' ? '📊 Boka gratis revision' : '📊 Book a Free Audit'}
            </a>
          </div>
        </div>
      </section>

<section id="ask" className="ip-final">
        <div>
          <h2>{t.askTitle}</h2>
          <p>{t.askText}</p>
        </div>
        <div className="ip-contact">
          <span>{t.contact}</span>
          <a href={`mailto:${t.email}`}>{t.email}</a>
          <a href={`tel:${t.phone}`}>{t.phone}</a>
        </div>
      </section>

      <footer className="ip-footer">
        <ShieldCheck size={16} />
        <span>{t.trust}</span>
      </footer>
    </main>
  );
}
