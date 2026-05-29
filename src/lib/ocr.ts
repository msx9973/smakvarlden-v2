import Tesseract, { type LoggerMessage } from 'tesseract.js';

export async function extractTextFromInvoice(
  imageUrl: string,
  logger?: (message: LoggerMessage) => void
): Promise<string> {
  const {
    data: { text },
  } = await Tesseract.recognize(imageUrl, 'swe', {
    logger,
  });

  return text;
}
