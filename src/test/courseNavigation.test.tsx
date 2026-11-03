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

describe('MISSION 02 : Course Navigation and Routing Verification', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  // =========================================================================
  // SECTION A : Tests de correspondance des journées et frontières
  // =========================================================================
  describe('A. Correspondance des 25 journées & 5 frontières officielles', () => {
    it('associe chaque jour de 1 à 15 à course-01', () => {
      for (let day = 1; day <= 15; day++) {
        expect(resolveCourseIdForDay(day)).toBe('course-01');
        expect(isDayInCourse(day, 'course-01')).toBe(true);
      }
    });

    it('associe chaque jour de 16 à 17 à course-02', () => {
      for (let day = 16; day <= 17; day++) {
        expect(resolveCourseIdForDay(day)).toBe('course-02');
        expect(isDayInCourse(day, 'course-02')).toBe(true);
      }
    });

    it('associe chaque jour de 18 à 20 à course-03', () => {
      for (let day = 18; day <= 20; day++) {
        expect(resolveCourseIdForDay(day)).toBe('course-03');
        expect(isDayInCourse(day, 'course-03')).toBe(true);
      }
    });

    it('associe chaque jour de 21 à 23 à course-04', () => {
      for (let day = 21; day <= 23; day++) {
        expect(resolveCourseIdForDay(day)).toBe('course-04');
        expect(isDayInCourse(day, 'course-04')).toBe(true);
      }
    });

    it('associe chaque jour de 24 à 25 à course-05', () => {
      for (let day = 24; day <= 25; day++) {
        expect(resolveCourseIdForDay(day)).toBe('course-05');
        expect(isDayInCourse(day, 'course-05')).toBe(true);
      }
    });

    it('vérifie rigoureusement les cinq frontières officielles', () => {
      expect(resolveCourseIdForDay(1)).toBe('course-01');
      expect(resolveCourseIdForDay(15)).toBe('course-01');
      expect(resolveCourseIdForDay(16)).toBe('course-02');
      expect(resolveCourseIdForDay(17)).toBe('course-02');
      expect(resolveCourseIdForDay(18)).toBe('course-03');
      expect(resolveCourseIdForDay(20)).toBe('course-03');
      expect(resolveCourseIdForDay(21)).toBe('course-04');
      expect(resolveCourseIdForDay(23)).toBe('course-04');
      expect(resolveCourseIdForDay(24)).toBe('course-05');
      expect(resolveCourseIdForDay(25)).toBe('course-05');
    });

    it('formate correctement les titres de plages de journées', () => {
      expect(formatCourseDayRangeTitle([1, 15])).toBe('JOURS 1 À 15');
      expect(formatCourseDayRangeTitle([16, 17])).toBe('JOURS 16 À 17');
      expect(formatCourseDayRangeTitle([18, 20])).toBe('JOURS 18 À 20');
      expect(formatCourseDayRangeTitle([21, 23])).toBe('JOURS 21 À 23');
      expect(formatCourseDayRangeTitle([24, 25])).toBe('JOURS 24 À 25');
    });

    it('récupère le cours correspondant via getCourseByDayNumber pour les 25 journées', () => {
      expect(MAIN_COURSES).toHaveLength(5);
      for (let day = 1; day <= 25; day++) {
        const course = getCourseByDayNumber(day);
        expect(course).toBeDefined();
        expect(course?.id).toBe(resolveCourseIdForDay(day));
      }
    });

    it('résout la formation active depuis les différents formats de routes', () => {
      expect(resolveActiveCourseId({ kind: 'home' })).toBeNull();
      expect(resolveActiveCourseId({ kind: 'bonus', bonusId: 'bonus-01' })).toBeNull();
      expect(resolveActiveCourseId({ kind: 'resources' })).toBeNull();
      expect(resolveActiveCourseId({ kind: 'start-here', lessonId: 'intro' })).toBe('course-01');
      expect(resolveActiveCourseId({ kind: 'day', dayNumber: 16 })).toBe('course-02');
      expect(resolveActiveCourseId({ kind: 'course', courseId: 'course-03', dayNumber: 18 })).toBe('course-03');
    });

    it('valide l\'intégrité stricte des cinq formations officielles', () => {
      const integrity = validateCourseIntegrity(MAIN_COURSES);
      expect(integrity.isValid).toBe(true);
      expect(integrity.errors).toHaveLength(0);
      expect(() => assertCourseIntegrity(MAIN_COURSES)).not.toThrow();
    });

    it('détecte les anomalies d\'intégrité du cursus (trous, chevauchements, nombre, identifiants)', () => {
      // 1. Nombre de formations incorrect
      const invalidCount = validateCourseIntegrity(MAIN_COURSES.slice(0, 4));
      expect(invalidCount.isValid).toBe(false);
      expect(invalidCount.errors.some((e) => e.includes('Attendu 5 formations'))).toBe(true);

      // 2. Identifiants dupliqués
      const duplicatedIds = validateCourseIntegrity([
        ...MAIN_COURSES.slice(0, 4),
        { ...MAIN_COURSES[0], id: 'course-04' },
      ]);
      expect(duplicatedIds.isValid).toBe(false);
      expect(duplicatedIds.errors.some((e) => e.includes('dupliqués'))).toBe(true);

      // 3. Chevauchement de journées
      const overlappingCourses = MAIN_COURSES.map((c) =>
        c.id === 'course-02' ? { ...c, dayRange: [15, 17] as [number, number] } : c
      );
      const overlapResult = validateCourseIntegrity(overlappingCourses);
      expect(overlapResult.isValid).toBe(false);
      expect(overlapResult.errors.some((e) => e.includes('chevauchement'))).toBe(true);

      // 4. Trou dans les journées
      const gapCourses = MAIN_COURSES.map((c) =>
        c.id === 'course-01' ? { ...c, dayRange: [1, 14] as [number, number] } : c
      );
      const gapResult = validateCourseIntegrity(gapCourses);
      expect(gapResult.isValid).toBe(false);
      expect(gapResult.errors.some((e) => e.includes('trou'))).toBe(true);

      // 5. assertCourseIntegrity lève une exception en cas de violation
      expect(() => assertCourseIntegrity(gapCourses)).toThrowError(/Violation de l'intégrité/);
    });

    it('élimine le masquage silencieux dans resolveCourseIdForDay pour les jours hors plage', () => {
      // Jours hors de 1 à 25 sans fallback explicite -> retourne null
      expect(resolveCourseIdForDay(0)).toBeNull();
      expect(resolveCourseIdForDay(26)).toBeNull();
      expect(resolveCourseIdForDay(-5)).toBeNull();
      expect(resolveCourseIdForDay(99)).toBeNull();

      // Jours hors de 1 à 25 avec fallback explicite -> retourne le fallback
      expect(resolveCourseIdForDay(99, 'course-01')).toBe('course-01');
      expect(resolveCourseIdForDay(0, 'custom-fallback')).toBe('custom-fallback');

      // Jours valides 1 à 25 -> retourne la formation officielle
      expect(resolveCourseIdForDay(1)).toBe('course-01');
      expect(resolveCourseIdForDay(16)).toBe('course-02');
      expect(resolveCourseIdForDay(18)).toBe('course-03');
      expect(resolveCourseIdForDay(21)).toBe('course-04');
      expect(resolveCourseIdForDay(24)).toBe('course-05');
    });

    it('normalise rigoureusement les routes restaurées selon toutes les règles', () => {
      // Cas obligatoire : course-02 avec dayNumber: 1 -> normalisé à dayNumber: 16 (début de course-02)
      expect(
        normalizeActiveRoute({ kind: 'course', courseId: 'course-02', dayNumber: 1 })
      ).toEqual({
        kind: 'course',
        courseId: 'course-02',
        dayNumber: 16,
      });

      // courseId valide avec dayNumber valide dans la plage -> conservé
      expect(
        normalizeActiveRoute({ kind: 'course', courseId: 'course-02', dayNumber: 17 })
      ).toEqual({
        kind: 'course',
        courseId: 'course-02',
        dayNumber: 17,
      });

      // courseId valide avec dayNumber absent -> assigne dayRange[0]
      expect(normalizeActiveRoute({ kind: 'course', courseId: 'course-03' })).toEqual({
        kind: 'course',
        courseId: 'course-03',
        dayNumber: 18,
      });

      // courseId valide avec dayNumber hors plage supérieure -> assigne dayRange[0]
      expect(
        normalizeActiveRoute({ kind: 'course', courseId: 'course-05', dayNumber: 99 })
      ).toEqual({
        kind: 'course',
        courseId: 'course-05',
        dayNumber: 24,
      });

      // courseId invalide mais dayNumber valide (ex. 22) -> résout vers course-04
      expect(
        normalizeActiveRoute({ kind: 'course', courseId: 'inconnu', dayNumber: 22 })
      ).toEqual({
        kind: 'course',
        courseId: 'course-04',
        dayNumber: 22,
      });

      // courseId invalide et dayNumber invalide -> fallback course-01 jour 1
      expect(
        normalizeActiveRoute({ kind: 'course', courseId: 'inconnu', dayNumber: 999 })
      ).toEqual({
        kind: 'course',
        courseId: 'course-01',
        dayNumber: 1,
      });

      // Route de type day valide -> normalisée vers course avec bon courseId
      expect(normalizeActiveRoute({ kind: 'day', dayNumber: 16 })).toEqual({
        kind: 'course',
        courseId: 'course-02',
        dayNumber: 16,
      });

      // Route de type day invalide -> fallback course-01 jour 1
      expect(normalizeActiveRoute({ kind: 'day', dayNumber: 42 })).toEqual({
        kind: 'course',
        courseId: 'course-01',
        dayNumber: 1,
      });

      // Routes home, resources, bonus
      expect(normalizeActiveRoute({ kind: 'home' })).toEqual({ kind: 'home' });
      expect(normalizeActiveRoute({ kind: 'resources' })).toEqual({ kind: 'resources' });
      expect(normalizeActiveRoute({ kind: 'bonus', bonusId: 'bonus-01' })).toEqual({
        kind: 'bonus',
        bonusId: 'bonus-01',
      });
      expect(normalizeActiveRoute({ kind: 'bonus', bonusId: '' })).toEqual({ kind: 'home' });

      // Entrées non-objets ou nulles -> fallback home
      expect(normalizeActiveRoute(null)).toEqual({ kind: 'home' });
      expect(normalizeActiveRoute(undefined)).toEqual({ kind: 'home' });
      expect(normalizeActiveRoute('invalid')).toEqual({ kind: 'home' });
    });
  });

  // =========================================================================
  // SECTION B : Tests MainSidebar
  // =========================================================================
  describe('B. MainSidebar navigation and active course identification', () => {
    it('navigue vers le bon jour de départ pour chacune des 5 formations', () => {
      let currentRoute: any;
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

      // 01 : COMMENCER ICI -> Jour 1
      const btnCourse01 = screen.getByRole('button', { name: /COMMENCER ICI/i });
      fireEvent.click(btnCourse01);
      expect(currentRoute).toMatchObject({
        kind: 'course',
        courseId: 'course-01',
        dayNumber: 1,
      });

      // 02 : PARLONS-EN -> Jour 16
      const btnCourse02 = screen.getByRole('button', { name: /PARLONS-EN/i });
      fireEvent.click(btnCourse02);
      expect(currentRoute).toMatchObject({
        kind: 'course',
        courseId: 'course-02',
        dayNumber: 16,
      });

      // 03 : FAITES-LE VÔTRE -> Jour 18
      const btnCourse03 = screen.getByRole('button', { name: /FAITES-LE VÔTRE/i });
      fireEvent.click(btnCourse03);
      expect(currentRoute).toMatchObject({
        kind: 'course',
        courseId: 'course-03',
        dayNumber: 18,
      });

      // 04 : CONCEVOIR + CONSTRUIRE -> Jour 21
      const btnCourse04 = screen.getByRole('button', { name: /CONCEVOIR \+ CONSTRUIRE/i });
      fireEvent.click(btnCourse04);
      expect(currentRoute).toMatchObject({
        kind: 'course',
        courseId: 'course-04',
        dayNumber: 21,
      });

      // 05 : HÉBERGEZ-LE -> Jour 24
      const btnCourse05 = screen.getByRole('button', { name: /HÉBERGEZ-LE/i });
      fireEvent.click(btnCourse05);
      expect(currentRoute).toMatchObject({
        kind: 'course',
        courseId: 'course-05',
        dayNumber: 24,
      });
    });

    it('identifie visuellement la formation active avec aria-current', () => {
      const TestContainer = () => {
        const { navigateToCourse } = useProgress();
        return (
          <div>
            <button onClick={() => navigateToCourse('course-03', 18)}>Set Course 03</button>
            <MainSidebar />
          </div>
        );
      };

      render(
        <ProgressProvider>
          <TestContainer />
        </ProgressProvider>
      );

      fireEvent.click(screen.getByText('Set Course 03'));

      const course03Btn = screen.getByRole('button', { name: /FAITES-LE VÔTRE/i });
      expect(course03Btn).toHaveAttribute('aria-current', 'page');

      const course01Btn = screen.getByRole('button', { name: /COMMENCER ICI/i });
      expect(course01Btn).not.toHaveAttribute('aria-current');
    });
  });

  // =========================================================================
  // SECTION C : Tests CourseSidebar
  // =========================================================================
  describe('C. CourseSidebar filtrage strict des leçons et dynamisme', () => {
    it('affiche exactement le nombre de journées correspondant à chaque formation', () => {
      const expectedDaysByCourse: Record<string, { count: number; title: string; firstDay: number }> = {
        'course-01': { count: 15, title: 'JOURS 1 À 15', firstDay: 1 },
        'course-02': { count: 2, title: 'JOURS 16 À 17', firstDay: 16 },
        'course-03': { count: 3, title: 'JOURS 18 À 20', firstDay: 18 },
        'course-04': { count: 3, title: 'JOURS 21 À 23', firstDay: 21 },
        'course-05': { count: 2, title: 'JOURS 24 À 25', firstDay: 24 },
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
      const TestCourseView = ({ targetCourseId, targetDay }: { targetCourseId: string; targetDay: number }) => {
        const { navigateToCourse } = useProgress();
        React.useEffect(() => {
          navigateToCourse(targetCourseId, targetDay);
        }, [targetCourseId, targetDay, navigateToCourse]);

        return <CourseSidebar course={COURSE_DATA} />;
      };

      // Test avec course-02 (PARLONS-EN : Jours 16 et 17)
      const { unmount } = render(
        <ProgressProvider>
          <TestCourseView targetCourseId="course-02" targetDay={16} />
        </ProgressProvider>
      );

      expect(screen.getByText('JOURS 16 À 17')).toBeInTheDocument();
      expect(screen.getByText('Jour 16')).toBeInTheDocument();
      expect(screen.getByText('Jour 17')).toBeInTheDocument();
      expect(screen.queryByText('Jour 15')).not.toBeInTheDocument();
      expect(screen.queryByText('Jour 18')).not.toBeInTheDocument();

      unmount();

      // Test avec course-05 (HÉBERGEZ-LE : Jours 24 et 25)
      render(
        <ProgressProvider>
          <TestCourseView targetCourseId="course-05" targetDay={24} />
        </ProgressProvider>
      );

      expect(screen.getByText('JOURS 24 À 25')).toBeInTheDocument();
      expect(screen.getByText('Jour 24')).toBeInTheDocument();
      expect(screen.getByText('Jour 25')).toBeInTheDocument();
      expect(screen.queryByText('Jour 23')).not.toBeInTheDocument();
    });

    it('permet de basculer de formation au clic sur une cellule de ProgressGrid', () => {
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

      // Clic sur le Jour 18 dans la grille globale (Jour 18 appartient à course-03)
      const day18Btn = screen.getByRole('button', { name: /Jour 18/i });
      fireEvent.click(day18Btn);

      expect(screen.getByTestId('active-route-info')).toHaveTextContent('course-03:18');
      expect(screen.getByText('JOURS 18 À 20')).toBeInTheDocument();
      expect(screen.getByText('Jour 18')).toBeInTheDocument();
      expect(screen.getByText('Jour 19')).toBeInTheDocument();
      expect(screen.getByText('Jour 20')).toBeInTheDocument();
      expect(screen.queryByText('Jour 17')).not.toBeInTheDocument();
    });
  });

  // =========================================================================
  // SECTION D : Tests ProgressContext
  // =========================================================================
  describe('D. ProgressContext navigateToDay et transitions inter-formations', () => {
    it('attribue le bon courseId pour chacune des 25 journées', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ({ children }) => <ProgressProvider>{children}</ProgressProvider>,
      });

      for (let day = 1; day <= 25; day++) {
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

    it('gère parfaitement les 4 transitions consécutives entre formations', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ({ children }) => <ProgressProvider>{children}</ProgressProvider>,
      });

      // Transition 1 : Jour 15 -> Jour 16 (course-01 -> course-02)
      act(() => {
        result.current.navigateToDay(15);
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'course-01',
        dayNumber: 15,
      });

      act(() => {
        result.current.navigateToDay(16);
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'course-02',
        dayNumber: 16,
      });

      // Transition 2 : Jour 17 -> Jour 18 (course-02 -> course-03)
      act(() => {
        result.current.navigateToDay(17);
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'course-02',
        dayNumber: 17,
      });

      act(() => {
        result.current.navigateToDay(18);
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'course-03',
        dayNumber: 18,
      });

      // Transition 3 : Jour 20 -> Jour 21 (course-03 -> course-04)
      act(() => {
        result.current.navigateToDay(20);
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'course-03',
        dayNumber: 20,
      });

      act(() => {
        result.current.navigateToDay(21);
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'course-04',
        dayNumber: 21,
      });

      // Transition 4 : Jour 23 -> Jour 24 (course-04 -> course-05)
      act(() => {
        result.current.navigateToDay(23);
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'course-04',
        dayNumber: 23,
      });

      act(() => {
        result.current.navigateToDay(24);
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'course-05',
        dayNumber: 24,
      });
    });

    it('protège navigateToCourse contre les jours hors limites', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ({ children }) => <ProgressProvider>{children}</ProgressProvider>,
      });

      // Si on demande course-02 avec le Jour 1 (invalide), cela force le premier jour valide (Jour 16)
      act(() => {
        result.current.navigateToCourse('course-02', 1);
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'course-02',
        dayNumber: 16,
      });

      // Si on demande course-04 sans jour, cela ouvre le Jour 21
      act(() => {
        result.current.navigateToCourse('course-04');
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'course-04',
        dayNumber: 21,
      });

      // Si on demande un courseId invalide, repli sur course-01
      act(() => {
        result.current.navigateToCourse('course-invalid');
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'course-01',
        dayNumber: 1,
      });
    });

    it('protège navigateToDay avec du clamping de 1 à 25', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ({ children }) => <ProgressProvider>{children}</ProgressProvider>,
      });

      act(() => {
        result.current.navigateToDay(-5);
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'course-01',
        dayNumber: 1,
      });

      act(() => {
        result.current.navigateToDay(999);
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'course-05',
        dayNumber: 25,
      });
    });
  });

  // =========================================================================
  // SECTION E : Tests de préservation de la progression
  // =========================================================================
  describe('E. Préservation intégrale de la progression et de l\'état élève', () => {
    it('préserve les leçons complétées et les étapes actives lors des changements de cours', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ({ children }) => <ProgressProvider>{children}</ProgressProvider>,
      });

      // Valider toutes les étapes du Jour 16 (course-02)
      act(() => {
        result.current.navigateToDay(16);
        result.current.completeStep(16, 'concept', false);
        result.current.completeStep(16, 'prompt', false);
        result.current.completeStep(16, 'example', false);
        result.current.completeStep(16, 'your-turn', false);
        result.current.setActiveStepForDay(16, 'example');
        result.current.updateProfileField('business', 'Yoga Studio');
      });

      expect(result.current.getDayProgress(16).isCompleted).toBe(true);

      // Changer pour course-04 (Jour 21)
      act(() => {
        result.current.navigateToCourse('course-04', 21);
      });
      expect(result.current.state.activeRoute).toMatchObject({
        courseId: 'course-04',
        dayNumber: 21,
      });

      // Revenir à course-02 (Jour 16)
      act(() => {
        result.current.navigateToCourse('course-02', 16);
      });

      // Vérifier que la progression, l'étape active et le profil sont restés intacts
      expect(result.current.getDayProgress(16).isCompleted).toBe(true);
      expect(result.current.getActiveStepForDay(16)).toBe('example');
      expect(result.current.state.profile.business).toBe('Yoga Studio');
    });
  });

  // =========================================================================
  // SECTION F : Tests mobiles
  // =========================================================================
  describe('F. MobileNavigation intégration et fermeture après navigation', () => {
    it('ferme le tiroir mobile lors d\'une navigation vers un cours', () => {
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

      // Le tiroir est ouvert en modal
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Clic sur une formation
      const courseBtn = screen.getByRole('button', { name: /PARLONS-EN/i });
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
