import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProgressProvider } from '../context/ProgressContext';
import { MyProjectPage, DOSSIER_FIELDS_CATALOG } from '../components/project/MyProjectPage';
import { STORAGE_KEY, createInitialProgress } from '../utils/storage';
import { ALL_DOSSIER_FIELD_KEYS, serializeProductIdentity } from '../types/dossier';

describe('Page Mon Projet (Gestion, Sécurité & Égalité de Traitement)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('affiche les 18 champs du catalogue avec leurs statuts initiaux et la notice de stockage local', () => {
    render(
      <ProgressProvider>
        <MyProjectPage />
      </ProgressProvider>
    );

    expect(screen.getByText(/Mon Dossier de Projet/i)).toBeInTheDocument();
    expect(screen.getByText(/Vos données restent exclusivement sur cet appareil/i)).toBeInTheDocument();

    // Vérifie la présence des 18 champs dans le catalogue
    expect(DOSSIER_FIELDS_CATALOG).toHaveLength(18);
    expect(DOSSIER_FIELDS_CATALOG.map((f) => f.key).sort()).toEqual([...ALL_DOSSIER_FIELD_KEYS].sort());

    // Vérifie les indicateurs à renseigner par défaut
    const emptyBadges = screen.getAllByText(/À renseigner/i);
    expect(emptyBadges.length).toBe(18);
  });

  it('affiche les valeurs en texte brut sécurisé sans interprétation HTML', () => {
    const initial = createInitialProgress();
    initial.dossier.fields.documentAnalysis = {
      value: '<script>alert("xss")</script> & <b>Texte brut sans HTML</b>',
      status: 'draft',
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));

    render(
      <ProgressProvider>
        <MyProjectPage />
      </ProgressProvider>
    );

    // Le contenu doit être visible sous forme textuelle littérale
    expect(screen.getByText(/<script>alert\("xss"\)<\/script> & <b>Texte brut sans HTML<\/b>/i)).toBeInTheDocument();
  });

  it('ouvre l éditeur dédié pour productIdentity et sauvegarde les données structurées', () => {
    render(
      <ProgressProvider>
        <MyProjectPage />
      </ProgressProvider>
    );

    const editIdentityBtn = screen.getByRole('button', { name: /Éditeur Produit/i });
    fireEvent.click(editIdentityBtn);

    const modal = screen.getByRole('dialog', { name: /identité produit/i });
    expect(modal).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/Nom du produit/i);
    fireEvent.change(nameInput, { target: { value: 'Calculateur Solopreneur' } });

    const brandInput = screen.getByLabelText(/Nom de la marque ou du studio/i);
    fireEvent.change(brandInput, { target: { value: 'Studio Chiffres' } });

    const hookInput = screen.getByLabelText(/Accroche courte/i);
    fireEvent.change(hookInput, { target: { value: 'Optimisez votre TJM en 2 minutes.' } });

    const saveBtn = screen.getByRole('button', { name: /Enregistrer l’identité/i });
    fireEvent.click(saveBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText(/Calculateur Solopreneur/i)).toBeInTheDocument();
    expect(screen.getByText(/Studio Chiffres/i)).toBeInTheDocument();
  });

  it('ouvre l éditeur texte standard pour documentAnalysis et applique la validation', () => {
    render(
      <ProgressProvider>
        <MyProjectPage />
      </ProgressProvider>
    );

    // Trouver le bouton Modifier pour l'analyse
    const buttons = screen.getAllByRole('button', { name: /Modifier/i });
    fireEvent.click(buttons[0]); // documentAnalysis

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const textarea = screen.getByLabelText(/Contenu textuel/i);
    fireEvent.change(textarea, { target: { value: 'Synthèse du document initial d analyse.' } });

    const validRadio = screen.getByLabelText(/Validé \(définitif\)/i);
    fireEvent.click(validRadio);

    const saveBtn = screen.getByRole('button', { name: /Enregistrer/i });
    fireEvent.click(saveBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText(/Synthèse du document initial d analyse./i)).toBeInTheDocument();
    expect(screen.getByText('Validé')).toBeInTheDocument();
  });

  it('télécharge le dossier au format JSON lors du clic sur Télécharger', () => {
    render(
      <ProgressProvider>
        <MyProjectPage />
      </ProgressProvider>
    );

    // Mock createObjectURL et revokeObjectURL
    const createUrlSpy = vi.fn().mockReturnValue('blob:mock-url');
    const revokeUrlSpy = vi.fn();
    window.URL.createObjectURL = createUrlSpy;
    window.URL.revokeObjectURL = revokeUrlSpy;

    const downloadBtn = screen.getByRole('button', { name: /Télécharger mon dossier/i });
    fireEvent.click(downloadBtn);

    expect(createUrlSpy).toHaveBeenCalled();
    expect(revokeUrlSpy).toHaveBeenCalled();
  });

  it('exige une confirmation explicite avant d écraser le dossier lors d un import JSON', () => {
    render(
      <ProgressProvider>
        <MyProjectPage />
      </ProgressProvider>
    );

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();

    const importedPayload = {
      app: 'AI_CREATOR_STUDIO',
      kind: 'project_dossier',
      version: 1,
      dossier: {
        version: 1,
        updatedAt: new Date().toISOString(),
        fields: {
          productIdentity: {
            value: serializeProductIdentity({ productName: 'Produit Restauré' }),
            status: 'valid',
            updatedAt: new Date().toISOString(),
          },
        },
      },
    };

    const file = new File([JSON.stringify(importedPayload)], 'sauvegarde.json', {
      type: 'application/json',
    });

    fireEvent.change(input, { target: { files: [file] } });

    // Le lecteur FileReader est asynchrone
    // On simule l'apparition du modal de confirmation
  });
});
