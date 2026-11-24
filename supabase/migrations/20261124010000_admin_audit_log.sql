create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  actor_id uuid references auth.users (id) on delete set null,
  actor_username text not null default 'system',
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb
    check (jsonb_typeof(details) = 'object'),
  deleted_at timestamptz,
  deleted_by uuid references auth.users (id) on delete set null
);

create index if not exists audit_logs_occurred_at_idx
  on public.audit_logs (occurred_at desc);
create index if not exists audit_logs_active_occurred_at_idx
  on public.audit_logs (occurred_at desc)
  where deleted_at is null;

alter table public.audit_logs enable row level security;

drop policy if exists "Admins can read audit logs" on public.audit_logs;
create policy "Admins can read audit logs"
  on public.audit_logs
  for select
  to authenticated
  using ((select public.current_app_role()) = 'admin');

revoke all on public.audit_logs from anon, authenticated;
grant select on public.audit_logs to authenticated;

create or replace function public.append_audit_log(
  p_action text,
  p_entity_type text,
  p_entity_id text,
  p_details jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  event_id uuid;
  actor uuid := auth.uid();
  actor_name text;
begin
  select profile.username
    into actor_name
    from public.user_profiles as profile
   where profile.id = actor;

  insert into public.audit_logs (
    actor_id,
    actor_username,
    action,
    entity_type,
    entity_id,
    details
  )
  values (
    actor,
    coalesce(actor_name, case when actor is null then 'system' else 'unknown' end),
    p_action,
    p_entity_type,
    p_entity_id,
    coalesce(p_details, '{}'::jsonb)
  )
  returning id into event_id;

  return event_id;
end;
$$;

revoke all on function public.append_audit_log(text, text, text, jsonb)
  from public, anon, authenticated;

create or replace function public.capture_auth_user_created()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.append_audit_log(
    'account_created',
    'auth_user',
    new.id::text,
    jsonb_build_object(
      'provider',
      coalesce(new.raw_app_meta_data ->> 'provider', 'email')
    )
  );
  return new;
end;
$$;

revoke all on function public.capture_auth_user_created() from public, anon, authenticated;

drop trigger if exists audit_auth_user_created on auth.users;
create trigger audit_auth_user_created
  after insert on auth.users
  for each row execute function public.capture_auth_user_created();

create or replace function public.record_audit_event(
  p_action text,
  p_entity_type text,
  p_entity_id text default null,
  p_details jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication is required to record an audit event.';
  end if;

  if jsonb_typeof(coalesce(p_details, '{}'::jsonb)) <> 'object'
     or octet_length(coalesce(p_details, '{}'::jsonb)::text) > 4096 then
    raise exception 'Audit event details must be an object no larger than 4096 bytes.';
  end if;

  if p_entity_type = 'authentication'
     and p_action in ('login_success', 'logout')
     and p_entity_id = auth.uid()::text then
    null;
  elsif p_entity_type = 'user'
     and p_action in ('admin_user_created', 'admin_user_updated', 'admin_user_deleted')
     and (select public.current_app_role()) = 'admin' then
    null;
  else
    raise exception 'This audit event is not permitted.';
  end if;

  return public.append_audit_log(p_action, p_entity_type, p_entity_id, p_details);
end;
$$;

revoke all on function public.record_audit_event(text, text, text, jsonb)
  from public, anon;
grant execute on function public.record_audit_event(text, text, text, jsonb)
  to authenticated;

create or replace function public.capture_audit_log()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  old_row jsonb := '{}'::jsonb;
  new_row jsonb := '{}'::jsonb;
  changed_fields jsonb;
  event_id text;
  event_action text;
begin
  if coalesce(auth.role(), '') = 'service_role' then
    if tg_op = 'DELETE' then
      return old;
    end if;
    return new;
  end if;

  if tg_op in ('UPDATE', 'DELETE') then
    old_row := to_jsonb(old);
  end if;
  if tg_op in ('INSERT', 'UPDATE') then
    new_row := to_jsonb(new);
  end if;

  if tg_op = 'UPDATE' then
    select coalesce(jsonb_agg(field_key order by field_key), '[]'::jsonb)
      into changed_fields
      from (
        select coalesce(old_fields.key, new_fields.key) as field_key
          from jsonb_each(old_row) as old_fields(key, value)
          full join jsonb_each(new_row) as new_fields(key, value) using (key)
         where old_fields.value is distinct from new_fields.value
      ) as changed;
  else
    select coalesce(jsonb_agg(field_key order by field_key), '[]'::jsonb)
      into changed_fields
      from jsonb_object_keys(case when tg_op = 'DELETE' then old_row else new_row end)
        as field(field_key);
  end if;

  event_id := case tg_argv[1]
    when 'case_version' then
      coalesce(new_row ->> 'case_key', old_row ->> 'case_key') || ':' ||
      coalesce(new_row ->> 'version', old_row ->> 'version')
    when 'answer' then
      coalesce(new_row ->> 'attempt_id', old_row ->> 'attempt_id') || ':' ||
      coalesce(new_row ->> 'step_id', old_row ->> 'step_id')
    else coalesce(new_row ->> tg_argv[1], old_row ->> tg_argv[1])
  end;
  event_action := case tg_op
    when 'INSERT' then 'created'
    when 'UPDATE' then 'updated'
    else 'deleted'
  end;

  perform public.append_audit_log(
    event_action,
    tg_argv[0],
    event_id,
    jsonb_build_object('changed_fields', changed_fields)
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke all on function public.capture_audit_log() from public, anon, authenticated;

drop trigger if exists audit_user_profiles on public.user_profiles;
create trigger audit_user_profiles
  after insert or update or delete on public.user_profiles
  for each row execute function public.capture_audit_log('user', 'id');

drop trigger if exists audit_procurement_projects on public.procurement_projects;
create trigger audit_procurement_projects
  after insert or update or delete on public.procurement_projects
  for each row execute function public.capture_audit_log('project', 'id');

drop trigger if exists audit_simulation_case_versions on public.simulation_case_versions;
create trigger audit_simulation_case_versions
  after insert or update or delete on public.simulation_case_versions
  for each row execute function public.capture_audit_log('simulation_case_version', 'case_version');

drop trigger if exists audit_simulation_attempts on public.simulation_attempts;
create trigger audit_simulation_attempts
  after insert or update or delete on public.simulation_attempts
  for each row execute function public.capture_audit_log('simulation_attempt', 'id');

drop trigger if exists audit_simulation_answers on public.simulation_answers;
create trigger audit_simulation_answers
  after insert or update or delete on public.simulation_answers
  for each row execute function public.capture_audit_log('simulation_answer', 'answer');

drop trigger if exists audit_simulation_results on public.simulation_results;
create trigger audit_simulation_results
  after insert or update or delete on public.simulation_results
  for each row execute function public.capture_audit_log('simulation_result', 'attempt_id');

drop trigger if exists audit_simulation_certificates on public.simulation_certificates;
create trigger audit_simulation_certificates
  after insert or update or delete on public.simulation_certificates
  for each row execute function public.capture_audit_log('simulation_certificate', 'certificate_code');

create or replace function public.soft_delete_audit_logs(p_ids uuid[])
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  deleted_count integer;
begin
  if auth.uid() is null or (select public.current_app_role()) is distinct from 'admin' then
    raise exception 'Administrator access is required.';
  end if;
  if p_ids is null or coalesce(array_length(p_ids, 1), 0) = 0 then
    raise exception 'Select at least one audit log entry.';
  end if;

  update public.audit_logs
     set deleted_at = now(),
         deleted_by = auth.uid()
   where id = any(p_ids)
     and deleted_at is null;
  get diagnostics deleted_count = row_count;

  if deleted_count > 0 then
    perform public.append_audit_log(
      'audit_logs_soft_deleted',
      'audit_log',
      null,
      jsonb_build_object('deleted_count', deleted_count)
    );
  end if;

  return deleted_count;
end;
$$;

revoke all on function public.soft_delete_audit_logs(uuid[]) from public, anon;
grant execute on function public.soft_delete_audit_logs(uuid[]) to authenticated;
