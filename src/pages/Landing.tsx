import { Link } from 'react-router-dom';
import ConsultingLeadForm from '../components/ConsultingLeadForm';

const services = [
  {
    title: 'Invoice audit',
    body: 'We review supplier invoices and show hidden price increases, unusual changes and ingredients that pressure your food cost.',
  },
  {
    title: 'Recipe setup',
    body: 'We help enter the first recipes, ingredients and menu prices so Smakvärlden becomes useful from the first week.',
  },
  {
    title: 'Supplier discussion support',
    body: 'We give you clear numbers for conversations with Menigo, Martin & Servera or local suppliers.',
  },
  {
    title: 'Action plan',
    body: 'You get practical next steps: change menu price, adjust portion, replace ingredient or update the recipe.',
  },
];

const deliverSteps = [
  { title: 'Analyze', body: 'Send one recent invoice or bring it to a demo.' },
  { title: 'Identify', body: 'We find which price changes affect your dishes.' },
  { title: 'Optimize', body: 'Recipes and food cost are connected to your real prices.' },
  { title: 'Profit', body: 'The kitchen gets clear decisions before margin disappears.' },
];

const stats = [
  { label: 'Hidden price increases caught', value: '6-12 / month' },
  { label: 'Possible weekly savings', value: '3 000-8 000 kr' },
  { label: 'Time to first insight', value: 'Under 60 sec' },
  { label: 'Pro plan', value: '59 kr/month' },
];

export default function Landing() {
  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: 'var(--cream)', color: 'var(--t1)' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(247,244,239,.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0 40px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: 'var(--brown)', fontStyle: 'italic' }}>Smakvärlden</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="#consulting" style={{ fontSize: 13, color: 'var(--t2)', textDecoration: 'none', padding: '8px 16px', fontWeight: 600 }}>Profit support</a>
          <Link to="/login" style={{ fontSize: 13, fontWeight: 700, color: 'var(--white)', background: 'var(--brown)', padding: '8px 20px', borderRadius: 9, textDecoration: 'none' }}>Log in</Link>
        </div>
      </nav>

      <section style={{ background: 'var(--brown)', padding: '96px 48px 108px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-block', fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', border: '1px solid rgba(201,168,76,.3)', padding: '5px 16px', borderRadius: 100, marginBottom: 28 }}>
          Kitchen Operating System
        </div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(42px, 6vw, 80px)', fontWeight: 700, letterSpacing: -2, lineHeight: 1.05, color: '#fff', marginBottom: 22 }}>
          Stop Guessing.<br />
          <span style={{ color: 'var(--goldl)', fontStyle: 'italic' }}>Start Profiting.</span>
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,.62)', lineHeight: 1.78, maxWidth: 620, margin: '0 auto 44px' }}>
          Smakvärlden combines invoice scanning, recipe costing and practical profit support so restaurants can protect food cost before money leaks out.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#consulting" style={{ background: 'var(--gold)', color: 'var(--brown)', padding: '13px 30px', borderRadius: 10, fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
            Request free analysis
          </a>
          <Link to="/login" style={{ background: 'transparent', color: 'rgba(255,255,255,.78)', padding: '13px 26px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,.2)' }}>
            Try the demo
          </Link>
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

      <section id="consulting" style={{ padding: '88px 48px', maxWidth: 1120, margin: '0 auto', scrollMarginTop: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(340px, .9fr)', gap: 42, alignItems: 'start' }}>
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>Consulting section</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 700, letterSpacing: -1.2, color: 'var(--t1)', lineHeight: 1.08, marginBottom: 14 }}>
              Profit support that turns your first invoice into clear decisions.
            </h2>
            <p style={{ fontSize: 16, color: 'var(--t2)', lineHeight: 1.75, maxWidth: 620, marginBottom: 30 }}>
              The product does the calculation. The support helps the restaurant get started correctly: invoice review, recipe setup and practical decisions for the chef and owner.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', marginBottom: 28 }}>
              {services.map((service) => (
                <div key={service.title} style={{ background: 'var(--white)', padding: '26px' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', marginBottom: 8 }}>{service.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.65 }}>{service.body}</p>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--brown)', borderRadius: 18, padding: '28px 34px', color: '#fff' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: 'var(--goldl)', marginBottom: 8 }}>How it connects to Excel</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.64)', lineHeight: 1.7 }}>
                Requests are saved in Netlify Forms. From Netlify you can download the form submissions as CSV and open them directly in Excel.
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
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>How we deliver results</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, letterSpacing: -1.2, color: 'var(--t1)', lineHeight: 1.1, marginBottom: 14 }}>
              Four steps to <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>real savings</span>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--t2)', lineHeight: 1.75, marginBottom: 34 }}>No guessing and no heavy setup. Start with one invoice and a few important dishes.</p>
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
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: 'var(--t1)', letterSpacing: -.5, marginBottom: 20 }}>What a typical kitchen can find</h3>
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
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 18 }}>Ready to check one invoice?</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 700, color: '#fff', letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 16 }}>
            Do not let profit disappear<br />
            <span style={{ color: 'var(--goldl)', fontStyle: 'italic' }}>in the fine print</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.58)', lineHeight: 1.65, maxWidth: 520, margin: '0 auto 38px' }}>
            Request a free analysis and we will show what your first invoice reveals.
          </p>
          <a href="#consulting" style={{ background: 'var(--gold)', color: 'var(--brown)', padding: '13px 30px', borderRadius: 10, fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
            Request free analysis
          </a>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,.28)', letterSpacing: .5, marginTop: 24 }}>chef@smakvarlden.se · smakvarlden.se · Upplands Väsby, Sweden</div>
        </div>
      </section>

      <footer style={{ background: '#0A0604', padding: '32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--goldl)', fontWeight: 700, fontStyle: 'italic' }}>Smakvärlden</div>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link to="/trust" style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>How it works</Link>
          <Link to="/login" style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>Log in</Link>
          <a href="mailto:chef@smakvarlden.se" style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>Contact</a>
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,.18)' }}>© 2026 Smakvärlden</div>
      </footer>
    </div>
  );
}
