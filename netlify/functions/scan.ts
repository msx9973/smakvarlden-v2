import type { Handler } from '@netlify/functions';

const ALLOWED_TYPES = ['invoice', 'recipe'];

function extractJson(text: string) {
  return text.trim().replace(/```json|```/g, '').trim();
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { type, base64, mediaType } = JSON.parse(event.body || '{}');

    if (!ALLOWED_TYPES.includes(type)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid type' }) };
    }

    if (!base64 || !mediaType) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing data' }) };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured' }) };
    }

    const systems: Record<string, string> = {
      invoice: [
        'Du ar ett system som laser leveransfakturor fran svenska livsmedelsgrossister.',
        'Extrahera endast riktiga produktrader/ingredienser. Ignorera moms, frakt, rabatter, totalsummor, OCR, artikelrubriker och sidfot.',
        'Behall produktnamn pa fakturans sprak. Oversatt inte Laxfile, Menigo, Martin & Servera eller vanliga kokstermer.',
        'Svara endast med giltig JSON i detta format:',
        '{"supplierName":"Menigo","invoiceId":"optional","invoiceDate":"YYYY-MM-DD","items":[{"name":"Laxfile","category":"Fisk","quantity":5,"unit":"kg","unitPrice":162,"totalPrice":810,"confidence":0.92}]}',
        'Om quantity saknas, anvand 1. Om unitPrice saknas men totalPrice finns, anvand totalPrice som unitPrice.',
      ].join(' '),
      recipe: [
        'Du ar ett system som laser recept fran svenska restaurangkok.',
        'Svara endast med giltig JSON:',
        '{"name":"Namn","category":"Huvudratter","servings":1,"sellingPrice":null,"ingredients":[{"name":"Lax","quantity":120,"unit":"g"}]}',
        'Satt quantity till null om du ar osaker.',
      ].join(' '),
    };

    const isPdf = mediaType === 'application/pdf';
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1800,
        system: systems[type],
        messages: [
          {
            role: 'user',
            content: [
              { type: isPdf ? 'document' : 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
              { type: 'text', text: type === 'invoice' ? 'Las denna faktura.' : 'Las detta recept.' },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: data.error?.message || 'AI error' }) };
    }

    const text = data.content?.[0]?.text;
    if (!text) {
      return { statusCode: 500, body: JSON.stringify({ error: 'AI returned no text' }) };
    }

    const parsed = JSON.parse(extractJson(text));
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
    };
  }
};
