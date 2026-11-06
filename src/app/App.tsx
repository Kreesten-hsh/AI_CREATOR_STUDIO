import { useCallback, useState } from 'react';
import { ProgressProvider } from '../context/ProgressContext';
import { COURSE_DATA } from '../data/course';
import { CourseLayout } from '../components/layout/CourseLayout';
import { ErrorBoundary } from '../components/layout/ErrorBoundary';
import { CourseWorkspaceRouter } from './routes';
import { safeResetActiveRouteToHome } from '../utils/storage';

export function App() {
  const [boundaryKey, setBoundaryKey] = useState(0);

  const handleResetToHome = useCallback(() => {
    safeResetActiveRouteToHome();
    setBoundaryKey((k) => k + 1);
  }, []);

  return (
    <ErrorBoundary key={boundaryKey} onReset={handleResetToHome}>
      <ProgressProvider>
        <CourseLayout course={COURSE_DATA}>
          <CourseWorkspaceRouter />
        </CourseLayout>
      </ProgressProvider>
    </ErrorBoundary>
  );
}

export default App;
