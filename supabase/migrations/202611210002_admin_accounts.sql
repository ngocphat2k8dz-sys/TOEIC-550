begin;

create schema if not exists private;

create table private.toeic_admin (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null unique references auth.users(id) on delete cascade
);

alter table private.toeic_admin enable row level security;
revoke all on table private.toeic_admin from public, anon, authenticated;

create function public.is_toeic_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from private.toeic_admin a where a.user_id = auth.uid()
  );
$$;

create function public.list_toeic_students(p_limit integer, p_offset integer)
returns table (
  id uuid,
  display_name text,
  email text,
  created_at timestamptz,
  status text,
  lessons_completed integer
)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.is_toeic_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  return query
    select u.id,
      coalesce(nullif(btrim(p.display_name), ''), nullif(btrim(u.raw_user_meta_data ->> 'display_name'), ''), 'Chưa có tên'),
      u.email::text,
      u.created_at,
      case when u.banned_until > now() then 'blocked'
           when u.email_confirmed_at is null then 'unconfirmed'
           else 'active' end,
      coalesce(up.lessons_completed, 0)
    from auth.users u
    left join public.profiles p on p.id = u.id
    left join public.user_progress up on up.user_id = u.id
    where u.id <> auth.uid() and u.deleted_at is null
    order by u.created_at desc, u.id desc
    limit least(greatest(coalesce(p_limit, 26), 1), 100)
    offset greatest(coalesce(p_offset, 0), 0);
end;
$$;

revoke execute on function public.is_toeic_admin() from public, anon, authenticated;
revoke execute on function public.list_toeic_students(integer, integer) from public, anon, authenticated;
grant execute on function public.is_toeic_admin() to authenticated;
grant execute on function public.list_toeic_students(integer, integer) to authenticated;

commit;
