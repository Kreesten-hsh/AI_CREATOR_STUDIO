export const BUYER_AUTH_SESSION_STORAGE_KEY = 'ai_creator_studio_buyer_session_v1';

export const MSG_BUYER_NOT_FOUND =
  "Aucun achat trouvé avec cette adresse e-mail. Utilise l'adresse e-mail renseignée lors de ton achat sur Chariow.";
export const MSG_CODE_ALREADY_USED =
  "Ce code à usage unique a déjà été utilisé. Contacte aicreatorstudio.support@gmail.com si tu changes d'appareil.";
export const MSG_INVALID_CODE =
  "Code incorrect. Vérifie le code à 6 chiffres reçu dans ton e-mail d'achat.";
export const MSG_RESEND_CONFIRMATION =
  "Si un achat est associé à cet e-mail, un nouveau code à usage unique vient de t'être envoyé.";

export interface BuyerAuthSession {
  accessToken: string;
  refreshToken: string;
  email: string;
  userId: string;
  authenticatedAt: string;
  expiresAt?: number;
}

export interface VerifyBuyerCodeResult {
  ok: boolean;
  session?: BuyerAuthSession;
  error?: string;
}

export interface RequestNewCodeResult {
  ok: boolean;
  message?: string;
  error?: string;
}

export interface SupabaseClientConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  authRequired: boolean;
}

export function normalizeBuyerEmail(rawEmail: string): string {
  return rawEmail.trim().toLowerCase();
}

export function normalizeSixDigitCode(rawCode: string): string {
  return rawCode.replace(/\D+/g, '').slice(0, 6);
}

export function getSupabaseClientConfig(): SupabaseClientConfig {
  const env = import.meta.env ?? {};
  const isTestEnv = env.MODE === 'test' || Boolean(env.VITEST);
  const isDevEnv = Boolean(env.DEV);

  const supabaseUrl = typeof env.VITE_SUPABASE_URL === 'string' ? env.VITE_SUPABASE_URL.trim() : '';
  const supabaseAnonKey =
    typeof env.VITE_SUPABASE_ANON_KEY === 'string' ? env.VITE_SUPABASE_ANON_KEY.trim() : '';

  let forceLoginPreview = false;
  let isLocalhostEnv = false;

  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      forceLoginPreview = params.get('login') === '1' || params.get('preview_auth') === '1';
      const hostname = window.location?.hostname ?? '';
      isLocalhostEnv =
        hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
    } catch {
      // Ignore URL access errors
    }
  }

  // En local (localhost / npm run dev) et dans Vitest : vous (le Patron) travaillez directement
  // sans être bloqué par l'authentification (sauf si vous ajoutez ?login=1 pour voir le formulaire).
  // En production publique : l'authentification acheteur est active.
  let authRequired: boolean;
  if (forceLoginPreview) {
    authRequired = true;
  } else if (isTestEnv || isDevEnv || isLocalhostEnv) {
    authRequired = false;
  } else {
    authRequired = env.VITE_AUTH_REQUIRED !== 'false';
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    authRequired,
  };
}

export function loadBuyerSessionFromStorage(): BuyerAuthSession | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(BUYER_AUTH_SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<BuyerAuthSession> | null;
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof parsed.email !== 'string' ||
      !parsed.email.includes('@') ||
      typeof parsed.accessToken !== 'string' ||
      parsed.accessToken.length === 0
    ) {
      return null;
    }

    if (typeof parsed.expiresAt === 'number' && parsed.expiresAt * 1000 < Date.now()) {
      window.localStorage.removeItem(BUYER_AUTH_SESSION_STORAGE_KEY);
      return null;
    }

    return {
      accessToken: parsed.accessToken,
      refreshToken: typeof parsed.refreshToken === 'string' ? parsed.refreshToken : '',
      email: normalizeBuyerEmail(parsed.email),
      userId: typeof parsed.userId === 'string' ? parsed.userId : 'buyer',
      authenticatedAt:
        typeof parsed.authenticatedAt === 'string'
          ? parsed.authenticatedAt
          : new Date().toISOString(),
      ...(typeof parsed.expiresAt === 'number' ? { expiresAt: parsed.expiresAt } : {}),
    };
  } catch {
    return null;
  }
}

export function saveBuyerSessionToStorage(session: BuyerAuthSession): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    window.localStorage.setItem(BUYER_AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
    return true;
  } catch {
    return false;
  }
}

export function clearBuyerSessionFromStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.removeItem(BUYER_AUTH_SESSION_STORAGE_KEY);
  } catch {
    // Ignore storage removal errors in restricted environments
  }
}

export const DEFAULT_SUPABASE_URL = 'https://itmcmzohnjfrkymkcrmj.supabase.co';

function resolveFunctionEndpoint(functionName: 'verify-buyer-code' | 'request-new-code'): {
  url: string;
  headers: Record<string, string>;
} {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseClientConfig();
  const effectiveBaseUrl = (supabaseUrl || DEFAULT_SUPABASE_URL).replace(/\/$/, '');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (supabaseAnonKey) {
    headers.apikey = supabaseAnonKey;
    headers.Authorization = `Bearer ${supabaseAnonKey}`;
  }

  return {
    url: `${effectiveBaseUrl}/functions/v1/${functionName}`,
    headers,
  };
}

export async function verifyBuyerCodeWithSupabase(
  rawEmail: string,
  rawCode = ''
): Promise<VerifyBuyerCodeResult> {
  const email = normalizeBuyerEmail(rawEmail);
  const code = normalizeSixDigitCode(rawCode);

  if (!email || !email.includes('@')) {
    return {
      ok: false,
      error: MSG_BUYER_NOT_FOUND,
    };
  }

  if (code.length !== 6) {
    return {
      ok: false,
      error: MSG_INVALID_CODE,
    };
  }

  const { url, headers } = resolveFunctionEndpoint('verify-buyer-code');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, code }),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
      email?: string;
      session?: {
        access_token?: string;
        refresh_token?: string;
        expires_at?: number;
        user?: { id?: string; email?: string };
      };
    };

    if (!response.ok || !payload.ok) {
      return {
        ok: false,
        error: payload.error ?? MSG_INVALID_CODE,
      };
    }

    const session: BuyerAuthSession = {
      accessToken: payload.session?.access_token ?? `sb-token-${Date.now()}`,
      refreshToken: payload.session?.refresh_token ?? '',
      email: normalizeBuyerEmail(payload.session?.user?.email ?? payload.email ?? email),
      userId: payload.session?.user?.id ?? 'buyer-verified',
      authenticatedAt: new Date().toISOString(),
      ...(typeof payload.session?.expires_at === 'number'
        ? { expiresAt: payload.session.expires_at }
        : {}),
    };

    saveBuyerSessionToStorage(session);

    return {
      ok: true,
      session,
    };
  } catch {
    return {
      ok: false,
      error: 'Impossible de contacter le serveur de vérification. Vérifie ta connexion et réessaie.',
    };
  }
}

export async function requestNewBuyerCodeFromSupabase(
  rawEmail: string
): Promise<RequestNewCodeResult> {
  const email = normalizeBuyerEmail(rawEmail);

  if (!email || !email.includes('@')) {
    return {
      ok: false,
      error: "Saisis d'abord l'adresse e-mail utilisée lors de ton achat sur Chariow.",
    };
  }

  const { url, headers } = resolveFunctionEndpoint('request-new-code');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email }),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      message?: string;
      error?: string;
    };

    if (!response.ok || payload.error) {
      return {
        ok: false,
        error:
          payload.error ??
          "Impossible d'envoyer un nouveau code pour le moment. Réessaie dans un instant.",
      };
    }

    return {
      ok: true,
      message: payload.message ?? MSG_RESEND_CONFIRMATION,
    };
  } catch {
    return {
      ok: false,
      error: 'Impossible de contacter le serveur. Vérifie ta connexion et réessaie.',
    };
  }
}

export async function signOutBuyerSession(): Promise<void> {
  const existing = loadBuyerSessionFromStorage();
  clearBuyerSessionFromStorage();

  const { supabaseUrl, supabaseAnonKey } = getSupabaseClientConfig();
  if (supabaseUrl && supabaseAnonKey && existing?.accessToken) {
    try {
      await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${existing.accessToken}`,
        },
      });
    } catch {
      // Nettoyage local déjà effectué
    }
  }
}
