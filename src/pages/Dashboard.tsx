import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { store, margin, buildAlerts } from '../store';
import { useAuth } from '../lib/auth-context';
import { BigStep, HowItWorksStrip, SimpleTip } from '../components/SimpleGuide';

export default function Dashboard() {
  const { user } = useAuth();
  const recipes = store.getRecipes();
  const ingredients = store.getIngredients();
  const alerts = useMemo(() => buildAlerts(ingredients, recipes, 3), [ingredients, recipes]);
  const priceWarnings = alerts.filter(a => a.changePct > 0);
  const weakRecipes = useMemo(
    () => recipes.filter(r => margin(r) < 45).slice(0, 3),
    [recipes],
  );

  return (
    <div style={{ padding:'32px 36px', maxWidth:880, margin:'0 auto' }}>
      <div style={{ marginBottom:28 }}>
        <h1 className="font-serif" style={{ fontSize:32, fontWeight:600, letterSpacing:'-.7px', color:'var(--t1)', marginBottom:8 }}>
          Hej{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
        </h1>
        <p style={{ fontSize:16, color:'var(--t2)', lineHeight:1.5 }}>
          Här ser du om dina rätter tjänar pengar — och vad du ska göra härnäst.
        </p>
      </div>

      {priceWarnings.length > 0 && (
        <SimpleTip>
          <strong>En ingrediens har blivit dyrare.</strong>{' '}
          {priceWarnings.length === 1
            ? `${priceWarnings[0].ingredient.name} kostar mer nu.`
            : `${priceWarnings.length} ingredienser kostar mer nu.`}
          {' '}Kolla vilka rätter som behöver höjt pris.{' '}
          <Link to="/price-intel" style={{ color:'var(--brown)', fontWeight:700 }}>Visa mig →</Link>
        </SimpleTip>
      )}

      <div style={{ marginTop:20, marginBottom:12 }}>
        <h2 style={{ fontSize:13, fontWeight:800, textTransform:'uppercase', letterSpacing:'.7px', color:'var(--t3)', marginBottom:14 }}>
          Börja här
        </h2>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <BigStep
            emoji="📸"
            title="Fota din faktura"
            text="Ta en bild på leveransfakturan. Vi skriver in nya priser på dina ingredienser — du slipper knappa själv."
            to="/recipes?scan=invoice"
            button="Skanna faktura"
            highlight
          />
          <BigStep
            emoji="🍽️"
            title="Lägg in en rätt"
            text="Skriv in ingredienser och portionspris. Då räknar appen ut vad rätten kostar och om priset är bra."
            to="/recipes?new=1"
            button="Lägg till rätt"
          />
          <BigStep
            emoji="🧮"
            title="Räkna snabbt på en rätt"
            text="Testa en idé innan du sparar den. Välj ingredienser och se kostnad direkt."
            to="/calculator"
            button="Öppna räknare"
          />
        </div>
      </div>

      <div style={{ marginTop:28, marginBottom:12 }}>
        <h2 style={{ fontSize:13, fontWeight:800, textTransform:'uppercase', letterSpacing:'.7px', color:'var(--t3)', marginBottom:14 }}>
          Så funkar det
        </h2>
        <HowItWorksStrip />
      </div>

      {(weakRecipes.length > 0 || recipes.length > 0) && (
        <div style={{ marginTop:28 }}>
          <h2 style={{ fontSize:13, fontWeight:800, textTransform:'uppercase', letterSpacing:'.7px', color:'var(--t3)', marginBottom:14 }}>
            {weakRecipes.length > 0 ? 'Rätter som kan behöva höjt pris' : 'Dina rätter'}
          </h2>
          <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
            {(weakRecipes.length > 0 ? weakRecipes : recipes.slice(0, 5)).map((r, idx, arr) => {
              const m = margin(r);
              const ok = m >= 62;
              const warn = m >= 45;
              return (
                <Link
                  key={r.id}
                  to={`/recipes/${r.id}`}
                  style={{
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'space-between',
                    gap:12,
                    padding:'14px 18px',
                    borderBottom: idx < arr.length - 1 ? '1px solid var(--border)' : 'none',
                    textDecoration:'none',
                  }}
                >
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:'var(--t1)' }}>{r.name}</div>
                    <div style={{ fontSize:12, color:'var(--t3)', marginTop:2 }}>
                      {ok ? 'Bra pris — du tjänar pengar' : warn ? 'Okej, men kan bli bättre' : 'Priset är för lågt just nu'}
                    </div>
                  </div>
                  <span style={{
                    fontSize:13,
                    fontWeight:700,
                    padding:'4px 10px',
                    borderRadius:999,
                    background: ok ? 'var(--greenbg)' : warn ? 'var(--goldbg)' : 'var(--redbg)',
                    color: ok ? 'var(--green)' : warn ? 'hsl(44 54% 35%)' : 'var(--red)',
                  }}>
                    {m.toFixed(0)}% vinst
                  </span>
                </Link>
              );
            })}
            {recipes.length > 5 && (
              <Link to="/recipes" style={{ display:'block', padding:'12px 18px', textAlign:'center', fontSize:13, fontWeight:600, color:'var(--gold)', textDecoration:'none' }}>
                Se alla {recipes.length} rätter →
              </Link>
            )}
          </div>
        </div>
      )}

      {recipes.length === 0 && (
        <div style={{ marginTop:24 }}>
          <SimpleTip>
            <strong>Ny här?</strong> Börja med att fota en faktura eller lägg in din första rätt. Appen fyller i mycket åt dig.
          </SimpleTip>
        </div>
      )}
    </div>
  );
}
