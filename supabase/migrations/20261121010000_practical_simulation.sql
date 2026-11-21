create table if not exists public.simulation_case_versions (
  case_key text not null check (case_key ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  version integer not null check (version > 0),
  status text not null check (status in ('draft', 'published')),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  answer_key jsonb not null check (jsonb_typeof(answer_key) = 'object'),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  published_at timestamptz,
  primary key (case_key, version),
  check ((status = 'published') = (published_at is not null))
);

create table if not exists public.simulation_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  case_key text not null,
  case_version integer not null,
  attempt_no integer not null default 1 check (attempt_no > 0),
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  foreign key (case_key, case_version)
    references public.simulation_case_versions (case_key, version),
  unique (user_id, case_key, case_version, attempt_no),
  check ((status = 'completed') = (completed_at is not null))
);

create index if not exists simulation_attempts_user_started_idx
  on public.simulation_attempts (user_id, started_at desc);

create table if not exists public.simulation_answers (
  attempt_id uuid not null references public.simulation_attempts (id) on delete cascade,
  step_id text not null,
  response jsonb not null check (jsonb_typeof(response) = 'object'),
  updated_at timestamptz not null default now(),
  primary key (attempt_id, step_id)
);

create table if not exists public.simulation_results (
  attempt_id uuid primary key references public.simulation_attempts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  score integer not null check (score between 0 and 100),
  passed boolean not null,
  breakdown jsonb not null check (jsonb_typeof(breakdown) = 'array'),
  completed_at timestamptz not null default now()
);

create index if not exists simulation_results_user_completed_idx
  on public.simulation_results (user_id, completed_at desc);

create table if not exists public.simulation_certificates (
  certificate_code uuid primary key default gen_random_uuid(),
  attempt_id uuid not null unique references public.simulation_results (attempt_id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  case_key text not null,
  case_version integer not null,
  display_name text not null check (length(btrim(display_name)) between 2 and 120),
  issued_at timestamptz not null default now(),
  revoked_at timestamptz,
  foreign key (case_key, case_version)
    references public.simulation_case_versions (case_key, version)
);

create or replace function public.assign_simulation_attempt_number()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtext(new.user_id::text),
    pg_catalog.hashtext(new.case_key)
  );

  select coalesce(max(attempt.attempt_no), 0) + 1
    into new.attempt_no
    from public.simulation_attempts as attempt
   where attempt.user_id = new.user_id
     and attempt.case_key = new.case_key;

  return new;
end;
$$;

drop trigger if exists simulation_attempts_assign_number
  on public.simulation_attempts;
create trigger simulation_attempts_assign_number
  before insert on public.simulation_attempts
  for each row execute procedure public.assign_simulation_attempt_number();

create or replace function public.touch_simulation_answer()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists simulation_answers_touch_updated_at
  on public.simulation_answers;
create trigger simulation_answers_touch_updated_at
  before update on public.simulation_answers
  for each row execute procedure public.touch_simulation_answer();

alter table public.simulation_case_versions enable row level security;
alter table public.simulation_attempts enable row level security;
alter table public.simulation_answers enable row level security;
alter table public.simulation_results enable row level security;
alter table public.simulation_certificates enable row level security;

drop policy if exists "Authenticated users can read published simulation cases"
  on public.simulation_case_versions;
create policy "Authenticated users can read published simulation cases"
  on public.simulation_case_versions
  for select
  to authenticated
  using (status = 'published' or (select public.current_app_role()) = 'admin');

drop policy if exists "Users can read permitted simulation attempts"
  on public.simulation_attempts;
create policy "Users can read permitted simulation attempts"
  on public.simulation_attempts
  for select
  to authenticated
  using (user_id = (select auth.uid()) or (select public.current_app_role()) = 'admin');

drop policy if exists "Users can start their own attempts for published cases"
  on public.simulation_attempts;
create policy "Users can start their own attempts for published cases"
  on public.simulation_attempts
  for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'in_progress'
    and completed_at is null
    and exists (
      select 1
        from public.simulation_case_versions as case_version
       where case_version.case_key = simulation_attempts.case_key
         and case_version.version = simulation_attempts.case_version
         and case_version.status = 'published'
    )
  );

drop policy if exists "Users can read their own answers and admins can read all"
  on public.simulation_answers;
create policy "Users can read their own answers and admins can read all"
  on public.simulation_answers
  for select
  to authenticated
  using (
    exists (
      select 1
        from public.simulation_attempts as attempt
       where attempt.id = simulation_answers.attempt_id
         and (attempt.user_id = (select auth.uid())
              or (select public.current_app_role()) = 'admin')
    )
  );

drop policy if exists "Users can save answers to their own active attempts"
  on public.simulation_answers;
create policy "Users can save answers to their own active attempts"
  on public.simulation_answers
  for insert
  to authenticated
  with check (
    exists (
      select 1
        from public.simulation_attempts as attempt
       where attempt.id = simulation_answers.attempt_id
         and attempt.user_id = (select auth.uid())
         and attempt.status = 'in_progress'
    )
  );

drop policy if exists "Users can update answers to their own active attempts"
  on public.simulation_answers;
create policy "Users can update answers to their own active attempts"
  on public.simulation_answers
  for update
  to authenticated
  using (
    exists (
      select 1
        from public.simulation_attempts as attempt
       where attempt.id = simulation_answers.attempt_id
         and attempt.user_id = (select auth.uid())
         and attempt.status = 'in_progress'
    )
  )
  with check (
    exists (
      select 1
        from public.simulation_attempts as attempt
       where attempt.id = simulation_answers.attempt_id
         and attempt.user_id = (select auth.uid())
         and attempt.status = 'in_progress'
    )
  );

drop policy if exists "Users can read permitted simulation results"
  on public.simulation_results;
create policy "Users can read permitted simulation results"
  on public.simulation_results
  for select
  to authenticated
  using (user_id = (select auth.uid()) or (select public.current_app_role()) = 'admin');

drop policy if exists "Users can read permitted simulation certificates"
  on public.simulation_certificates;
create policy "Users can read permitted simulation certificates"
  on public.simulation_certificates
  for select
  to authenticated
  using (user_id = (select auth.uid()) or (select public.current_app_role()) = 'admin');

revoke all on public.simulation_case_versions from anon, authenticated;
grant select (case_key, version, status, content, created_at, published_at)
  on public.simulation_case_versions to authenticated;

revoke all on public.simulation_attempts from anon, authenticated;
grant select, insert on public.simulation_attempts to authenticated;

revoke all on public.simulation_answers from anon, authenticated;
grant select, insert, update on public.simulation_answers to authenticated;

revoke all on public.simulation_results from anon, authenticated;
grant select on public.simulation_results to authenticated;

revoke all on public.simulation_certificates from anon, authenticated;
grant select on public.simulation_certificates to authenticated;

create or replace function public.save_simulation_case_version(
  p_case_key text,
  p_content jsonb,
  p_answer_key jsonb,
  p_status text
)
returns table (case_key text, version integer, status text, created_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  next_version integer;
  step jsonb;
  total_points numeric := 0;
  inserted_at timestamptz;
begin
  if auth.uid() is null or (select public.current_app_role()) <> 'admin' then
    raise exception 'Administrator access is required.';
  end if;
  if p_case_key !~ '^[a-z0-9][a-z0-9-]{2,63}$' then
    raise exception 'Case key must use 3-64 lowercase letters, digits, or hyphens.';
  end if;
  if p_status not in ('draft', 'published')
     or jsonb_typeof(p_content) <> 'object'
     or jsonb_typeof(p_answer_key) <> 'object'
     or jsonb_typeof(p_content -> 'steps') <> 'array'
     or length(btrim(coalesce(p_content ->> 'title', ''))) < 3 then
    raise exception 'Case content, answer key, status, or title is invalid.';
  end if;

  for step in select value from jsonb_array_elements(p_content -> 'steps')
  loop
    if length(btrim(coalesce(step ->> 'id', ''))) = 0
       or (step ->> 'points') !~ '^[0-9]+$'
       or p_answer_key -> (step ->> 'id') is null then
      raise exception 'Every case step needs an id, integer points, and an answer-key entry.';
    end if;
    total_points := total_points + (step ->> 'points')::numeric;
  end loop;

  if total_points <> 100 then
    raise exception 'Case rubric must total exactly 100 points.';
  end if;
  if pg_catalog.pg_column_size(p_content) > 262144
     or pg_catalog.pg_column_size(p_answer_key) > 131072 then
    raise exception 'Case content exceeds the allowed size.';
  end if;

  select coalesce(max(existing.version), 0) + 1
    into next_version
    from public.simulation_case_versions as existing
   where existing.case_key = p_case_key;

  insert into public.simulation_case_versions (
    case_key, version, status, content, answer_key, created_by, published_at
  )
  values (
    p_case_key,
    next_version,
    p_status,
    p_content,
    p_answer_key,
    auth.uid(),
    case when p_status = 'published' then now() else null end
  )
  returning public.simulation_case_versions.created_at into inserted_at;

  return query select p_case_key, next_version, p_status, inserted_at;
end;
$$;

create or replace function public.list_admin_simulation_case_versions()
returns table (
  case_key text,
  version integer,
  status text,
  content jsonb,
  answer_key jsonb,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or (select public.current_app_role()) <> 'admin' then
    raise exception 'Administrator access is required.';
  end if;

  return query
  select versions.case_key, versions.version, versions.status,
         versions.content, versions.answer_key, versions.created_at
    from public.simulation_case_versions as versions
   order by versions.case_key, versions.version desc;
end;
$$;

create or replace function public.grade_simulation_attempt(p_attempt_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  attempt public.simulation_attempts%rowtype;
  existing_result public.simulation_results%rowtype;
  case_content jsonb;
  answer_key jsonb;
  step jsonb;
  key_entry jsonb;
  response_value text;
  expected_answer text;
  points_available integer;
  points_percentage integer;
  points_earned integer;
  total_score integer := 0;
  is_correct boolean;
  breakdown jsonb := '[]'::jsonb;
  completed_time timestamptz := now();
  numeric_response numeric;
begin
  select * into attempt
    from public.simulation_attempts
   where id = p_attempt_id;
  if not found or attempt.user_id <> auth.uid() then
    raise exception 'Simulation attempt not found or access denied.';
  end if;

  if attempt.status = 'completed' then
    select * into existing_result
      from public.simulation_results
     where attempt_id = p_attempt_id;
    if not found then
      raise exception 'Completed simulation result is missing.';
    end if;
    return jsonb_build_object(
      'score', existing_result.score,
      'passed', existing_result.passed,
      'breakdown', existing_result.breakdown,
      'completedAt', existing_result.completed_at
    );
  end if;

  select version_row.content, version_row.answer_key
    into case_content, answer_key
    from public.simulation_case_versions as version_row
   where version_row.case_key = attempt.case_key
     and version_row.version = attempt.case_version
     and version_row.status = 'published';
  if not found then
    raise exception 'Published case version was not found.';
  end if;

  for step in select value from jsonb_array_elements(case_content -> 'steps')
  loop
    key_entry := answer_key -> (step ->> 'id');
    if key_entry is null then
      raise exception 'Scoring key missing for step %.', step ->> 'id';
    end if;

    select answer.response ->> 'value'
      into response_value
      from public.simulation_answers as answer
     where answer.attempt_id = p_attempt_id
       and answer.step_id = step ->> 'id';
    if not found or response_value is null then
      raise exception 'Answer missing for step %.', step ->> 'id';
    end if;

    points_available := (step ->> 'points')::integer;
    is_correct := false;
    points_percentage := 0;
    expected_answer := '';

    if key_entry ->> 'type' = 'single-choice' then
      points_percentage := greatest(0, least(100,
        coalesce((key_entry -> 'optionScores' ->> response_value)::integer, 0)
      ));
      is_correct := response_value = key_entry ->> 'correctOptionId';
      select option_row.value ->> 'label'
        into expected_answer
        from jsonb_array_elements(step -> 'options') as option_row(value)
       where option_row.value ->> 'id' = key_entry ->> 'correctOptionId'
       limit 1;
      expected_answer := coalesce(expected_answer, key_entry ->> 'correctOptionId');
    elsif key_entry ->> 'type' = 'number' then
      if response_value !~ '^-?[0-9]+(\.[0-9]+)?$' then
        points_percentage := 0;
      else
        numeric_response := response_value::numeric;
        is_correct := abs(numeric_response - (key_entry ->> 'expectedValue')::numeric)
          <= (key_entry ->> 'tolerance')::numeric;
        points_percentage := case when is_correct then 100 else 0 end;
      end if;
      expected_answer := (key_entry ->> 'expectedValue')
        || ' ' || coalesce(step ->> 'numberUnit', '');
    else
      raise exception 'Unsupported scoring type for step %.', step ->> 'id';
    end if;

    points_earned := floor((points_available::numeric * points_percentage / 100) + 0.5)::integer;
    total_score := total_score + points_earned;
    breakdown := breakdown || jsonb_build_array(jsonb_build_object(
      'stepId', step ->> 'id',
      'pointsEarned', points_earned,
      'pointsAvailable', points_available,
      'isCorrect', is_correct,
      'explanation', key_entry ->> 'explanation',
      'correctAnswer', expected_answer
    ));
  end loop;

  if total_score not between 0 and 100 then
    raise exception 'Calculated score is outside the supported range.';
  end if;

  update public.simulation_attempts
     set status = 'completed', completed_at = completed_time, updated_at = completed_time
   where id = p_attempt_id and status = 'in_progress';

  insert into public.simulation_results (attempt_id, user_id, score, passed, breakdown, completed_at)
  values (p_attempt_id, attempt.user_id, total_score, total_score >= 70, breakdown, completed_time);

  return jsonb_build_object(
    'score', total_score,
    'passed', total_score >= 70,
    'breakdown', breakdown,
    'completedAt', completed_time
  );
end;
$$;

create or replace function public.issue_simulation_certificate(
  p_attempt_id uuid,
  p_display_name text
)
returns table (
  certificate_code uuid,
  display_name text,
  case_key text,
  case_title text,
  score integer,
  issued_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  attempt_row public.simulation_attempts%rowtype;
begin
  if auth.uid() is null or length(btrim(coalesce(p_display_name, ''))) not between 2 and 120 then
    raise exception 'A participant name between 2 and 120 characters is required.';
  end if;

  select * into attempt_row
    from public.simulation_attempts
   where id = p_attempt_id
     and user_id = auth.uid()
     and status = 'completed';
  if not found then
    raise exception 'Completed attempt was not found.';
  end if;

  if not exists (
    select 1 from public.simulation_results as result
     where result.attempt_id = p_attempt_id and result.passed
  ) then
    raise exception 'The passing score is required for a certificate.';
  end if;

  insert into public.simulation_certificates (
    attempt_id, user_id, case_key, case_version, display_name
  )
  values (
    p_attempt_id, auth.uid(), attempt_row.case_key, attempt_row.case_version, btrim(p_display_name)
  )
  on conflict (attempt_id) do nothing;

  return query
  select certificate.certificate_code, certificate.display_name,
         certificate.case_key, version_row.content ->> 'title',
         result.score, certificate.issued_at
    from public.simulation_certificates as certificate
    join public.simulation_results as result on result.attempt_id = certificate.attempt_id
    join public.simulation_case_versions as version_row
      on version_row.case_key = certificate.case_key
     and version_row.version = certificate.case_version
   where certificate.attempt_id = p_attempt_id
     and certificate.user_id = auth.uid();
end;
$$;

create or replace function public.verify_simulation_certificate(p_certificate_code uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  certificate record;
begin
  select c.certificate_code, c.issued_at, c.revoked_at,
         version_row.content ->> 'title' as case_title,
         result.score
    into certificate
    from public.simulation_certificates as c
    join public.simulation_results as result on result.attempt_id = c.attempt_id
    join public.simulation_case_versions as version_row
      on version_row.case_key = c.case_key
     and version_row.version = c.case_version
   where c.certificate_code = p_certificate_code;

  if not found then
    return jsonb_build_object('valid', false);
  end if;

  return jsonb_build_object(
    'valid', certificate.revoked_at is null,
    'code', certificate.certificate_code,
    'caseTitle', certificate.case_title,
    'score', certificate.score,
    'issuedAt', certificate.issued_at,
    'status', case when certificate.revoked_at is null then 'valid' else 'revoked' end
  );
end;
$$;

revoke all on function public.save_simulation_case_version(text, jsonb, jsonb, text) from public, anon, authenticated;
grant execute on function public.save_simulation_case_version(text, jsonb, jsonb, text) to authenticated;

revoke all on function public.list_admin_simulation_case_versions() from public, anon, authenticated;
grant execute on function public.list_admin_simulation_case_versions() to authenticated;

revoke all on function public.grade_simulation_attempt(uuid) from public, anon, authenticated;
grant execute on function public.grade_simulation_attempt(uuid) to authenticated;

revoke all on function public.issue_simulation_certificate(uuid, text) from public, anon, authenticated;
grant execute on function public.issue_simulation_certificate(uuid, text) to authenticated;

revoke all on function public.verify_simulation_certificate(uuid) from public, anon, authenticated;
grant execute on function public.verify_simulation_certificate(uuid) to anon, authenticated;

notify pgrst, 'reload schema';
