export type StepType = 'concept' | 'prompt' | 'example' | 'your-turn';

export const ALL_STEP_TYPES: readonly StepType[] = [
  'concept',
  'prompt',
  'example',
  'your-turn',
] as const;

export type CalloutVariant = 'important' | 'warning' | 'tip' | 'pro-insight';

export interface VibePaletteOption {
  id: string;
  name: string;
  tagline: string;
  background: string;
  surface: string;
  accent: string;
  ink: string;
}

export interface VibeStyleOption {
  id: string;
  name: string;
  description: string;
  borderRadius: string;
  shadowStyle: string;
  promptDescriptor: string;
}

export interface VibeTypographyOption {
  id: string;
  name: string;
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  promptDescriptor: string;
}

export interface VibeSelection {
  paletteId: string;
  styleId: string;
  typographyId: string;
}

export type ProfileVariableKey =
  | 'studentName'
  | 'business'
  | 'targetAudience'
  | 'productType'
  | 'brandStyle'
  | 'mainObjective';

export interface StudentProfile {
  studentName: string;
  business: string;
  targetAudience: string;
  productType: string;
  brandStyle: string;
  mainObjective: string;
  vibe: VibeSelection;
  customVariables: Record<string, string>;
}

export interface ProseBlock {
  id: string;
  type: 'prose';
  eyebrow?: string;
  title?: string;
  italicAccent?: string;
  highlightPill?: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface VibePickerBlock {
  id: string;
  type: 'vibe-picker';
  title: string;
  description: string;
}

export interface PromptVariableField {
  key: string;
  label: string;
  placeholder: string;
  profileBinding?: ProfileVariableKey;
}

export interface PromptBuilderBlock {
  id: string;
  type: 'prompt-builder';
  title: string;
  description: string;
  deliverableTarget: 'claude-artifact' | 'html-app' | 'sales-copy' | 'automation-json';
  template: string;
  fields: PromptVariableField[];
}

export interface ChecklistItemConfig {
  id: string;
  label: string;
  detail?: string;
}

export interface StepChecklistBlock {
  id: string;
  type: 'checklist';
  title: string;
  description?: string;
  items: ChecklistItemConfig[];
}

export interface CalloutBlock {
  id: string;
  type: 'callout';
  variant: CalloutVariant;
  title: string;
  content: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizBlock {
  id: string;
  type: 'quiz';
  title: string;
  description?: string;
  questions: QuizQuestion[];
}

export interface TextExerciseBlock {
  id: string;
  type: 'text-exercise';
  title: string;
  instructions: string;
  placeholder: string;
  maxLength?: number;
  minLength?: number;
  profileBinding?: ProfileVariableKey;
   secondaryFields?: Array<{
    key: ProfileVariableKey;
    label: string;
    placeholder: string;
  }>;
}

export interface VideoBlockConfig {
  id: string;
  type: 'video';
  title: string;
  description: string;
  duration: string;
  videoUrl?: string;
  posterLabel: string;
  keyTakeaways?: string[];
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'template' | 'prompt-pack' | 'checklist' | 'guide';
  description: string;
  format: string;
  downloadFilename?: string;
  downloadContent?: string;
  externalUrl?: string;
}

export interface ResourceBlock {
  id: string;
  type: 'resource';
  title: string;
  description?: string;
  resources: ResourceItem[];
}

export interface CopyBlockConfig {
  id: string;
  type: 'copy';
  title: string;
  label: string;
  content: string;
  notes?: string;
}

export type ContentBlock =
  | ProseBlock
  | VibePickerBlock
  | PromptBuilderBlock
  | StepChecklistBlock
  | CalloutBlock
  | QuizBlock
  | TextExerciseBlock
  | VideoBlockConfig
  | ResourceBlock
  | CopyBlockConfig;

export interface Step {
  id: string;
  type: StepType;
  number: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  completionLabel: string;
  blocks: ContentBlock[];
}

export interface Day {
  id: string;
  dayNumber: number;
  sprintId: string;
  title: string;
  italicTitleWord?: string;
  objective: string;
  deliverableSummary: string;
  isSkeletonPlaceholder: boolean;
  steps: [Step, Step, Step, Step];
}

export interface StartHereLesson {
  id: string;
  lessonNumber: 1 | 2;
  title: string;
  italicTitleWord?: string;
  subtitle: string;
  objective: string;
  blocks: ContentBlock[];
}

export interface Sprint {
  id: string;
  sprintNumber: 1 | 2 | 3 | 4 | 5;
  title: string;
  subtitle: string;
  dayRange: [number, number];
  deliverable: string;
}

export interface Course {
  id: string;
  title: string;
  totalDays: 25;
  startHere: [StartHereLesson, StartHereLesson];
  sprints: Sprint[];
  days: Day[];
}

export type ActiveRoute =
  | { kind: 'home' }
  | { kind: 'course'; courseId: string; dayNumber?: number; lessonId?: string }
  | { kind: 'start-here'; lessonId: string }
  | { kind: 'day'; dayNumber: number }
  | { kind: 'bonus'; bonusId: string }
  | { kind: 'resources' };

export interface QuizAttemptState {
  answers: Record<string, number>;
  submitted: boolean;
  score: number;
  total: number;
}

export interface StudentProgress {
  schemaVersion: 1;
  activeRoute: ActiveRoute;
  activeStepByDay: Record<number, StepType>;
  completedStartHereIds: string[];
  completedStepsByDay: Record<number, StepType[]>;
  checklistAnswers: Record<string, Record<string, boolean>>;
  exerciseAnswers: Record<string, string>;
  quizStates: Record<string, QuizAttemptState>;
  savedPrompts: Record<string, string>;
  customPromptInputs: Record<string, Record<string, string>>;
  profile: StudentProfile;
  lastUpdated: string;
}
