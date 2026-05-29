const SCAN_URL = import.meta.env.VITE_SCAN_URL ?? '/.netlify/functions/scan';

export interface ScanHealth {
  ok: boolean;
  scanConfigured: boolean;
  model?: string;
}

export interface ScanRequest {
  type: 'invoice' | 'recipe';
  base64: string;
  mediaType: string;
}

function guessMediaType(file: File): string {
  if (file.type) return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    heic: 'image/heic',
    heif: 'image/heif',
    pdf: 'application/pdf',
  };
  return map[ext ?? ''] ?? 'image/jpeg';
}

export function scanErrorMessage(data: unknown): string {
  if (!data || typeof data !== 'object') return 'API-fel';
  const err = (data as { error?: unknown }).error;
  if (typeof err === 'string') return err;
  if (
    err &&
    typeof err === 'object' &&
    'message' in err &&
    typeof (err as { message: unknown }).message === 'string'
  ) {
    return (err as { message: string }).message;
  }
  return 'API-fel';
}

export async function scanDocument(payload: ScanRequest): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(SCAN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      'Kan inte nå skanningstjänsten. Kör npm run dev:netlify lokalt eller använd den deployade Netlify-appen.'
    );
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    if (response.status === 404 || contentType.includes('text/html')) {
      throw new Error(
        'Skanningstjänsten är inte aktiv på den här sidan. Kontrollera att Netlify-funktionen scan är deployad och att du inte kör npm run dev utan npm run dev:netlify.'
      );
    }
    throw new Error(`Skanningstjänsten svarade fel (${response.status}).`);
  }

  const data: unknown = await response.json();
  if (!response.ok) throw new Error(scanErrorMessage(data));
  return data;
}

export async function fetchScanHealth(): Promise<ScanHealth> {
  const response = await fetch(SCAN_URL, { method: 'GET' });
  if (!response.ok) {
    return { ok: false, scanConfigured: false };
  }
  return (await response.json()) as ScanHealth;
}

export async function fileToBase64(file: File): Promise<{ base64: string; mediaType: string }> {
  const base64 = await new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res((reader.result as string).split(',')[1]);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
  const mediaType = guessMediaType(file);
  return { base64, mediaType };
}
