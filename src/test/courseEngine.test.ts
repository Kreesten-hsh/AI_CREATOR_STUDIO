import { describe, expect, it, beforeEach } from 'vitest';
import { COURSE_DATA, ALL_DAYS } from '../data/course';
import {
  calculateDailyProgress,
  calculateGlobalProgress,
  isDayCompleted,
} from '../utils/progressCalculator';
import { renderPromptTemplate } from '../utils/promptRenderer';
import {
  createInitialProgress,
  importProgressJson,
  loadProgressFromStorage,
  saveProgressToStorage,
  STORAGE_KEY,
} from '../utils/storage';
import { ALL_STEP_TYPES } from '../types/course';

describe('AI CREATOR STUDIO : Course Data & Engine Verification', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('contains exactly 2 Start Here lessons, 5 sprints, and 25 days', () => {
    expect(COURSE_DATA.startHere).toHaveLength(2);
    expect(COURSE_DATA.sprints).toHaveLength(5);
    expect(ALL_DAYS).toHaveLength(25);

    const dayNumbers = ALL_DAYS.map((d) => d.dayNumber);
    expect(dayNumbers).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
  });

  it('ensures every single day has exactly 4 steps in canonical order', () => {
    for (const day of ALL_DAYS) {
      expect(day.steps).toHaveLength(4);
      expect(day.steps.map((s) => s.type)).toEqual(ALL_STEP_TYPES);
      expect(day.steps.map((s) => s.number)).toEqual([1, 2, 3, 4]);
    }
  });

  it('calculates daily progress deterministically (completedSteps / 4 * 100)', () => {
    expect(calculateDailyProgress([]).percentage).toBe(0);
    expect(calculateDailyProgress(['concept']).percentage).toBe(25);
    expect(calculateDailyProgress(['concept', 'prompt']).percentage).toBe(50);
    expect(calculateDailyProgress(['concept', 'prompt', 'example']).percentage).toBe(75);

    const full = calculateDailyProgress(['concept', 'prompt', 'example', 'your-turn']);
    expect(full.percentage).toBe(100);
    expect(full.isCompleted).toBe(true);
    expect(isDayCompleted(['concept', 'prompt', 'example', 'your-turn'])).toBe(true);
  });

  it('calculates global progress (completedDays / 25 * 100) and never counts partial days', () => {
    const partialMap = {
      1: ['concept', 'prompt', 'example'] as const,
      2: ['concept', 'prompt', 'example', 'your-turn'] as const,
    };

    const res = calculateGlobalProgress({
      1: [...partialMap[1]],
      2: [...partialMap[2]],
    });

    expect(res.completedDaysCount).toBe(1);
    expect(res.completedDayNumbers).toEqual([2]);
    expect(res.percentage).toBe(4);
  });

  it('interpolates StudentProfile variables in PromptBuilder templates accurately', () => {
    const state = createInitialProgress();
    state.profile.business = 'Strength Studio for Engineers';
    state.profile.targetAudience = 'Remote Tech Workers';
    state.profile.productType = '21-Day Interactive Kettlebell Kit';
    state.profile.brandStyle = 'Neo-Brutalist Editorial';
    state.profile.mainObjective = 'Launch at $49';

    const template =
      'Business: {{business}} | Audience: {{targetAudience}} | Product: {{productType}} | Style: {{brandStyle}} | Goal: {{mainObjective}}';

    const rendered = renderPromptTemplate(template, state.profile);
    expect(rendered.missingKeys).toHaveLength(0);
    expect(rendered.renderedText).toBe(
      'Business: Strength Studio for Engineers | Audience: Remote Tech Workers | Product: 21-Day Interactive Kettlebell Kit | Style: Neo-Brutalist Editorial | Goal: Launch at $49'
    );
  });

  it('persists and recovers safely from corrupted LocalStorage', () => {
    const initial = createInitialProgress();
    initial.completedStartHereIds = ['introduction', 'setup'];
    initial.completedStepsByDay[1] = ['concept', 'prompt', 'example', 'your-turn'];
    initial.profile.studentName = 'Camille';

    saveProgressToStorage(initial);
    const loaded = loadProgressFromStorage();
    expect(loaded.profile.studentName).toBe('Camille');
    expect(loaded.completedStartHereIds).toEqual(['introduction', 'setup']);
    expect(calculateGlobalProgress(loaded.completedStepsByDay).completedDaysCount).toBe(1);

    // Corrupt localStorage and verify safe fallback
    window.localStorage.setItem(STORAGE_KEY, '{corrupted_json');
    const recovered = loadProgressFromStorage();
    expect(recovered.schemaVersion).toBe(1);
    expect(recovered.completedStartHereIds).toEqual([]);

    // Verify JSON import validation
    expect(importProgressJson('invalid')).toBeNull();
    expect(importProgressJson(JSON.stringify(initial))?.profile.studentName).toBe('Camille');
  });

  it('guarantees clean separation between skeleton placeholders and developed days', () => {
    const skeletonDayNumbers = [1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
    const developedDayNumbers = [6, 7, 8, 9, 10];

    for (const day of ALL_DAYS) {
      if (skeletonDayNumbers.includes(day.dayNumber)) {
        expect(day.isSkeletonPlaceholder).toBe(true);
        // Every step in a skeleton day must have empty blocks (no fake content)
        for (const step of day.steps) {
          expect(step.blocks).toEqual([]);
        }
      } else if (developedDayNumbers.includes(day.dayNumber)) {
        expect(day.isSkeletonPlaceholder).toBe(false);
        // Developed days must have real content blocks
        for (const step of day.steps) {
          expect(step.blocks.length).toBeGreaterThan(0);
        }
      }

      // No day in the 25 days should have a VideoBlock at this stage
      for (const step of day.steps) {
        const videoBlocks = step.blocks.filter((b) => b.type === 'video');
        expect(videoBlocks).toHaveLength(0);
      }
    }
  });
});
