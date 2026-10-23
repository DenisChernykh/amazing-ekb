-- Remove only the guards installed by freeze-supabase.sql.
-- Reconcile new D1 writes before serving traffic from this database again.
BEGIN;
DROP TRIGGER IF EXISTS cloudflare_migration_read_only ON public."Category";
DROP TRIGGER IF EXISTS cloudflare_migration_read_only ON public."Profile";
DROP TRIGGER IF EXISTS cloudflare_migration_read_only ON public."TelegramPost";
DROP TRIGGER IF EXISTS cloudflare_migration_read_only ON public."Post";
DROP TRIGGER IF EXISTS cloudflare_migration_read_only ON public."Image";
DROP FUNCTION IF EXISTS public.cloudflare_migration_read_only();
COMMIT;
