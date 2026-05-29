import { describe, expect, it } from 'vitest';
import { scanErrorMessage } from './scan-api';

describe('scanErrorMessage', () => {
  it('reads string errors from the scan function', () => {
    expect(scanErrorMessage({ error: 'Server not configured' })).toBe('Server not configured');
  });

  it('reads nested message errors', () => {
    expect(scanErrorMessage({ error: { message: 'Rate limited' } })).toBe('Rate limited');
  });

  it('falls back to a generic message', () => {
    expect(scanErrorMessage({})).toBe('API-fel');
  });
});
