import type { RecipeVisibility } from '../store';

type Props = {
  value: RecipeVisibility;
  onChange: (value: RecipeVisibility) => void;
};

export default function RecipeVisibilityPicker({ value, onChange }: Props) {
  return (
    <div>
      <label style={{ fontSize:14, fontWeight:700, color:'var(--t1)', display:'block', marginBottom:8 }}>
        Vem får se den här rätten?
      </label>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        {([
          ['private', 'Bara jag', 'Ingen annan ser den'],
          ['public', 'Alla', 'Andra kan titta och inspireras'],
        ] as const).map(([id, title, hint]) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            style={{
              textAlign:'left',
              padding:'12px 14px',
              borderRadius:10,
              border:`1.5px solid ${value === id ? 'var(--gold)' : 'var(--border)'}`,
              background: value === id ? 'var(--goldbg)' : 'var(--white)',
              cursor:'pointer',
            }}
          >
            <div style={{ fontSize:14, fontWeight:700, color:'var(--t1)', marginBottom:4 }}>{title}</div>
            <div style={{ fontSize:12, color:'var(--t3)', lineHeight:1.4 }}>{hint}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
