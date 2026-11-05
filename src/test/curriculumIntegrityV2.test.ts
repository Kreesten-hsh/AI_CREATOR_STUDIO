import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { COURSE_TITLE, COURSE_META_TITLE, COURSE_SUBTITLE, ALL_DAYS, COURSE_DATA } from '../data/course';
import { RESOURCE_CATEGORIES } from '../data/navigation/resources';
import { BONUSES } from '../data/navigation/bonuses';
import { INTRODUCTION_LESSON } from '../data/startHere/introduction';
import { SETUP_LESSON } from '../data/startHere/setup';
import { PRODUCT_MODELS } from '../data/productModels';

describe('Intégrité Curriculaire et Non-Régression V2 (Mission D)', () => {
  describe('1. Constantes de Titre et Sous-Titre Centralisées', () => {
    it('définit COURSE_TITLE et COURSE_META_TITLE avec la valeur officielle exacte', () => {
      const expectedTitle = "Utiliser Claude pour créer un produit digital qui ne ressemble pas à de la merde générée par l'IA";
      expect(COURSE_TITLE).toBe(expectedTitle);
      expect(COURSE_META_TITLE).toBe(expectedTitle);
    });

    it('définit COURSE_SUBTITLE avec la formulation officielle Document-First', () => {
      const expectedSubtitle = 'Transformez votre document existant en une expérience interactive personnalisée avec Claude, publiez-la et apprenez à la vendre.';
      expect(COURSE_SUBTITLE).toBe(expectedSubtitle);
    });
  });

  describe('2. Les 10 Fiches Ressources Pratiques Canoniques', () => {
    const fiches = RESOURCE_CATEGORIES[0]?.items ?? [];

    it('contient exactement 10 fiches pratiques dans la première catégorie', () => {
      expect(fiches).toHaveLength(10);
    });

    it('aligne la Fiche 2 sur les 4 modèles de productModels.ts plus le choix libre', () => {
      const fiche2 = fiches[1];
      expect(fiche2).toBeDefined();
      expect(fiche2.title).toContain('Les 4 modèles');
      expect(fiche2.content).toBeDefined();

      const content = (fiche2.content ?? '').toLowerCase();
      // Vérifie la présence des 4 modèles canoniques dans le contenu de la fiche
      for (const model of PRODUCT_MODELS) {
        expect(content).toContain(model.name.toLowerCase());
      }
      expect(content).toContain('libre');
    });

    it('affiche le statut visible "Procédure à confirmer par test" sur les fiches 7 à 10', () => {
      const fichesAConfirmer = fiches.slice(6, 10);
      expect(fichesAConfirmer).toHaveLength(4);

      for (const fiche of fichesAConfirmer) {
        expect(fiche.content ?? '').toContain('Statut : Procédure à confirmer par test');
      }
    });

    it('ne marque PAS le statut "Procédure à confirmer par test" sur les fiches 1 à 6', () => {
      const fichesStandard = fiches.slice(0, 6);
      for (const fiche of fichesStandard) {
        expect(fiche.content ?? '').not.toContain('Statut : Procédure à confirmer par test');
      }
    });
  });

  describe('3. Éradication des Termes et Références Obsolètes dans les Contenus Visibles', () => {
    const activePayloads = [
      { name: 'COURSE_DATA', data: COURSE_DATA },
      { name: 'ALL_DAYS', data: ALL_DAYS },
      { name: 'BONUSES', data: BONUSES },
      { name: 'RESOURCE_CATEGORIES', data: RESOURCE_CATEGORIES },
      { name: 'INTRODUCTION_LESSON', data: INTRODUCTION_LESSON },
      { name: 'SETUP_LESSON', data: SETUP_LESSON },
    ];

    it('interdit toute occurrence de "Alexandre V." dans tous les contenus de cours actifs', () => {
      for (const { name, data } of activePayloads) {
        const serialized = JSON.stringify(data);
        expect(serialized, `Contenu actif ${name} contient 'Alexandre V.'`).not.toContain('Alexandre V.');
      }
    });

    it('interdit "Le Système de Création Régulière" dans les contenus actifs', () => {
      for (const { name, data } of activePayloads) {
        const serialized = JSON.stringify(data);
        expect(serialized, `Contenu actif ${name} contient 'Le Système de Création Régulière'`).not.toContain('Le Système de Création Régulière');
      }
    });

    it('interdit l ancienne citation "Tu ne vas pas apprendre à créer notre plateforme" ou ses variantes', () => {
      for (const { name, data } of activePayloads) {
        const serialized = JSON.stringify(data);
        expect(serialized, `Contenu actif ${name} contient l'ancienne citation`).not.toMatch(/Tu ne vas pas apprendre à créer notre (propre )?plateforme/i);
      }
    });

    it('interdit "ZIP obligatoire" ou "archive ZIP obligatoire"', () => {
      for (const { name, data } of activePayloads) {
        const serialized = JSON.stringify(data);
        expect(serialized, `Contenu actif ${name} mentionne un ZIP obligatoire`).not.toMatch(/(archive\s+)?ZIP\s+obligatoire/i);
      }
    });

    it('interdit la prescription obligatoire de Canva (seules les formulations négatives comme "sans Canva" sont tolérées)', () => {
      for (const { name, data } of activePayloads) {
        const serialized = JSON.stringify(data);
        // Si "Canva" apparaît, il doit obligatoirement être précédé de "sans " ou "pas de "
        const canvaMatches = serialized.match(/(.{0,15})canva(.{0,15})/gi) ?? [];
        for (const match of canvaMatches) {
          const isNegative = /(sans|pas de|aucun|exit|sans passer par)\s+canva/i.test(match);
          expect(isNegative, `Occurrence positive non autorisée de Canva trouvée dans ${name} : "${match}"`).toBe(true);
        }
      }
    });

    it('interdit la mention de "modèle fixe à 4 étapes"', () => {
      for (const { name, data } of activePayloads) {
        const serialized = JSON.stringify(data);
        expect(serialized, `Contenu actif ${name} mentionne le modèle fixe à 4 étapes`).not.toContain('modèle fixe à 4 étapes');
      }
    });
  });

  describe('4. Intégrité des Liens du README et Absence de Liens Cassés vers les Fichiers Supprimés', () => {
    it('vérifie que README.md ne pointe vers aucun fichier V1 ou blueprint supprimé', () => {
      const readmePath = path.resolve(process.cwd(), 'README.md');
      const readmeContent = fs.readFileSync(readmePath, 'utf-8');

      const deletedFiles = [
        'PEDAGOGICAL_ARCHITECTURE_V1.md',
        'CURRICULUM_BLUEPRINT.md',
        'CURRICULUM_BLUEPRINT_V2.md',
        'TEMPLATE_RESEARCH_REGISTER.md',
        'DAY_01_INTERNAL_SPEC_V1.md',
        'DAY_01_PEDAGOGICAL_CONTENT_V1.md',
        'DAY_02_INTERNAL_SPEC_V1.md',
        'DAY_02_PEDAGOGICAL_CONTENT_V1.md',
        'DAY_03_INTERNAL_SPEC_V1.md',
        'DAY_03_PEDAGOGICAL_CONTENT_V1.md',
      ];

      for (const deletedFile of deletedFiles) {
        expect(readmeContent, `README.md contient une référence au fichier supprimé ${deletedFile}`).not.toContain(deletedFile);
      }
    });

    it('vérifie que les documents canoniques référencés dans README.md existent physiquement', () => {
      const readmePath = path.resolve(process.cwd(), 'README.md');
      const readmeContent = fs.readFileSync(readmePath, 'utf-8');

      const canonicalDocs = [
        'docs/PEDAGOGICAL_ARCHITECTURE_V2.md',
        'docs/PRODUCT_DELIVERY_DECISION.md',
        'docs/RESEARCH_DRIVEN_PEDAGOGICAL_PRODUCTION_PROTOCOL.md',
        'docs/PROJECT_DOSSIER_V2.md',
        'docs/MEDIA_PRODUCTION_PLAN_V2.md',
        'DESIGN.md',
      ];

      for (const doc of canonicalDocs) {
        expect(readmeContent, `README.md devrait référencer ${doc}`).toContain(doc);
        const docPath = path.resolve(process.cwd(), doc);
        expect(fs.existsSync(docPath), `Le document canonique ${doc} doit exister physiquement`).toBe(true);
      }
    });
  });

  describe('5. Nettoyage des Fichiers de Démo HTML (public/demos/pdf-to-hub/)', () => {
    it('vérifie l absence de données personnelles et de "Alexandre V." dans avant-pdf-statique.html', () => {
      const demoPath = path.resolve(process.cwd(), 'public/demos/pdf-to-hub/avant-pdf-statique.html');
      const demoContent = fs.readFileSync(demoPath, 'utf-8');

      expect(demoContent).not.toContain('Alexandre V.');
      expect(demoContent).not.toContain('Le Système de Création Régulière');
      expect(demoContent).toMatch(/(exemple (pédagogique |didactique )?fictif|cas d'école fictif)/i);
    });

    it('vérifie l absence de données personnelles et de "Alexandre V." dans apres-hub-interactif.html', () => {
      const demoPath = path.resolve(process.cwd(), 'public/demos/pdf-to-hub/apres-hub-interactif.html');
      const demoContent = fs.readFileSync(demoPath, 'utf-8');

      expect(demoContent).not.toContain('Alexandre V.');
      expect(demoContent).not.toContain('Le Système de Création Régulière');
      expect(demoContent).toMatch(/(exemple (pédagogique |didactique )?fictif|cas d'école fictif)/i);
    });
  });
});
