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

  it('ensures every single lesson (1 to 9) has 3 or 4 coherent steps with real content and zero skeleton placeholders', () => {
    for (const day of ALL_DAYS) {
      expect(day.isSkeletonPlaceholder).toBe(false);
      expect([3, 4]).toContain(day.steps.length);
      expect(day.steps.map((s) => s.number)).toEqual(
        day.steps.map((_, idx) => idx + 1)
      );

      for (const step of day.steps) {
        expect(step.blocks.length).toBeGreaterThan(0);
        const videoBlocks = step.blocks.filter((b) => b.type === 'video');
        expect(videoBlocks).toHaveLength(0);
      }
    }
  });

  it('calculates daily progress deterministically for 3-step and 4-step lessons', () => {
    // 4-step lesson
    expect(calculateDailyProgress([]).percentage).toBe(0);
    expect(calculateDailyProgress(['concept']).percentage).toBe(25);
    expect(calculateDailyProgress(['concept', 'prompt']).percentage).toBe(50);
    expect(calculateDailyProgress(['concept', 'prompt', 'example']).percentage).toBe(75);

    const full4 = calculateDailyProgress(['concept', 'prompt', 'example', 'your-turn']);
    expect(full4.percentage).toBe(100);
    expect(full4.isCompleted).toBe(true);
    expect(isDayCompleted(['concept', 'prompt', 'example', 'your-turn'])).toBe(true);

    // 3-step lesson
    expect(calculateDailyProgress([], 3).percentage).toBe(0);
    expect(calculateDailyProgress(['concept'], 3).percentage).toBe(33);
    expect(calculateDailyProgress(['concept', 'prompt'], 3).percentage).toBe(67);
    const full3 = calculateDailyProgress(['concept', 'prompt', 'your-turn'], 3);
    expect(full3.percentage).toBe(100);
    expect(full3.isCompleted).toBe(true);
    expect(isDayCompleted(['concept', 'prompt', 'your-turn'], 3)).toBe(true);
  });

  it('calculates global progress over 9 lessons (completedDays / 9 * 100) and never counts partial lessons', () => {
    const partialMap = {
      1: ['concept', 'prompt', 'example'] as const,
      2: ['concept', 'prompt', 'example', 'your-turn'] as const,
    };

    const res = calculateGlobalProgress({
      1: [...partialMap[1]],
      2: [...partialMap[2]],
    });

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

    const rendered = renderPromptTemplate(template, state.profile);
    expect(rendered.missingKeys).toHaveLength(0);
    expect(rendered.renderedText).toBe(
      'Business: Strength Studio for Engineers | Audience: Remote Tech Workers | Product: 21-Day Interactive Kettlebell Kit | Style: Ardoise & Émeraude | Goal: Launch on Chariow'
    );
  });

  it('persists in schemaVersion 2 and recovers safely from corrupted LocalStorage', () => {
    const initial = createInitialProgress();
    expect(initial.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(initial.profile.brandStyle).toBe('');

    initial.completedStartHereIds = ['introduction', 'setup'];
    initial.completedStepsByDay[1] = ['concept', 'prompt', 'example', 'your-turn'];
    initial.profile.studentName = 'Camille';

    saveProgressToStorage(initial);
    const loaded = loadProgressFromStorage();
    expect(loaded.schemaVersion).toBe(2);
    expect(loaded.profile.studentName).toBe('Camille');
    expect(loaded.completedStartHereIds).toEqual(['introduction', 'setup']);
    expect(calculateGlobalProgress(loaded.completedStepsByDay).completedDaysCount).toBe(1);

    // Corrupt localStorage and verify safe fallback
    window.localStorage.setItem(STORAGE_KEY, '{corrupted_json');
    const recovered = loadProgressFromStorage();
    expect(recovered.schemaVersion).toBe(2);
    expect(recovered.completedStartHereIds).toEqual([]);

    // Verify JSON import validation
    expect(importProgressJson('invalid')).toBeNull();
    expect(importProgressJson(JSON.stringify(initial))?.profile.studentName).toBe('Camille');
  });
});
