// supabase/functions/_shared/crypto.ts
// Utilitaires cryptographiques partagés entre les Edge Functions acheteur.

export function generateSixDigitCode(): string {
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  const code = 100000 + (randomBuffer[0] % 900000);
  return String(code).padStart(6, '0');
}

export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
