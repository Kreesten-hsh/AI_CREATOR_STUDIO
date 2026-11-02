import { ProgressProvider } from '../context/ProgressContext';
import { COURSE_DATA } from '../data/course';
import { CourseLayout } from '../components/layout/CourseLayout';
import { CourseWorkspaceRouter } from './routes';

export function App() {
  return (
    <ProgressProvider>
      <CourseLayout course={COURSE_DATA}>
        <CourseWorkspaceRouter />
      </CourseLayout>
    </ProgressProvider>
  );
}

export default App;
