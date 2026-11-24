import { createClient } from '@supabase/supabase-js';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          username: string;
          role: 'admin' | 'user';
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          role?: 'admin' | 'user';
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          role?: 'admin' | 'user';
          created_at?: string;
        };
        Relationships: [];
      };
      procurement_projects: {
        Row: {
          id: string;
          owner_id: string | null;
          title: string;
          office_name: string;
          procurement_type: 'works' | 'goods' | 'consulting' | 'services';
          method_id: string;
          estimated_amount: number;
          current_stage_id: string;
          progress_percent: number;
          budget_source: string;
          start_date: string;
          target_completion_date: string;
          contractor_name: string | null;
          contract_amount: number | null;
          checklist_status: Json;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          owner_id: string | null;
          title: string;
          office_name: string;
          procurement_type: 'works' | 'goods' | 'consulting' | 'services';
          method_id: string;
          estimated_amount: number;
          current_stage_id: string;
          progress_percent: number;
          budget_source: string;
          start_date: string;
          target_completion_date: string;
          contractor_name?: string | null;
          contract_amount?: number | null;
          checklist_status?: Json;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string | null;
          title?: string;
          office_name?: string;
          procurement_type?: 'works' | 'goods' | 'consulting' | 'services';
          method_id?: string;
          estimated_amount?: number;
          current_stage_id?: string;
          progress_percent?: number;
          budget_source?: string;
          start_date?: string;
          target_completion_date?: string;
          contractor_name?: string | null;
          contract_amount?: number | null;
          checklist_status?: Json;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      simulation_case_versions: {
        Row: {
          case_key: string;
          version: number;
          status: 'draft' | 'published';
          content: Json;
          answer_key: Json;
          created_by: string | null;
          created_at: string;
          published_at: string | null;
        };
        Insert: {
          case_key: string;
          version: number;
          status: 'draft' | 'published';
          content: Json;
          answer_key: Json;
          created_by?: string | null;
          created_at?: string;
          published_at?: string | null;
        };
        Update: {
          case_key?: string;
          version?: number;
          status?: 'draft' | 'published';
          content?: Json;
          answer_key?: Json;
          created_by?: string | null;
          created_at?: string;
          published_at?: string | null;
        };
        Relationships: [];
      };
      simulation_attempts: {
        Row: {
          id: string;
          user_id: string;
          case_key: string;
          case_version: number;
          attempt_no: number;
          status: 'in_progress' | 'completed';
          started_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          case_key: string;
          case_version: number;
          attempt_no?: number;
          status?: 'in_progress' | 'completed';
          started_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          case_key?: string;
          case_version?: number;
          attempt_no?: number;
          status?: 'in_progress' | 'completed';
          started_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      simulation_answers: {
        Row: {
          attempt_id: string;
          step_id: string;
          response: Json;
          updated_at: string;
        };
        Insert: {
          attempt_id: string;
          step_id: string;
          response: Json;
          updated_at?: string;
        };
        Update: {
          attempt_id?: string;
          step_id?: string;
          response?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      simulation_results: {
        Row: {
          attempt_id: string;
          user_id: string;
          score: number;
          passed: boolean;
          breakdown: Json;
          completed_at: string;
        };
        Insert: {
          attempt_id: string;
          user_id: string;
          score: number;
          passed: boolean;
          breakdown: Json;
          completed_at?: string;
        };
        Update: {
          attempt_id?: string;
          user_id?: string;
          score?: number;
          passed?: boolean;
          breakdown?: Json;
          completed_at?: string;
        };
        Relationships: [];
      };
      simulation_certificates: {
        Row: {
          certificate_code: string;
          attempt_id: string;
          user_id: string;
          case_key: string;
          case_version: number;
          display_name: string;
          issued_at: string;
          revoked_at: string | null;
        };
        Insert: {
          certificate_code?: string;
          attempt_id: string;
          user_id: string;
          case_key: string;
          case_version: number;
          display_name: string;
          issued_at?: string;
          revoked_at?: string | null;
        };
        Update: {
          certificate_code?: string;
          attempt_id?: string;
          user_id?: string;
          case_key?: string;
          case_version?: number;
          display_name?: string;
          issued_at?: string;
          revoked_at?: string | null;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
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
        };
        Insert: {
          id?: string;
          occurred_at?: string;
          actor_id?: string | null;
          actor_username?: string;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          details?: Json;
          deleted_at?: string | null;
          deleted_by?: string | null;
        };
        Update: {
          id?: string;
          occurred_at?: string;
          actor_id?: string | null;
          actor_username?: string;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          details?: Json;
          deleted_at?: string | null;
          deleted_by?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      save_simulation_case_version: {
        Args: {
          p_case_key: string;
          p_content: Json;
          p_answer_key: Json;
          p_status: 'draft' | 'published';
        };
        Returns: Array<{ case_key: string; version: number; status: string; created_at: string }>;
      };
      list_admin_simulation_case_versions: {
        Args: Record<string, never>;
        Returns: Array<{
          case_key: string;
          version: number;
          status: 'draft' | 'published';
          content: Json;
          answer_key: Json;
          created_at: string;
        }>;
      };
      grade_simulation_attempt: {
        Args: { p_attempt_id: string };
        Returns: Json;
      };
      issue_simulation_certificate: {
        Args: { p_attempt_id: string; p_display_name: string };
        Returns: Array<{
          certificate_code: string;
          display_name: string;
          case_key: string;
          case_title: string;
          score: number;
          issued_at: string;
        }>;
      };
      verify_simulation_certificate: {
        Args: { p_certificate_code: string };
        Returns: Json;
      };
      record_audit_event: {
        Args: {
          p_action: string;
          p_entity_type: string;
          p_entity_id?: string | null;
          p_details?: Json;
        };
        Returns: string;
      };
      soft_delete_audit_logs: {
        Args: { p_ids: string[] };
        Returns: number;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl!, supabasePublishableKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const USER_EMAIL_DOMAIN = 'accounts.procurement-guide.example';

export const usernameToEmail = (username: string) =>
  `${username.trim().toLocaleLowerCase()}@${USER_EMAIL_DOMAIN}`;
