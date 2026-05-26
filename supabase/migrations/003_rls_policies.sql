-- is_admin(): security definer로 실행 → profiles 조회 시 RLS 재귀 방지
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function is_admin() to authenticated;

-- ── profiles ─────────────────────────────────────────────────────────────────
-- 기존 admin_all 제거 (자기 참조 재귀 위험)
drop policy if exists "admin_all" on profiles;

-- 일반 유저: 본인 행만 읽기
create policy "profiles_self_select" on profiles
  for select using (auth.uid() = id);

-- 관리자: 전체 조회 · 수정
create policy "profiles_admin_all" on profiles
  for all using (is_admin());

-- ── travel_plans ─────────────────────────────────────────────────────────────
-- 기존 users_own_plans 유지 (본인 데이터 CRUD)
-- 관리자: 전체 조회 · 수정 · 삭제
create policy "travel_plans_admin_all" on travel_plans
  for all using (is_admin());

-- ── payments ─────────────────────────────────────────────────────────────────
-- 기존 users_own_payments 유지 (본인 결제 읽기)
-- 관리자: 전체 조회 · 수정
create policy "payments_admin_all" on payments
  for all using (is_admin());
