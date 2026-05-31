import { useState } from 'react';

type Tone = 'light' | 'dark';

interface ConsultingLeadFormProps {
  source: string;
  tone?: Tone;
}

const fieldStyle = (tone: Tone): React.CSSProperties => ({
  width: '100%',
  border: tone === 'dark' ? '1px solid rgba(255,255,255,.16)' : '1px solid var(--border)',
  borderRadius: 12,
  background: tone === 'dark' ? 'rgba(255,255,255,.08)' : 'var(--white)',
  color: tone === 'dark' ? '#fff' : 'var(--t1)',
  padding: '12px 14px',
  outline: 'none',
});

const labelStyle = (tone: Tone): React.CSSProperties => ({
  display: 'block',
  marginBottom: 6,
  color: tone === 'dark' ? 'rgba(255,255,255,.58)' : 'var(--t2)',
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '.06em',
  textTransform: 'uppercase',
});

function encodeForm(formData: FormData) {
  return new URLSearchParams(formData as unknown as Record<string, string>).toString();
}

export default function ConsultingLeadForm({ source, tone = 'light' }: ConsultingLeadFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setError('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set('form-name', 'consulting-request');
    formData.set('source', source);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeForm(formData),
      });
      if (!response.ok) throw new Error('Kunde inte skicka förfrågan');
      form.reset();
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte skicka förfrågan');
      setStatus('error');
    }
  }

  const muted = tone === 'dark' ? 'rgba(255,255,255,.62)' : 'var(--t2)';

  return (
    <form
      name="consulting-request"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={submit}
      style={{
        display: 'grid',
        gap: 14,
        padding: 22,
        border: tone === 'dark' ? '1px solid rgba(255,255,255,.12)' : '1px solid var(--border)',
        borderRadius: 20,
        background: tone === 'dark' ? 'rgba(255,255,255,.06)' : 'var(--white)',
      }}
    >
      <input type="hidden" name="form-name" value="consulting-request" />
      <input type="hidden" name="source" value={source} />
      <p style={{ display: 'none' }}>
        <label>
          Fyll inte i detta: <input name="bot-field" />
        </label>
      </p>

      <div className="consulting-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <label>
          <span style={labelStyle(tone)}>Restaurang</span>
          <input name="restaurant" required placeholder="Restaurangnamn" style={fieldStyle(tone)} />
        </label>
        <label>
          <span style={labelStyle(tone)}>Kontaktperson</span>
          <input name="name" required placeholder="Ditt namn" style={fieldStyle(tone)} />
        </label>
      </div>

      <div className="consulting-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <label>
          <span style={labelStyle(tone)}>E-post</span>
          <input name="email" type="email" required placeholder="chef@restaurant.se" style={fieldStyle(tone)} />
        </label>
        <label>
          <span style={labelStyle(tone)}>Stad</span>
          <input name="city" placeholder="Upplands Väsby" style={fieldStyle(tone)} />
        </label>
      </div>

      <label>
        <span style={labelStyle(tone)}>Vad vill ni testa?</span>
        <select name="need" defaultValue="invoice-audit" style={fieldStyle(tone)}>
          <option value="invoice-audit">Fakturakoll</option>
          <option value="recipe-setup">Lägga in produkter</option>
          <option value="supplier-prices">Kontrollera leverantörspriser</option>
          <option value="demo">Boka demo</option>
        </select>
      </label>

      <label>
        <span style={labelStyle(tone)}>Meddelande</span>
        <textarea
          name="message"
          rows={4}
          placeholder="Skriv vilka fakturor, produkter eller menypriser ni vill kontrollera först."
          style={{ ...fieldStyle(tone), resize: 'vertical' }}
        />
      </label>

      <button
        type="submit"
        disabled={status === 'sending'}
        style={{
          border: 0,
          borderRadius: 12,
          padding: '13px 18px',
          background: tone === 'dark' ? 'var(--gold)' : 'var(--brown)',
          color: tone === 'dark' ? 'var(--brown)' : '#fff',
          cursor: status === 'sending' ? 'default' : 'pointer',
          fontWeight: 900,
        }}
      >
        {status === 'sending' ? 'Skickar...' : 'Boka gratis marginalkoll'}
      </button>

      {status === 'sent' && (
        <div style={{ color: tone === 'dark' ? 'var(--goldl)' : 'var(--green)', fontSize: 13, fontWeight: 800 }}>
          Tack! Din förfrågan är sparad och vi återkommer från chef@smakvarlden.se.
        </div>
      )}
      {status === 'error' && (
        <div style={{ color: tone === 'dark' ? '#fca5a5' : 'var(--red)', fontSize: 13, fontWeight: 800 }}>
          {error}. Du kan också mejla chef@smakvarlden.se.
        </div>
      )}
      <p style={{ color: muted, fontSize: 11, lineHeight: 1.5 }}>
        Förfrågningar sparas i Netlify Forms och kan exporteras som CSV till Excel.
      </p>
    </form>
  );
}
