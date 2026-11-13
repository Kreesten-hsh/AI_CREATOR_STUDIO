import { useCallback, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { AuthProvider } from '../context/AuthContext';
import { ProgressProvider } from '../context/ProgressContext';
import { BuyerAuthGate } from '../components/auth/BuyerAuthGate';
import { COURSE_DATA } from '../data/course';
import { CourseLayout } from '../components/layout/CourseLayout';
import { ErrorBoundary } from '../components/layout/ErrorBoundary';
import { ModuleCompletionDialog } from '../components/course/ModuleCompletionDialog';
import { CourseWorkspaceRouter } from './routes';
import { safeResetActiveRouteToHome } from '../utils/storage';

export interface AppProps {
  forceAuthRequired?: boolean;
}

export function App({ forceAuthRequired }: AppProps = {}) {
  const [boundaryKey, setBoundaryKey] = useState(0);

  const handleResetToHome = useCallback(() => {
    safeResetActiveRouteToHome();
    setBoundaryKey((k) => k + 1);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ErrorBoundary key={boundaryKey} onReset={handleResetToHome}>
        <AuthProvider forceAuthRequired={forceAuthRequired}>
          <BuyerAuthGate>
            <ProgressProvider>
              <CourseLayout course={COURSE_DATA}>
                <CourseWorkspaceRouter />
              </CourseLayout>
              <ModuleCompletionDialog />
            </ProgressProvider>
          </BuyerAuthGate>
        </AuthProvider>
      </ErrorBoundary>
    </MotionConfig>
  );
}

export default App;
