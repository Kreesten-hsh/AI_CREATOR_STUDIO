import { describe, expect, it } from 'vitest';
import {
  calculateDailyProgress,
  calculateGlobalProgress,
  isDayCompleted,
  normalizeStepIdList,
} from '../utils/progressCalculator';

describe('Calculateur de progression V3 (par stepId)', () => {
  describe('normalizeStepIdList', () => {
    it('supprime les doublons et les valeurs vides', () => {
      const input = ['step-1', 'step-2', 'step-1', '', '   ', 'step-3'];
      expect(normalizeStepIdList(input)).toEqual(['step-1', 'step-2', 'step-3']);
    });

    it('gère les entrées undefined ou non-tableaux', () => {
      expect(normalizeStepIdList(undefined)).toEqual([]);
      expect(normalizeStepIdList([] as string[])).toEqual([]);
    });
  });

  describe('isDayCompleted', () => {
    it("détermine correctement si une journée à 1, 2, 3 ou 4 étapes est terminée selon le total réel de la journée", () => {
      // Journée à 1 étape
      expect(isDayCompleted(['step-1'], 1)).toBe(true);
      expect(isDayCompleted([], 1)).toBe(false);

      // Journée à 2 étapes
      expect(isDayCompleted(['step-1'], 2)).toBe(false);
      expect(isDayCompleted(['step-1', 'step-2'], 2)).toBe(true);

      // Journée à 3 étapes
      expect(isDayCompleted(['step-1', 'step-2'], 3)).toBe(false);
      expect(isDayCompleted(['step-1', 'step-2', 'step-3'], 3)).toBe(true);

      // Journée de transition à 4 étapes
      expect(isDayCompleted(['step-1', 'step-2', 'step-3'], 4)).toBe(false);
      expect(isDayCompleted(['step-1', 'step-2', 'step-3', 'step-4'], 4)).toBe(true);
    });

    it('rejette les doublons : 2 fois le même id ne valide pas une journée à 2 étapes', () => {
      expect(isDayCompleted(['step-1', 'step-1'], 2)).toBe(false);
    });
  });

  describe('calculateDailyProgress', () => {
    it('calcule la progression exacte pour une journée à 1 étape', () => {
      expect(calculateDailyProgress([], 1)).toEqual({
        completedCount: 0,
        total: 1,
        percentage: 0,
        isCompleted: false,
      });

      expect(calculateDailyProgress(['s1'], 1)).toEqual({
        completedCount: 1,
        total: 1,
        percentage: 100,
        isCompleted: true,
      });
    });

    it('calcule la progression exacte pour une journée à 2 étapes', () => {
      expect(calculateDailyProgress([], 2).percentage).toBe(0);
      expect(calculateDailyProgress(['s1'], 2).percentage).toBe(50);
      expect(calculateDailyProgress(['s1', 's2'], 2).percentage).toBe(100);
      expect(calculateDailyProgress(['s1', 's2'], 2).isCompleted).toBe(true);
    });

    it('calcule la progression exacte pour une journée à 3 étapes', () => {
      expect(calculateDailyProgress([], 3).percentage).toBe(0);
      expect(calculateDailyProgress(['s1'], 3).percentage).toBe(33);
      expect(calculateDailyProgress(['s1', 's2'], 3).percentage).toBe(67);
      expect(calculateDailyProgress(['s1', 's2', 's3'], 3).percentage).toBe(100);
      expect(calculateDailyProgress(['s1', 's2', 's3'], 3).isCompleted).toBe(true);
    });

    it('calcule la progression exacte pour une journée de transition à 4 étapes', () => {
      expect(calculateDailyProgress([], 4).percentage).toBe(0);
      expect(calculateDailyProgress(['s1'], 4).percentage).toBe(25);
      expect(calculateDailyProgress(['s1', 's2'], 4).percentage).toBe(50);
      expect(calculateDailyProgress(['s1', 's2', 's3'], 4).percentage).toBe(75);
      expect(calculateDailyProgress(['s1', 's2', 's3', 's4'], 4).percentage).toBe(100);
    });
  });

  describe('calculateGlobalProgress', () => {
    it('calcule la progression globale en tenant compte du nombre dynamique d étapes par jour', () => {
      const completedStepIdsByDay: Record<number, string[]> = {
        1: ['d1-s1', 'd1-s2', 'd1-s3', 'd1-s4'], // jour 1 (4 étapes) -> validé
        2: ['d2-s1'],                             // jour 2 (4 étapes) -> non validé
        5: ['d5-s1', 'd5-s2', 'd5-s3'],           // jour 5 (3 étapes) -> validé
      };

      const totalStepsByDay: Record<number, number> = {
        1: 4,
        2: 4,
        5: 3,
      };

      const result = calculateGlobalProgress(completedStepIdsByDay, totalStepsByDay);
      expect(result.completedDaysCount).toBe(2);
      expect(result.completedDayNumbers).toEqual([1, 5]);
      expect(result.totalDays).toBe(9);
      expect(result.percentage).toBe(Math.round((2 / 9) * 100)); // 22%
    });

    it('renvoie 0% si aucune donnée ou objet vide', () => {
      expect(calculateGlobalProgress(undefined).percentage).toBe(0);
      expect(calculateGlobalProgress({}).completedDaysCount).toBe(0);
    });
  });
});
