import type { Handler } from '@netlify/functions';

const ALLOWED_TYPES = ['invoice', 'recipe'];

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }
  try {
    const { type, base64, mediaType } = JSON.parse(event.body || '{}');
    if (!ALLOWED_TYPES.includes(type)) return { statusCode: 400, body: JSON.stringify({ error: 'Invalid type' }) };
    if (!base64 || !mediaType) return { statusCode: 400, body: JSON.stringify({ error: 'Missing data' }) };
    const API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!API_KEY) return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured' }) };
    const systems: Record<string, string> = {
      invoice: 'Du är ett system som läser leveransfakturor från svenska livsmedelsgrossister. Extrahera ALLA ingredienser med pris och enhet. Svara ENDAST med giltig JSON: {"items":[{"name":"Norsk Lax","price":145,"unit":"kg"}]}. Ignorera frakt, moms, rabatter.',
      recipe: 'Du är ett system som läser recept från svenska restaurangkök. Svara ENDAST med giltig JSON: {"name":"Namn","category":"Huvudrätter","servings":1,"sellingPrice":null,"ingredients":[{"name":"Lax","quantity":120,"unit":"g"}]}. Sätt quantity till null om osäker.',
    };
    const isPdf = mediaType === 'application/pdf';
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: systems[type],
        messages: [{ role: 'user', content: [
          { type: isPdf ? 'document' : 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          { type: 'text', text: type === 'invoice' ? 'Läs denna faktura.' : 'Läs detta recept.' },
        ]}],
      }),
    });
    const data = await response.json();
    if (!response.ok) return { statusCode: 500, body: JSON.stringify({ error: data.error?.message || 'AI error' }) };
    const text = data.content[0].text.trim().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }) };
  }
};
