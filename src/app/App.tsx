import { ProgressProvider } from '../context/ProgressContext';
import { COURSE_DATA } from '../data/course';
import { CourseLayout } from '../components/layout/CourseLayout';
import { ErrorBoundary } from '../components/layout/ErrorBoundary';
import { CourseWorkspaceRouter } from './routes';

export function App() {
  return (
    <ErrorBoundary>
      <ProgressProvider>
        <CourseLayout course={COURSE_DATA}>
          <CourseWorkspaceRouter />
        </CourseLayout>
      </ProgressProvider>
    </ErrorBoundary>
  );
}

export default App;
