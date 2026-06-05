import type { Handler } from '@netlify/functions';

const ALLOWED_TYPES = ['invoice', 'recipe', 'menu'];
const MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

function scanError(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod === 'GET') {
    return jsonResponse(200, {
      ok: true,
      scanConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
      model: MODEL,
    });
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
        error:
          'ANTHROPIC_API_KEY saknas. Lägg till nyckeln under Netlify → Site configuration → Environment variables (scope: Functions) och deploya om.',
      });
    }

    const systems: Record<string, string> = {
      invoice: [
        'Du är ett system som läser leveransfakturor från svenska livsmedelsgrossister.',
        'Extrahera endast riktiga produktrader/ingredienser. Ignorera moms, frakt, rabatter, totalsummor, OCR, artikelrubriker och sidfot.',
        'Behåll produktnamn på fakturans språk. Översätt inte Laxfilé, Menigo, Martin & Servera eller vanliga kökstermer.',
        'Använd kategorier som Fisk, Kött, Grönsaker, Mejeri, Torrvaror, Kryddor, Skaldjur, Svamp, Dryck, Kaffe eller Förpackning.',
        'För sprit/vin på flaska, returnera gärna unit "liter" och unitPrice per liter när flaskstorleken syns. Exempel: 70cl flaska 279 kr => quantity 0.7, unit "liter", unitPrice 398.57.',
        'För öl, läsk och styckförpackade drycker som säljs som en hel burk/flaska, behåll unit "st" och unitPrice per styck.',
        'Svara endast med giltig JSON i detta format:',
        '{"supplierName":"Menigo","invoiceId":"optional","invoiceDate":"YYYY-MM-DD","items":[{"name":"Laxfile","category":"Fisk","quantity":5,"unit":"kg","unitPrice":162,"totalPrice":810,"confidence":0.92}]}',
        'Om quantity saknas, använd 1. Om unitPrice saknas men totalPrice finns, använd totalPrice som unitPrice.',
      ].join(' '),
      recipe: [
        'Du är ett system som läser recept och produktkalkyler från svenska restaurangkök, barer och caféer.',
        'Det kan vara maträtter, drycker, kaffe, desserter, tillbehör eller cateringprodukter.',
        'Sätt category till en av: Mat, Dryck, Kaffe, Dessert, Tillbehör, Catering när det passar.',
        'Svara endast med giltig JSON:',
        '{"name":"Namn","category":"Mat","servings":1,"sellingPrice":null,"ingredients":[{"name":"Lax","quantity":120,"unit":"g"}]}',
        'Sätt quantity till null om du är osäker.',
      ].join(' '),
      menu: [
        'Du är ett system som läser restaurangmenyer från svenska restauranger.',
        'Extrahera alla säljbara produkter: maträtter, drycker, kaffe, desserter, tillbehör, extra toppings och catering/lunchlådor.',
        'Sätt category till en av: Mat, Dryck, Kaffe, Dessert, Tillbehör, Catering.',
        'Prioritera att alltid få med ALLA produktnamn och menypriser, även på långa menyer.',
        'Gissa högst 4 viktigaste ingredienser per produkt med portionsmängd och svenskt grossist-/marknadspris.',
        'För enkla drycker, kaffe och tillbehör räcker 1-2 ingredienser.',
        'Håll JSON kompakt. Skriv inga förklaringar och upprepa inte menytext.',
        'Detta är ett snabbt estimat, inte exakt receptkalkyl. Använd confidence 0.5-0.85 beroende på hur tydlig rätten är.',
        'Svara endast med giltig JSON:',
        '{"items":[{"name":"Carbonara","category":"Pasta","menuPrice":180,"confidence":0.78,"ingredients":[{"name":"Pasta","quantity":120,"unit":"g","estimatedPriceSek":32,"priceUnit":"kg","category":"Torrvaror","confidence":0.8}]}]}',
        'Behåll rättnamn på menyns språk. Använd SEK-priser per priceUnit. Om pris saknas på menyn, sätt menuPrice null.',
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
        model: MODEL,
        max_tokens: type === 'menu' ? 12000 : type === 'invoice' ? 4000 : 3000,
        system: systems[type],
        messages: [
          {
            role: 'user',
            content: [
              {
                type: isPdf ? 'document' : 'image',
                source: { type: 'base64', media_type: mediaType, data: base64 },
              },
              {
                type: 'text',
                text: type === 'invoice'
                  ? 'Läs denna faktura.'
                  : type === 'menu'
                    ? 'Läs denna meny och skapa redigerbara kostnadsestimat.'
                    : 'Läs detta recept.',
              },
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

    if (data.stop_reason === 'max_tokens') {
      return jsonResponse(422, {
        error: 'Menyn är för stor för en enda skanning. Fota en menysida eller sektion i taget.',
      });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(extractJson(text));
    } catch (error) {
      return jsonResponse(422, {
        error: type === 'menu'
          ? 'Menyn kunde inte läsas klart. Fota en tydlig menysida eller sektion och försök igen.'
          : `AI-svaret kunde inte läsas: ${scanError(error)}`,
      });
    }
    return jsonResponse(200, parsed);
  } catch (err) {
    return jsonResponse(500, {
      error: scanError(err),
    });
  }
};
