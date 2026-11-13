import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { App } from '../app/App';
import {
  BUYER_AUTH_SESSION_STORAGE_KEY,
  MSG_BUYER_NOT_FOUND,
  MSG_INVALID_CODE,
  loadBuyerSessionFromStorage,
} from '../utils/supabaseClient';

describe('Mission 11 : BuyerAuthGate & Authentification Acheteur Chariow (E-mail + Code à 6 chiffres)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("affiche un formulaire de connexion simple (E-mail d'achat + Code à 6 chiffres + bouton Se connecter) sans bouton de contournement public", () => {
    render(<App forceAuthRequired={true} />);

    expect(screen.getByTestId('buyer-auth-gate')).toBeInTheDocument();
    expect(screen.getByText('Connexion à ton espace')).toBeInTheDocument();

    const emailInput = screen.getByLabelText(/E-mail d'achat/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('placeholder', 'ton-email@gmail.com');

    expect(screen.getByLabelText(/Code d'accès \(6 chiffres\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Renvoyer un code par mail/i })).toBeInTheDocument();
    expect(screen.queryByText(/Accès Patron/i)).not.toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /^Se connecter$/i })
    ).toBeInTheDocument();
  });

  it("rejette un e-mail non acheteur avec le message d'erreur explicite Chariow", async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: false, error: MSG_BUYER_NOT_FOUND }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    render(<App forceAuthRequired={true} />);

    const emailInput = screen.getByLabelText(/E-mail d'achat/i);
    const codeInput = screen.getByLabelText(/Code d'accès \(6 chiffres\)/i);
    const submitBtn = screen.getByRole('button', { name: /^Se connecter$/i });

    fireEvent.change(emailInput, { target: { value: 'inconnu@gmail.com' } });
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(MSG_BUYER_NOT_FOUND);
    });
    expect(screen.getByTestId('buyer-auth-gate')).toBeInTheDocument();
  });

  it("rejette un code incomplet sans appeler le serveur", async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    render(<App forceAuthRequired={true} />);

    fireEvent.change(screen.getByLabelText(/E-mail d'achat/i), {
      target: { value: 'eleve@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText(/Code d'accès \(6 chiffres\)/i), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^Se connecter$/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(MSG_INVALID_CODE);
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("déverrouille l'accès avec e-mail + code à 6 chiffres, persiste la session et masque toute déconnexion", async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          ok: true,
          email: 'eleve@gmail.com',
          session: {
            access_token: 'sb-jwt-token-valid',
            refresh_token: 'sb-refresh-token-valid',
            user: {
              id: 'uuid-buyer-01',
              email: 'eleve@gmail.com',
            },
          },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    const { unmount } = render(<App forceAuthRequired={true} />);

    fireEvent.change(screen.getByLabelText(/E-mail d'achat/i), {
      target: { value: '  Eleve@Gmail.com ' },
    });
    fireEvent.change(screen.getByLabelText(/Code d'accès \(6 chiffres\)/i), {
      target: { value: '654321' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^Se connecter$/i }));

    await waitFor(() => {
      expect(screen.queryByTestId('buyer-auth-gate')).not.toBeInTheDocument();
    });

    // Vérifie que la session est persistée dans localStorage
    const storedSession = loadBuyerSessionFromStorage();
    expect(storedSession).not.toBeNull();
    expect(storedSession?.email).toBe('eleve@gmail.com');
    expect(storedSession?.accessToken).toBe('sb-jwt-token-valid');
    expect(window.localStorage.getItem(BUYER_AUTH_SESSION_STORAGE_KEY)).toBeTruthy();

    // Vérifie l'indicateur discret de l'e-mail connecté et l'absence totale de bouton Se déconnecter (session permanente pour l'élève)
    expect(screen.getByTestId('sidebar-buyer-session')).toHaveTextContent('eleve@gmail.com');
    expect(screen.queryByRole('button', { name: /Se déconnecter/i })).not.toBeInTheDocument();

    // Vérifie que la session reste ouverte au rechargement de l'application
    unmount();
    render(<App forceAuthRequired={true} />);
    expect(screen.queryByTestId('buyer-auth-gate')).not.toBeInTheDocument();
    expect(screen.getByTestId('sidebar-buyer-session')).toHaveTextContent('eleve@gmail.com');
    expect(screen.queryByRole('button', { name: /Se déconnecter/i })).not.toBeInTheDocument();
  });

  it('fournit la migration SQL Supabase avec RLS et les Edge Functions requises', () => {
    const rootDir = process.cwd();
    const migrationPath = path.join(
      rootDir,
      'supabase',
      'migrations',
      '20261112000001_buyer_access_auth.sql'
    );
    const webhookFnPath = path.join(
      rootDir,
      'supabase',
      'functions',
      'chariow-webhook',
      'index.ts'
    );
    const verifyFnPath = path.join(
      rootDir,
      'supabase',
      'functions',
      'verify-buyer-code',
      'index.ts'
    );
    const envExamplePath = path.join(rootDir, '.env.example');

    const sharedEmailPath = path.join(
      rootDir,
      'supabase',
      'functions',
      '_shared',
      'sendBuyerEmail.ts'
    );

    expect(fs.existsSync(migrationPath)).toBe(true);
    expect(fs.existsSync(webhookFnPath)).toBe(true);
    expect(fs.existsSync(verifyFnPath)).toBe(true);
    expect(fs.existsSync(sharedEmailPath)).toBe(true);
    expect(fs.existsSync(envExamplePath)).toBe(true);

    const sql = fs.readFileSync(migrationPath, 'utf-8');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS public.authorized_buyers');
    expect(sql).toContain('ALTER TABLE public.authorized_buyers ENABLE ROW LEVEL SECURITY;');
    expect(sql).toContain('public.register_buyer_with_code');

    const verifySource = fs.readFileSync(verifyFnPath, 'utf-8');
    expect(verifySource).toContain(MSG_BUYER_NOT_FOUND);
    expect(verifySource).toContain('cleanCode.length !== 6');

    const emailSource = fs.readFileSync(sharedEmailPath, 'utf-8');
    expect(emailSource).toContain('Bonjour Boss,');
    expect(emailSource).not.toContain('Bonjour Patron Studio');
    expect(emailSource).toContain('smtp.gmail.com');
  });
});
