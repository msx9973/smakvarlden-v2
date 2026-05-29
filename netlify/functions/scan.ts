import type { Handler } from '@netlify/functions';

const ALLOWED_TYPES = ['invoice', 'recipe'];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function extractJson(text: string) {
  return text.trim().replace(/```json|```/g, '').trim();
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  try {
    const { type, base64, mediaType } = JSON.parse(event.body || '{}');

    if (!ALLOWED_TYPES.includes(type)) {
      return jsonResponse(400, { error: 'Invalid type' });
    }

    if (!base64 || !mediaType) {
      return jsonResponse(400, { error: 'Missing data' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return jsonResponse(500, {
        error: 'Server not configured. Add ANTHROPIC_API_KEY in Netlify environment variables.',
      });
    }

    const systems: Record<string, string> = {
      invoice: [
        'Du är ett system som läser leveransfakturor från svenska livsmedelsgrossister.',
        'Extrahera endast riktiga produktrader/ingredienser. Ignorera moms, frakt, rabatter, totalsummor, OCR, artikelrubriker och sidfot.',
        'Behåll produktnamn på fakturans språk. Översätt inte Laxfilé, Menigo, Martin & Servera eller vanliga kökstermer.',
        'Svara endast med giltig JSON i detta format:',
        '{"supplierName":"Menigo","invoiceId":"optional","invoiceDate":"YYYY-MM-DD","items":[{"name":"Laxfile","category":"Fisk","quantity":5,"unit":"kg","unitPrice":162,"totalPrice":810,"confidence":0.92}]}',
        'Om quantity saknas, använd 1. Om unitPrice saknas men totalPrice finns, använd totalPrice som unitPrice.',
      ].join(' '),
      recipe: [
        'Du är ett system som läser recept från svenska restaurangkök.',
        'Svara endast med giltig JSON:',
        '{"name":"Namn","category":"Huvudratter","servings":1,"sellingPrice":null,"ingredients":[{"name":"Lax","quantity":120,"unit":"g"}]}',
        'Sätt quantity till null om du är osäker.',
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
              { type: 'text', text: type === 'invoice' ? 'Läs denna faktura.' : 'Läs detta recept.' },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return jsonResponse(500, { error: data.error?.message || 'AI error' });
    }

    const text = data.content?.[0]?.text;
    if (!text) {
      return jsonResponse(500, { error: 'AI returned no text' });
    }

    const parsed = JSON.parse(extractJson(text));
    return jsonResponse(200, parsed);
  } catch (err) {
    return jsonResponse(500, {
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
