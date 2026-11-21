export type SimulationSection =
  | 'dashboard'
  | 'cases'
  | 'progress'
  | 'reports'
  | 'certificates'
  | 'legal'
  | 'case-management';

export type SimulationQuestionType = 'single-choice' | 'number';
export type SimulationCriterion = 'decision' | 'legal-basis' | 'process' | 'reasoning';
export type SimulationCaseStatus = 'draft' | 'published';
export type SimulationAttemptStatus = 'in_progress' | 'completed';

export interface SimulationOption {
  id: string;
  label: string;
}

export interface SimulationStep {
  id: string;
  title: string;
  criterion: SimulationCriterion;
  points: number;
  prompt: string;
  questionType: SimulationQuestionType;
  options?: SimulationOption[];
  numberUnit?: string;
  legalReferenceIds: string[];
}

export interface SimulationCaseContent {
  title: string;
  category: string;
  difficulty: 'सुरुआती' | 'मध्यम' | 'उन्नत';
  estimatedMinutes: number;
  scenario: string;
  objectives: string[];
  priorKnowledge: string[];
  steps: SimulationStep[];
  legalReferenceIds: string[];
}

export interface ChoiceAnswerKey {
  type: 'single-choice';
  correctOptionId: string;
  optionScores: Record<string, number>;
  explanation: string;
}

export interface NumberAnswerKey {
  type: 'number';
  expectedValue: number;
  tolerance: number;
  explanation: string;
}

export type SimulationAnswerKey = Record<string, ChoiceAnswerKey | NumberAnswerKey>;

export interface SimulationCaseVersion {
  caseKey: string;
  version: number;
  status: SimulationCaseStatus;
  content: SimulationCaseContent;
  answerKey?: SimulationAnswerKey;
  createdAt?: string;
}

export interface SimulationCaseDraft {
  caseKey: string;
  content: SimulationCaseContent;
  answerKey: SimulationAnswerKey;
}

export interface SimulationLegalReference {
  id: string;
  lawName: string;
  clause: string;
  summary: string;
  officialUrl: string;
  sourceVersion: string;
  lastCheckedAt: string | null;
  verificationNote: string;
  appTab?: string;
}

export interface SimulationScoreRow {
  stepId: string;
  pointsEarned: number;
  pointsAvailable: number;
  isCorrect: boolean;
  explanation: string;
  correctAnswer: string;
}

export interface SimulationResult {
  score: number;
  passed: boolean;
  breakdown: SimulationScoreRow[];
  completedAt: string;
}

export interface SimulationAttempt {
  id: string;
  userId: string;
  caseKey: string;
  caseVersion: number;
  attemptNumber: number;
  status: SimulationAttemptStatus;
  answers: Record<string, string | number>;
  startedAt: string;
  updatedAt: string;
  result?: SimulationResult;
}

export interface SimulationCertificate {
  code: string;
  attemptId?: string;
  displayName: string;
  caseKey: string;
  caseTitle: string;
  score: number;
  issuedAt: string;
  isSample: boolean;
}

export interface SimulationCertificateVerification {
  valid: boolean;
  isSample?: boolean;
  status?: 'valid' | 'revoked';
  code?: string;
  caseTitle?: string;
  score?: number;
  issuedAt?: string;
}
