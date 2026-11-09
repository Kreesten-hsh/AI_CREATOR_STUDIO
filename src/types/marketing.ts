/**
 * Modèle de données strict pour le Bonus 02 : Marketing Library.
 */

export type MarketingCategory =
  | 'all'
  | 'strategy'
  | 'copywriting'
  | 'visibility'
  | 'conversation';

export interface MarketingCategoryConfig {
  id: MarketingCategory;
  label: string;
  count?: number;
}

export interface DigitalProductScenario {
  productName: string;
  context: string;
  execution: string;
}

export interface ReadyPrompt {
  mission: string;
  fullPrompt: string;
  explanation: string;
}

export interface ExpectedResult {
  summary: string;
  sampleOutput: string;
}

export interface SkillDownloadInfo {
  fileName: string;
  downloadUrl?: string;
  fileSize?: string;
  includedFiles: string[];
  isAvailable: boolean;
  statusNote?: string;
  licenseInfo?: string;
}

export interface UsageInstructions {
  quickStart: string[];
  compatibilityNotes: string;
}

export interface MarketingResource {
  id: string;
  technicalName: string;
  title: string;
  category: Exclude<MarketingCategory, 'all'>;
  categoryLabel: string;
  shortDescription: string;
  concreteProblem: string;
  whenToUse: string[];
  digitalProductScenario: DigitalProductScenario;
  readyPrompt: ReadyPrompt;
  expectedResult: ExpectedResult;
  download: SkillDownloadInfo;
  usageInstructions: UsageInstructions;
  specificNotice?: string;
}

export interface CompetitivePromptResource {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  fullPrompt: string;
  bestPractices: string[];
  reliabilityRules: string[];
}

export interface ExternalResourceInfo {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  badge: string;
}

export interface MarketingLibraryData {
  header: {
    orderNumber: string;
    title: string;
    subtitle: string;
    description: string;
    totalResourcesCount: number;
  };
  categories: MarketingCategoryConfig[];
  skills: MarketingResource[];
  competitivePrompt: CompetitivePromptResource;
  externalResource: ExternalResourceInfo;
}
