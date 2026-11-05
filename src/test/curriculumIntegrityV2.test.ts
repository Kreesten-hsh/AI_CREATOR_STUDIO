import { describe, expect, it } from 'vitest';
import {
  COURSE_TITLE,
  COURSE_META_TITLE,
  COURSE_SUBTITLE,
  ALL_DAYS,
  COURSE_DATA,
} from '../data/course';
import { RESOURCE_CATEGORIES } from '../data/navigation/resources';
import { BONUSES } from '../data/navigation/bonuses';
import { MAIN_COURSES } from '../data/navigation/mainCourses';

describe('Intégrité Curriculaire et Remise à Zéro (Mission 0)', () => {
  describe('1. Constantes de Titre et Sous-Titre Centralisées', () => {
    it('définit COURSE_TITLE et COURSE_META_TITLE avec la valeur officielle exacte', () => {
      const expectedTitle =
        "Utiliser Claude pour créer un produit digital qui ne ressemble pas à de la merde générée par l'IA";
      expect(COURSE_TITLE).toBe(expectedTitle);
      expect(COURSE_META_TITLE).toBe(expectedTitle);
    });

    it('définit COURSE_SUBTITLE avec la formulation officielle Document-First', () => {
      const expectedSubtitle =
        'Transformez votre document existant en une expérience interactive personnalisée avec Claude, publiez-la et apprenez à la vendre.';
      expect(COURSE_SUBTITLE).toBe(expectedSubtitle);
    });
  });

  describe('2. Structure des 3 Modules et 9 Leçons', () => {
    it('contient exactement 3 modules dans MAIN_COURSES et COURSE_DATA.sprints', () => {
      expect(MAIN_COURSES).toHaveLength(3);
      expect(COURSE_DATA.sprints).toHaveLength(3);
      expect(MAIN_COURSES[0].title).toBe('Opportunité et positionnement');
      expect(MAIN_COURSES[1].title).toBe('Concevoir et créer avec Claude');
      expect(MAIN_COURSES[2].title).toBe('Vendre et promouvoir');
    });

    it('contient exactement 9 leçons avec les titres officiels validés', () => {
      expect(ALL_DAYS).toHaveLength(9);
      expect(COURSE_DATA.days).toHaveLength(9);

      const expectedTitles = [
        'Analyser son document et identifier son potentiel interactif.',
        'Comprendre son acheteur et le problème à résoudre.',
        'Définir sa solution et sa promesse.',
        'Concevoir son expérience interactive.',
        'Créer son application avec Claude.',
        'Personnaliser, tester et publier son application.',
        'Construire son offre commerciale.',
        'Créer son dispositif de livraison et publier sur Chariow.',
        'Présenter et promouvoir son application.',
      ];

      ALL_DAYS.forEach((day, index) => {
        expect(day.dayNumber).toBe(index + 1);
        expect(day.title).toBe(expectedTitles[index]);
        expect(day.steps).toHaveLength(0);
      });
    });
  });

  describe('3. Les 2 Bonus Vides', () => {
    it('contient exactement 2 bonus avec leurs intitulés officiels et contenu vidé', () => {
      expect(BONUSES).toHaveLength(2);
      expect(BONUSES[0].title).toBe('LE SYSTÈME MANYCHAT AUTOMATISÉ AVEC CLAUDE');
      expect(BONUSES[1].title).toBe('MARKETING LIBRARY');
      expect(BONUSES[0].blocks).toHaveLength(0);
      expect(BONUSES[1].blocks).toHaveLength(0);
    });
  });

  describe('4. Ressources Vidées', () => {
    it('RESOURCE_CATEGORIES est vide', () => {
      expect(RESOURCE_CATEGORIES).toHaveLength(0);
    });
  });
});
