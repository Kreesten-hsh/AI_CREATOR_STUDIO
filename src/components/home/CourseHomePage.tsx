import { CourseHero } from './CourseHero';
import { CourseAffiliateCard } from './CourseAffiliateCard';

export function CourseHomePage() {
  return (
    <div className="space-y-6">
      <CourseHero />
      <CourseAffiliateCard />
    </div>
  );
}
