-- ============================================================
-- PAYMENTS: trocar stripe por AbacatePay
-- ============================================================
alter table public.payments
  drop column if exists stripe_session_id,
  add column if not exists abacate_billing_id  text,
  add column if not exists abacate_billing_url text;

-- Index para lookup rápido por billing ID (usado no webhook)
create index if not exists payments_abacate_billing_id_idx
  on public.payments (abacate_billing_id);

-- Permite que service_role atualize payments (webhook usa service_role)
create policy "Service role atualiza pagamentos"
  on public.payments for update
  using (true)
  with check (true);

-- ============================================================
-- DREAMS: adicionar status 'error' ao check constraint
-- ============================================================
alter table public.dreams
  drop constraint if exists dreams_status_check;

alter table public.dreams
  add constraint dreams_status_check
  check (status in ('pending', 'analyzed', 'paid_analyzed', 'error'));
