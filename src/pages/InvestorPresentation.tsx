import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Calculator,
  Check,
  CircleDollarSign,
  ExternalLink,
  Languages,
  LineChart,
  LockKeyhole,
  Menu,
  PackageCheck,
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
type PanelId = 'market' | 'product' | 'price' | 'suppliers' | 'demo' | 'ask';

const COPY = {
  sv: {
    badge: 'Interaktiv investerarpresentation',
    nav: ['Behov', 'Produkt', 'Prisintelligens', 'Leverantörer', 'Demo', 'Kontakt'],
    langLabel: 'Svenska',
    heroTitle: 'Kitchen OS för svenska restauranger',
    heroText:
      'Smakvärlden hjälper kockar se verklig food cost, prisändringar, svinn och marginalrisk innan vinsten försvinner.',
    primary: 'Testa demon',
    secondary: 'Se starkaste funktionen',
    statIntro: 'Svenska restauranger behöver spara pengar och tid nu',
    stats: [
      { value: '+0,5%', label: 'försäljningsvolym 2025', detail: 'Svag volymtillväxt gör varje marginalbeslut viktigare.' },
      { value: '+3,7%', label: 'restaurangpriser 2025', detail: 'Kunder märker högre priser samtidigt som kostnaderna stiger.' },
      { value: '29 300', label: 'restaurang- och cateringföretag', detail: 'En stor marknad med samma praktiska problem i köket.' },
    ],
    pressureTitle: 'Kockar pressas från alla håll',
    pressureItems: ['Leverantörspriser', 'Svinn', 'Personal', 'Hyra', 'Energi', 'Långsamma kalkylblad'],
    productTitle: 'En dashboard för food cost, svinn och vinst',
    productText:
      'Byggd för trötta kök: snabb att skanna, enkel att agera på och fokuserad på beslut som skyddar marginalen.',
    productCards: [
      { title: 'Food cost', text: 'Se verklig kostnad per rätt.' },
      { title: 'Prisändringar', text: 'Se vad som ändrats och vilka recept som påverkas.' },
      { title: 'Vinstskydd', text: 'Få förslag innan marginalen försvinner.' },
    ],
    priceTitle: 'Ingredienspris ändras -> recept påverkas -> marginal tappas -> åtgärd',
    alert: 'Laxpris +12%',
    affected: 'Påverkade rätter',
    dishes: ['Salmon poke', 'Nigiri', 'Laxpasta'],
    margin: 'Marginal',
    action: 'Föreslagen åtgärd',
    actionText: '+6-9 kr menypris eller byt ingrediens',
    suppliersTitle: 'Byggt runt svensk leverantörsverklighet',
    suppliersText:
      'Smakvärlden är inte en generisk receptapp. Produkten byggs runt inköpskanaler svenska restauranger redan använder.',
    supplierCards: ['Martin & Servera', 'Menigo', 'Lokala leverantörer', 'Prisimporter'],
    calculatorTitle: 'Varje recept blir ett affärsbeslut',
    calculatorRows: [
      ['Lax', '16 kr'],
      ['Ris', '6 kr'],
      ['Avokado', '9 kr'],
      ['Food cost', '39 kr'],
      ['Svinn +20%', '7,8 kr'],
      ['Total kostnad', '46,8 kr'],
      ['Försäljningspris', '139 kr'],
    ],
    demoTitle: 'Demo som investerare kan testa direkt',
    demoSteps: ['Logga in med demo@smakvarlden.se / demo1234', 'Gå till Dashboard', 'Öppna Price Intelligence'],
    demoButton: 'Öppna appdemo',
    roadmapTitle: 'Lansera starkaste versionen först',
    roadmap: ['Dashboard', 'Price Intelligence', 'Ingredienser', 'Recept', 'Kalkylator', 'Pricing / Upgrade'],
    askTitle: 'Byggt av kockar. Gjort för moderna svenska kök.',
    askText:
      'Smakvärlden hjälper restauranger förstå verklig food cost, skydda vinst och fatta bättre menybeslut.',
    contact: 'Kontakt',
    email: 'msx9973@gmail.com',
    phone: '0700483921',
    trust: 'Demo data / exempelberäkningar. Riktig produktion kräver backend-auth, dataskydd och leverantörsavtal.',
  },
  en: {
    badge: 'Interactive investor presentation',
    nav: ['Need', 'Product', 'Price Intel', 'Suppliers', 'Demo', 'Contact'],
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
    email: 'msx9973@gmail.com',
    phone: '0700483921',
    trust: 'Demo data / example calculations. Real production requires backend auth, data security and supplier agreements.',
  },
};

const sectionIds: PanelId[] = ['market', 'product', 'price', 'suppliers', 'demo', 'ask'];

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
          <span>Smakvärlden</span>
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

      <section id="price" className="ip-section ip-price">
        <div className="ip-section-head">
          <span>03</span>
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
            <span>04</span>
            <h2>{t.suppliersTitle}</h2>
          </div>
          <p className="ip-lead">{t.suppliersText}</p>
        </div>
      </section>

      <section className="ip-section ip-calculator">
        <div className="ip-section-head">
          <span>05</span>
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
            <span>06</span>
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
          <span>07</span>
          <h2>{t.roadmapTitle}</h2>
        </div>
        <div className="ip-roadmap">
          {t.roadmap.map((item) => <span key={item}>{item}</span>)}
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
