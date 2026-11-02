import { useProgress } from './useProgress';
import type { ProfileVariableKey, StudentProfile, VibeSelection } from '../types/course';

export interface UseStudentProfileReturn {
  profile: StudentProfile;
  updateProfileField: (key: ProfileVariableKey, value: string) => void;
  updateCustomVariable: (key: string, value: string) => void;
  updateVibeSelection: (vibe: VibeSelection, brandStyleSummary: string) => void;
}

export function useStudentProfile(): UseStudentProfileReturn {
  const {
    state,
    updateProfileField,
    updateCustomVariable,
    updateVibeSelection,
  } = useProgress();

  return {
    profile: state.profile,
    updateProfileField,
    updateCustomVariable,
    updateVibeSelection,
  };
}
