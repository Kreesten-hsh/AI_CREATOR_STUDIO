export type StepType = 'concept' | 'prompt' | 'example' | 'your-turn';

export const ALL_STEP_TYPES: readonly StepType[] = [
  'concept',
  'prompt',
  'example',
  'your-turn',
] as const;

export type CalloutVariant = 'important' | 'warning' | 'tip' | 'pro-insight';

export type ModuleId = 'module-01' | 'module-02' | 'module-03';
export type DayId = 'day-01' | 'day-02' | 'day-03';
export type LessonId =
  | 'lesson-01'
  | 'lesson-02'
  | 'lesson-03'
  | 'lesson-04'
  | 'lesson-05'
  | 'lesson-06'
  | 'lesson-07';

export const ALL_MODULE_IDS: readonly ModuleId[] = [
  'module-01',
  'module-02',
  'module-03',
] as const;

export const ALL_DAY_IDS: readonly DayId[] = [
  'day-01',
  'day-02',
  'day-03',
] as const;

export const ALL_LESSON_IDS: readonly LessonId[] = [
  'lesson-01',
  'lesson-02',
  'lesson-03',
  'lesson-04',
  'lesson-05',
  'lesson-06',
  'lesson-07',
] as const;

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
  vibeConfirmed?: boolean;
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

export interface ImageBlockConfig {
  id: string;
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
}

export interface ScreenshotBlockConfig {
  id: string;
  type: 'screenshot';
  src: string;
  alt: string;
  caption: string;
  capturedAt: string;
}

export interface DiagramNode {
  id: string;
  label: string;
  description?: string;
  tag?: string;
}

export interface DiagramLink {
  from: string;
  to: string;
  label?: string;
}

export interface DiagramBlockConfig {
  id: string;
  type: 'diagram';
  title?: string;
  accessibleDescription: string;
  data: {
    kind: 'steps' | 'flow' | 'grid';
    nodes: DiagramNode[];
    links?: DiagramLink[];
  };
}

export type ContentBlock =
  | ProseBlock
  | StepChecklistBlock
  | CalloutBlock
  | QuizBlock
  | TextExerciseBlock
  | VideoBlockConfig
  | ResourceBlock
  | CopyBlockConfig
  | ImageBlockConfig
  | ScreenshotBlockConfig
  | DiagramBlockConfig;

export interface TroubleshootingPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

export interface StepHelpConfig {
  frequentMistakes?: Array<{
    mistake: string;
    correction: string;
  }>;
  tips?: string[];
  troubleshootingPrompts?: TroubleshootingPrompt[];
}

export interface Step {
  id: string;
  number: number;
  title: string;
  completionLabel: string;
  blocks: ContentBlock[];
  subtitle?: string;
  kind?: string;
  legacyType?: StepType;
  help?: StepHelpConfig;
}

/**
 * Unité pédagogique réellement suivie et validée par l'apprenant (L1 à L7).
 * Seule une leçon possède des étapes pédagogiques (steps).
 */
export interface Lesson {
  id: LessonId;
  lessonNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  moduleId: ModuleId;
  dayId: DayId;
  dayNumber: 1 | 2 | 3;
  title: string;
  italicTitleWord?: string;
  duration: string;
  objective: string;
  deliverableSummary: string;
  isSkeletonPlaceholder: boolean;
  steps: Step[];
}

/**
 * Unité de progression temporelle (Journée 1 à 3).
 * Regroupe exclusivement les leçons qui lui appartiennent.
 */
export interface Day {
  id: DayId;
  dayNumber: 1 | 2 | 3;
  moduleId: ModuleId;
  title: string;
  objective: string;
  deliverableSummary: string;
  lessons: Lesson[];
}

/**
 * Regroupement pédagogique thématique (Modules 1 à 3).
 */
export interface CourseModule {
  id: ModuleId;
  moduleNumber: 1 | 2 | 3;
  orderNumber: '01' | '02' | '03';
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  dayId: DayId;
  dayNumber: 1 | 2 | 3;
  lessonIds: readonly LessonId[];
  lessonRange: readonly [number, number];
  deliverable: string;
  available: boolean;
}

export type Sprint = CourseModule;

export interface Course {
  id: string;
  title: string;
  modules: readonly CourseModule[];
  days: readonly Day[];
  lessons: readonly Lesson[];
  totalModules: number;
  totalDays: number;
  totalLessons: number;
}

/**
 * Représentation canonique unique de la route active persistée.
 */
export type ActiveRoute =
  | { kind: 'home' }
  | { kind: 'lesson'; lessonId: LessonId }
  | { kind: 'bonus'; bonusId: string };

export interface QuizAttemptState {
  answers: Record<string, number>;
  submitted: boolean;
  score: number;
  total: number;
}

export interface StudentProgress {
  schemaVersion: 4;
  curriculumModel: '3m-3d-7l';
  activeRoute: ActiveRoute;
  activeStepIdByLesson: Partial<Record<LessonId, string>>;
  completedStepIdsByLesson: Partial<Record<LessonId, string[]>>;
  checklistAnswers: Record<string, Record<string, boolean>>;
  exerciseAnswers: Record<string, string>;
  quizStates: Record<string, QuizAttemptState>;
  savedPrompts: Record<string, string>;
  customPromptInputs: Record<string, Record<string, string>>;
  profile: StudentProfile;
  persistenceDisabled?: boolean;
  legacyArchive?: Record<string, unknown>;
  lastUpdated: string;
}
