import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { store, margin, buildAlerts } from '../store';
import { useAuth } from '../lib/auth-context';
import { useLanguage } from '../lib/language';
import { BigStep, HowItWorksStrip, SimpleTip } from '../components/SimpleGuide';

export default function Dashboard() {
  const { user } = useAuth();
  const { isEnglish } = useLanguage();
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
          {isEnglish ? 'Hi' : 'Hej'}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
        </h1>
        <p style={{ fontSize:16, color:'var(--t2)', lineHeight:1.5 }}>
          {isEnglish
            ? 'See if your dishes, drinks and products make money and what to do next.'
            : 'Här ser du om dina rätter, drycker och produkter tjänar pengar — och vad du ska göra härnäst.'}
        </p>
      </div>

      {priceWarnings.length > 0 && (
        <SimpleTip>
          <strong>{isEnglish ? 'An ingredient got more expensive.' : 'En ingrediens har blivit dyrare.'}</strong>{' '}
          {isEnglish
            ? priceWarnings.length === 1
              ? `${priceWarnings[0].ingredient.name} costs more now.`
              : `${priceWarnings.length} ingredients cost more now.`
            : priceWarnings.length === 1
              ? `${priceWarnings[0].ingredient.name} kostar mer nu.`
              : `${priceWarnings.length} ingredienser kostar mer nu.`}
          {' '}{isEnglish ? 'Check which menu prices need attention.' : 'Kolla vilka produkter som behöver höjt pris.'}{' '}
          <Link to="/price-intel" style={{ color:'var(--brown)', fontWeight:700 }}>{isEnglish ? 'Show me' : 'Visa mig'} →</Link>
        </SimpleTip>
      )}

      <div style={{ background:'linear-gradient(135deg, var(--white) 0%, var(--goldbg) 100%)', border:'1px solid var(--goldb)', borderRadius:18, padding:'20px', marginTop:20, boxShadow:'0 6px 20px var(--shad)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', gap:16, alignItems:'flex-start', marginBottom:14 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'.8px', color:'var(--gold)', marginBottom:6 }}>
              {isEnglish ? 'Customer demo' : 'Kunddemo'}
            </div>
            <h2 className="font-serif" style={{ fontSize:24, fontWeight:600, color:'var(--t1)', letterSpacing:'-.4px', marginBottom:6 }}>
              {isEnglish ? 'Show value in 5 minutes' : 'Visa värdet på 5 minuter'}
            </h2>
            <p style={{ fontSize:14, color:'var(--t2)', lineHeight:1.55, maxWidth:560 }}>
              {isEnglish
                ? 'Use this flow with a restaurant owner: menu estimate, real invoice prices, then old vs new margin impact.'
                : 'Använd detta flöde med en restaurangägare: menyestimat, riktiga fakturapriser och sedan gammal vs ny marginal.'}
            </p>
          </div>
          <span style={{ flexShrink:0, padding:'5px 10px', borderRadius:999, background:'var(--brown)', color:'var(--goldl)', fontSize:11, fontWeight:800 }}>
            {isEnglish ? 'Pilot ready' : 'Pilotklar'}
          </span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10 }}>
          {[
            {
              n:'1',
              title:isEnglish ? 'Scan menu' : 'Skanna meny',
              text:isEnglish ? 'AI finds food, drinks and prices.' : 'AI hittar mat, dryck och priser.',
              to:'/recipes?scan=menu',
            },
            {
              n:'2',
              title:isEnglish ? 'Scan invoice' : 'Skanna faktura',
              text:isEnglish ? 'Update beer, cola, whiskey and food costs.' : 'Uppdatera öl, cola, whiskey och matkostnader.',
              to:'/recipes?scan=invoice',
            },
            {
              n:'3',
              title:isEnglish ? 'Show impact' : 'Visa påverkan',
              text:isEnglish ? 'Old price, new price and affected margins.' : 'Gammalt pris, nytt pris och påverkade marginaler.',
              to:'/price-intel',
            },
          ].map(step => (
            <Link key={step.n} to={step.to} style={{ background:'rgba(255,255,255,.72)', border:'1px solid rgba(201,168,76,.28)', borderRadius:13, padding:'13px', textDecoration:'none' }}>
              <div style={{ width:24, height:24, borderRadius:999, background:'var(--brown)', color:'var(--goldl)', display:'grid', placeItems:'center', fontSize:12, fontWeight:800, marginBottom:8 }}>{step.n}</div>
              <div style={{ fontSize:13, fontWeight:800, color:'var(--t1)', marginBottom:4 }}>{step.title}</div>
              <div style={{ fontSize:12, color:'var(--t2)', lineHeight:1.45 }}>{step.text}</div>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ marginTop:20, marginBottom:12 }}>
        <h2 style={{ fontSize:13, fontWeight:800, textTransform:'uppercase', letterSpacing:'.7px', color:'var(--t3)', marginBottom:14 }}>
          {isEnglish ? 'Start here' : 'Börja här'}
        </h2>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <BigStep
            emoji="📸"
            title={isEnglish ? 'Scan your menu' : 'Skanna din meny'}
            text={isEnglish ? 'Upload a menu photo. AI finds food, drinks, add-ons and prices, then gives editable cost estimates.' : 'Ladda upp en menybild. AI hittar mat, dryck, tillbehör och priser och ger kostnadsestimat som du kan ändra.'}
            to="/recipes?scan=menu"
            button={isEnglish ? 'Open menu scanner' : 'Öppna menyskanner'}
            highlight
          />
          <BigStep
            emoji="🍽️"
            title={isEnglish ? 'Scan a recipe' : 'Skanna ett recept'}
            text={isEnglish ? 'Use the recipe scanner for accurate ingredients, drink measures, portions, and saved cost cards.' : 'Använd receptskannern för exakta ingredienser, dryckesmått, mängder och sparade kalkylkort.'}
            to="/recipes?scan=recipe"
            button={isEnglish ? 'Scan recipe' : 'Skanna recept'}
          />
          <BigStep
            emoji="🧾"
            title={isEnglish ? 'Scan an invoice' : 'Skanna en faktura'}
            text={isEnglish ? 'Supplier invoices replace estimates with real prices and show old vs new margin impact.' : 'Leverantörsfakturor ersätter estimat med riktiga priser och visar gammal mot ny marginal.'}
            to="/recipes?scan=invoice"
            button={isEnglish ? 'Scan invoice' : 'Skanna faktura'}
          />
        </div>
      </div>

      <div style={{ marginTop:28, marginBottom:12 }}>
        <h2 style={{ fontSize:13, fontWeight:800, textTransform:'uppercase', letterSpacing:'.7px', color:'var(--t3)', marginBottom:14 }}>
          {isEnglish ? 'How it works' : 'Så funkar det'}
        </h2>
        <HowItWorksStrip />
      </div>

      {(weakRecipes.length > 0 || recipes.length > 0) && (
        <div style={{ marginTop:28 }}>
          <h2 style={{ fontSize:13, fontWeight:800, textTransform:'uppercase', letterSpacing:'.7px', color:'var(--t3)', marginBottom:14 }}>
            {weakRecipes.length > 0
              ? isEnglish ? 'Products that may need a higher price' : 'Produkter som kan behöva höjt pris'
              : isEnglish ? 'Your products' : 'Dina produkter'}
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
                      {ok
                        ? isEnglish ? 'Good price — profitable' : 'Bra pris — du tjänar pengar'
                        : warn
                          ? isEnglish ? 'Okay, but can improve' : 'Okej, men kan bli bättre'
                          : isEnglish ? 'Price is too low right now' : 'Priset är för lågt just nu'}
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
                    {m.toFixed(0)}% {isEnglish ? 'margin' : 'vinst'}
                  </span>
                </Link>
              );
            })}
            {recipes.length > 5 && (
              <Link to="/recipes" style={{ display:'block', padding:'12px 18px', textAlign:'center', fontSize:13, fontWeight:600, color:'var(--gold)', textDecoration:'none' }}>
                {isEnglish ? `See all ${recipes.length} products` : `Se alla ${recipes.length} produkter`} →
              </Link>
            )}
          </div>
        </div>
      )}

      {recipes.length === 0 && (
        <div style={{ marginTop:24 }}>
          <SimpleTip>
            <strong>{isEnglish ? 'New here?' : 'Ny här?'}</strong>{' '}
            {isEnglish
              ? 'Start by scanning a menu or invoice. The app fills in food, drinks and product costs for you.'
              : 'Börja med att skanna en meny eller faktura. Appen fyller i mat, dryck och produktkostnader åt dig.'}
          </SimpleTip>
        </div>
      )}
    </div>
  );
}
