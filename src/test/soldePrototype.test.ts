import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';

interface SoldeApi {
  ACCESS_CODE: string;
  KEY: string;
  STORAGE_KEY: string;
  MICRO_PER_FCFA: number;
  EUR_RATE: number;
  MICRO_PER_EUR: number;
  parseFrenchFinancialInput: (
    raw: unknown,
    options?: { allowEmpty?: boolean; currency?: 'FCFA' | 'EUR' }
  ) => { ok: boolean; value?: number; error?: string };
  exportStateJson: () => string;
  importStateJson: (rawText: string) => { ok: boolean; error?: string };
  getState: () => {
    currency: 'FCFA' | 'EUR';
    profile: string;
    incomeMicro: number;
    savingsMicro: number;
    shockMicro: number;
    goalName: string;
    goalTargetMicro: number;
    fixedItems: Array<{ id: string; label: string; amountMicro: number }>;
    lifeItems: Array<{ id: string; label: string; amountMicro: number }>;
  };
}

declare global {
  interface Window {
    SOLDE_API: SoldeApi;
  }
}

describe('Produit Fil Rouge SOLDE (docs/examples/solde/index.html)', () => {
  const htmlPath = path.resolve(process.cwd(), 'docs/examples/solde/index.html');
  let htmlContent: string;

  function bootSolde() {
    document.documentElement.className = '';
    htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    document.documentElement.innerHTML = htmlContent;

    const scripts = Array.from(document.querySelectorAll('script'));
    scripts.forEach((script) => {
      const code = script.textContent || '';
      if (code.trim()) {
        const fn = new Function(code);
        fn();
      }
    });
  }

  beforeEach(() => {
    localStorage.clear();
    bootSolde();
  });

  describe('1. Verrou synchrone .gate (R9)', () => {
    it('verrouille le document au démarrage, rejette un mauvais code, accepte solde2026 (insensible à la casse) et reverrouille via #lockBtn', () => {
      const form = document.getElementById('gateForm') as HTMLFormElement;
      const input = document.getElementById('gateInput') as HTMLInputElement;
      const err = document.getElementById('gateErr')!;
      const lockBtn = document.getElementById('lockBtn') as HTMLButtonElement;

      // Verrouillé par défaut avant premier rendu
      expect(document.documentElement.classList.contains('locked')).toBe(true);
      expect(localStorage.getItem('solde_access')).toBeNull();
      expect(lockBtn).not.toBeNull();
      expect(lockBtn.getAttribute('aria-label')).toBe("Verrouiller l'application");
      expect(document.getElementById('btnOpenGate')).toBeNull();

      // Mauvais code rejeté
      input.value = '2026';
      form.dispatchEvent(new Event('submit', { cancelable: true }));
      expect(document.documentElement.classList.contains('locked')).toBe(true);
      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(err.classList.contains('is-visible')).toBe(true);
      expect(err.textContent).toContain("Ce code n'est pas valide");

      // Bon code en minuscules avec espaces accepté
      input.value = '  solde2026  ';
      form.dispatchEvent(new Event('submit', { cancelable: true }));
      expect(document.documentElement.classList.contains('locked')).toBe(false);
      expect(localStorage.getItem('solde_access')).toBe('ok');
      expect(input.getAttribute('aria-invalid')).toBeNull();
      expect(err.classList.contains('is-visible')).toBe(false);

      // Rechargement avec localStorage persistant -> reste déverrouillé
      bootSolde();
      expect(document.documentElement.classList.contains('locked')).toBe(false);

      // Reverrouillage via #lockBtn
      const freshLockBtn = document.getElementById('lockBtn') as HTMLButtonElement;
      freshLockBtn.click();
      expect(document.documentElement.classList.contains('locked')).toBe(true);
      expect(localStorage.getItem('solde_access')).toBeNull();
    });
  });

  describe('2. Validation financière stricte R6 (parseFrenchFinancialInput)', () => {
    it('accepte les formats français valides et rejette abc, -100, 12..3 sans jamais convertir silencieusement en 0', () => {
      const { parseFrenchFinancialInput } = window.SOLDE_API;

      expect(parseFrenchFinancialInput('250 000')).toMatchObject({ ok: true, value: 250000 });
      expect(parseFrenchFinancialInput('1\u202F250\u202F000,50')).toMatchObject({
        ok: true,
        value: 1250000.5,
      });
      expect(parseFrenchFinancialInput('381.12')).toMatchObject({ ok: true, value: 381.12 });
      expect(parseFrenchFinancialInput('0')).toMatchObject({ ok: true, value: 0 });

      expect(parseFrenchFinancialInput('abc').ok).toBe(false);
      expect(parseFrenchFinancialInput('-100').ok).toBe(false);
      expect(parseFrenchFinancialInput('12..3').ok).toBe(false);
      expect(parseFrenchFinancialInput('1 00').ok).toBe(false);

      // Vérification dans le DOM sur #inputIncome
      const incomeInput = document.getElementById('inputIncome') as HTMLInputElement;
      const incomeErr = document.getElementById('err-inputIncome')!;
      const beforeFree = document.getElementById('freeBalanceHero')!.textContent;

      incomeInput.value = 'abc';
      incomeInput.dispatchEvent(new Event('input'));

      expect(incomeInput.value).toBe('abc');
      expect(incomeInput.getAttribute('aria-invalid')).toBe('true');
      expect(incomeErr.getAttribute('role')).toBe('alert');
      expect(incomeErr.classList.contains('is-visible')).toBe(true);
      expect(window.SOLDE_API.getState().incomeMicro).toBe(250000 * 1000000);
      expect(document.getElementById('freeBalanceHero')!.textContent).toBe(beforeFree);
      expect(document.getElementById('freeBalanceHero')!.textContent).not.toContain('NaN');

      // Vérification négatif
      incomeInput.value = '-100';
      incomeInput.dispatchEvent(new Event('input'));
      expect(incomeInput.value).toBe('-100');
      expect(incomeInput.getAttribute('aria-invalid')).toBe('true');
      expect(incomeErr.textContent).toContain('négatif');
      expect(window.SOLDE_API.getState().incomeMicro).toBe(250000 * 1000000);

      // Correction vers une valeur valide lève l'erreur et met à jour le calcul
      incomeInput.value = '300 000';
      incomeInput.dispatchEvent(new Event('input'));
      expect(incomeInput.getAttribute('aria-invalid')).toBeNull();
      expect(incomeErr.classList.contains('is-visible')).toBe(false);
      expect(window.SOLDE_API.getState().incomeMicro).toBe(300000 * 1000000);
      expect(document.getElementById('freeBalanceHero')!.textContent).toBe('60 000 FCFA');
    });
  });

  describe('3. Parité sans perte FCFA ↔ EUR (micro-FCFA)', () => {
    it('préserve exactement les montants après 5 allers-retours FCFA ↔ EUR', () => {
      const btnFCFA = document.getElementById('btnFCFA') as HTMLButtonElement;
      const btnEUR = document.getElementById('btnEUR') as HTMLButtonElement;
      const incomeInput = document.getElementById('inputIncome') as HTMLInputElement;

      const initialMicro = window.SOLDE_API.getState().incomeMicro;
      expect(initialMicro).toBe(250000 * 1000000);
      expect(incomeInput.value).toBe('250 000');

      for (let i = 0; i < 5; i++) {
        btnEUR.click();
        expect(incomeInput.value).toBe('381,12');
        expect(window.SOLDE_API.getState().incomeMicro).toBe(initialMicro);

        btnFCFA.click();
        expect(incomeInput.value).toBe('250 000');
        expect(window.SOLDE_API.getState().incomeMicro).toBe(initialMicro);
      }

      // Saisie directe en EUR puis 5 allers-retours EUR -> FCFA -> EUR
      btnEUR.click();
      incomeInput.value = '100,50';
      incomeInput.dispatchEvent(new Event('input'));
      const eurMicro = window.SOLDE_API.getState().incomeMicro;
      expect(eurMicro).toBe(Math.round(100.5 * 655957000));

      for (let i = 0; i < 5; i++) {
        btnFCFA.click();
        expect(incomeInput.value).toBe('65 924');
        btnEUR.click();
        expect(incomeInput.value).toBe('100,50');
        expect(window.SOLDE_API.getState().incomeMicro).toBe(eurMicro);
      }
    });
  });

  describe('4. Calculs des 3 profils, crash-test +40 000, score /100 et ETA', () => {
    it('calcule exactement les vecteurs standard, creator, student et crash-test +40 000', () => {
      // Profil standard par défaut
      expect(document.getElementById('freeBalanceHero')!.textContent).toBe('10 000 FCFA');
      expect(document.getElementById('scoreNumber')!.textContent).toBe('100');
      expect(document.getElementById('pctFixed')!.textContent).toBe('50%');
      expect(document.getElementById('pctLife')!.textContent).toBe('26%');
      expect(document.getElementById('pctSavings')!.textContent).toBe('20%');
      expect(document.getElementById('goalEtaPill')!.textContent).toBe('6 mois');

      // Crash-test +40 000 sur standard
      const shock40k = document.querySelector('.shock-btn[data-shock="40000"]') as HTMLButtonElement;
      shock40k.click();
      expect(document.getElementById('freeBalanceHero')!.textContent).toBe('-30 000 FCFA');
      expect(document.getElementById('scoreNumber')!.textContent).toBe('69');
      expect(document.getElementById('goalEtaPill')!.textContent).toBe('15 mois');
      expect(document.getElementById('healthPill')!.textContent).toBe('Budget dépassé');

      // Profil creator
      const creatorTab = document.querySelector('.profile-tab[data-profile="creator"]') as HTMLButtonElement;
      creatorTab.click();
      expect(document.getElementById('freeBalanceHero')!.textContent).toBe('15 000 FCFA');
      expect(document.getElementById('scoreNumber')!.textContent).toBe('100');
      expect(document.getElementById('goalEtaPill')!.textContent).toBe('3 mois');
      expect(document.getElementById('dailyPill')!.textContent).toBe('500 FCFA / jour');

      // Profil student
      const studentTab = document.querySelector('.profile-tab[data-profile="student"]') as HTMLButtonElement;
      studentTab.click();
      expect(document.getElementById('freeBalanceHero')!.textContent).toBe('0 FCFA');
      expect(document.getElementById('scoreNumber')!.textContent).toBe('100');
      expect(document.getElementById('goalEtaPill')!.textContent).toBe('8 mois');
    });
  });

  describe('5. Sauvegarde portable Export / Import JSON (R7 b/c)', () => {
    it('exporte un JSON valide, importe un budget valide et rejette un JSON corrompu sans écraser l’état', () => {
      const exportBtn = document.getElementById('btnExportJson') as HTMLButtonElement;
      const importBtn = document.getElementById('btnImportJson') as HTMLButtonElement;
      const importInput = document.getElementById('inputImportJson') as HTMLInputElement;

      expect(exportBtn).not.toBeNull();
      expect(importBtn).not.toBeNull();
      expect(importInput).not.toBeNull();

      // Export JSON
      const exported = window.SOLDE_API.exportStateJson();
      const parsed = JSON.parse(exported);
      expect(parsed.app).toBe('SOLDE');
      expect(parsed.incomeMicro).toBe(250000 * 1000000);
      expect(Array.isArray(parsed.fixedItems)).toBe(true);
      expect(Array.isArray(parsed.lifeItems)).toBe(true);

      // Import JSON valide modifié
      const customPayload = JSON.stringify({
        currency: 'FCFA',
        profile: 'creator',
        activeRule: 'custom',
        incomeMicro: 600000 * 1000000,
        fixedItems: [{ id: 'f1', label: 'Studio', amountMicro: 200000 * 1000000 }],
        lifeItems: [{ id: 'l1', label: 'Vie', amountMicro: 150000 * 1000000 }],
        savingsMicro: 150000 * 1000000,
        shockMicro: 0,
        goalName: 'MacBook Pro',
        goalTargetMicro: 900000 * 1000000,
      });

      const okRes = window.SOLDE_API.importStateJson(customPayload);
      expect(okRes.ok).toBe(true);
      expect(document.getElementById('freeBalanceHero')!.textContent).toBe('100 000 FCFA');
      expect(document.getElementById('goalEtaPill')!.textContent).toBe('6 mois');
      expect((document.getElementById('inputGoalName') as HTMLInputElement).value).toBe('MacBook Pro');

      // Import JSON invalide (syntaxe cassée + valeurs négatives) -> rejeté et état préservé
      expect(window.SOLDE_API.importStateJson('{broken json').ok).toBe(false);
      expect(
        window.SOLDE_API.importStateJson(
          JSON.stringify({ incomeMicro: -100, fixedItems: [], lifeItems: [] })
        ).ok
      ).toBe(false);
      expect(window.SOLDE_API.getState().incomeMicro).toBe(600000 * 1000000);
      expect(document.getElementById('freeBalanceHero')!.textContent).toBe('100 000 FCFA');
    });
  });

  describe('6. Hygiène CSS & Sécurité (.mobile-dock, absence de pricing_access et overflow-x: hidden)', () => {
    it('corrige .mobile-dock à 12px, supprime toute trace de pricing_access et évite overflow-x: hidden sur html/body', () => {
      expect(htmlContent).toContain('bottom: calc(12px + env(safe-area-inset-bottom, 0px));');
      expect(htmlContent).not.toContain('bottom: calc(60px + env(safe-area-inset-bottom, 0px));');
      expect(htmlContent).not.toContain('pricing_access');
      expect(htmlContent).not.toMatch(/html\s*,?\s*body\s*\{[^}]*overflow-x\s*:\s*hidden/i);
    });
  });
});
