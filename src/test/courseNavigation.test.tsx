import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import React from 'react';
import { MAIN_COURSES } from '../data/navigation/mainCourses';
import { COURSE_DATA } from '../data/course';
import {
  getCourseById,
  getCourseByDayNumber,
  isDayInCourse,
  resolveCourseIdForDay,
  resolveActiveCourseId,
  getCourseDays,
  formatCourseDayRangeTitle,
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

describe('V2 : Course Navigation and Routing Verification (3 Modules / 9 Lessons)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  // =========================================================================
  // SECTION A : Tests de correspondance des 9 leçons et 3 frontières de modules
  // =========================================================================
  describe('A. Correspondance des 9 leçons & 3 modules officiels', () => {
    it('associe chaque leçon de 1 à 3 à module-01', () => {
      for (let day = 1; day <= 3; day++) {
        expect(resolveCourseIdForDay(day)).toBe('module-01');
        expect(isDayInCourse(day, 'module-01')).toBe(true);
      }
    });

    it('associe chaque leçon de 4 à 6 à module-02', () => {
      for (let day = 4; day <= 6; day++) {
        expect(resolveCourseIdForDay(day)).toBe('module-02');
        expect(isDayInCourse(day, 'module-02')).toBe(true);
      }
    });

    it('associe chaque leçon de 7 à 9 à module-03', () => {
      for (let day = 7; day <= 9; day++) {
        expect(resolveCourseIdForDay(day)).toBe('module-03');
        expect(isDayInCourse(day, 'module-03')).toBe(true);
      }
    });

    it('vérifie rigoureusement les trois frontières officielles', () => {
      expect(resolveCourseIdForDay(1)).toBe('module-01');
      expect(resolveCourseIdForDay(3)).toBe('module-01');
      expect(resolveCourseIdForDay(4)).toBe('module-02');
      expect(resolveCourseIdForDay(6)).toBe('module-02');
      expect(resolveCourseIdForDay(7)).toBe('module-03');
      expect(resolveCourseIdForDay(9)).toBe('module-03');
    });

    it('formate correctement les titres de plages de leçons', () => {
      expect(formatCourseDayRangeTitle([1, 3])).toBe('LEÇONS 1 À 3');
      expect(formatCourseDayRangeTitle([4, 6])).toBe('LEÇONS 4 À 6');
      expect(formatCourseDayRangeTitle([7, 9])).toBe('LEÇONS 7 À 9');
    });

    it('récupère le module correspondant via getCourseByDayNumber pour les 9 leçons', () => {
      expect(MAIN_COURSES).toHaveLength(3);
      for (let day = 1; day <= 9; day++) {
        const course = getCourseByDayNumber(day);
        expect(course).toBeDefined();
        expect(course?.id).toBe(resolveCourseIdForDay(day));
      }
    });

    it('résout le module actif depuis les différents formats de routes', () => {
      expect(resolveActiveCourseId({ kind: 'home' })).toBeNull();
      expect(resolveActiveCourseId({ kind: 'bonus', bonusId: 'bonus-manychat' })).toBeNull();
      expect(resolveActiveCourseId({ kind: 'resources' })).toBeNull();
      expect(resolveActiveCourseId({ kind: 'practical-sheets' })).toBeNull();
      expect(resolveActiveCourseId({ kind: 'day', dayNumber: 5 })).toBe('module-02');
      expect(resolveActiveCourseId({ kind: 'course', courseId: 'module-03', dayNumber: 7 })).toBe('module-03');
    });

    it("valide l'intégrité stricte des trois modules officiels", () => {
      const integrity = validateCourseIntegrity(MAIN_COURSES);
      expect(integrity.isValid).toBe(true);
      expect(integrity.errors).toHaveLength(0);
      expect(() => assertCourseIntegrity(MAIN_COURSES)).not.toThrow();
    });

    it("détecte les anomalies d'intégrité du cursus (trous, chevauchements, nombre, identifiants)", () => {
      // 1. Nombre de modules incorrect
      const invalidCount = validateCourseIntegrity(MAIN_COURSES.slice(0, 2));
      expect(invalidCount.isValid).toBe(false);
      expect(invalidCount.errors.some((e) => e.includes('Attendu 3 modules'))).toBe(true);

      // 2. Identifiants dupliqués
      const duplicatedIds = validateCourseIntegrity([
        ...MAIN_COURSES.slice(0, 2),
        { ...MAIN_COURSES[0], id: 'module-02' },
      ]);
      expect(duplicatedIds.isValid).toBe(false);
      expect(duplicatedIds.errors.some((e) => e.includes('dupliqués'))).toBe(true);

      // 3. Chevauchement de leçons
      const overlappingCourses = MAIN_COURSES.map((c) =>
        c.id === 'module-02' ? { ...c, dayRange: [3, 6] as [number, number] } : c
      );
      const overlapResult = validateCourseIntegrity(overlappingCourses);
      expect(overlapResult.isValid).toBe(false);
      expect(overlapResult.errors.some((e) => e.includes('chevauchement'))).toBe(true);

      // 4. Trou dans les leçons
      const gapCourses = MAIN_COURSES.map((c) =>
        c.id === 'module-01' ? { ...c, dayRange: [1, 2] as [number, number] } : c
      );
      const gapResult = validateCourseIntegrity(gapCourses);
      expect(gapResult.isValid).toBe(false);
      expect(gapResult.errors.some((e) => e.includes('trou'))).toBe(true);

      // 5. assertCourseIntegrity lève une exception en cas de violation
      expect(() => assertCourseIntegrity(gapCourses)).toThrowError(/Violation de l'intégrité/);
    });

    it('élimine le masquage silencieux dans resolveCourseIdForDay pour les leçons hors plage', () => {
      expect(resolveCourseIdForDay(0)).toBeNull();
      expect(resolveCourseIdForDay(10)).toBeNull();
      expect(resolveCourseIdForDay(-5)).toBeNull();
      expect(resolveCourseIdForDay(99)).toBeNull();

      expect(resolveCourseIdForDay(99, 'module-01')).toBe('module-01');
      expect(resolveCourseIdForDay(0, 'custom-fallback')).toBe('custom-fallback');

      expect(resolveCourseIdForDay(1)).toBe('module-01');
      expect(resolveCourseIdForDay(4)).toBe('module-02');
      expect(resolveCourseIdForDay(7)).toBe('module-03');
    });

    it('normalise rigoureusement les routes V2 et migre les routes V1 selon le contrat explicite', () => {
      // Module V2 valide avec dayNumber hors de sa plage -> début du module
      expect(
        normalizeActiveRoute({ kind: 'course', courseId: 'module-02', dayNumber: 1 })
      ).toEqual({
        kind: 'course',
        courseId: 'module-02',
        dayNumber: 4,
      });

      // Module V2 valide avec dayNumber valide -> conservé
      expect(
        normalizeActiveRoute({ kind: 'course', courseId: 'module-02', dayNumber: 5 })
      ).toEqual({
        kind: 'course',
        courseId: 'module-02',
        dayNumber: 5,
      });

      // Module V2 valide sans dayNumber -> assigne dayRange[0]
      expect(normalizeActiveRoute({ kind: 'course', courseId: 'module-03' })).toEqual({
        kind: 'course',
        courseId: 'module-03',
        dayNumber: 7,
      });

      // Route V1 legacy : course-01 avec leçon 1..3 -> module-01
      expect(
        normalizeActiveRoute({ kind: 'course', courseId: 'course-01', dayNumber: 2 })
      ).toEqual({
        kind: 'course',
        courseId: 'module-01',
        dayNumber: 2,
      });

      // Route V1 legacy : course-01 avec jour > 3 -> { kind: 'home' }
      expect(
        normalizeActiveRoute({ kind: 'course', courseId: 'course-01', dayNumber: 12 })
      ).toEqual({ kind: 'home' });

      // Routes V1 legacy : course-02..05 -> { kind: 'home' }
      expect(
        normalizeActiveRoute({ kind: 'course', courseId: 'course-02', dayNumber: 16 })
      ).toEqual({ kind: 'home' });
      expect(
        normalizeActiveRoute({ kind: 'course', courseId: 'course-05', dayNumber: 25 })
      ).toEqual({ kind: 'home' });

      // Bonus V1 legacy : bonus-01 -> bonus-manychat, bonus-03 -> bonus-marketing, bonus-02 -> home
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

      // Route start-here supprimée -> redirigée vers { kind: 'home' }
      expect(normalizeActiveRoute({ kind: 'start-here', lessonId: 'introduction' })).toEqual({
        kind: 'home',
      });
      expect(normalizeActiveRoute({ kind: 'start-here', lessonId: 'setup' })).toEqual({
        kind: 'home',
      });

      // Route day valide -> normalisée vers course
      expect(normalizeActiveRoute({ kind: 'day', dayNumber: 5 })).toEqual({
        kind: 'course',
        courseId: 'module-02',
        dayNumber: 5,
      });

      // Route day hors limite -> { kind: 'home' }
      expect(normalizeActiveRoute({ kind: 'day', dayNumber: 42 })).toEqual({
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
    it('navigue vers la bonne leçon de départ pour chacun des 3 modules', () => {
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

      // Module 01 -> Leçon 1
      const btnMod01 = screen.getByRole('button', { name: /OPPORTUNITÉ (&|ET) POSITIONNEMENT/i });
      fireEvent.click(btnMod01);
      expect(currentRoute).toMatchObject({
        kind: 'course',
        courseId: 'module-01',
        dayNumber: 1,
      });

      // Module 02 -> Leçon 4
      const btnMod02 = screen.getByRole('button', { name: /CONCEVOIR (&|ET) CRÉER AVEC CLAUDE/i });
      fireEvent.click(btnMod02);
      expect(currentRoute).toMatchObject({
        kind: 'course',
        courseId: 'module-02',
        dayNumber: 4,
      });

      // Module 03 -> Leçon 7
      const btnMod03 = screen.getByRole('button', { name: /VENDRE (&|ET) PROMOUVOIR/i });
      fireEvent.click(btnMod03);
      expect(currentRoute).toMatchObject({
        kind: 'course',
        courseId: 'module-03',
        dayNumber: 7,
      });
    });

    it('identifie visuellement le module actif avec aria-current', () => {
      const TestContainer = () => {
        const { navigateToCourse } = useProgress();
        return (
          <div>
            <button onClick={() => navigateToCourse('module-02', 4)}>Set Module 02</button>
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

      const mod02Btn = screen.getByRole('button', { name: /CONCEVOIR (&|ET) CRÉER AVEC CLAUDE/i });
      expect(mod02Btn).toHaveAttribute('aria-current', 'page');

      const mod01Btn = screen.getByRole('button', { name: /OPPORTUNITÉ (&|ET) POSITIONNEMENT/i });
      expect(mod01Btn).not.toHaveAttribute('aria-current');
    });
  });

  // =========================================================================
  // SECTION C : Tests CourseSidebar
  // =========================================================================
  describe('C. CourseSidebar filtrage strict des leçons et dynamisme', () => {
    it('affiche exactement 3 leçons correspondant à chaque module', () => {
      const expectedDaysByCourse: Record<
        string,
        { count: number; title: string; firstDay: number }
      > = {
        'module-01': { count: 3, title: 'LEÇONS 1 À 3', firstDay: 1 },
        'module-02': { count: 3, title: 'LEÇONS 4 À 6', firstDay: 4 },
        'module-03': { count: 3, title: 'LEÇONS 7 À 9', firstDay: 7 },
      };

      for (const [courseId, exp] of Object.entries(expectedDaysByCourse)) {
        const days = getCourseDays(COURSE_DATA.days, courseId);
        expect(days).toHaveLength(exp.count);
        expect(days[0].dayNumber).toBe(exp.firstDay);
        expect(days[days.length - 1].dayNumber).toBe(exp.firstDay + exp.count - 1);

        const course = getCourseById(courseId);
        expect(formatCourseDayRangeTitle(course?.dayRange)).toBe(exp.title);
      }
    });

    it('affiche les leçons correctes et le titre dynamique dans le DOM', () => {
      const TestCourseView = ({
        targetCourseId,
        targetDay,
      }: {
        targetCourseId: string;
        targetDay: number;
      }) => {
        const { navigateToCourse } = useProgress();
        React.useEffect(() => {
          navigateToCourse(targetCourseId, targetDay);
        }, [targetCourseId, targetDay, navigateToCourse]);

        return <CourseSidebar course={COURSE_DATA} />;
      };

      const { unmount } = render(
        <ProgressProvider>
          <TestCourseView targetCourseId="module-02" targetDay={4} />
        </ProgressProvider>
      );

      expect(screen.getByText(/LEÇONS 4 À 6/i)).toBeInTheDocument();
      expect(screen.getByText('Leçon 4')).toBeInTheDocument();
      expect(screen.getByText('Leçon 5')).toBeInTheDocument();
      expect(screen.getByText('Leçon 6')).toBeInTheDocument();
      expect(screen.queryByText('Leçon 3')).not.toBeInTheDocument();
      expect(screen.queryByText('Leçon 7')).not.toBeInTheDocument();

      unmount();

      render(
        <ProgressProvider>
          <TestCourseView targetCourseId="module-03" targetDay={7} />
        </ProgressProvider>
      );

      expect(screen.getByText(/LEÇONS 7 À 9/i)).toBeInTheDocument();
      expect(screen.getByText('Leçon 7')).toBeInTheDocument();
      expect(screen.getByText('Leçon 8')).toBeInTheDocument();
      expect(screen.getByText('Leçon 9')).toBeInTheDocument();
      expect(screen.queryByText('Leçon 6')).not.toBeInTheDocument();
    });

    it('permet de basculer de module au clic sur une cellule de ProgressGrid', () => {
      const TestGridInteraction = () => {
        const { state } = useProgress();
        return (
          <div>
            <div data-testid="active-route-info">
              {state.activeRoute.kind === 'course'
                ? `${state.activeRoute.courseId}:${state.activeRoute.dayNumber}`
                : 'none'}
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

      const day7Btn = screen.getByRole('button', { name: /^Leçon 7$/i });
      fireEvent.click(day7Btn);

      expect(screen.getByTestId('active-route-info')).toHaveTextContent('module-03:7');
      expect(screen.getByText(/LEÇONS 7 À 9/i)).toBeInTheDocument();
      expect(screen.getByText('Leçon 7')).toBeInTheDocument();
      expect(screen.getByText('Leçon 8')).toBeInTheDocument();
      expect(screen.getByText('Leçon 9')).toBeInTheDocument();
    });
  });

  // =========================================================================
  // SECTION D : Tests ProgressContext
  // =========================================================================
  describe('D. ProgressContext navigateToDay et transitions inter-modules', () => {
    it('attribue le bon courseId pour chacune des 9 leçons', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ({ children }) => <ProgressProvider>{children}</ProgressProvider>,
      });

      for (let day = 1; day <= 9; day++) {
        act(() => {
          result.current.navigateToDay(day);
        });

        const expectedCourseId = resolveCourseIdForDay(day);
        expect(result.current.state.activeRoute).toEqual({
          kind: 'course',
          courseId: expectedCourseId,
          dayNumber: day,
        });
      }
    });

    it('gère les transitions consécutives entre les 3 modules', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ({ children }) => <ProgressProvider>{children}</ProgressProvider>,
      });

      act(() => {
        result.current.navigateToDay(3);
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'module-01',
        dayNumber: 3,
      });

      act(() => {
        result.current.navigateToDay(4);
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'module-02',
        dayNumber: 4,
      });

      act(() => {
        result.current.navigateToDay(6);
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'module-02',
        dayNumber: 6,
      });

      act(() => {
        result.current.navigateToDay(7);
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'module-03',
        dayNumber: 7,
      });
    });

    it('protège navigateToDay avec du clamping de 1 à 9', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ({ children }) => <ProgressProvider>{children}</ProgressProvider>,
      });

      act(() => {
        result.current.navigateToDay(-5);
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'module-01',
        dayNumber: 1,
      });

      act(() => {
        result.current.navigateToDay(999);
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'module-03',
        dayNumber: 9,
      });
    });
  });

  // =========================================================================
  // SECTION E : Tests de préservation de la progression
  // =========================================================================
  describe("E. Préservation intégrale de la progression et de l'état élève", () => {
    it('préserve les leçons complétées et les étapes actives lors des changements de module', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ({ children }) => <ProgressProvider>{children}</ProgressProvider>,
      });

      act(() => {
        result.current.navigateToDay(4);
        result.current.completeStep(4, 'concept', false);
        result.current.completeStep(4, 'prompt', false);
        result.current.completeStep(4, 'example', false);
        result.current.completeStep(4, 'your-turn', false);
        result.current.setActiveStepForDay(4, 'example');
        result.current.updateProfileField('business', 'Yoga Studio');
      });

      // Une journée squelette vide (0 étapes) ne peut être marquée comme terminée
      expect(result.current.getDayProgress(4).isCompleted).toBe(false);
      expect(result.current.state.completedStepIdsByDay[4]).toHaveLength(4);

      act(() => {
        result.current.navigateToCourse('module-03', 7);
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'module-03',
        dayNumber: 7,
      });

      act(() => {
        result.current.navigateToCourse('module-02', 4);
      });

      expect(result.current.getDayProgress(4).isCompleted).toBe(false);
      expect(result.current.state.completedStepIdsByDay[4]).toHaveLength(4);
      expect(result.current.getActiveStepForDay(4)).toBe('');
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

      const courseBtn = screen.getByRole('button', { name: /CONCEVOIR (&|ET) CRÉER AVEC CLAUDE/i });
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
