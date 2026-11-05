-- Global portfolio hammer counts. These tables remain private: the Next.js
-- server uses its service role only through the two RPC functions below.
create table if not exists public.portfolio_hit_totals (
  id boolean primary key default true check (id),
  lifetime_count bigint not null default 0 check (lifetime_count >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_monthly_hits (
  month_start date primary key,
  monthly_count bigint not null default 0 check (monthly_count >= 0),
  updated_at timestamptz not null default now(),
  check (month_start = date_trunc('month', month_start)::date)
);

alter table public.portfolio_hit_totals enable row level security;
alter table public.portfolio_monthly_hits enable row level security;

create or replace function public.get_portfolio_hit_totals(
  target_month date default date_trunc('month', now() at time zone 'utc')::date
)
returns table (
  lifetime_count bigint,
  monthly_count bigint,
  month_start date
)
language sql
security invoker
set search_path = public
as $$
  select
    coalesce((select lifetime_count from public.portfolio_hit_totals where id), 0),
    coalesce((select monthly_count from public.portfolio_monthly_hits where portfolio_monthly_hits.month_start = target_month), 0),
    target_month;
$$;

create or replace function public.increment_portfolio_hit(
  target_month date default date_trunc('month', now() at time zone 'utc')::date
)
returns table (
  lifetime_count bigint,
  monthly_count bigint,
  month_start date
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  new_lifetime_count bigint;
  new_monthly_count bigint;
begin
  insert into public.portfolio_hit_totals (id, lifetime_count)
  values (true, 0)
  on conflict (id) do nothing;

  update public.portfolio_hit_totals
  set lifetime_count = portfolio_hit_totals.lifetime_count + 1,
      updated_at = now()
  where id
  returning portfolio_hit_totals.lifetime_count into new_lifetime_count;

  insert into public.portfolio_monthly_hits (month_start, monthly_count)
  values (target_month, 1)
  on conflict (month_start) do update
    set monthly_count = portfolio_monthly_hits.monthly_count + 1,
        updated_at = now()
  returning portfolio_monthly_hits.monthly_count into new_monthly_count;

  return query select new_lifetime_count, new_monthly_count, target_month;
end;
$$;

revoke all on function public.get_portfolio_hit_totals(date) from public;
revoke all on function public.increment_portfolio_hit(date) from public;
grant execute on function public.get_portfolio_hit_totals(date) to service_role;
grant execute on function public.increment_portfolio_hit(date) to service_role;
