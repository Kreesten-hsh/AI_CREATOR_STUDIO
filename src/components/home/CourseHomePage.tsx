import { CourseHero } from './CourseHero';
import { CourseOverview } from './CourseOverview';

export function CourseHomePage() {
  return (
    <div className="space-y-10">
      <CourseHero />
      <CourseOverview />
    </div>
  );
}
