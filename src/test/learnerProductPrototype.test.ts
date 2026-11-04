import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

interface HubPrototypeAPI {
  getSerializableState: () => {
    schemaVersion: number;
    currentProfile: string;
    hoursTotal: number;
    hoursClient: number;
    hoursAdmin: number;
    checkedTasks: Record<string, boolean>;
    exportedAt: string;
  };
  importDataJsonString: (json: string) => boolean;
  selectProfile: (profileKey: string) => void;
  toggleTask: (taskId: string) => void;
  onHoursInputChange: () => void;
  resetAllProgress: () => void;
}

declare global {
  interface Window {
    __HUB_PROTOTYPE__?: HubPrototypeAPI;
  }
}

const prototypePath = path.resolve(
  __dirname,
  '../../public/demos/pdf-to-hub/apres-hub-interactif.html'
);

function mountPrototypeHTML(rawHtml: string): HubPrototypeAPI {
  const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<script>/i);
  const scriptMatch = rawHtml.match(/<script>([\s\S]*?)<\/script>/i);

  if (!bodyMatch || !scriptMatch) {
    throw new Error('Impossible d’extraire le corps ou le script du prototype HTML.');
  }

  document.body.innerHTML = bodyMatch[1];
  const executeScript = new Function(scriptMatch[1]);
  executeScript();

  if (!window.__HUB_PROTOTYPE__) {
    throw new Error('API __HUB_PROTOTYPE__ non exposée par le prototype.');
  }

  return window.__HUB_PROTOTYPE__;
}

describe('Phase 02 — Prototype représentatif de bout en bout (apres-hub-interactif.html)', () => {
  const rawHtml = fs.readFileSync(prototypePath, 'utf-8');

  beforeEach(() => {
    window.localStorage.clear();
    document.body.innerHTML = '';
    delete window.__HUB_PROTOTYPE__;
  });

  it('possède sa propre identité visuelle (Ardoise & Émeraude) et exclut la charte du Studio', () => {
    expect(rawHtml).toContain('#0F766E');
    expect(rawHtml).toContain('#0F172A');
    expect(rawHtml.toUpperCase()).not.toContain('#B63131');
    expect(rawHtml.toUpperCase()).not.toContain('#E6A0A8');
    expect(rawHtml.toUpperCase()).not.toContain('#FAF6F0');
    expect(rawHtml).not.toContain('\u2014');
  });

  it('exécute les calculs, le changement de profil et la compilation de prompt sans réseau', () => {
    const api = mountPrototypeHTML(rawHtml);

    expect(document.getElementById('res-hours')?.textContent).toBe('4.5 h');
    expect(document.getElementById('storage-status-indicator')?.textContent).toContain(
      'Sauvegarde navigateur active'
    );

    api.selectProfile('trainer');
    expect(document.getElementById('current-profile-label')?.textContent).toBe(
      'Formateur / Infopreneur'
    );
    expect(document.getElementById('res-hours')?.textContent).toBe('11.1 h');

    const totalInput = document.getElementById('hours-total') as HTMLInputElement;
    const clientInput = document.getElementById('hours-client') as HTMLInputElement;
    const adminInput = document.getElementById('hours-admin') as HTMLInputElement;

    totalInput.value = '45';
    clientInput.value = '30';
    adminInput.value = '5';
    api.onHoursInputChange();

    // (45 - 30 - 5) * 0.65 = 6.5 h
    expect(document.getElementById('res-hours')?.textContent).toBe('6.5 h');
    expect(document.getElementById('dynamic-prompt-display')?.textContent).toContain('6.5 h');
  });

  it('exporte et réimporte intégralement les données en JSON portable (profil, heures et tâches)', () => {
    const api = mountPrototypeHTML(rawHtml);

    api.selectProfile('coach');
    const totalInput = document.getElementById('hours-total') as HTMLInputElement;
    totalInput.value = '50';
    api.onHoursInputChange();
    api.toggleTask('task-1');
    api.toggleTask('task-2');
    api.toggleTask('task-3');

    const exportedJson = JSON.stringify(api.getSerializableState());
    const parsedExport = JSON.parse(exportedJson);
    expect(parsedExport.currentProfile).toBe('coach');
    expect(parsedExport.hoursTotal).toBe(50);
    expect(parsedExport.checkedTasks['task-1']).toBe(true);
    expect(document.getElementById('badge-1')?.classList.contains('unlocked')).toBe(true);

    // Réinitialisation complète puis restauration depuis le JSON portable
    api.resetAllProgress();
    expect(api.getSerializableState().currentProfile).toBe('freelance');
    expect(document.getElementById('badge-1')?.classList.contains('unlocked')).toBe(false);

    const restored = api.importDataJsonString(exportedJson);
    expect(restored).toBe(true);
    expect(api.getSerializableState().currentProfile).toBe('coach');
    expect(api.getSerializableState().hoursTotal).toBe(50);
    expect(document.getElementById('badge-1')?.classList.contains('unlocked')).toBe(true);
    expect(document.getElementById('portable-feedback')?.textContent).toContain(
      'Données JSON restaurées avec succès'
    );
  });

  it('rejette proprement un JSON malformé sans corrompre l’état en cours', () => {
    const api = mountPrototypeHTML(rawHtml);
    api.toggleTask('task-1');

    const ok = api.importDataJsonString('{invalid json');
    expect(ok).toBe(false);
    expect(api.getSerializableState().checkedTasks['task-1']).toBe(true);
    expect(document.getElementById('portable-feedback')?.textContent).toContain('invalide');
  });

  it('continue de fonctionner intégralement lorsque localStorage lève une SecurityError (ex. ouverture file:// stricte)', () => {
    const originalSetItem = Storage.prototype.setItem;
    const originalGetItem = Storage.prototype.getItem;

    Storage.prototype.setItem = () => {
      throw new DOMException('Blocked under file:// origin', 'SecurityError');
    };
    Storage.prototype.getItem = () => {
      throw new DOMException('Blocked under file:// origin', 'SecurityError');
    };

    try {
      const api = mountPrototypeHTML(rawHtml);

      expect(document.getElementById('storage-status-indicator')?.textContent).toContain(
        'Mode local : utilisez Exporter (.json) pour sauvegarder'
      );

      // Les interactions et l'export/import JSON restent 100 % opérationnels
      api.selectProfile('trainer');
      api.toggleTask('task-1');
      const snapshot = JSON.stringify(api.getSerializableState());

      api.resetAllProgress();
      expect(api.importDataJsonString(snapshot)).toBe(true);
      expect(api.getSerializableState().currentProfile).toBe('trainer');
      expect(api.getSerializableState().checkedTasks['task-1']).toBe(true);
    } finally {
      Storage.prototype.setItem = originalSetItem;
      Storage.prototype.getItem = originalGetItem;
    }
  });
});
