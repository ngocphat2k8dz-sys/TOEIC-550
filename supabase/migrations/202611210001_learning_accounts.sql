begin;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text check (char_length(display_name) <= 60),
  target_score smallint not null default 550 check (target_score between 10 and 990 and target_score % 5 = 0),
  daily_goal smallint not null default 30 check (daily_goal between 1 and 360),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  id uuid not null default gen_random_uuid(),
  user_id uuid primary key references public.profiles(id) on delete cascade,
  total_xp integer not null default 0 check (total_xp >= 0),
  level integer generated always as (total_xp / 100 + 1) stored,
  streak integer not null default 0 check (streak >= 0),
  total_study_minutes numeric(14, 2) not null default 0 check (total_study_minutes >= 0),
  lessons_completed integer not null default 0 check (lessons_completed >= 0),
  correct_answers integer not null default 0 check (correct_answers >= 0),
  wrong_answers integer not null default 0 check (wrong_answers >= 0),
  listening_score_estimate smallint check (listening_score_estimate between 5 and 495),
  reading_score_estimate smallint check (reading_score_estimate between 5 and 495),
  revision integer not null default 0 check (revision >= 0),
  learning_state jsonb not null default '{}'::jsonb check (jsonb_typeof(learning_state) = 'object'),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_attempts (
  id text not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  question_id text not null,
  part smallint not null check (part between 1 and 7),
  topic text not null,
  selected_answer smallint check (selected_answer between 0 and 3),
  correct_answer smallint not null check (correct_answer between 0 and 3),
  is_correct boolean not null,
  attempted_at timestamptz not null,
  primary key (user_id, id)
);

create table if not exists public.wrong_questions (
  id text not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  question_id text not null,
  part smallint not null check (part between 1 and 7),
  topic text not null,
  status text not null check (status in ('open', 'understood')),
  created_at timestamptz not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, id),
  unique (user_id, question_id)
);

create table if not exists public.vocabulary_progress (
  id text not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  vocab_id text not null,
  status text not null check (status in ('known', 'review')),
  review_count integer not null check (review_count >= 0),
  last_reviewed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, id),
  unique (user_id, vocab_id)
);

create table if not exists public.study_sessions (
  id text not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  activity_type text not null check (activity_type in ('practice', 'mini', 'mock', 'review', 'weakness', 'vocab')),
  title text not null,
  duration_minutes numeric(12, 2) not null check (duration_minutes >= 0),
  score smallint check (score between 0 and 100),
  correct_count integer not null check (correct_count >= 0 and correct_count <= total_count),
  total_count integer not null check (total_count >= 0),
  listening_score_estimate smallint check (listening_score_estimate between 5 and 495),
  reading_score_estimate smallint check (reading_score_estimate between 5 and 495),
  created_at timestamptz not null,
  primary key (user_id, id)
);

create table if not exists public.study_plan_progress (
  id text not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_item_id text not null,
  completed boolean not null,
  completed_at timestamptz,
  primary key (user_id, id),
  unique (user_id, plan_item_id)
);

create table if not exists public.lesson_completions (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null,
  primary key (user_id, lesson_id)
);

create table if not exists public.learning_sync_receipts (
  user_id uuid not null references public.profiles(id) on delete cascade,
  operation_id text not null,
  applied_at timestamptz not null default now(),
  primary key (user_id, operation_id)
);

create index if not exists question_attempts_user_date_idx on public.question_attempts(user_id, attempted_at desc);
create index if not exists study_sessions_user_date_idx on public.study_sessions(user_id, created_at desc);

do $policies$
declare
  tbl text;
  owner_col text;
begin
  foreach tbl in array array[
    'profiles', 'user_progress', 'question_attempts', 'wrong_questions', 'vocabulary_progress',
    'study_sessions', 'study_plan_progress', 'lesson_completions', 'learning_sync_receipts'
  ] loop
    owner_col := case when tbl = 'profiles' then 'id' else 'user_id' end;
    execute format('alter table public.%I enable row level security', tbl);
    execute format('revoke all on public.%I from public, anon, authenticated', tbl);
    execute format('grant select, insert, update, delete on public.%I to authenticated', tbl);
    execute format('drop policy if exists owner_select on public.%I', tbl);
    execute format('drop policy if exists owner_insert on public.%I', tbl);
    execute format('drop policy if exists owner_update on public.%I', tbl);
    execute format('drop policy if exists owner_delete on public.%I', tbl);
    execute format('create policy owner_select on public.%I for select to authenticated using (%I = (select auth.uid()))', tbl, owner_col);
    execute format('create policy owner_insert on public.%I for insert to authenticated with check (%I = (select auth.uid()))', tbl, owner_col);
    execute format('create policy owner_update on public.%I for update to authenticated using (%I = (select auth.uid())) with check (%I = (select auth.uid()))', tbl, owner_col, owner_col);
    execute format('create policy owner_delete on public.%I for delete to authenticated using (%I = (select auth.uid()))', tbl, owner_col);
  end loop;
end;
$policies$;

create or replace function public.load_learning(p_user_id uuid, p_pending_ids text[])
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $load$
declare result jsonb;
begin
  if auth.uid() is null or p_user_id is distinct from auth.uid() then
    raise exception 'Account mismatch' using errcode = '42501';
  end if;

  insert into public.profiles(id, email, display_name)
  values (
    p_user_id, coalesce(auth.jwt()->>'email', ''),
    nullif(left(btrim(auth.jwt()->'user_metadata'->>'display_name'), 60), '')
  ) on conflict (id) do nothing;
  insert into public.user_progress(user_id) values (p_user_id) on conflict (user_id) do nothing;

  select jsonb_build_object(
    'revision', up.revision, 'state', up.learning_state, 'display_name', p.display_name,
    'target_score', p.target_score, 'daily_goal', p.daily_goal,
    'acknowledged', coalesce((
      select jsonb_agg(r.operation_id) from public.learning_sync_receipts r
      where r.user_id = p_user_id and r.operation_id = any(p_pending_ids)
    ), '[]'::jsonb)
  ) into result from public.user_progress up join public.profiles p on p.id = up.user_id
  where up.user_id = p_user_id;
  return result;
end;
$load$;

create or replace function public.commit_learning(
  p_user_id uuid, p_revision integer, p_operation_ids text[], p_state jsonb, p_rows jsonb
)
returns integer
language plpgsql
security invoker
set search_path = ''
as $commit$
declare
  current_revision integer;
  prior_state jsonb;
  totals jsonb := p_rows->'totals';
begin
  if auth.uid() is null or p_user_id is distinct from auth.uid() then
    raise exception 'Account mismatch' using errcode = '42501';
  end if;
  if coalesce(cardinality(p_operation_ids), 0) = 0 then
    raise exception 'Missing operation IDs' using errcode = '22023';
  end if;

  select up.revision, up.learning_state into current_revision, prior_state
  from public.user_progress up where up.user_id = p_user_id for update;
  if current_revision is distinct from p_revision or exists (
    select 1 from public.learning_sync_receipts r
    where r.user_id = p_user_id and r.operation_id = any(p_operation_ids)
  ) then
    return null;
  end if;

  if coalesce((p_state->>'resetAt')::bigint, 0) > coalesce((prior_state->>'resetAt')::bigint, 0) then
    delete from public.question_attempts where user_id = p_user_id;
    delete from public.wrong_questions where user_id = p_user_id;
    delete from public.vocabulary_progress where user_id = p_user_id;
    delete from public.study_sessions where user_id = p_user_id;
    delete from public.study_plan_progress where user_id = p_user_id;
    delete from public.lesson_completions where user_id = p_user_id;
  end if;

  update public.profiles set
    email = coalesce(auth.jwt()->>'email', email),
    display_name = nullif(p_state->>'displayName', ''),
    target_score = (p_state->'progress'->'settings'->>'target')::smallint,
    daily_goal = (p_state->'progress'->'settings'->>'dailyGoal')::smallint,
    updated_at = now()
  where id = p_user_id;

  insert into public.question_attempts(id, user_id, question_id, part, topic, selected_answer, correct_answer, is_correct, attempted_at)
  select a.id, p_user_id, a.question_id, a.part, a.topic, a.selected_answer, a.correct_answer, a.is_correct, a.attempted_at
  from jsonb_to_recordset(p_rows->'attempts') as a(
    id text, question_id text, part smallint, topic text, selected_answer smallint,
    correct_answer smallint, is_correct boolean, attempted_at timestamptz
  ) on conflict (user_id, id) do nothing;

  insert into public.wrong_questions as w(id, user_id, question_id, part, topic, status, created_at)
  select a.question_id, p_user_id, a.question_id, a.part, a.topic, a.status, a.created_at
  from jsonb_to_recordset(p_rows->'wrong') as a(question_id text, part smallint, topic text, status text, created_at timestamptz)
  on conflict (user_id, id) do update set status = excluded.status, updated_at = now(),
    created_at = least(w.created_at, excluded.created_at)
  where w.status is distinct from excluded.status or w.created_at > excluded.created_at;

  insert into public.vocabulary_progress as v(id, user_id, vocab_id, status, review_count, last_reviewed_at)
  select a.vocab_id, p_user_id, a.vocab_id, a.status, a.review_count, a.last_reviewed_at
  from jsonb_to_recordset(p_rows->'vocabulary') as a(vocab_id text, status text, review_count integer, last_reviewed_at timestamptz)
  on conflict (user_id, id) do update set status = excluded.status, review_count = excluded.review_count,
    last_reviewed_at = excluded.last_reviewed_at, updated_at = now()
  where (v.status, v.review_count, v.last_reviewed_at) is distinct from
    (excluded.status, excluded.review_count, excluded.last_reviewed_at);

  insert into public.study_sessions(id, user_id, activity_type, title, duration_minutes, score, correct_count, total_count,
    listening_score_estimate, reading_score_estimate, created_at)
  select a.id, p_user_id, a.activity_type, a.title, a.duration_minutes, a.score, a.correct_count, a.total_count,
    a.listening_score_estimate, a.reading_score_estimate, a.created_at
  from jsonb_to_recordset(p_rows->'sessions') as a(
    id text, activity_type text, title text, duration_minutes numeric, score smallint, correct_count integer, total_count integer,
    listening_score_estimate smallint, reading_score_estimate smallint, created_at timestamptz
  ) on conflict (user_id, id) do nothing;

  insert into public.study_plan_progress(id, user_id, plan_item_id, completed, completed_at)
  select a.plan_item_id, p_user_id, a.plan_item_id, a.completed, a.completed_at
  from jsonb_to_recordset(p_rows->'plan') as a(plan_item_id text, completed boolean, completed_at timestamptz)
  on conflict (user_id, id) do update set completed = excluded.completed, completed_at = excluded.completed_at;

  insert into public.lesson_completions(user_id, lesson_id)
  select p_user_id, l.value from jsonb_array_elements_text(p_state->'progress'->'completed') as l
  on conflict (user_id, lesson_id) do nothing;

  insert into public.learning_sync_receipts(user_id, operation_id)
  select p_user_id, o.id from unnest(p_operation_ids) as o(id);

  update public.user_progress set
    total_xp = (p_state->'progress'->>'xp')::integer, streak = (totals->>'streak')::integer,
    total_study_minutes = (totals->>'minutes')::numeric,
    lessons_completed = jsonb_array_length(p_state->'progress'->'completed'),
    correct_answers = (totals->>'correct')::integer, wrong_answers = (totals->>'wrong')::integer,
    listening_score_estimate = (totals->>'listening')::smallint, reading_score_estimate = (totals->>'reading')::smallint,
    learning_state = p_state, revision = current_revision + 1, updated_at = now()
  where user_id = p_user_id;
  return current_revision + 1;
end;
$commit$;

revoke execute on function public.load_learning(uuid, text[]) from public, anon, authenticated;
revoke execute on function public.commit_learning(uuid, integer, text[], jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.load_learning(uuid, text[]) to authenticated;
grant execute on function public.commit_learning(uuid, integer, text[], jsonb, jsonb) to authenticated;

commit;
