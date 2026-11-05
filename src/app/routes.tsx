import { Construction } from 'lucide-react';
import { COURSE_DATA } from '../data/course';
import { useProgress } from '../hooks/useProgress';
import { DayHeader } from '../components/layout/DayHeader';
import { CourseHomePage } from '../components/home/CourseHomePage';
import { BonusView } from '../components/bonus/BonusView';
import { ResourcesView } from '../components/resources/ResourcesView';
import { PracticalSheetsView } from '../components/resources/PracticalSheetsView';
import type { Day } from '../types/course';
import { getCourseById } from '../utils/courseNavigation';

function DayWorkspaceView({ day }: { day: Day }) {
  const sprint = COURSE_DATA.sprints.find((s) => s.id === day.sprintId);
  const { getDayProgress } = useProgress();
  const progress = getDayProgress(day.dayNumber);

  return (
    <div className="space-y-6">
      <DayHeader day={day} sprint={sprint} progress={progress} />

      <section
        aria-label={`Contenu de la Leçon ${String(day.dayNumber).padStart(2, '0')}`}
        className="brutal-card rounded-brutal-card bg-surface p-8 sm:p-12 border-2 border-ink shadow-brutal text-center space-y-4"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 bg-pale-pink border-2 border-ink rounded-brutal-btn shadow-brutal-xs">
          <Construction className="w-7 h-7 text-primary-red" aria-hidden="true" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="font-display text-xl uppercase tracking-tight text-ink">
            Cette leçon est en cours de reconstruction.
          </h3>
          <p className="font-serif text-sm text-ink/75 leading-relaxed">
            Le contenu pédagogique et les exercices pratiques de cette journée seront définis dans la prochaine phase.
          </p>
        </div>
      </section>
    </div>
  );
}

export function CourseWorkspaceRouter() {
  const { state } = useProgress();
  const route = state.activeRoute;

  if (route.kind === 'home' || (route as { kind: string }).kind === 'start-here') {
    return <CourseHomePage />;
  }

  if (route.kind === 'bonus') {
    return <BonusView bonusId={route.bonusId} />;
  }

  if (route.kind === 'resources') {
    return <ResourcesView />;
  }

  if (route.kind === 'practical-sheets') {
    return <PracticalSheetsView />;
  }

  if (route.kind === 'course') {
    const course = getCourseById(route.courseId);
    const startDay = course?.dayRange?.[0] ?? 1;
    const endDay = course?.dayRange?.[1] ?? 3;
    let dayNumber = route.dayNumber ?? startDay;
    if (dayNumber < startDay || dayNumber > endDay) {
      dayNumber = startDay;
    }
    const day =
      COURSE_DATA.days.find((d) => d.dayNumber === dayNumber) ??
      COURSE_DATA.days[0];
    return <DayWorkspaceView day={day} />;
  }

  const dayNumber = (route as { dayNumber?: number }).dayNumber ?? 1;
  const day =
    COURSE_DATA.days.find((d) => d.dayNumber === dayNumber) ??
    COURSE_DATA.days[0];

  return <DayWorkspaceView day={day} />;
}
