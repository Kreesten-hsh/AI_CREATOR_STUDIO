import { useCallback, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { ProgressProvider } from '../context/ProgressContext';
import { COURSE_DATA } from '../data/course';
import { CourseLayout } from '../components/layout/CourseLayout';
import { ErrorBoundary } from '../components/layout/ErrorBoundary';
import { ModuleCompletionDialog } from '../components/course/ModuleCompletionDialog';
import { CourseWorkspaceRouter } from './routes';
import { safeResetActiveRouteToHome } from '../utils/storage';

export function App() {
  const [boundaryKey, setBoundaryKey] = useState(0);

  const handleResetToHome = useCallback(() => {
    safeResetActiveRouteToHome();
    setBoundaryKey((k) => k + 1);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ErrorBoundary key={boundaryKey} onReset={handleResetToHome}>
        <ProgressProvider>
          <CourseLayout course={COURSE_DATA}>
            <CourseWorkspaceRouter />
          </CourseLayout>
          <ModuleCompletionDialog />
        </ProgressProvider>
      </ErrorBoundary>
    </MotionConfig>
  );
}

export default App;
