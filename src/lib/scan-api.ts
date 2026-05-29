const SCAN_URL = import.meta.env.VITE_SCAN_URL ?? '/.netlify/functions/scan';

export interface ScanRequest {
  type: 'invoice' | 'recipe';
  base64: string;
  mediaType: string;
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
    if (response.status === 404) {
      throw new Error(
        'Skanningstjänsten hittades inte. Kör npm run dev:netlify i stället för npm run dev när du testar skanning lokalt.'
      );
    }
    throw new Error(`Skanningstjänsten svarade fel (${response.status}).`);
  }

  const data: unknown = await response.json();
  if (!response.ok) throw new Error(scanErrorMessage(data));
  return data;
}

export async function fileToBase64(file: File): Promise<{ base64: string; mediaType: string }> {
  const base64 = await new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res((reader.result as string).split(',')[1]);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
  const isPdf = file.type === 'application/pdf';
  const mediaType = isPdf ? 'application/pdf' : file.type;
  return { base64, mediaType };
}
