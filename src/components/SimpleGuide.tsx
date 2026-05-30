import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useLanguage } from '../lib/language';

export function SimpleTip({ children }: { children: ReactNode }) {
  return (
    <div style={{
      padding:'14px 16px',
      background:'var(--goldbg)',
      border:'1px solid var(--goldb)',
      borderRadius:12,
      fontSize:14,
      color:'hsl(17 47% 22%)',
      lineHeight:1.55,
    }}>
      {children}
    </div>
  );
}

type StepProps = {
  emoji: string;
  title: string;
  text: string;
  to: string;
  button: string;
  highlight?: boolean;
};

export function BigStep({ emoji, title, text, to, button, highlight }: StepProps) {
  return (
    <Link
      to={to}
      style={{
        display:'block',
        padding:'22px 22px 20px',
        background: highlight ? 'linear-gradient(135deg, var(--brown) 0%, hsl(17 47% 20%) 100%)' : 'var(--white)',
        border:`1.5px solid ${highlight ? 'transparent' : 'var(--border)'}`,
        borderRadius:18,
        textDecoration:'none',
        color: highlight ? '#fff' : 'inherit',
        transition:'transform .15s, box-shadow .15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px var(--shadmd)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ fontSize:36, marginBottom:10 }}>{emoji}</div>
      <div style={{ fontSize:18, fontWeight:700, color: highlight ? '#fff' : 'var(--t1)', marginBottom:8, letterSpacing:'-.3px' }}>
        {title}
      </div>
      <div style={{ fontSize:14, color: highlight ? 'rgba(255,255,255,.78)' : 'var(--t2)', lineHeight:1.55, marginBottom:16 }}>
        {text}
      </div>
      <span style={{
        display:'inline-flex',
        alignItems:'center',
        gap:6,
        fontSize:14,
        fontWeight:700,
        color: highlight ? 'var(--goldl)' : 'var(--brown)',
      }}>
        {button} <ArrowRight size={15} />
      </span>
    </Link>
  );
}

export function HowItWorksStrip() {
  const { isEnglish } = useLanguage();
  const steps = isEnglish ? [
    { n: '1', title: 'Scan the menu', text: 'Get fast AI cost estimates.' },
    { n: '2', title: 'Review products', text: 'Edit portions, drink measures and add-ons before saving.' },
    { n: '3', title: 'Scan invoices', text: 'Real supplier prices update margins.' },
  ] : [
    { n: '1', title: 'Skanna menyn', text: 'Få snabba AI-estimat på kostnad.' },
    { n: '2', title: 'Granska produkterna', text: 'Justera portioner, dryckesmått och tillbehör innan du sparar.' },
    { n: '3', title: 'Skanna fakturan', text: 'Riktiga leverantörspriser uppdaterar marginalen.' },
  ];

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10 }}>
      {steps.map(step => (
        <div key={step.n} style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:12, padding:'14px 16px' }}>
          <div style={{
            width:28, height:28, borderRadius:999, background:'var(--brown)', color:'var(--goldl)',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, marginBottom:8,
          }}>
            {step.n}
          </div>
          <div style={{ fontSize:14, fontWeight:700, color:'var(--t1)', marginBottom:4 }}>{step.title}</div>
          <div style={{ fontSize:13, color:'var(--t2)', lineHeight:1.45 }}>{step.text}</div>
        </div>
      ))}
    </div>
  );
}
