import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  type BuyerAuthSession,
  type RequestNewCodeResult,
  type VerifyBuyerCodeResult,
  getSupabaseClientConfig,
  loadBuyerSessionFromStorage,
  requestNewBuyerCodeFromSupabase,
  signOutBuyerSession,
  verifyBuyerCodeWithSupabase,
} from '../utils/supabaseClient';

export interface AuthContextValue {
  authRequired: boolean;
  isAuthenticated: boolean;
  buyerEmail: string | null;
  session: BuyerAuthSession | null;
  verifyCode: (email: string, code?: string) => Promise<VerifyBuyerCodeResult>;
  requestNewCode: (email: string) => Promise<RequestNewCodeResult>;
  signOut: () => Promise<void>;
}

const DEFAULT_FALLBACK_AUTH_CONTEXT: AuthContextValue = {
  authRequired: false,
  isAuthenticated: true,
  buyerEmail: null,
  session: null,
  verifyCode: async () => ({ ok: true }),
  requestNewCode: async () => ({ ok: true }),
  signOut: async () => {},
};

export const AuthContext = createContext<AuthContextValue>(DEFAULT_FALLBACK_AUTH_CONTEXT);

export interface AuthProviderProps {
  children: React.ReactNode;
  forceAuthRequired?: boolean;
}

export function AuthProvider({ children, forceAuthRequired }: AuthProviderProps) {
  const config = getSupabaseClientConfig();
  const authRequired =
    typeof forceAuthRequired === 'boolean' ? forceAuthRequired : config.authRequired;

  const [session, setSession] = useState<BuyerAuthSession | null>(() =>
    loadBuyerSessionFromStorage()
  );

  const verifyCode = useCallback(
    async (email: string, code?: string): Promise<VerifyBuyerCodeResult> => {
      const result = await verifyBuyerCodeWithSupabase(email, code);
      if (result.ok && result.session) {
        setSession(result.session);
      }
      return result;
    },
    []
  );

  const requestNewCode = useCallback(
    async (email: string): Promise<RequestNewCodeResult> => {
      return requestNewBuyerCodeFromSupabase(email);
    },
    []
  );

  const signOut = useCallback(async (): Promise<void> => {
    await signOutBuyerSession();
    setSession(null);
  }, []);

  const isAuthenticated = !authRequired || session !== null;
  const buyerEmail = session?.email ?? null;

  const value = useMemo<AuthContextValue>(
    () => ({
      authRequired,
      isAuthenticated,
      buyerEmail,
      session,
      verifyCode,
      requestNewCode,
      signOut,
    }),
    [authRequired, isAuthenticated, buyerEmail, session, verifyCode, requestNewCode, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
