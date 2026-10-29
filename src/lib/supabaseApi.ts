import { Session } from '@supabase/supabase-js';
import { AppUser, ManagedUserInput, UserRole } from '../types/auth';
import { TrackedProject } from '../types/procurement';
import { Database, Json, supabase } from './supabase';

const LOCAL_STORAGE_KEY_PROJECTS = 'app_local_procurement_projects';
const LOCAL_STORAGE_KEY_USERS = 'app_local_users';
const LOCAL_STORAGE_KEY_SESSION = 'app_local_session_user';

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
    return getAppUser(authUser.id);
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
  return getAppUser(authUser.id);
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
    return;
  }
  await invokeUserFunction({ action: 'delete', id });
};
