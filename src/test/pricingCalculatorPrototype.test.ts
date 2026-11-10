import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Prototype Calculateur de Prix & Rentabilité (docs/examples/pricing-calculator/index.html)', () => {
  const htmlPath = path.resolve(process.cwd(), 'docs/examples/pricing-calculator/index.html');
  let htmlContent: string;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    // Inject HTML content into JSDOM document
    document.documentElement.innerHTML = htmlContent;

    // Execute scripts contained in the HTML
    const scripts = Array.from(document.querySelectorAll('script'));
    scripts.forEach((script) => {
      const code = script.textContent || '';
      if (code.trim()) {
        const fn = new Function(code);
        fn();
      }
    });
  });

  describe('1. Vecteurs de Référence Arithmétiques (100% Source Fidelity)', () => {
    it('calcule exactement le vecteur de référence FCFA', () => {
      // S'assurer que le mode FCFA est actif et charger l'exemple
      const bFCFA = document.getElementById('bFCFA') as HTMLButtonElement;
      bFCFA.click();
      const exampleBtn = document.getElementById('example') as HTMLButtonElement;
      exampleBtn.click();

      const price = document.getElementById('price')!.textContent?.trim();
      const sub = document.getElementById('sub')!.textContent?.trim();
      const profit = document.getElementById('profit')!.textContent?.trim();

      expect(price).toBe('10 368 FCFA');
      expect(sub).toContain('Coût de revient total : 6 500 FCFA');
      expect(profit).toBe('3 250 FCFA');

      // Vérification des détails de coûts
      expect(document.getElementById('vMat')!.textContent).toBe('4 500 FCFA');
      expect(document.getElementById('vTime')!.textContent).toBe('2 000 FCFA');
      expect(document.getElementById('vPlat')!.textContent).toBe('618 FCFA');
      expect(document.getElementById('vTax')!.textContent).toBe('0 FCFA');
      expect(document.getElementById('vTot')!.textContent).toBe('7 118 FCFA');
    });

    it('calcule exactement le vecteur de référence EUR (€)', () => {
      // Activer EUR et charger l'exemple EUR
      const bEUR = document.getElementById('bEUR') as HTMLButtonElement;
      bEUR.click();
      const exampleBtn = document.getElementById('example') as HTMLButtonElement;
      exampleBtn.click();

      const price = document.getElementById('price')!.textContent?.trim();
      const sub = document.getElementById('sub')!.textContent?.trim();
      const profit = document.getElementById('profit')!.textContent?.trim();

      expect(price).toBe('28,68 €');
      expect(sub).toContain('Coût de revient total : 18,00 €');
      expect(profit).toBe('9,00 €');

      // Vérification des détails de coûts
      expect(document.getElementById('vMat')!.textContent).toBe('8,00 €');
      expect(document.getElementById('vTime')!.textContent).toBe('10,00 €');
      expect(document.getElementById('vPlat')!.textContent).toBe('1,68 €');
      expect(document.getElementById('vTax')!.textContent).toBe('0,00 €');
      expect(document.getElementById('vTot')!.textContent).toBe('19,68 €');
    });
  });

  describe('2. Matrice de Validation des Entrées (Parseur Strict et Erreurs Locales)', () => {
    it('accepte les séparateurs de milliers standards (espace) et décimaux (, et .)', () => {
      const bFCFA = document.getElementById('bFCFA') as HTMLButtonElement;
      bFCFA.click();
      const matInput = document.getElementById('material') as HTMLInputElement;

      // Groupement de milliers valide en FCFA
      matInput.value = '1 250 000';
      matInput.dispatchEvent(new Event('input'));
      expect(matInput.getAttribute('aria-invalid')).toBeNull();
      expect(document.getElementById('err-material')!.textContent).toBe('');

      // Basculer en EUR et tester avec virgule et point
      const bEUR = document.getElementById('bEUR') as HTMLButtonElement;
      bEUR.click();

      matInput.value = '12,50';
      matInput.dispatchEvent(new Event('input'));
      expect(matInput.getAttribute('aria-invalid')).toBeNull();

      matInput.value = '12.50';
      matInput.dispatchEvent(new Event('input'));
      expect(matInput.getAttribute('aria-invalid')).toBeNull();
    });

    it('rejette les groupements de milliers mal formés, les chaînes corrompues et les négatifs', () => {
      const matInput = document.getElementById('material') as HTMLInputElement;
      const errMat = document.getElementById('err-material')!;

      const invalidValues = ['1 00', '12 34', '1 2 3', '12abc', '12..5', '-5'];
      invalidValues.forEach((val) => {
        matInput.value = val;
        matInput.dispatchEvent(new Event('input'));
        expect(matInput.getAttribute('aria-invalid')).toBe('true');
        expect(errMat.textContent).not.toBe('');
        // Résultat suspendu
        expect(document.getElementById('price')!.textContent).toBe('—');
      });
    });

    it('autorise explicitement 0 sur les champs licites (packaging, shipping, margin, taxes)', () => {
      const marginInput = document.getElementById('margin') as HTMLInputElement;
      marginInput.value = '0';
      marginInput.dispatchEvent(new Event('input'));

      expect(marginInput.getAttribute('aria-invalid')).toBeNull();
      expect(document.getElementById('err-margin')!.textContent).toBe('');
      // Avec marge = 0%, le calcul fonctionne et le bénéfice est 0 FCFA
      expect(document.getElementById('profit')!.textContent).toBe('0 FCFA');
    });

    it('bloque globalement si le cumul des frais et taxes atteint ou dépasse 100%', () => {
      const pFee = document.getElementById('pFee') as HTMLInputElement;
      const sTax = document.getElementById('sTax') as HTMLInputElement;
      const globalAlert = document.getElementById('globalAlert')!;

      pFee.value = '80';
      sTax.value = '20'; // total = 100%
      pFee.dispatchEvent(new Event('input'));
      sTax.dispatchEvent(new Event('input'));

      expect(globalAlert.style.display).toBe('block');
      expect(globalAlert.textContent).toContain('supérieur ou égal à 100 %');
      expect(document.getElementById('price')!.textContent).toBe('—');
      expect(document.getElementById('profit')!.textContent).toBe('—');

      // Ni pFee ni sTax ne doivent être marqués comme champ individuellement invalide
      expect(pFee.getAttribute('aria-invalid')).toBeNull();
      expect(sTax.getAttribute('aria-invalid')).toBeNull();
    });

    it('bloque globalement si le coût de revient unitaire est nul ou négatif', () => {
      const matInput = document.getElementById('material') as HTMLInputElement;
      const packInput = document.getElementById('packaging') as HTMLInputElement;
      const shipInput = document.getElementById('shipping') as HTMLInputElement;
      const minInput = document.getElementById('minutes') as HTMLInputElement;
      const globalAlert = document.getElementById('globalAlert')!;

      matInput.value = '0';
      packInput.value = '0';
      shipInput.value = '0';
      minInput.value = '0';
      matInput.dispatchEvent(new Event('input'));

      expect(globalAlert.style.display).toBe('block');
      expect(globalAlert.textContent).toContain('coût de revient unitaire est nul');
      expect(document.getElementById('price')!.textContent).toBe('—');
    });

    it('réinitialise proprement les erreurs lors du clic sur "Vider pour mon produit" sans avalanche d’erreurs rouges', () => {
      const clearBtn = document.getElementById('clear') as HTMLButtonElement;
      clearBtn.click();

      // Aucun champ ne doit afficher d'erreur rouge
      const inputs = Array.from(document.querySelectorAll('.field input'));
      inputs.forEach((input) => {
        expect(input.getAttribute('aria-invalid')).toBeNull();
      });

      const errDivs = Array.from(document.querySelectorAll('.field-err'));
      errDivs.forEach((div) => {
        expect(div.textContent).toBe('');
      });

      expect(document.getElementById('price')!.textContent).toBe('—');
      expect(document.getElementById('sub')!.textContent).toContain('Remplis les champs ci-contre');
    });
  });

  describe('3. Cycle de Vie Devise & Précision Canonique (1 EUR = 655,957 FCFA)', () => {
    it('convertit exactement les montants sans dérive d’arrondi sur des allers-retours successifs', () => {
      const bFCFA = document.getElementById('bFCFA') as HTMLButtonElement;
      const bEUR = document.getElementById('bEUR') as HTMLButtonElement;
      const exampleBtn = document.getElementById('example') as HTMLButtonElement;

      // Charger l'exemple FCFA : material = 3 500 FCFA
      bFCFA.click();
      exampleBtn.click();

      const matInput = document.getElementById('material') as HTMLInputElement;
      expect(matInput.value).toBe('3 500');

      // Basculer vers EUR : 3500 / 655.957 = 5.3357... -> 5,34 €
      bEUR.click();
      expect(matInput.value).toBe('5,34');

      // Revenir vers FCFA immédiatement : la valeur canonique interne restaure 3 500 FCFA sans dérive
      bFCFA.click();
      expect(matInput.value).toBe('3 500');

      // Re-basculer vers EUR -> 5,34 €
      bEUR.click();
      expect(matInput.value).toBe('5,34');
      bFCFA.click();
      expect(matInput.value).toBe('3 500');
    });

    it('met à jour la représentation canonique lors d’une saisie manuelle dans une devise', () => {
      const bFCFA = document.getElementById('bFCFA') as HTMLButtonElement;
      const bEUR = document.getElementById('bEUR') as HTMLButtonElement;
      const matInput = document.getElementById('material') as HTMLInputElement;

      bEUR.click();
      matInput.value = '6,00';
      matInput.dispatchEvent(new Event('input'));

      // 6.00 EUR * 655.957 = 3935.742 -> arrondi à 3 936 FCFA
      bFCFA.click();
      expect(matInput.value).toBe('3 936');

      // Retour en EUR -> 6,00 €
      bEUR.click();
      expect(matInput.value).toBe('6,00');
    });

    it('bloque le basculement de devise si une erreur de saisie est présente', () => {
      const bEUR = document.getElementById('bEUR') as HTMLButtonElement;
      const matInput = document.getElementById('material') as HTMLInputElement;
      const formAlert = document.getElementById('formAlert')!;

      // Saisir une valeur corrompue
      matInput.value = '12abc';
      matInput.dispatchEvent(new Event('input'));

      // Tenter de basculer vers EUR
      bEUR.click();

      // Le basculement doit être bloqué : la devise reste FCFA
      expect(document.getElementById('bFCFA')!.className).toBe('on');
      expect(document.getElementById('bEUR')!.className).not.toBe('on');
      expect(formAlert.style.display).toBe('block');
      expect(formAlert.textContent).toContain('Corrige les erreurs de saisie avant de changer de devise');
    });
  });

  describe('4. Cycle de Verrouillage (.gate) et Persistance RAM', () => {
    it('gère le verrouillage initial, le refus de mauvais code et le déverrouillage par CREATOR2026', () => {
      const form = document.getElementById('gateForm') as HTMLFormElement;
      const input = document.getElementById('gateInput') as HTMLInputElement;
      const err = document.getElementById('gateErr')!;
      const lockBtn = document.getElementById('lockBtn') as HTMLButtonElement;

      // Par défaut, l'attribut locked est présent sur html si localStorage n'a pas pricing_access
      expect(document.documentElement.classList.contains('locked')).toBe(true);

      // Soumettre un mauvais code
      input.value = 'WRONGCODE';
      form.dispatchEvent(new Event('submit'));

      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(err.textContent).toContain("Ce code n'est pas valide");
      expect(document.documentElement.classList.contains('locked')).toBe(true);

      // Soumettre le bon code
      input.value = 'CREATOR2026';
      form.dispatchEvent(new Event('submit'));

      expect(document.documentElement.classList.contains('locked')).toBe(false);
      expect(localStorage.getItem('pricing_access')).toBe('granted');

      // Cliquer sur le bouton Verrouiller
      lockBtn.click();
      expect(document.documentElement.classList.contains('locked')).toBe(true);
      expect(localStorage.getItem('pricing_access')).toBeNull();
    });

    it('ne stocke aucune donnée métier dans localStorage ou sessionStorage (100% volatile RAM)', () => {
      const exampleBtn = document.getElementById('example') as HTMLButtonElement;
      exampleBtn.click();

      expect(sessionStorage.length).toBe(0);
      // Seule la clé pricing_access peut exister dans localStorage
      for (let i = 0; i < localStorage.length; i++) {
        expect(localStorage.key(i)).toBe('pricing_access');
      }
    });
  });
});
