-- Adiciona campos de pagamento ao perfil
alter table public.profiles
  add column if not exists cellphone text,
  add column if not exists tax_id    text;
