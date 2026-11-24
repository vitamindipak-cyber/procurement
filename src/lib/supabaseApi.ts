import { Session } from '@supabase/supabase-js';
import { AppUser, ManagedUserInput, UserRole } from '../types/auth';
import { TrackedProject } from '../types/procurement';
import { Database, Json, supabase } from './supabase';
import { PRACTICAL_SIMULATION_CASES, SIMULATION_CASES_BY_KEY } from '../data/practicalSimulationCases';
import {
  SimulationAttempt,
  SimulationAnswerKey,
  SimulationCaseContent,
  SimulationCaseDraft,
  SimulationCaseVersion,
  SimulationCertificate,
  SimulationCertificateVerification,
  SimulationResult,
  SimulationScoreRow,
} from '../types/simulation';
import { calculateSimulationResult } from './simulationScoring';

const LOCAL_STORAGE_KEY_PROJECTS = 'app_local_procurement_projects';
const LOCAL_STORAGE_KEY_USERS = 'app_local_users';
const LOCAL_STORAGE_KEY_SESSION = 'app_local_session_user';
const LOCAL_STORAGE_KEY_SIMULATION_CASES = 'app_local_simulation_case_versions';
const LOCAL_STORAGE_KEY_SIMULATION_ATTEMPTS = 'app_local_simulation_attempts';
const LOCAL_STORAGE_KEY_SIMULATION_CERTIFICATES = 'app_local_simulation_certificates';
const LOCAL_STORAGE_KEY_AUDIT_LOGS = 'app_local_audit_logs';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isSimulationCaseContent = (value: unknown): value is SimulationCaseContent => {
  if (!isRecord(value) || typeof value.title !== 'string' || typeof value.category !== 'string'
    || (value.difficulty !== 'सरल' && value.difficulty !== 'मध्यम' && value.difficulty !== 'उन्नत')
    || typeof value.estimatedMinutes !== 'number'
    || typeof value.scenario !== 'string' || !Array.isArray(value.steps)
    || !Array.isArray(value.objectives) || !value.objectives.every((item) => typeof item === 'string')
    || !Array.isArray(value.priorKnowledge) || !value.priorKnowledge.every((item) => typeof item === 'string')
    || !Array.isArray(value.legalReferenceIds)
    || !value.legalReferenceIds.every((item) => typeof item === 'string')) return false;

  return value.steps.every((step) => isRecord(step)
    && typeof step.id === 'string'
    && typeof step.title === 'string'
    && typeof step.prompt === 'string'
    && typeof step.points === 'number'
    && (step.criterion === 'decision' || step.criterion === 'legal-basis'
      || step.criterion === 'process' || step.criterion === 'reasoning')
    && (step.questionType === 'single-choice' || step.questionType === 'number')
    && Array.isArray(step.legalReferenceIds)
    && step.legalReferenceIds.every((item) => typeof item === 'string')
    && (step.options === undefined || (Array.isArray(step.options)
      && step.options.every((option) => isRecord(option)
        && typeof option.id === 'string' && typeof option.label === 'string'))));
};

const isSimulationCaseVersion = (value: unknown): value is SimulationCaseVersion =>
  isRecord(value)
  && typeof value.caseKey === 'string'
  && typeof value.version === 'number'
  && (value.status === 'draft' || value.status === 'published')
  && isSimulationCaseContent(value.content);

const parseStoredArray = <T,>(
  key: string,
  guard: (value: unknown) => value is T,
  fallback: T[],
  transform?: (item: unknown) => unknown,
): T[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('Stored data has an unexpected shape.');
    const items = transform ? parsed.map(transform) : parsed;
    if (!items.every(guard)) throw new Error('Stored data has an unexpected shape.');
    return items;
  } catch (error) {
    console.error(`Failed to load local simulation data (${key}).`, error);
    throw new Error('स्थानीय अभ्यास विवरण पढ्न सकिएन। ब्राउजर भण्डारण जाँचेर पुनः प्रयास गर्नुहोस्।');
  }
};

const saveStoredArray = <T,>(key: string, value: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save local simulation data (${key}).`, error);
    throw new Error('अभ्यास विवरण स्थानीय रूपमा सुरक्षित गर्न सकिएन। ब्राउजर भण्डारण जाँचेर पुनः प्रयास गर्नुहोस्।');
  }
};

const toJson = (value: object): Json => JSON.parse(JSON.stringify(value)) as Json;

const migrateSimulationCaseVersion = (item: unknown): unknown => {
  if (!isRecord(item)) return item;
  const content = isRecord(item['content']) ? { ...item['content'] } : item['content'];
  if (isRecord(content) && content['difficulty'] === 'सुरुआती') {
    content['difficulty'] = 'सरल';
  }
  return { ...item, content };
};

const getLocalSimulationCases = (): SimulationCaseVersion[] => {
  const storedCases = parseStoredArray(
    LOCAL_STORAGE_KEY_SIMULATION_CASES,
    isSimulationCaseVersion,
    PRACTICAL_SIMULATION_CASES,
    migrateSimulationCaseVersion,
  );
  const canonicalMap = new Map(PRACTICAL_SIMULATION_CASES.map((c) => [c.caseKey, c]));
  // Always update canonical cases with the latest definitions from code
  const updatedStoredCases = storedCases.map((c) => canonicalMap.get(c.caseKey) || c);
  const existingKeys = new Set(updatedStoredCases.map((c) => c.caseKey));
  const missingDefaults = PRACTICAL_SIMULATION_CASES.filter(
    (c) => !existingKeys.has(c.caseKey),
  );
  const mergedCases = [...updatedStoredCases, ...missingDefaults];
  saveStoredArray(LOCAL_STORAGE_KEY_SIMULATION_CASES, mergedCases);
  return mergedCases;
};

const isSimulationAttempt = (value: unknown): value is SimulationAttempt => {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.userId !== 'string'
    || typeof value.caseKey !== 'string' || typeof value.caseVersion !== 'number'
    || typeof value.attemptNumber !== 'number'
    || (value.status !== 'in_progress' && value.status !== 'completed')
    || !isRecord(value.answers) || typeof value.startedAt !== 'string'
    || typeof value.updatedAt !== 'string') return false;

  if (!Object.values(value.answers).every((answer) =>
    typeof answer === 'string' || typeof answer === 'number')) return false;
  if (value.result === undefined) return true;
  return isRecord(value.result)
    && typeof value.result.score === 'number'
    && typeof value.result.passed === 'boolean'
    && typeof value.result.completedAt === 'string'
    && Array.isArray(value.result.breakdown)
    && value.result.breakdown.every(isSimulationScoreRow);
};

const getLocalSimulationAttempts = (): SimulationAttempt[] =>
  parseStoredArray(LOCAL_STORAGE_KEY_SIMULATION_ATTEMPTS, isSimulationAttempt, []);

const isSimulationCertificate = (value: unknown): value is SimulationCertificate =>
  isRecord(value)
  && typeof value.code === 'string'
  && typeof value.displayName === 'string'
  && typeof value.caseKey === 'string'
  && typeof value.caseTitle === 'string'
  && typeof value.score === 'number'
  && typeof value.issuedAt === 'string'
  && (value.attemptId === undefined || typeof value.attemptId === 'string')
  && typeof value.isSample === 'boolean';

const getLocalSimulationCertificates = (): SimulationCertificate[] =>
  parseStoredArray(LOCAL_STORAGE_KEY_SIMULATION_CERTIFICATES, isSimulationCertificate, []);

const createLocalId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export interface AuditLogRecord {
  id: string;
  occurred_at: string;
  actor_id: string | null;
  actor_username: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Json;
  deleted_at: string | null;
  deleted_by: string | null;
}

export interface AuditLogPage {
  items: AuditLogRecord[];
  total: number;
}

const isAuditLogRecord = (value: unknown): value is AuditLogRecord =>
  isRecord(value)
  && typeof value.id === 'string'
  && typeof value.occurred_at === 'string'
  && (typeof value.actor_id === 'string' || value.actor_id === null)
  && typeof value.actor_username === 'string'
  && typeof value.action === 'string'
  && typeof value.entity_type === 'string'
  && (typeof value.entity_id === 'string' || value.entity_id === null)
  && isRecord(value.details)
  && (typeof value.deleted_at === 'string' || value.deleted_at === null)
  && (typeof value.deleted_by === 'string' || value.deleted_by === null);

const getLocalAuditLogs = (): AuditLogRecord[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_AUDIT_LOGS);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isAuditLogRecord)) {
      throw new Error('Stored audit log data has an unexpected shape.');
    }
    return parsed;
  } catch (error) {
    console.error('Failed to load local audit logs.', error);
    throw new Error('स्थानीय audit log पढ्न सकिएन। ब्राउजर भण्डारण जाँचेर पुनः प्रयास गर्नुहोस्।');
  }
};

const saveLocalAuditLogs = (logs: AuditLogRecord[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_AUDIT_LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to save local audit logs.', error);
    throw new Error('Audit log स्थानीय रूपमा सुरक्षित गर्न सकिएन। ब्राउजर भण्डारण जाँचेर पुनः प्रयास गर्नुहोस्।');
  }
};

const getLocalAuditActor = (): { id: string | null; username: string } => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_SESSION);
    if (raw) {
      const user: unknown = JSON.parse(raw);
      if (isRecord(user) && typeof user.id === 'string' && typeof user.username === 'string') {
        return { id: user.id, username: user.username };
      }
    }
  } catch (error) {
    console.error('Failed to read the current local audit actor.', error);
  }
  return { id: null, username: 'system' };
};

const createLocalAuditEvent = (
  action: string,
  entityType: string,
  entityId: string | null,
  details: Record<string, Json>,
): AuditLogRecord => {
  const actor = getLocalAuditActor();
  return {
    id: createLocalId(),
    occurred_at: new Date().toISOString(),
    actor_id: actor.id,
    actor_username: actor.username,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
    deleted_at: null,
    deleted_by: null,
  };
};

const recordLocalAuditEvent = (
  action: string,
  entityType: string,
  entityId: string | null,
  details: Record<string, Json> = {},
): void => {
  saveLocalAuditLogs([createLocalAuditEvent(action, entityType, entityId, details), ...getLocalAuditLogs()]);
};

const isSimulationScoreRow = (value: unknown): value is SimulationScoreRow =>
  isRecord(value)
  && typeof value.stepId === 'string'
  && typeof value.pointsEarned === 'number'
  && typeof value.pointsAvailable === 'number'
  && typeof value.isCorrect === 'boolean'
  && typeof value.explanation === 'string'
  && typeof value.correctAnswer === 'string';

const parseSimulationResult = (value: unknown): SimulationResult => {
  if (!isRecord(value) || typeof value.score !== 'number'
    || typeof value.passed !== 'boolean' || typeof value.completedAt !== 'string'
    || !Array.isArray(value.breakdown) || !value.breakdown.every(isSimulationScoreRow)) {
    throw new Error('अभ्यास मूल्याङ्कनको नतिजा अमान्य छ।');
  }
  return {
    score: value.score,
    passed: value.passed,
    breakdown: value.breakdown,
    completedAt: value.completedAt,
  };
};

const isSimulationAnswerKey = (value: unknown): value is SimulationAnswerKey => {
  if (!isRecord(value)) return false;
  return Object.values(value).every((entry) => {
    if (!isRecord(entry) || typeof entry.type !== 'string'
      || typeof entry.explanation !== 'string') return false;
    if (entry.type === 'single-choice') {
      return typeof entry.correctOptionId === 'string'
        && isRecord(entry.optionScores)
        && Object.values(entry.optionScores).every((score) => typeof score === 'number');
    }
    return entry.type === 'number'
      && typeof entry.expectedValue === 'number'
      && typeof entry.tolerance === 'number';
  });
};

export const sanitizeSimulationText = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/उपकरणको\s+आधारभूत\s+үнийг\s+मात्र\s+लिएж\s+सूचना\s+प्रकाशित\s+गर्ने।?/g, 'उपकरणको आधारभूत मूल्य मात्र लिएर सूचना प्रकाशित गर्ने।')
    .replace(/CMC-ийн\s+үнэлгээг\s+тендер\s+нээсний\s+дараа\s+тог[^\s।]*।?/g, 'CMC वा अतिरिक्त सेवाको लागत सम्झौतापछि थप गर्ने।')
    .replace(/зөрүүтэй\s+мэт\s+देखिन्छ/g, 'शर्तसँग फरक देखिन्छ')
    .replace(/бүх\s+заманатанд\s+нэг\s+хуучин\s+хугацаа\s+тулгах\s+санаа/g, 'सबै जमानतमा एउटै पुरानो म्याद लाद्ने सोच')
    .replace(/निर्मાણ/g, 'निर्माण')
    .replace(/үнийг/g, 'मूल्य')
    .replace(/үнэлгээг/g, 'मूल्याङ्कन')
    .replace(/тендер/g, 'बोलपत्र')
    .replace(/нээсний/g, 'खोलिसकेको')
    .replace(/дараа/g, 'पछि')
    .replace(/тогтоо[^\s।]*/g, 'तय गर्ने')
    .replace(/хугацаа/g, 'म्याद')
    .replace(/тулгах/g, 'लाद्ने')
    .replace(/санаа/g, 'सोच')
    .replace(/зөрүүтэй/g, 'फरक')
    .replace(/заманатанд/g, 'जमानतमा')
    .replace(/мэт/g, 'जस्तो')
    .replace(/бүх/g, 'सबै')
    .replace(/нэг/g, 'एउटा')
    .replace(/хуучин/g, 'पुरानो')
    .replace(/[\u0400-\u04FF]/g, '')
    .replace(/[\u0A80-\u0AFF]/g, '')
    .replace(/ {2,}/g, ' ')
    .trim();
};

export const sanitizeSimulationContent = (value: unknown): unknown => {
  if (typeof value === 'string') {
    return sanitizeSimulationText(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeSimulationContent(item));
  }
  if (isRecord(value)) {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = sanitizeSimulationContent(v);
    }
    return result;
  }
  return value;
};

const normalizeDifficulty = (value: unknown): unknown => {
  if (!isRecord(value)) return value;
  const content = { ...value };
  if (content['difficulty'] === 'सुरुआती') content['difficulty'] = 'सरल';
  return content;
};

const parseSimulationCaseContent = (value: unknown): SimulationCaseContent => {
  const sanitized = sanitizeSimulationContent(value);
  const normalized = normalizeDifficulty(sanitized);
  if (!isSimulationCaseContent(normalized)) {
    throw new Error('अभ्यास केसको सामग्री अमान्य छ।');
  }
  return normalized;
};

const mapSimulationResultRow = (
  row: Database['public']['Tables']['simulation_results']['Row'],
): SimulationResult => parseSimulationResult({
  score: row.score,
  passed: row.passed,
  breakdown: row.breakdown,
  completedAt: row.completed_at,
});

const mapLocalPublishedCases = (versions = getLocalSimulationCases()): SimulationCaseVersion[] => {
  const latest = new Map<string, SimulationCaseVersion>();
  for (const simulationCase of versions
    .filter((item) => item.status === 'published')
    .sort((a, b) => b.version - a.version)) {
    if (!latest.has(simulationCase.caseKey)) latest.set(simulationCase.caseKey, simulationCase);
  }
  return [...latest.values()];
};

const isSimulationCaseDraft = (value: unknown): value is SimulationCaseDraft =>
  isRecord(value)
  && typeof value.caseKey === 'string'
  && isSimulationCaseContent(value.content)
  && isSimulationAnswerKey(value.answerKey);

export const validateSimulationCaseDraft: (value: unknown) => asserts value is SimulationCaseDraft =
  (value) => {
    if (!isSimulationCaseDraft(value)) {
      throw new Error('केस सामग्री वा rubric/उत्तर-सूचीको संरचना अमान्य छ।');
    }
    const draft = value;
    if (!/^[a-z0-9][a-z0-9-]{2,63}$/.test(draft.caseKey)) {
      throw new Error('केस key मा ३–६४ lowercase अक्षर, अङ्क वा hyphen मात्र राख्नुहोस्।');
    }
    if (draft.content.steps.length === 0
      || draft.content.steps.reduce((total, step) => total + step.points, 0) !== 100) {
      throw new Error('कम्तीमा एक प्रश्न राख्नुहोस् र rubric का अङ्क जम्मा १०० बनाउनुहोस्।');
    }

    const stepIds = new Set<string>();
    for (const step of draft.content.steps) {
      if (stepIds.has(step.id) || !Number.isSafeInteger(step.points) || step.points <= 0) {
        throw new Error('प्रश्नका ID अद्वितीय र प्रत्येक प्रश्नको अङ्क सकारात्मक पूर्णांक हुनुपर्छ।');
      }
      stepIds.add(step.id);
      const key = draft.answerKey[step.id];
      if (!key) throw new Error(`प्रश्न ${step.id} का लागि उत्तर-सूची राख्नुहोस्।`);
      if (step.questionType === 'single-choice') {
        const optionIds = step.options?.map((option) => option.id) ?? [];
        if (optionIds.length < 2 || new Set(optionIds).size !== optionIds.length
          || key.type !== 'single-choice' || !optionIds.includes(key.correctOptionId)) {
          throw new Error(`प्रश्न ${step.id} का विकल्प वा उत्तर-सूची मिलेन।`);
        }
        if (Object.entries(key.optionScores).some(([optionId, score]) =>
          !optionIds.includes(optionId) || !Number.isFinite(score) || score < 0 || score > 100,
        )) {
          throw new Error(`प्रश्न ${step.id} का आंशिक अङ्क विकल्पअनुसार ० देखि १०० बीच हुनुपर्छ।`);
        }
      } else if (key.type !== 'number'
        || !Number.isFinite(key.expectedValue)
        || !Number.isFinite(key.tolerance)
        || key.tolerance < 0) {
        throw new Error(`प्रश्न ${step.id} को संख्यात्मक उत्तर वा सहनशीलता अमान्य छ।`);
      }
    }
  };

export const ensureDefaultSimulationCases = async (): Promise<void> => {
  if (!supabase) return;
  const { data, error } = await requireSupabase()
    .from('simulation_case_versions')
    .select('case_key, content, version')
    .in('case_key', PRACTICAL_SIMULATION_CASES.map((item) => item.caseKey))
    .order('version', { ascending: false });
  const rows = requireSimulationData(data, error, 'simulation_case_versions');
  const existingKeys = new Set(rows.map((item) => item.case_key));
  const latestRowPerKey = new Map<string, { case_key: string; content: unknown; version: number }>();
  for (const row of rows) {
    if (!latestRowPerKey.has(row.case_key)) {
      latestRowPerKey.set(row.case_key, row);
    }
  }

  const casesToPublish = PRACTICAL_SIMULATION_CASES.filter((simulationCase) => {
    if (!existingKeys.has(simulationCase.caseKey)) return true;
    const latestRow = latestRowPerKey.get(simulationCase.caseKey);
    if (!latestRow) return true;
    const jsonStr = JSON.stringify(latestRow.content);
    const localStr = JSON.stringify(simulationCase.content);
    return jsonStr !== localStr || /[\u0400-\u04FF\u0A80-\u0AFF]/.test(jsonStr) || /\?{2,}/.test(jsonStr);
  });

  const batchSize = 5;
  for (let index = 0; index < casesToPublish.length; index += batchSize) {
    const batch = casesToPublish.slice(index, index + batchSize);
    await Promise.all(batch.map((simulationCase) => {
      if (!simulationCase.answerKey) {
        throw new Error(`Default case ${simulationCase.caseKey} has no answer key.`);
      }
      return saveSimulationCaseVersion({
        caseKey: simulationCase.caseKey,
        content: simulationCase.content,
        answerKey: simulationCase.answerKey,
      }, 'published');
    }));
  }
};

export const listPublishedSimulationCases = async (): Promise<SimulationCaseVersion[]> => {
  if (!supabase) return mapLocalPublishedCases();

  const { data, error } = await requireSupabase()
    .from('simulation_case_versions')
    .select('case_key, version, status, content, created_at')
    .eq('status', 'published')
    .order('version', { ascending: false });
  const rows = requireSimulationData(data, error, 'simulation_case_versions');
  const latest = new Map<string, SimulationCaseVersion>();

  for (const row of rows) {
    if (latest.has(row.case_key)) continue;
    let content = parseSimulationCaseContent(row.content);
    const localCase = SIMULATION_CASES_BY_KEY.get(row.case_key);
    if (localCase && localCase.version >= row.version) {
      content = localCase.content;
    }
    latest.set(row.case_key, {
      caseKey: row.case_key,
      version: row.version,
      status: row.status,
      content,
      createdAt: row.created_at,
    });
  }
  return [...latest.values()];
};

export const getPublishedSimulationCaseVersion = async (
  caseKey: string,
  version: number,
): Promise<SimulationCaseVersion> => {
  if (!supabase) {
    const simulationCase = getLocalSimulationCases().find((item) =>
      item.caseKey === caseKey && item.version === version && item.status === 'published',
    );
    if (!simulationCase) throw new Error('प्रकाशित अभ्यास केस संस्करण भेटिएन।');
    return simulationCase;
  }

  const { data, error } = await requireSupabase()
    .from('simulation_case_versions')
    .select('case_key, version, status, content, created_at')
    .eq('case_key', caseKey)
    .eq('version', version)
    .eq('status', 'published')
    .single();
  const row = requireSimulationData(data, error, 'simulation_case_versions');
  let content = parseSimulationCaseContent(row.content);
  const localCase = SIMULATION_CASES_BY_KEY.get(row.case_key);
  if (localCase && localCase.version >= row.version) {
    content = localCase.content;
  }
  return {
    caseKey: row.case_key,
    version: row.version,
    status: row.status,
    content,
    createdAt: row.created_at,
  };
};

export const listAdminSimulationCaseVersions = async (): Promise<SimulationCaseVersion[]> => {
  if (!supabase) return getLocalSimulationCases();

  const { data, error } = await requireSupabase().rpc('list_admin_simulation_case_versions');
  if (error) throw simulationDatabaseError(error, 'public.list_admin_simulation_case_versions()');
  return requireSimulationData(data, null, 'list_admin_simulation_case_versions()').map((row) => {
    if (!isSimulationAnswerKey(row.answer_key)) {
      throw new Error(`केस ${row.case_key} को rubric/उत्तर-सूची अमान्य छ।`);
    }
    let content = parseSimulationCaseContent(row.content);
    const localCase = SIMULATION_CASES_BY_KEY.get(row.case_key);
    if (localCase && localCase.version >= row.version) {
      content = localCase.content;
    }
    return {
      caseKey: row.case_key,
      version: row.version,
      status: row.status,
      content,
      answerKey: row.answer_key,
      createdAt: row.created_at,
    };
  });
};

export const saveSimulationCaseVersion = async (
  draft: SimulationCaseDraft,
  status: 'draft' | 'published',
): Promise<SimulationCaseVersion> => {
  validateSimulationCaseDraft(draft);
  if (!supabase) {
    const versions = getLocalSimulationCases();
    const version = Math.max(0, ...versions
      .filter((item) => item.caseKey === draft.caseKey)
      .map((item) => item.version)) + 1;
    const created: SimulationCaseVersion = {
      ...draft,
      version,
      status,
      createdAt: new Date().toISOString(),
    };
    saveStoredArray(LOCAL_STORAGE_KEY_SIMULATION_CASES, [...versions, created]);
    recordLocalAuditEvent('created', 'simulation_case_version', draft.caseKey, {
      changed_fields: ['case_key', 'version', 'status'],
    });
    return created;
  }

  const { data, error } = await requireSupabase().rpc('save_simulation_case_version', {
    p_case_key: draft.caseKey,
    p_content: toJson(draft.content),
    p_answer_key: toJson(draft.answerKey),
    p_status: status,
  });
  const row = requireSimulationData(data, error, 'save_simulation_case_version()')[0];
  if (!row) throw new Error('नयाँ केस संस्करण सिर्जना भएन।');
  if (row.status !== 'draft' && row.status !== 'published') {
    throw new Error(`केस संस्करणको अवस्था अमान्य छ: ${row.status}`);
  }
  return {
    ...draft,
    version: row.version,
    status: row.status,
    createdAt: row.created_at,
  };
};

export const startSimulationAttempt = async (
  userId: string,
  simulationCase: SimulationCaseVersion,
  mode: 'practice' | 'exam' = 'practice',
): Promise<SimulationAttempt> => {
  if (simulationCase.status !== 'published') throw new Error('प्रकाशित केस मात्र सुरु गर्न सकिन्छ।');

  if (!supabase) {
    const attempts = getLocalSimulationAttempts();
    const attemptNumber = attempts.filter((item) =>
      item.userId === userId && item.caseKey === simulationCase.caseKey,
    ).length + 1;
    const now = new Date().toISOString();
    const attempt: SimulationAttempt = {
      id: createLocalId(),
      userId,
      caseKey: simulationCase.caseKey,
      caseVersion: simulationCase.version,
      attemptNumber,
      status: 'in_progress',
      answers: {},
      startedAt: now,
      updatedAt: now,
      mode,
    };
    saveStoredArray(LOCAL_STORAGE_KEY_SIMULATION_ATTEMPTS, [attempt, ...attempts]);
    recordLocalAuditEvent('created', 'simulation_attempt', attempt.id, {
      case_key: attempt.caseKey,
      case_version: attempt.caseVersion,
      mode,
    });
    return attempt;
  }

  const { data, error } = await requireSupabase()
    .from('simulation_attempts')
    .insert({
      user_id: userId,
      case_key: simulationCase.caseKey,
      case_version: simulationCase.version,
    })
    .select('id, user_id, case_key, case_version, attempt_no, status, started_at, updated_at, completed_at')
    .single();
  const row = requireSimulationData(data, error, 'simulation_attempts');
  return {
    id: row.id,
    userId: row.user_id,
    caseKey: row.case_key,
    caseVersion: row.case_version,
    attemptNumber: row.attempt_no,
    status: row.status,
    answers: {},
    startedAt: row.started_at,
    updatedAt: row.updated_at,
  };
};

export const saveSimulationAnswer = async (
  attemptId: string,
  userId: string,
  stepId: string,
  value: string | number,
): Promise<void> => {
  if (!supabase) {
    const attempts = getLocalSimulationAttempts();
    let updated = false;
    const next = attempts.map((attempt) => {
      if (attempt.id !== attemptId || attempt.userId !== userId) return attempt;
      if (attempt.status !== 'in_progress') throw new Error('पूरा भएको अभ्यासको उत्तर परिवर्तन गर्न मिल्दैन।');
      updated = true;
      return {
        ...attempt,
        answers: { ...attempt.answers, [stepId]: value },
        updatedAt: new Date().toISOString(),
      };
    });
    if (!updated) throw new Error('सक्रिय अभ्यास भेटिएन।');
    saveStoredArray(LOCAL_STORAGE_KEY_SIMULATION_ATTEMPTS, next);
    recordLocalAuditEvent('updated', 'simulation_answer', `${attemptId}:${stepId}`, {
      changed_fields: ['response'],
    });
    return;
  }

  const { error } = await requireSupabase()
    .from('simulation_answers')
    .upsert({
      attempt_id: attemptId,
      step_id: stepId,
      response: toJson({ value }),
    }, { onConflict: 'attempt_id,step_id' });
  if (error) throw simulationDatabaseError(error, 'simulation_answers');
};

export const completeSimulationAttempt = async (
  attemptId: string,
  userId: string,
): Promise<SimulationResult> => {
  if (!supabase) {
    const attempts = getLocalSimulationAttempts();
    const attempt = attempts.find((item) => item.id === attemptId && item.userId === userId);
    if (!attempt) throw new Error('अभ्यास भेटिएन।');
    if (attempt.result) return attempt.result;

    const simulationCase = getLocalSimulationCases().find((item) =>
      item.caseKey === attempt.caseKey && item.version === attempt.caseVersion,
    );
    if (!simulationCase) throw new Error('अभ्यासको केस संस्करण भेटिएन।');
    const result = calculateSimulationResult(simulationCase, attempt.answers);
    const updated = attempts.map((item) => item.id === attemptId
      ? { ...item, status: 'completed' as const, updatedAt: result.completedAt, result }
      : item);
    saveStoredArray(LOCAL_STORAGE_KEY_SIMULATION_ATTEMPTS, updated);
    recordLocalAuditEvent('completed', 'simulation_attempt', attemptId, {
      score: result.score,
      passed: result.passed,
    });
    return result;
  }

  const { data, error } = await requireSupabase().rpc('grade_simulation_attempt', {
    p_attempt_id: attemptId,
  });
  return parseSimulationResult(requireSimulationData(data, error, 'grade_simulation_attempt()'));
};

export const listSimulationAttempts = async (
  userId: string,
  userRole: UserRole,
): Promise<SimulationAttempt[]> => {
  if (!supabase) {
    return getLocalSimulationAttempts()
      .filter((attempt) => userRole === 'admin' || attempt.userId === userId)
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  }

  let attemptsQuery = requireSupabase()
    .from('simulation_attempts')
    .select('id, user_id, case_key, case_version, attempt_no, status, started_at, updated_at, completed_at')
    .order('started_at', { ascending: false });
  if (userRole !== 'admin') attemptsQuery = attemptsQuery.eq('user_id', userId);
  const { data, error } = await attemptsQuery;
  const rows = requireSimulationData(data, error, 'simulation_attempts');
  if (rows.length === 0) return [];

  const attemptIds = rows.map((row) => row.id);
  let resultsQuery = requireSupabase()
    .from('simulation_results')
    .select('attempt_id, user_id, score, passed, breakdown, completed_at')
    .in('attempt_id', attemptIds);
  if (userRole !== 'admin') resultsQuery = resultsQuery.eq('user_id', userId);
  const { data: resultRows, error: resultError } = await resultsQuery;
  const resultMap = new Map(requireSimulationData(resultRows, resultError, 'simulation_results')
    .map((row) => [row.attempt_id, mapSimulationResultRow(row)]));
  if (rows.some((row) => row.status === 'completed' && !resultMap.has(row.id))) {
    throw new Error('सम्पन्न अभ्यासको मूल्याङ्कन नतिजा उपलब्ध छैन।');
  }

  const { data: answerRows, error: answerError } = await requireSupabase()
    .from('simulation_answers')
    .select('attempt_id, step_id, response')
    .in('attempt_id', attemptIds);
  const answersByAttempt = new Map<string, Record<string, string | number>>();
  for (const answer of requireSimulationData(answerRows, answerError, 'simulation_answers')) {
    if (!isRecord(answer.response)) {
      throw new Error(`अभ्यास प्रश्न ${answer.step_id} को सुरक्षित उत्तर अमान्य छ।`);
    }
    const value = answer.response.value;
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new Error(`अभ्यास प्रश्न ${answer.step_id} को उत्तर खाली वा अमान्य छ।`);
    }
    const answers = answersByAttempt.get(answer.attempt_id) ?? {};
    answers[answer.step_id] = value;
    answersByAttempt.set(answer.attempt_id, answers);
  }

  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    caseKey: row.case_key,
    caseVersion: row.case_version,
    attemptNumber: row.attempt_no,
    status: row.status,
    answers: answersByAttempt.get(row.id) ?? {},
    startedAt: row.started_at,
    updatedAt: row.updated_at,
    ...(resultMap.has(row.id) ? { result: resultMap.get(row.id) } : {}),
  }));
};

export const listSimulationCertificates = async (
  userId: string,
  userRole: UserRole,
): Promise<SimulationCertificate[]> => {
  if (!supabase) {
    return getLocalSimulationCertificates()
      .filter((certificate) => userRole === 'admin'
        || getLocalSimulationAttempts().some((attempt) =>
          attempt.userId === userId && attempt.id === certificate.attemptId,
        ));
  }

  let query = requireSupabase()
    .from('simulation_certificates')
    .select('certificate_code, attempt_id, user_id, case_key, case_version, display_name, issued_at, revoked_at')
    .order('issued_at', { ascending: false });
  if (userRole !== 'admin') query = query.eq('user_id', userId);
  const { data, error } = await query;
  const rows = requireSimulationData(data, error, 'simulation_certificates');
  if (rows.length === 0) return [];
  const attempts = await listSimulationAttempts(userId, userRole);
  const attemptScores = new Map(attempts.map((item) => [item.id, item.result?.score ?? 0]));

  const versions = await requireSupabase()
    .from('simulation_case_versions')
    .select('case_key, version, content')
    .in('case_key', [...new Set(rows.map((row) => row.case_key))])
    .in('version', [...new Set(rows.map((row) => row.case_version))]);
  const versionRows = requireSimulationData(versions.data, versions.error, 'simulation_case_versions');
  const caseNames = new Map(versionRows.map((row) => [
    `${row.case_key}:${row.version}`,
    parseSimulationCaseContent(row.content).title,
  ]));

  return rows.map((row) => {
    const score = attemptScores.get(row.attempt_id);
    if (score === undefined) throw new Error(`प्रमाणपत्र ${row.certificate_code} को नतिजा भेटिएन।`);
    return {
      code: row.certificate_code,
      attemptId: row.attempt_id,
      displayName: row.display_name,
      caseKey: row.case_key,
      caseTitle: caseNames.get(`${row.case_key}:${row.case_version}`) ?? row.case_key,
      score,
      issuedAt: row.issued_at,
      isSample: false,
    };
  });
};

export const issueSimulationCertificate = async (
  attemptId: string,
  userId: string,
  displayName: string,
): Promise<SimulationCertificate> => {
  const normalizedName = displayName.trim();
  if (normalizedName.length < 2 || normalizedName.length > 120) {
    throw new Error('प्रमाणपत्रका लागि २ देखि १२० अक्षरसम्मको नाम लेख्नुहोस्।');
  }

  if (!supabase) {
    const attempts = getLocalSimulationAttempts();
    const attempt = attempts.find((item) => item.id === attemptId && item.userId === userId);
    if (!attempt?.result?.passed) throw new Error('उत्तीर्ण अभ्यासपछि मात्र नमुना प्रमाणपत्र बनाउन सकिन्छ।');

    const existing = getLocalSimulationCertificates().find((item) =>
      item.attemptId === attemptId,
    );
    if (existing) return existing;

    const simulationCase = getLocalSimulationCases().find((item) => item.caseKey === attempt.caseKey);
    if (!simulationCase) throw new Error('प्रमाणपत्रको अभ्यास विवरण भेटिएन।');
    const certificate: SimulationCertificate = {
      code: createLocalId(),
      attemptId,
      displayName: normalizedName,
      caseKey: attempt.caseKey,
      caseTitle: simulationCase.content.title,
      score: attempt.result.score,
      issuedAt: new Date().toISOString(),
      isSample: true,
    };
    saveStoredArray(LOCAL_STORAGE_KEY_SIMULATION_CERTIFICATES, [
      certificate,
      ...getLocalSimulationCertificates(),
    ]);
    return certificate;
  }

  const { data, error } = await requireSupabase().rpc('issue_simulation_certificate', {
    p_attempt_id: attemptId,
    p_display_name: normalizedName,
  });
  const row = requireSimulationData(data, error, 'issue_simulation_certificate()')[0];
  if (!row) throw new Error('प्रमाणपत्र अभिलेख सिर्जना भएन।');
  return {
    code: row.certificate_code,
    displayName: row.display_name,
    caseKey: row.case_key,
    caseTitle: row.case_title,
    score: row.score,
    issuedAt: row.issued_at,
    isSample: false,
  };
};

export const verifySimulationCertificate = async (
  certificateCode: string,
): Promise<SimulationCertificateVerification> => {
  if (!supabase) {
    const certificate = getLocalSimulationCertificates()
      .find((item) => item.code === certificateCode);
    if (!certificate) return { valid: false };
    return {
      valid: false,
      isSample: true,
      code: certificate.code,
      caseTitle: certificate.caseTitle,
      score: certificate.score,
      issuedAt: certificate.issuedAt,
    };
  }
  const { data, error } = await requireSupabase().rpc('verify_simulation_certificate', {
    p_certificate_code: certificateCode,
  });
  const result = requireSimulationData(data, error, 'verify_simulation_certificate()');
  if (!isRecord(result) || typeof result.valid !== 'boolean') {
    throw new Error('प्रमाणपत्र प्रमाणीकरणको जवाफ अमान्य छ।');
  }
  return {
    valid: result.valid,
    ...(result.status === 'valid' || result.status === 'revoked' ? { status: result.status } : {}),
    ...(typeof result.code === 'string' ? { code: result.code } : {}),
    ...(typeof result.caseTitle === 'string' ? { caseTitle: result.caseTitle } : {}),
    ...(typeof result.score === 'number' ? { score: result.score } : {}),
    ...(typeof result.issuedAt === 'string' ? { issuedAt: result.issuedAt } : {}),
  };
};

export const DEFAULT_LOCAL_ADMIN: AppUser = {
  id: 'local-admin-1',
  username: 'admin',
  role: 'admin',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const getLocalProjects = (): TrackedProject[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_PROJECTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load local projects', e);
  }
  return [
    {
      id: 'proj-local-sample-1',
      title: 'वडा कार्यालय प्रशासनिक भवन निर्माण कार्य',
      officeName: 'शहीदभूमि गाउँपालिका, गाउँ कार्यपालिकाको कार्यालय',
      procurementType: 'works',
      methodId: 'ncb-works',
      estimatedAmount: 18500000,
      currentStageId: 'bidding',
      progressPercent: 40,
      budgetSource: 'आन्तरिक स्रोत तथा समपूरक अनुदान',
      startDate: '2081-01-15',
      targetCompletionDate: '2081-12-30',
      contractorName: 'सगरमाथा निर्माण सेवा प्रा.लि.',
      contractAmount: 16250000,
      checklistStatus: {
        'prep-1': true,
        'prep-2': true,
        'bid-1': true,
      },
      notes: 'स्थानीय मोडमा सञ्चालित नमूना आयोजना। तपाईं यसलाई सम्पादन गर्न वा नयाँ थप्न सक्नुहुन्छ।',
    },
    {
      id: 'proj-local-sample-2',
      title: 'स्वास्थ्य चौकीका लागि औषधि तथा सर्जिकल उपकरण खरिद',
      officeName: 'स्वास्थ्य सेवा विभाग, टेकु',
      procurementType: 'goods',
      methodId: 'ncb-goods',
      estimatedAmount: 4800000,
      currentStageId: 'contract-award',
      progressPercent: 75,
      budgetSource: 'नेपाल सरकार सशर्त अनुदान',
      startDate: '2081-02-01',
      targetCompletionDate: '2081-08-15',
      contractorName: 'नेपाल हेल्थकेयर सप्लायर्स प्रा.लि.',
      contractAmount: 4320000,
      checklistStatus: {
        'prep-1': true,
        'prep-2': true,
        'bid-1': true,
        'eval-1': true,
      },
      notes: 'सम्झौता कार्यान्वयन चरणमा रहेको।',
    },
  ];
};

const saveLocalProjects = (projects: TrackedProject[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save local projects', e);
  }
};

const getLocalUsers = (): AppUser[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_USERS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [
    DEFAULT_LOCAL_ADMIN,
    {
      id: 'local-user-2',
      username: 'procurement_officer',
      role: 'user',
      createdAt: '2026-01-02T00:00:00.000Z',
    },
  ];
};

const saveLocalUsers = (users: AppUser[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(users));
  } catch {}
};

const requireSupabase = () => {
  if (!supabase) throw new Error('Supabase सेटअप भएको छैन।');
  return supabase;
};

const requireData = <T,>(data: T | null, error: { message: string } | null): T => {
  if (error) throw new Error(error.message);
  if (data === null) throw new Error('Supabase बाट अपेक्षित विवरण प्राप्त भएन।');
  return data;
};

export const listAuditLogs = async (
  page: number,
  pageSize: number,
  includeDeleted = false,
): Promise<AuditLogPage> => {
  if (!Number.isInteger(page) || page < 0 || !Number.isInteger(pageSize)
    || pageSize < 1 || pageSize > 100) {
    throw new Error('Audit log पृष्ठ विवरण अमान्य छ।');
  }

  if (!supabase) {
    const logs = getLocalAuditLogs()
      .filter((entry) => includeDeleted || entry.deleted_at === null)
      .sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
    const start = page * pageSize;
    return { items: logs.slice(start, start + pageSize), total: logs.length };
  }

  let query = requireSupabase()
    .from('audit_logs')
    .select('*', { count: 'exact' });
  if (!includeDeleted) query = query.is('deleted_at', null);
  const { data, error, count } = await query
    .order('occurred_at', { ascending: false })
    .order('id', { ascending: false })
    .range(page * pageSize, ((page + 1) * pageSize) - 1);
  if (error) {
    if (error.code === 'PGRST202' || error.code === '42P01') {
      throw new Error('Audit log migration लागू भएको छैन। `supabase db push` चलाउनुहोस् र पुनः प्रयास गर्नुहोस्।');
    }
    throw new Error(error.message);
  }
  return { items: requireData(data, null), total: count ?? 0 };
};

export const recordAuditEvent = async (
  action: string,
  entityType: string,
  entityId: string | null,
  details: Record<string, Json> = {},
): Promise<void> => {
  if (!supabase) {
    recordLocalAuditEvent(action, entityType, entityId, details);
    return;
  }
  const { error } = await requireSupabase().rpc('record_audit_event', {
    p_action: action,
    p_entity_type: entityType,
    p_entity_id: entityId,
    p_details: details,
  });
  if (error) {
    if (error.code === 'PGRST202') {
      throw new Error('Audit log migration लागू भएको छैन। `supabase db push` चलाउनुहोस् र पुनः प्रयास गर्नुहोस्।');
    }
    throw new Error(error.message);
  }
};

export const softDeleteAuditLogs = async (ids: string[]): Promise<number> => {
  const uniqueIds = [...new Set(ids)];
  if (uniqueIds.length === 0) throw new Error('कम्तीमा एउटा audit log छान्नुहोस्।');

  if (!supabase) {
    const selected = new Set(uniqueIds);
    const actor = getLocalAuditActor();
    const deletedAt = new Date().toISOString();
    let deletedCount = 0;
    const updated = getLocalAuditLogs().map((entry) => {
      if (!selected.has(entry.id) || entry.deleted_at !== null) return entry;
      deletedCount += 1;
      return { ...entry, deleted_at: deletedAt, deleted_by: actor.id };
    });
    if (deletedCount > 0) {
      const event = createLocalAuditEvent(
        'audit_logs_soft_deleted',
        'audit_log',
        null,
        { deleted_count: deletedCount },
      );
      saveLocalAuditLogs([event, ...updated]);
    }
    return deletedCount;
  }

  const { data, error } = await requireSupabase().rpc('soft_delete_audit_logs', {
    p_ids: uniqueIds,
  });
  if (error) {
    if (error.code === 'PGRST202') {
      throw new Error('Audit log migration लागू भएको छैन। `supabase db push` चलाउनुहोस् र पुनः प्रयास गर्नुहोस्।');
    }
    throw new Error(error.message);
  }
  return requireData(data, null);
};

const simulationSchemaCacheError = (resource: string): Error =>
  new Error(
    `Supabase schema cache मा ${resource} भेटिएन। Practical Simulation migration लागू गर्न `
    + '`supabase db push` चलाउनुहोस्। Migration लागू छ भने SQL Editor मा '
    + "`NOTIFY pgrst, 'reload schema';` चलाएर पुनः प्रयास गर्नुहोस्। विवरण `supabase/SETUP.md` मा छ।",
  );

const simulationDatabaseError = (
  error: { code?: string; message: string },
  resource: string,
): Error => {
  if (['PGRST202', 'PGRST204', 'PGRST205'].includes(error.code ?? '')) {
    return simulationSchemaCacheError(resource);
  }
  return new Error(error.message);
};

const requireSimulationData = <T,>(
  data: T | null,
  error: { code?: string; message: string } | null,
  resource: string,
): T => {
  if (error) throw simulationDatabaseError(error, resource);
  return requireData(data, null);
};

export const signInWithUsername = async (username: string, password: string): Promise<AppUser> => {
  if (!supabase) {
    const login = username.trim() || 'admin';
    const users = getLocalUsers();
    let existing = users.find((u) => u.username.toLowerCase() === login.toLowerCase());
    if (!existing) {
      existing = {
        id: `local-user-${Date.now()}`,
        username: login,
        role: login.toLowerCase() === 'admin' ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
      };
      saveLocalUsers([...users, existing]);
    }
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SESSION, JSON.stringify(existing));
    } catch {}
    recordLocalAuditEvent('login_success', 'authentication', existing.id, { method: 'local' });
    return existing;
  }

  const client = requireSupabase();
  const login = username.trim();
  if (login.includes('@')) {
    const { data, error } = await client.auth.signInWithPassword({
      email: login.toLocaleLowerCase(),
      password,
    });
    const authUser = requireData(data.user, error);
    const user = await getAppUser(authUser.id);
    await recordAuditEvent('login_success', 'authentication', user.id, { method: 'email' });
    return user;
  }

  const { data, error } = await client.functions.invoke<{
    session?: { access_token: string; refresh_token: string };
  }>('manage-users', { body: { action: 'sign-in', username: login, password } });
  if (error) throw new Error(await getFunctionErrorMessage(error));
  if (!data?.session?.access_token || !data.session.refresh_token) {
    throw new Error('लगइन सत्र प्राप्त भएन।');
  }

  const { data: sessionData, error: sessionError } = await client.auth.setSession(data.session);
  const authUser = requireData(sessionData.user, sessionError);
  const user = await getAppUser(authUser.id);
  await recordAuditEvent('login_success', 'authentication', user.id, { method: 'username' });
  return user;
};

export const signUpWithEmail = async (
  username: string,
  email: string,
  password: string,
): Promise<AppUser | null> => {
  if (!supabase) {
    const login = username.trim() || 'user';
    const newUser: AppUser = {
      id: `local-user-${Date.now()}`,
      username: login,
      role: login.toLowerCase() === 'admin' ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
    };
    const users = getLocalUsers();
    saveLocalUsers([...users, newUser]);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SESSION, JSON.stringify(newUser));
    } catch {}
    recordLocalAuditEvent('account_created', 'user', newUser.id, { method: 'local_signup' });
    return newUser;
  }

  const client = requireSupabase();
  const normalizedEmail = email.trim();
  const emailRedirectTo = window.location.origin;
  const { data, error } = await client.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: { username: username.trim().toLocaleLowerCase() },
      emailRedirectTo,
    },
  });
  if (error) throw new Error(error.message);
  if (data.user && !data.session && data.user.identities?.length === 0) {
    const { error: resendError } = await client.auth.resend({
      type: 'signup',
      email: normalizedEmail,
      options: { emailRedirectTo },
    });
    if (resendError) throw new Error(resendError.message);
  }
  return data.session && data.user ? getAppUser(data.user.id) : null;
};

export const getAppUser = async (userId: string): Promise<AppUser> => {
  if (!supabase) {
    const users = getLocalUsers();
    const found = users.find((u) => u.id === userId);
    return found || DEFAULT_LOCAL_ADMIN;
  }

  const client = requireSupabase();
  const { data, error } = await client
    .from('user_profiles')
    .select('id, username, role, created_at')
    .eq('id', userId)
    .single();
  const profile = requireData(data, error);
  return {
    id: profile.id,
    username: profile.username,
    role: profile.role,
    createdAt: profile.created_at,
  };
};

export const restoreSessionUser = async (): Promise<AppUser | null> => {
  if (!supabase) {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY_SESSION);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }

  const client = requireSupabase();
  const { data, error } = await client.auth.getSession();
  if (error) throw new Error(error.message);
  const session: Session | null = data.session;
  return session ? getAppUser(session.user.id) : null;
};

export const signOut = async (): Promise<void> => {
  if (supabase) {
    const { data, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw new Error(sessionError.message);
    if (data.session) {
      await recordAuditEvent('logout', 'authentication', data.session.user.id);
    }
  } else {
    recordLocalAuditEvent('logout', 'authentication', null);
  }
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY_SESSION);
  } catch {}
  if (supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }
};

type ProjectRow = Database['public']['Tables']['procurement_projects']['Row'];

const readChecklistStatus = (value: Json): Record<string, boolean> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('आयोजनाको checklist विवरणको ढाँचा अमान्य छ।');
  }
  const status: Record<string, boolean> = {};
  for (const [id, checked] of Object.entries(value)) {
    if (typeof checked !== 'boolean') {
      throw new Error('आयोजनाको checklist विवरणको ढाँचा अमान्य छ।');
    }
    status[id] = checked;
  }
  return status;
};

const fromProjectRow = (row: ProjectRow): TrackedProject => ({
  id: row.id,
  title: row.title,
  officeName: row.office_name,
  procurementType: row.procurement_type,
  methodId: row.method_id,
  estimatedAmount: Number(row.estimated_amount),
  currentStageId: row.current_stage_id,
  progressPercent: row.progress_percent,
  budgetSource: row.budget_source,
  startDate: row.start_date,
  targetCompletionDate: row.target_completion_date,
  contractorName: row.contractor_name ?? undefined,
  contractAmount: row.contract_amount === null ? undefined : Number(row.contract_amount),
  checklistStatus: readChecklistStatus(row.checklist_status),
  notes: row.notes ?? undefined,
});

const toProjectRow = (project: TrackedProject) => ({
  id: project.id,
  title: project.title,
  office_name: project.officeName,
  procurement_type: project.procurementType,
  method_id: project.methodId,
  estimated_amount: project.estimatedAmount,
  current_stage_id: project.currentStageId,
  progress_percent: project.progressPercent,
  budget_source: project.budgetSource,
  start_date: project.startDate,
  target_completion_date: project.targetCompletionDate,
  contractor_name: project.contractorName ?? null,
  contract_amount: project.contractAmount ?? null,
  checklist_status: project.checklistStatus,
  notes: project.notes ?? null,
});

export const listProjects = async (): Promise<TrackedProject[]> => {
  if (!supabase) {
    return getLocalProjects();
  }
  try {
    const { data, error } = await requireSupabase()
      .from('procurement_projects')
      .select('*')
      .order('created_at', { ascending: false });
    return requireData(data, error).map(fromProjectRow);
  } catch (err) {
    console.warn('Supabase projects fetch failed, using local fallback:', err);
    return getLocalProjects();
  }
};

export const createProject = async (
  project: TrackedProject,
  ownerId: string,
): Promise<TrackedProject> => {
  if (!supabase) {
    const projects = getLocalProjects();
    const newProj: TrackedProject = {
      ...project,
      id: project.id || `proj-local-${Date.now()}`,
    };
    saveLocalProjects([newProj, ...projects]);
    recordLocalAuditEvent('created', 'project', newProj.id, {
      changed_fields: ['project'],
    });
    return newProj;
  }

  const { data, error } = await requireSupabase()
    .from('procurement_projects')
    .insert({ ...toProjectRow(project), owner_id: ownerId })
    .select('*')
    .single();
  return fromProjectRow(requireData(data, error));
};

export const updateProject = async (project: TrackedProject): Promise<TrackedProject> => {
  if (!supabase) {
    const projects = getLocalProjects();
    const updatedList = projects.map((p) => (p.id === project.id ? project : p));
    saveLocalProjects(updatedList);
    recordLocalAuditEvent('updated', 'project', project.id, {
      changed_fields: ['project'],
    });
    return project;
  }

  const { data, error } = await requireSupabase()
    .from('procurement_projects')
    .update(toProjectRow(project))
    .eq('id', project.id)
    .select('*')
    .single();
  return fromProjectRow(requireData(data, error));
};

interface UserFunctionResponse {
  users?: Array<{ id: string; username: string; role: UserRole; created_at: string }>;
  user?: { id: string; username: string; role: UserRole; created_at: string };
}

const getFunctionErrorMessage = async (error: { message: string; context?: unknown }): Promise<string> => {
  if (error.context instanceof Response) {
    try {
      const responseBody: unknown = await error.context.json();
      if (responseBody && typeof responseBody === 'object' && 'error' in responseBody
        && typeof responseBody.error === 'string') {
        return responseBody.error;
      }
    } catch {
      // Keep the Supabase SDK error when the function response is not JSON.
    }
  }
  if (error.message.includes('Failed to send a request to the Edge Function')) {
    return 'manage-users Edge Function सँग सम्पर्क हुन सकेन। Supabase मा function deploy भएको र उपलब्ध रहेको जाँच गर्नुहोस्।';
  }
  return error.message;
};

const invokeUserFunction = async (body: Record<string, unknown>): Promise<UserFunctionResponse> => {
  const { data, error } = await requireSupabase().functions.invoke('manage-users', { body });
  if (error) throw new Error(await getFunctionErrorMessage(error));
  if (!data || typeof data !== 'object') throw new Error('User management response अमान्य छ।');
  return data as UserFunctionResponse;
};

const mapUser = (user: NonNullable<UserFunctionResponse['user']>): AppUser => ({
  id: user.id,
  username: user.username,
  role: user.role,
  createdAt: user.created_at,
});

export const listManagedUsers = async (): Promise<AppUser[]> => {
  if (!supabase) {
    return getLocalUsers();
  }
  const { data, error } = await requireSupabase()
    .from('user_profiles')
    .select('id, username, role, created_at')
    .order('created_at', { ascending: true });
  return requireData(data, error).map((user) => ({
    id: user.id,
    username: user.username,
    role: user.role,
    createdAt: user.created_at,
  }));
};

export const createManagedUser = async (input: ManagedUserInput): Promise<AppUser> => {
  if (!supabase) {
    const users = getLocalUsers();
    const newUser: AppUser = {
      id: `local-user-${Date.now()}`,
      username: input.username,
      role: input.role,
      createdAt: new Date().toISOString(),
    };
    saveLocalUsers([...users, newUser]);
    recordLocalAuditEvent('admin_user_created', 'user', newUser.id, {
      changed_fields: ['username', 'role'],
    });
    return newUser;
  }
  const response = await invokeUserFunction({ action: 'create', ...input });
  if (!response.user) throw new Error('नयाँ प्रयोगकर्ता विवरण प्राप्त भएन।');
  return mapUser(response.user);
};

export const updateManagedUser = async (id: string, input: ManagedUserInput): Promise<AppUser> => {
  if (!supabase) {
    const users = getLocalUsers();
    let updated: AppUser | undefined;
    const newUsers = users.map((u) => {
      if (u.id === id) {
        updated = { ...u, username: input.username, role: input.role };
        return updated;
      }
      return u;
    });
    saveLocalUsers(newUsers);
    if (!updated) throw new Error('प्रयोगकर्ता भेटिएन।');
    recordLocalAuditEvent('admin_user_updated', 'user', id, {
      changed_fields: ['username', 'role'],
    });
    return updated;
  }
  const response = await invokeUserFunction({ action: 'update', id, ...input });
  if (!response.user) throw new Error('परिवर्तित प्रयोगकर्ता विवरण प्राप्त भएन।');
  return mapUser(response.user);
};

export const deleteManagedUser = async (id: string): Promise<void> => {
  if (!supabase) {
    const users = getLocalUsers();
    saveLocalUsers(users.filter((u) => u.id !== id));
    if (users.some((user) => user.id === id)) {
      recordLocalAuditEvent('admin_user_deleted', 'user', id);
    }
    return;
  }
  await invokeUserFunction({ action: 'delete', id });
};
