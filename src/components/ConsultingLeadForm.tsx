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
      if (!response.ok) throw new Error('Could not send request');
      form.reset();
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send request');
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
          Do not fill this out: <input name="bot-field" />
        </label>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <label>
          <span style={labelStyle(tone)}>Restaurant</span>
          <input name="restaurant" required placeholder="Restaurant name" style={fieldStyle(tone)} />
        </label>
        <label>
          <span style={labelStyle(tone)}>Contact person</span>
          <input name="name" required placeholder="Your name" style={fieldStyle(tone)} />
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <label>
          <span style={labelStyle(tone)}>Email</span>
          <input name="email" type="email" required placeholder="chef@restaurant.se" style={fieldStyle(tone)} />
        </label>
        <label>
          <span style={labelStyle(tone)}>City</span>
          <input name="city" placeholder="Upplands Väsby" style={fieldStyle(tone)} />
        </label>
      </div>

      <label>
        <span style={labelStyle(tone)}>Main need</span>
        <select name="need" defaultValue="invoice-audit" style={fieldStyle(tone)}>
          <option value="invoice-audit">Invoice audit</option>
          <option value="recipe-setup">Recipe setup</option>
          <option value="supplier-prices">Supplier price control</option>
          <option value="demo">Book a demo</option>
        </select>
      </label>

      <label>
        <span style={labelStyle(tone)}>Message</span>
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us which supplier invoices, recipes or menu items you want to check first."
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
        {status === 'sending' ? 'Sending...' : 'Request free analysis'}
      </button>

      {status === 'sent' && (
        <div style={{ color: tone === 'dark' ? 'var(--goldl)' : 'var(--green)', fontSize: 13, fontWeight: 800 }}>
          Thank you. Your request is saved and we will reply from chef@smakvarlden.se.
        </div>
      )}
      {status === 'error' && (
        <div style={{ color: tone === 'dark' ? '#fca5a5' : 'var(--red)', fontSize: 13, fontWeight: 800 }}>
          {error}. You can also email chef@smakvarlden.se.
        </div>
      )}
      <p style={{ color: muted, fontSize: 11, lineHeight: 1.5 }}>
        Submissions are stored in Netlify Forms and can be exported as CSV for Excel.
      </p>
    </form>
  );
}
