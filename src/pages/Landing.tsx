import { Link } from 'react-router-dom';

const steps = ['Analyze', 'Identify', 'Optimize', 'Profit'];

const services = [
  { icon: "ð", title: "Deep Invoice Audit", body: "We personally review your supplier invoices to identify hidden price increases and market discrepancies â the ones quietly draining your margins every week." },
  { icon: "ð¤", title: "Supplier Negotiation Support", body: "We give you exact data to negotiate better deals with Martin & Servera and Menigo. Numbers never lie â use them." },
  { icon: "âï¸", title: "System Setup", body: "We handle the initial setup of your recipe costs and ingredient database so you start saving from day one â no technical knowledge required." },
  { icon: "ð¯", title: "Actionable Insights", body: "We turn complex data into simple steps: Raise this price. Swap this ingredient. Reduce this portion. Clear decisions, immediate impact." },
];

const deliverSteps = [
  { title: "Analyze â Upload one week of invoices", body: "Share your latest delivery invoices from Menigo or Martin & Servera. AI reads every price in seconds â no manual entry." },
  { title: "Identify â We find the hidden losses", body: "We compare your prices against current market data and pinpoint every ingredient costing more than it should." },
  { title: "Optimize â We implement the findings", body: "Every finding goes into your Smakvärlden dashboard. Recipe margins update automatically. You see the full picture." },
  { title: "Profit â Immediate impact on food costs", body: "You see a measurable reduction in monthly food costs from week one. No waiting, no guessing â just better margins." },
];

const stats = [
  { label: "Hidden price increases caught", value: "6â12 / month" },
  { label: "Average weekly savings", value: "3 000â8 000 kr" },
  { label: "Time to first insight", value: "Under 60 sec" },
  { label: "Monthly cost of Pro plan", value: "59 kr" },
];

const footerLinks = [
  { label: "Hur det fungerar", to: "/trust" },
  { label: "Logga in", to: "/login" },
];

export default function Landing() {
  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: 'var(--cream)', color: 'var(--t1)' }}>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(247,244,239,.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0 40px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: 'var(--brown)', fontStyle: 'italic' }}>Smakvärlden</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/trust" style={{ fontSize: 13, color: 'var(--t2)', textDecoration: 'none', padding: '8px 16px', fontWeight: 500 }}>Hur det fungerar</Link>
          <Link to="/login" style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)', background: 'var(--brown)', padding: '8px 20px', borderRadius: 9, textDecoration: 'none' }}>Logga in</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: 'var(--brown)', padding: '96px 48px 108px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-block', fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', border: '1px solid rgba(201,168,76,.3)', padding: '5px 16px', borderRadius: 100, marginBottom: 28 }}>
          Kitchen Operating System
        </div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(42px, 6vw, 80px)', fontWeight: 700, letterSpacing: -2, lineHeight: 1.05, color: '#fff', marginBottom: 22 }}>
          Stop Guessing.<br />
          <span style={{ color: 'var(--goldl)', fontStyle: 'italic' }}>Start Profiting.</span>
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,.58)', lineHeight: 1.78, maxWidth: 580, margin: '0 auto 44px' }}>
          We don&apos;t just provide software â we provide a complete Kitchen Operating System. Smakvärlden combines AI-powered invoice tracking with expert Profit Optimization to keep your kitchen profitable every single day.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="mailto:chef@smakvarlden.se?subject=Free Profit Audit" style={{ background: 'var(--gold)', color: 'var(--brown)', padding: '13px 30px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            Book a Free Profit Audit
          </a>
          <Link to="/login" style={{ background: 'transparent', color: 'rgba(255,255,255,.75)', padding: '13px 26px', borderRadius: 10, fontSize: 14, fontWeight: 500, textDecoration: 'none', border: '1px solid rgba(255,255,255,.2)' }}>
            Try the demo â
          </Link>
        </div>
      </section>

      {/* 4-STEP STRIP */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: 'var(--gold)' }}>
        {steps.map((label, i) => (
          <div key={i} style={{ padding: '20px 16px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,.25)' : 'none' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 34, fontWeight: 700, color: 'rgba(255,255,255,.22)', lineHeight: 1 }}>{i + 1}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--brown)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* PROFIT OPTIMIZATION SERVICE */}
      <section style={{ padding: '88px 48px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>Profit Optimization Service</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 4vw, 50px)', fontWeight: 700, letterSpacing: -1.5, color: 'var(--t1)', lineHeight: 1.1, marginBottom: 14 }}>
          Your Kitchen, <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Our Priority</span>
        </h2>
        <p style={{ fontSize: 16, color: 'var(--t2)', lineHeight: 1.75, maxWidth: 540, marginBottom: 52 }}>
          Technology is only half the battle. We offer a hands-on Profit Optimization Service to take the burden off your shoulders. We give you results, not just tools.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', marginBottom: 28 }}>
          {services.map((svc, i) => (
            <div key={i} style={{ background: 'var(--white)', padding: '30px' }}>
              <div style={{ fontSize: 26, marginBottom: 12 }}>{svc.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)', marginBottom: 8 }}>{svc.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.65 }}>{svc.body}</p>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--brown)', borderRadius: 18, padding: '36px 44px', display: 'flex', alignItems: 'center', gap: 28, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,.14) 0%, transparent 70%)' }} />
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(201,168,76,.15)', border: '2px solid rgba(201,168,76,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>â¶</div>
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, color: 'var(--goldl)', marginBottom: 8 }}>Our Success Guarantee</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.58)', lineHeight: 1.7 }}>
              We are confident in our ability to improve your bottom line. We work with you to find the leaks in your kitchen budget. <strong style={{ color: '#fff' }}>If we don&apos;t find opportunities for profit improvement, our initial consultation costs you nothing.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* HOW WE DELIVER */}
      <section style={{ background: 'var(--white)', padding: '88px 48px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>How we deliver results</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, letterSpacing: -1.2, color: 'var(--t1)', lineHeight: 1.1, marginBottom: 14 }}>
              Four steps to <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>real savings</span>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--t2)', lineHeight: 1.75, marginBottom: 44 }}>No guesswork. No waiting weeks to see results. Our process shows you impact from the very first week.</p>
            <div style={{ position: 'relative', paddingLeft: 40 }}>
              <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 2, background: 'var(--border)' }} />
              {deliverSteps.map((s, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 18, paddingBottom: i < 3 ? 30 : 0, position: 'relative' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--brown)', color: 'var(--goldl)', fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>{i + 1}</div>
                  <div style={{ paddingTop: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 5 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.65 }}>{s.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--goldbg)', border: '1px solid var(--border)', borderRadius: 18, padding: 34 }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: 'var(--t1)', letterSpacing: -.5, marginBottom: 20 }}>What a typical kitchen saves</h3>
            {stats.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', fontSize: 13 }}>
                <span style={{ color: 'var(--t2)' }}>{r.label}</span>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: '#15803d' }}>{r.value}</span>
              </div>
            ))}
            <div style={{ marginTop: 22, background: 'var(--brown)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,.35)', letterSpacing: 1, marginBottom: 6 }}>ROI IN FIRST WEEK</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, fontWeight: 700, color: 'var(--goldl)', letterSpacing: -1 }}>50Ã</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 4 }}>average return on 59 kr investment</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '88px 48px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ background: 'var(--brown)', borderRadius: 22, padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -150, right: -150, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 18 }}>Ready to boost your margins?</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 700, color: '#fff', letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 16 }}>
            Don&apos;t let your profits slip away<br />
            <span style={{ color: 'var(--goldl)', fontStyle: 'italic' }}>in the fine print</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.5)', marginBottom: 40, lineHeight: 1.65, maxWidth: 500, margin: '0 auto 40px' }}>
            Let&apos;s do a quick, free audit of your current costs. No commitment. No credit card. Just clarity on where your money is going.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 22 }}>
            <a href="mailto:chef@smakvarlden.se?subject=Free Profit Audit Request" style={{ background: 'var(--gold)', color: 'var(--brown)', padding: '13px 30px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Book a Free Profit Audit
            </a>
            <Link to="/login" style={{ background: 'transparent', color: 'rgba(255,255,255,.7)', padding: '13px 26px', borderRadius: 10, fontSize: 14, fontWeight: 500, textDecoration: 'none', border: '1px solid rgba(255,255,255,.2)' }}>
              Try the demo free
            </Link>
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,.25)', letterSpacing: .5 }}>chef@smakvarlden.se Â· smakvarlden.se Â· Upplands Väsby, Sweden</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0A0604', padding: '32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--goldl)', fontWeight: 700, fontStyle: 'italic' }}>Smakvärlden</div>
        <div style={{ display: 'flex', gap: 20 }}>
          {footerLinks.map((l) => (
            <Link key={l.to} to={l.to} style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>{l.label}</Link>
          ))}
          <a href="mailto:chef@smakvarlden.se" style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>Kontakt</a>
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,.18)' }}>Â© 2025 Smakvärlden</div>
      </footer>

    </div>
  );
}