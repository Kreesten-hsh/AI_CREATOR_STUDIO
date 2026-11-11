import React, { useState } from 'react';
import type { Course } from '../../types/course';
import { useProgress } from '../../hooks/useProgress';
import { MainSidebar } from './MainSidebar';
import { CourseSidebar } from '../course/CourseSidebar';
import { MobileNavigation } from './MobileNavigation';

interface CourseLayoutProps {
  course: Course;
  children: React.ReactNode;
}

export function CourseLayout({ course, children }: CourseLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { state } = useProgress();

  const isInsideCourse = state.activeRoute.kind === 'lesson';

  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col lg:flex-row">
      {/* Sidebar persistante à gauche sur desktop */}
      <div className="hidden lg:block lg:w-80 xl:w-88 shrink-0 lg:h-screen lg:sticky lg:top-0">
        {isInsideCourse ? (
          <CourseSidebar course={course} />
        ) : (
          <MainSidebar />
        )}
      </div>

      {/* Navigation mobile pliable */}
      <MobileNavigation
        course={course}
        isOpen={mobileMenuOpen}
        onToggle={() => setMobileMenuOpen((prev) => !prev)}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Espace de travail pédagogique principal */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Conteneur de contenu principal */}
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 space-y-6">
          {children}
        </main>

        {/* Pied de page sobre */}
        <footer className="mt-12 border-t-2 border-ink bg-surface px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-ink">
          <span>AI CREATOR Studio : Parcours de formation interactif</span>
          <span>Expériences interactives &amp; automatisations</span>
        </footer>
      </div>
    </div>
  );
}
