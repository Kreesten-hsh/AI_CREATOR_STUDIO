import { describe, expect, it, beforeEach } from 'vitest';
import { COURSE_DATA, ALL_DAYS, TOTAL_COURSE_LESSONS } from '../data/course';
import { BONUSES } from '../data/navigation/bonuses';
import {
  calculateDailyProgress,
  calculateGlobalProgress,
  isDayCompleted,
  TOTAL_COURSE_DAYS,
} from '../utils/progressCalculator';
import { renderPromptTemplate } from '../utils/promptRenderer';
import {
  createInitialProgress,
  CURRENT_SCHEMA_VERSION,
  importProgressJson,
  loadProgressFromStorage,
  saveProgressToStorage,
  STORAGE_KEY,
} from '../utils/storage';

describe('AI CREATOR STUDIO V2 : Course Data & Engine Verification', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('contains 0 Start Here menus, 3 modules (sprints), 9 lessons, and 2 bonuses', () => {
    expect(COURSE_DATA.startHere).toHaveLength(0);
    expect(COURSE_DATA.sprints).toHaveLength(3);
    expect(COURSE_DATA.sprints.map((s) => s.id)).toEqual(['module-01', 'module-02', 'module-03']);
    expect(ALL_DAYS).toHaveLength(9);
    expect(TOTAL_COURSE_LESSONS).toBe(9);
    expect(TOTAL_COURSE_DAYS).toBe(9);
    expect(COURSE_DATA.totalDays).toBe(9);
    expect(BONUSES).toHaveLength(2);
    expect(BONUSES.map((b) => b.id)).toEqual(['bonus-manychat', 'bonus-marketing']);

    const dayNumbers = ALL_DAYS.map((d) => d.dayNumber);
    expect(dayNumbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('ensures every single lesson (1 to 9) is reset to an empty shell with zero steps and isSkeletonPlaceholder: true', () => {
    for (const day of ALL_DAYS) {
      expect(day.isSkeletonPlaceholder).toBe(true);
      expect(day.steps).toHaveLength(0);
    }
  });

  it('calculates daily progress deterministically for 3-step and 4-step lessons', () => {
    // 4-step lesson
    expect(calculateDailyProgress([], 4).percentage).toBe(0);
    expect(calculateDailyProgress(['day-01-step-1'], 4).percentage).toBe(25);
    expect(calculateDailyProgress(['day-01-step-1', 'day-01-step-2'], 4).percentage).toBe(50);
    expect(calculateDailyProgress(['day-01-step-1', 'day-01-step-2', 'day-01-step-3'], 4).percentage).toBe(75);

    const full4 = calculateDailyProgress(['day-01-step-1', 'day-01-step-2', 'day-01-step-3', 'day-01-step-4'], 4);
    expect(full4.percentage).toBe(100);
    expect(full4.isCompleted).toBe(true);
    expect(isDayCompleted(['day-01-step-1', 'day-01-step-2', 'day-01-step-3', 'day-01-step-4'], 4)).toBe(true);

    // 3-step lesson
    expect(calculateDailyProgress([], 3).percentage).toBe(0);
    expect(calculateDailyProgress(['day-05-step-1'], 3).percentage).toBe(33);
    expect(calculateDailyProgress(['day-05-step-1', 'day-05-step-2'], 3).percentage).toBe(67);
    const full3 = calculateDailyProgress(['day-05-step-1', 'day-05-step-2', 'day-05-step-3'], 3);
    expect(full3.percentage).toBe(100);
    expect(full3.isCompleted).toBe(true);
    expect(isDayCompleted(['day-05-step-1', 'day-05-step-2', 'day-05-step-3'], 3)).toBe(true);
  });

  it('calculates global progress over 9 lessons (completedDays / 9 * 100) and never counts partial lessons', () => {
    const partialMap = {
      1: ['day-01-step-1', 'day-01-step-2', 'day-01-step-3'],
      2: ['day-02-step-1', 'day-02-step-2', 'day-02-step-3', 'day-02-step-4'],
    };

    const res = calculateGlobalProgress(partialMap, { 1: 4, 2: 4 });

    expect(res.completedDaysCount).toBe(1);
    expect(res.totalDays).toBe(9);
    expect(res.completedDayNumbers).toEqual([2]);
    expect(res.percentage).toBe(11);
  });

  it('interpolates StudentProfile variables in PromptBuilder templates accurately', () => {
    const state = createInitialProgress();
    state.profile.business = 'Strength Studio for Engineers';
    state.profile.targetAudience = 'Remote Tech Workers';
    state.profile.productType = '21-Day Interactive Kettlebell Kit';
    state.profile.brandStyle = 'Ardoise & Émeraude';
    state.profile.mainObjective = 'Launch on Chariow';

    const template =
      'Business: {{business}} | Audience: {{targetAudience}} | Product: {{productType}} | Style: {{brandStyle}} | Goal: {{mainObjective}}';

    const rendered = renderPromptTemplate(template, { profile: state.profile });
    expect(rendered.missingKeys).toHaveLength(0);
    expect(rendered.renderedText).toBe(
      'Business: Strength Studio for Engineers | Audience: Remote Tech Workers | Product: 21-Day Interactive Kettlebell Kit | Style: Ardoise & Émeraude | Goal: Launch on Chariow'
    );
  });

  it('persists in schemaVersion 3 and recovers safely from corrupted LocalStorage', () => {
    const initial = createInitialProgress();
    expect(initial.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(initial.profile.brandStyle).toBe('');

    initial.completedStartHereIds = ['introduction', 'setup'];
    initial.completedStepIdsByDay[1] = [
      'day-01-step-1',
      'day-01-step-2',
      'day-01-step-3',
      'day-01-step-4',
    ];
    initial.profile.studentName = 'Camille';

    saveProgressToStorage(initial);
    const loaded = loadProgressFromStorage();
    expect(loaded.schemaVersion).toBe(3);
    expect(loaded.profile.studentName).toBe('Camille');
    expect(loaded.completedStartHereIds).toEqual(['introduction', 'setup']);
    expect(calculateGlobalProgress(loaded.completedStepIdsByDay, { 1: 4 }).completedDaysCount).toBe(1);

    // Corrupt localStorage and verify safe fallback with persistenceDisabled
    window.localStorage.setItem(STORAGE_KEY, '{corrupted_json');
    const recovered = loadProgressFromStorage();
    expect(recovered.schemaVersion).toBe(3);
    expect(recovered.persistenceDisabled).toBe(true);
    expect(recovered.completedStartHereIds).toEqual([]);

    // Verify JSON import validation
    expect(importProgressJson('invalid')).toBeNull();
    expect(importProgressJson(JSON.stringify(initial))?.profile.studentName).toBe('Camille');
  });
});
