import React, { useState } from 'react';
import type { Course } from '../../types/course';
import { useProgress } from '../../hooks/useProgress';
import { MainSidebar } from './MainSidebar';
import { CourseSidebar } from '../course/CourseSidebar';
import { MobileNavigation } from './MobileNavigation';

const WHATSAPP_SUPPORT_URL = 'https://wa.me/2290161905259';

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
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 space-y-6">
          {children}
        </main>

        {/* Pied de page support direct WhatsApp 24/24 */}
        <footer className="mt-10 border-t-2 border-ink bg-surface px-4 sm:px-6 md:px-8 py-4">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-sans text-ink">
            <span className="font-semibold text-center">
              Un problème ? Contactez-nous directement 24/24
            </span>
            <a
              href={WHATSAPP_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contacter le support sur WhatsApp (+229 0161905259)"
              className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3 py-1.5 bg-cream hover:bg-pale-pink border-2 border-ink rounded-brutal-btn shadow-brutal-xs transition-colors"
            >
              <svg
                viewBox="0 0 32 32"
                className="w-6 h-6 shrink-0"
                aria-hidden="true"
              >
                <path
                  fill="#25D366"
                  d="M16.04 3C8.87 3 3.04 8.79 3.04 15.92c0 2.54.74 5.01 2.13 7.12L3 29l6.15-2.09a13.06 13.06 0 0 0 6.89 1.95h.01c7.16 0 12.99-5.79 12.99-12.92C29.04 8.79 23.21 3 16.04 3Z"
                />
                <path
                  fill="#FFFFFF"
                  d="M23.62 20.47c-.32.89-1.85 1.71-2.55 1.82-.68.1-1.54.15-2.48-.15-.57-.18-1.31-.42-2.25-.83-3.95-1.7-6.53-5.67-6.73-5.93-.2-.26-1.61-2.14-1.61-4.08 0-1.94 1.02-2.89 1.38-3.28.36-.39.79-.49 1.05-.49.26 0 .53 0 .76.01.24.01.57-.09.89.68.33.79 1.12 2.74 1.22 2.94.1.2.16.43.03.69-.13.26-.2.43-.39.66-.2.23-.41.51-.59.69-.2.2-.4.41-.17.8.23.39 1.03 1.7 2.22 2.75 1.52 1.35 2.81 1.77 3.2 1.97.39.2.62.17.85-.1.23-.26.98-1.14 1.24-1.53.26-.39.52-.33.88-.2.36.13 2.3 1.08 2.69 1.28.39.2.66.3.76.46.1.16.1.95-.22 1.84Z"
                />
              </svg>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
