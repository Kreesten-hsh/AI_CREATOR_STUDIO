import { describe, expect, it, beforeEach } from 'vitest';
import {
  COURSE_DATA,
  ALL_DAYS,
  ALL_LESSONS,
  TOTAL_COURSE_MODULES,
  TOTAL_COURSE_DAYS,
  TOTAL_COURSE_LESSONS,
} from '../data/course';
import { BONUSES } from '../data/navigation/bonuses';
import {
  calculateLessonProgress,
  calculateDayProgress,
  calculateModuleProgress,
  calculateGlobalProgress,
  isLessonCompleted,
} from '../utils/progressCalculator';
import { renderPromptTemplate } from '../utils/promptRenderer';
import {
  createInitialProgress,
  CURRENT_SCHEMA_VERSION,
  CURRICULUM_MODEL,
  importProgressJson,
  loadProgressFromStorage,
  saveProgressToStorage,
  STORAGE_KEY,
} from '../utils/storage';
import type { Lesson } from '../types/course';

describe('AI CREATOR STUDIO : Course Data & Engine Verification (3M / 3J / 7L)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('contains 3 modules, 3 days, 7 lessons (2 + 3 + 2), and 2 bonuses', () => {
    expect(COURSE_DATA.modules).toHaveLength(3);
    expect(COURSE_DATA.modules.map((m) => m.id)).toEqual(['module-01', 'module-02', 'module-03']);
    expect(ALL_DAYS).toHaveLength(3);
    expect(ALL_DAYS.map((d) => d.id)).toEqual(['day-01', 'day-02', 'day-03']);
    expect(ALL_LESSONS).toHaveLength(7);
    expect(ALL_LESSONS.map((l) => l.id)).toEqual([
      'lesson-01',
      'lesson-02',
      'lesson-03',
      'lesson-04',
      'lesson-05',
      'lesson-06',
      'lesson-07',
    ]);
    expect(TOTAL_COURSE_MODULES).toBe(3);
    expect(TOTAL_COURSE_DAYS).toBe(3);
    expect(TOTAL_COURSE_LESSONS).toBe(7);
    expect(COURSE_DATA.totalLessons).toBe(7);
    expect(COURSE_DATA.totalDays).toBe(3);
    expect(BONUSES).toHaveLength(2);
    expect(BONUSES.map((b) => b.id)).toEqual(['bonus-manychat', 'bonus-marketing']);
  });

  it('ensures every single lesson (1 to 7) is a skeleton placeholder with zero steps', () => {
    for (const lesson of ALL_LESSONS) {
      expect(lesson.isSkeletonPlaceholder).toBe(true);
      expect(lesson.steps).toHaveLength(0);
    }
  });

  it('calculates lesson, day, module, and global progress deterministically over 7 lessons', () => {
    const mockLessons: Lesson[] = ALL_LESSONS.map((lesson) => ({
      ...lesson,
      isSkeletonPlaceholder: false,
      steps: [
        { id: `${lesson.id}-step-1`, number: 1, title: 'S1', completionLabel: 'OK', blocks: [] },
        { id: `${lesson.id}-step-2`, number: 2, title: 'S2', completionLabel: 'OK', blocks: [] },
      ],
    }));

    // Empty lesson (0 steps) is never completed
    expect(calculateLessonProgress(ALL_LESSONS[0], ['any-step']).isCompleted).toBe(false);
    expect(calculateLessonProgress(ALL_LESSONS[0], ['any-step']).percentage).toBe(0);

    // 2-step lesson
    expect(calculateLessonProgress(mockLessons[0], []).percentage).toBe(0);
    expect(calculateLessonProgress(mockLessons[0], ['lesson-01-step-1']).percentage).toBe(50);
    const fullL1 = calculateLessonProgress(mockLessons[0], [
      'lesson-01-step-1',
      'lesson-01-step-2',
    ]);
    expect(fullL1.percentage).toBe(100);
    expect(fullL1.isCompleted).toBe(true);
    expect(isLessonCompleted(mockLessons[0], ['lesson-01-step-1', 'lesson-01-step-2'])).toBe(true);

    // Day 1 (L1 + L2) progress
    const completedMap = {
      'lesson-01': ['lesson-01-step-1', 'lesson-01-step-2'],
      'lesson-02': ['lesson-02-step-1'], // partial
    };
    const mockDay1 = { ...ALL_DAYS[0], lessons: [mockLessons[0], mockLessons[1]] };
    const day1Progress = calculateDayProgress(mockDay1, completedMap);
    expect(day1Progress.completedLessonsCount).toBe(1);
    expect(day1Progress.totalLessons).toBe(2);
    expect(day1Progress.percentage).toBe(50);
    expect(day1Progress.isCompleted).toBe(false);

    // Module 1 progress
    const mod1Progress = calculateModuleProgress(
      COURSE_DATA.modules[0],
      completedMap,
      mockLessons
    );
    expect(mod1Progress.completedLessonsCount).toBe(1);
    expect(mod1Progress.totalLessons).toBe(2);
    expect(mod1Progress.isCompleted).toBe(false);

    // Global progress over 7 lessons
    const globalRes = calculateGlobalProgress(completedMap, mockLessons, [mockDay1]);
    expect(globalRes.completedLessonsCount).toBe(1);
    expect(globalRes.totalLessons).toBe(7);
    expect(globalRes.completedLessonIds).toEqual(['lesson-01']);
    expect(globalRes.completedLessonNumbers).toEqual([1]);
    expect(globalRes.percentage).toBe(Math.round((1 / 7) * 100)); // 14%
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

  it('persists in schemaVersion 4 (curriculumModel 3m-3d-7l) and recovers safely from corrupted LocalStorage', () => {
    const initial = createInitialProgress();
    expect(initial.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(initial.schemaVersion).toBe(4);
    expect(initial.curriculumModel).toBe(CURRICULUM_MODEL);
    expect(initial.profile.brandStyle).toBe('');

    initial.completedStepIdsByLesson['lesson-01'] = ['lesson-01-step-1', 'lesson-01-step-2'];
    initial.profile.studentName = 'Camille';

    saveProgressToStorage(initial);
    const loaded = loadProgressFromStorage();
    expect(loaded.schemaVersion).toBe(4);
    expect(loaded.curriculumModel).toBe('3m-3d-7l');
    expect(loaded.profile.studentName).toBe('Camille');
    expect(loaded.completedStepIdsByLesson['lesson-01']).toEqual([
      'lesson-01-step-1',
      'lesson-01-step-2',
    ]);

    // Corrupt localStorage and verify safe fallback with persistenceDisabled
    window.localStorage.setItem(STORAGE_KEY, '{corrupted_json');
    const recovered = loadProgressFromStorage();
    expect(recovered.schemaVersion).toBe(4);
    expect(recovered.persistenceDisabled).toBe(true);
    expect(recovered.completedStepIdsByLesson).toEqual({});

    // Verify JSON import validation
    expect(importProgressJson('invalid')).toBeNull();
    expect(importProgressJson(JSON.stringify(initial))?.profile.studentName).toBe('Camille');
  });
});
