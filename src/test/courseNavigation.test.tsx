import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import React from 'react';
import { MAIN_COURSES } from '../data/navigation/mainCourses';
import { COURSE_DATA } from '../data/course';
import {
  getCourseById,
  getCourseByLessonNumber,
  getCourseByDayNumber,
  isLessonInCourse,
  resolveCourseIdForLesson,
  resolveCourseIdForDay,
  resolveActiveCourseId,
  getCourseLessons,
  formatCourseLessonRangeTitle,
  validateCourseIntegrity,
  assertCourseIntegrity,
  normalizeActiveRoute,
} from '../utils/courseNavigation';
import '@testing-library/jest-dom/vitest';
import { ProgressProvider } from '../context/ProgressContext';
import { useProgress } from '../hooks/useProgress';
import { MainSidebar } from '../components/layout/MainSidebar';
import { CourseSidebar } from '../components/course/CourseSidebar';
import { MobileNavigation } from '../components/layout/MobileNavigation';

describe('V4 : Course Navigation and Routing Verification (3 Modules / 3 Days / 7 Lessons)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  // =========================================================================
  // SECTION A : Tests de correspondance des 7 leçons, 3 journées et 3 modules (2 + 3 + 2)
  // =========================================================================
  describe('A. Correspondance des 7 leçons, 3 journées & 3 modules officiels', () => {
    it('associe les leçons 1 et 2 à module-01 / day-01', () => {
      for (const lessonNum of [1, 2]) {
        expect(resolveCourseIdForLesson(lessonNum)).toBe('module-01');
        expect(isLessonInCourse(lessonNum, 'module-01')).toBe(true);
        expect(isLessonInCourse(lessonNum, 'module-02')).toBe(false);
      }
      expect(resolveCourseIdForDay(1)).toBe('module-01');
    });

    it('associe les leçons 3, 4 et 5 à module-02 / day-02', () => {
      for (const lessonNum of [3, 4, 5]) {
        expect(resolveCourseIdForLesson(lessonNum)).toBe('module-02');
        expect(isLessonInCourse(lessonNum, 'module-02')).toBe(true);
        expect(isLessonInCourse(lessonNum, 'module-01')).toBe(false);
      }
      expect(resolveCourseIdForDay(2)).toBe('module-02');
    });

    it('associe les leçons 6 et 7 à module-03 / day-03', () => {
      for (const lessonNum of [6, 7]) {
        expect(resolveCourseIdForLesson(lessonNum)).toBe('module-03');
        expect(isLessonInCourse(lessonNum, 'module-03')).toBe(true);
        expect(isLessonInCourse(lessonNum, 'module-02')).toBe(false);
      }
      expect(resolveCourseIdForDay(3)).toBe('module-03');
    });

    it('vérifie rigoureusement les frontières officielles 2 + 3 + 2', () => {
      expect(resolveCourseIdForLesson(1)).toBe('module-01');
      expect(resolveCourseIdForLesson(2)).toBe('module-01');
      expect(resolveCourseIdForLesson(3)).toBe('module-02');
      expect(resolveCourseIdForLesson(5)).toBe('module-02');
      expect(resolveCourseIdForLesson(6)).toBe('module-03');
      expect(resolveCourseIdForLesson(7)).toBe('module-03');
    });

    it('formate correctement les titres de plages de leçons', () => {
      expect(formatCourseLessonRangeTitle([1, 2])).toBe('LEÇONS 1 À 2');
      expect(formatCourseLessonRangeTitle([3, 5])).toBe('LEÇONS 3 À 5');
      expect(formatCourseLessonRangeTitle([6, 7])).toBe('LEÇONS 6 À 7');
    });

    it('récupère le module correspondant via getCourseByLessonNumber pour les 7 leçons et getCourseByDayNumber pour les 3 journées', () => {
      expect(MAIN_COURSES).toHaveLength(3);
      for (let lessonNum = 1; lessonNum <= 7; lessonNum++) {
        const course = getCourseByLessonNumber(lessonNum);
        expect(course).toBeDefined();
        expect(course?.id).toBe(resolveCourseIdForLesson(lessonNum));
      }
      for (let dayNum = 1; dayNum <= 3; dayNum++) {
        const course = getCourseByDayNumber(dayNum);
        expect(course).toBeDefined();
        expect(course?.id).toBe(`module-0${dayNum}`);
      }
    });

    it('résout le module actif depuis la route canonique', () => {
      expect(resolveActiveCourseId({ kind: 'home' })).toBeNull();
      expect(resolveActiveCourseId({ kind: 'bonus', bonusId: 'bonus-manychat' })).toBeNull();
      expect(resolveActiveCourseId({ kind: 'lesson', lessonId: 'lesson-01' })).toBe('module-01');
      expect(resolveActiveCourseId({ kind: 'lesson', lessonId: 'lesson-04' })).toBe('module-02');
      expect(resolveActiveCourseId({ kind: 'lesson', lessonId: 'lesson-07' })).toBe('module-03');
    });

    it("valide l'intégrité stricte des 3 modules, 3 journées et 7 leçons", () => {
      const integrity = validateCourseIntegrity(MAIN_COURSES);
      expect(integrity.isValid).toBe(true);
      expect(integrity.errors).toHaveLength(0);
      expect(() => assertCourseIntegrity(MAIN_COURSES)).not.toThrow();
    });

    it("détecte les anomalies d'intégrité du cursus (trous, chevauchements, nombre, identifiants)", () => {
      const invalidCount = validateCourseIntegrity(MAIN_COURSES.slice(0, 2));
      expect(invalidCount.isValid).toBe(false);
      expect(invalidCount.errors.some((e) => e.includes('Attendu 3 modules'))).toBe(true);

      const duplicatedIds = validateCourseIntegrity([
        ...MAIN_COURSES.slice(0, 2),
        { ...MAIN_COURSES[0], id: 'module-02' },
      ]);
      expect(duplicatedIds.isValid).toBe(false);
      expect(duplicatedIds.errors.some((e) => e.includes('dupliqués'))).toBe(true);

      const overlappingCourses = MAIN_COURSES.map((c) =>
        c.id === 'module-02' ? { ...c, lessonRange: [2, 5] as [number, number] } : c
      );
      const overlapResult = validateCourseIntegrity(overlappingCourses);
      expect(overlapResult.isValid).toBe(false);
      expect(overlapResult.errors.some((e) => e.includes('chevauchement'))).toBe(true);

      const gapCourses = MAIN_COURSES.map((c) =>
        c.id === 'module-01' ? { ...c, lessonRange: [1, 1] as [number, number] } : c
      );
      const gapResult = validateCourseIntegrity(gapCourses);
      expect(gapResult.isValid).toBe(false);
      expect(gapResult.errors.some((e) => e.includes('trou'))).toBe(true);

      expect(() => assertCourseIntegrity(gapCourses)).toThrowError(/Violation de l'intégrité/);
    });

    it('élimine le masquage silencieux dans resolveCourseIdForLesson et resolveCourseIdForDay', () => {
      expect(resolveCourseIdForLesson(0)).toBeNull();
      expect(resolveCourseIdForLesson(8)).toBeNull();
      expect(resolveCourseIdForLesson(9)).toBeNull();
      expect(resolveCourseIdForLesson(99, 'module-01')).toBe('module-01');

      expect(resolveCourseIdForDay(0)).toBeNull();
      expect(resolveCourseIdForDay(4)).toBeNull();
      expect(resolveCourseIdForDay(9)).toBeNull();
    });

    it('normalise rigoureusement vers la seule route canonique (home | lesson | bonus) et ramène les anciennes routes à home', () => {
      // Route canonique lesson valide
      expect(normalizeActiveRoute({ kind: 'lesson', lessonId: 'lesson-04' })).toEqual({
        kind: 'lesson',
        lessonId: 'lesson-04',
      });

      // Route lesson avec id inconnu -> { kind: 'home' }
      expect(normalizeActiveRoute({ kind: 'lesson', lessonId: 'lesson-09' })).toEqual({
        kind: 'home',
      });

      // Anciennes routes supprimées : resources, practical-sheets, start-here -> { kind: 'home' }
      expect(normalizeActiveRoute({ kind: 'resources' })).toEqual({ kind: 'home' });
      expect(normalizeActiveRoute({ kind: 'practical-sheets' })).toEqual({ kind: 'home' });
      expect(normalizeActiveRoute({ kind: 'start-here', lessonId: 'introduction' })).toEqual({
        kind: 'home',
      });

      // Anciennes routes V1/V2/V3 (course / day) : aucune réinterprétation risquée -> { kind: 'home' }
      expect(
        normalizeActiveRoute({ kind: 'course', courseId: 'module-02', dayNumber: 5 })
      ).toEqual({ kind: 'home' });
      expect(normalizeActiveRoute({ kind: 'day', dayNumber: 5 })).toEqual({ kind: 'home' });

      // Bonus actuels et legacy
      expect(normalizeActiveRoute({ kind: 'bonus', bonusId: 'bonus-manychat' })).toEqual({
        kind: 'bonus',
        bonusId: 'bonus-manychat',
      });
      expect(normalizeActiveRoute({ kind: 'bonus', bonusId: 'bonus-01' })).toEqual({
        kind: 'bonus',
        bonusId: 'bonus-manychat',
      });
      expect(normalizeActiveRoute({ kind: 'bonus', bonusId: 'bonus-03' })).toEqual({
        kind: 'bonus',
        bonusId: 'bonus-marketing',
      });
      expect(normalizeActiveRoute({ kind: 'bonus', bonusId: 'bonus-02' })).toEqual({
        kind: 'home',
      });

      // Entrées nulles ou invalides -> { kind: 'home' }
      expect(normalizeActiveRoute(null)).toEqual({ kind: 'home' });
      expect(normalizeActiveRoute(undefined)).toEqual({ kind: 'home' });
      expect(normalizeActiveRoute('invalid')).toEqual({ kind: 'home' });
    });
  });

  // =========================================================================
  // SECTION B : Tests MainSidebar
  // =========================================================================
  describe('B. MainSidebar navigation and active module identification', () => {
    it('navigue vers la première leçon de chacun des 3 modules (L1, L3, L6)', () => {
      let currentRoute: unknown;
      const TestComponent = () => {
        const { state } = useProgress();
        currentRoute = state.activeRoute;
        return <MainSidebar />;
      };

      render(
        <ProgressProvider>
          <TestComponent />
        </ProgressProvider>
      );

      // Module 01 (CHOISIR) -> lesson-01
      const btnMod01 = screen.getByRole('button', { name: /CHOISIR/i });
      fireEvent.click(btnMod01);
      expect(currentRoute).toEqual({
        kind: 'lesson',
        lessonId: 'lesson-01',
      });

      // Module 02 (CRÉER) -> lesson-03
      const btnMod02 = screen.getByRole('button', { name: /CRÉER/i });
      fireEvent.click(btnMod02);
      expect(currentRoute).toEqual({
        kind: 'lesson',
        lessonId: 'lesson-03',
      });

      // Module 03 (PUBLIER ET LIVRER) -> lesson-06
      const btnMod03 = screen.getByRole('button', { name: /PUBLIER ET LIVRER/i });
      fireEvent.click(btnMod03);
      expect(currentRoute).toEqual({
        kind: 'lesson',
        lessonId: 'lesson-06',
      });
    });

    it('identifie visuellement le module actif avec aria-current', () => {
      const TestContainer = () => {
        const { navigateToCourse } = useProgress();
        return (
          <div>
            <button onClick={() => navigateToCourse('module-02')}>Set Module 02</button>
            <MainSidebar />
          </div>
        );
      };

      render(
        <ProgressProvider>
          <TestContainer />
        </ProgressProvider>
      );

      fireEvent.click(screen.getByText('Set Module 02'));

      const mod02Btn = screen.getByRole('button', { name: /CRÉER/i });
      expect(mod02Btn).toHaveAttribute('aria-current', 'page');

      const mod01Btn = screen.getByRole('button', { name: /CHOISIR/i });
      expect(mod01Btn).not.toHaveAttribute('aria-current');
    });
  });

  // =========================================================================
  // SECTION C : Tests CourseSidebar
  // =========================================================================
  describe('C. CourseSidebar filtrage strict des leçons (2 + 3 + 2) et dynamisme', () => {
    it('associe exactement 2, 3 et 2 leçons à chaque module', () => {
      const expectedLessonsByCourse: Record<
        string,
        { count: number; title: string; firstLesson: number }
      > = {
        'module-01': { count: 2, title: 'LEÇONS 1 À 2', firstLesson: 1 },
        'module-02': { count: 3, title: 'LEÇONS 3 À 5', firstLesson: 3 },
        'module-03': { count: 2, title: 'LEÇONS 6 À 7', firstLesson: 6 },
      };

      for (const [courseId, exp] of Object.entries(expectedLessonsByCourse)) {
        const lessons = getCourseLessons(COURSE_DATA.lessons, courseId);
        expect(lessons).toHaveLength(exp.count);
        expect(lessons[0].lessonNumber).toBe(exp.firstLesson);
        expect(lessons[lessons.length - 1].lessonNumber).toBe(exp.firstLesson + exp.count - 1);

        const course = getCourseById(courseId);
        expect(formatCourseLessonRangeTitle(course?.lessonRange)).toBe(exp.title);
      }
    });

    it('affiche les leçons correctes et le titre dynamique dans le DOM', () => {
      const TestCourseView = ({ targetCourseId }: { targetCourseId: string }) => {
        const { navigateToCourse } = useProgress();
        React.useEffect(() => {
          navigateToCourse(targetCourseId);
        }, [targetCourseId, navigateToCourse]);

        return <CourseSidebar course={COURSE_DATA} />;
      };

      const { unmount } = render(
        <ProgressProvider>
          <TestCourseView targetCourseId="module-02" />
        </ProgressProvider>
      );

      expect(screen.getByText(/LEÇONS 3 À 5/i)).toBeInTheDocument();
      expect(screen.getByText('Leçon 3')).toBeInTheDocument();
      expect(screen.getByText('Leçon 4')).toBeInTheDocument();
      expect(screen.getByText('Leçon 5')).toBeInTheDocument();
      expect(screen.queryByText('Leçon 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Leçon 6')).not.toBeInTheDocument();

      unmount();

      render(
        <ProgressProvider>
          <TestCourseView targetCourseId="module-03" />
        </ProgressProvider>
      );

      expect(screen.getByText(/LEÇONS 6 À 7/i)).toBeInTheDocument();
      expect(screen.getByText('Leçon 6')).toBeInTheDocument();
      expect(screen.getByText('Leçon 7')).toBeInTheDocument();
      expect(screen.queryByText('Leçon 5')).not.toBeInTheDocument();
    });

    it('permet de basculer de module au clic sur une cellule de ProgressGrid (7 cellules)', () => {
      const TestGridInteraction = () => {
        const { state } = useProgress();
        return (
          <div>
            <div data-testid="active-route-info">
              {state.activeRoute.kind === 'lesson' ? state.activeRoute.lessonId : 'none'}
            </div>
            <CourseSidebar course={COURSE_DATA} />
          </div>
        );
      };

      render(
        <ProgressProvider>
          <TestGridInteraction />
        </ProgressProvider>
      );

      const lesson6Btn = screen.getByRole('button', { name: /^Leçon 6$/i });
      fireEvent.click(lesson6Btn);

      expect(screen.getByTestId('active-route-info')).toHaveTextContent('lesson-06');
      expect(screen.getByText(/LEÇONS 6 À 7/i)).toBeInTheDocument();
      expect(screen.getByText('Leçon 6')).toBeInTheDocument();
      expect(screen.getByText('Leçon 7')).toBeInTheDocument();
    });
  });

  // =========================================================================
  // SECTION D : Tests ProgressContext
  // =========================================================================
  describe('D. ProgressContext navigateToLesson et navigateToDay', () => {
    it('navigue vers chacune des 7 leçons via navigateToLesson', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ({ children }) => <ProgressProvider>{children}</ProgressProvider>,
      });

      for (let num = 1; num <= 7; num++) {
        act(() => {
          result.current.navigateToLesson(num);
        });

        expect(result.current.state.activeRoute).toEqual({
          kind: 'lesson',
          lessonId: `lesson-0${num}`,
        });
      }
    });

    it('navigue vers la première leçon de chacune des 3 journées via navigateToDay', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ({ children }) => <ProgressProvider>{children}</ProgressProvider>,
      });

      act(() => result.current.navigateToDay(1));
      expect(result.current.state.activeRoute).toEqual({
        kind: 'lesson',
        lessonId: 'lesson-01',
      });

      act(() => result.current.navigateToDay(2));
      expect(result.current.state.activeRoute).toEqual({
        kind: 'lesson',
        lessonId: 'lesson-03',
      });

      act(() => result.current.navigateToDay(3));
      expect(result.current.state.activeRoute).toEqual({
        kind: 'lesson',
        lessonId: 'lesson-06',
      });
    });

    it('protège navigateToLesson avec du clamping de 1 à 7', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ({ children }) => <ProgressProvider>{children}</ProgressProvider>,
      });

      act(() => {
        result.current.navigateToLesson(-5);
      });
      expect(result.current.state.activeRoute).toEqual({
        kind: 'lesson',
        lessonId: 'lesson-01',
      });

      act(() => {
        result.current.navigateToLesson(999);
      });
      expect(result.current.state.activeRoute).toEqual({
        kind: 'lesson',
        lessonId: 'lesson-07',
      });
    });
  });

  // =========================================================================
  // SECTION E : Tests de préservation de la progression
  // =========================================================================
  describe("E. Préservation intégrale de la progression et de l'état élève", () => {
    it('préserve les étapes complétées par leçon et le profil lors des changements de module', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ({ children }) => <ProgressProvider>{children}</ProgressProvider>,
      });

      act(() => {
        result.current.navigateToLesson('lesson-04');
        result.current.completeStep('lesson-04', 'lesson-04-step-1', false);
        result.current.updateProfileField('business', 'Yoga Studio');
      });

      // Une leçon squelette vide (0 étapes) a toujours 0 % et isCompleted: false
      expect(result.current.getLessonProgress('lesson-04').isCompleted).toBe(false);
      expect(result.current.state.completedStepIdsByLesson['lesson-04']).toEqual([
        'lesson-04-step-1',
      ]);

      act(() => {
        result.current.navigateToCourse('module-03');
      });
      expect(result.current.state.activeRoute).toEqual({
        kind: 'lesson',
        lessonId: 'lesson-06',
      });

      act(() => {
        result.current.navigateToLesson('lesson-04');
      });

      expect(result.current.getLessonProgress('lesson-04').isCompleted).toBe(false);
      expect(result.current.state.completedStepIdsByLesson['lesson-04']).toEqual([
        'lesson-04-step-1',
      ]);
      expect(result.current.state.profile.business).toBe('Yoga Studio');
    });
  });

  // =========================================================================
  // SECTION F : Tests mobiles
  // =========================================================================
  describe('F. MobileNavigation intégration et fermeture après navigation', () => {
    it("ferme le tiroir mobile lors d'une navigation vers un module", () => {
      const onCloseMock = vi.fn();

      render(
        <ProgressProvider>
          <MobileNavigation
            course={COURSE_DATA}
            isOpen={true}
            onToggle={() => {}}
            onClose={onCloseMock}
          />
        </ProgressProvider>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      const courseBtn = screen.getByRole('button', { name: /CRÉER/i });
      fireEvent.click(courseBtn);

      expect(onCloseMock).toHaveBeenCalled();
    });

    it('ferme le tiroir mobile lors de la pression sur Escape', () => {
      const onCloseMock = vi.fn();

      render(
        <ProgressProvider>
          <MobileNavigation
            course={COURSE_DATA}
            isOpen={true}
            onToggle={() => {}}
            onClose={onCloseMock}
          />
        </ProgressProvider>
      );

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
});
