-- Run immediately before the final source snapshot and production promotion.
-- Reads remain available. To abort/roll back, run unfreeze-supabase.sql.
BEGIN;
SET LOCAL lock_timeout = '10s';
LOCK TABLE public."Category", public."Profile", public."TelegramPost", public."Post", public."Image" IN SHARE ROW EXCLUSIVE MODE;
CREATE OR REPLACE FUNCTION public.cloudflare_migration_read_only() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'This database is read-only after the Cloudflare migration' USING ERRCODE = '55000'; RETURN NULL; END; $$;
CREATE TRIGGER cloudflare_migration_read_only BEFORE INSERT OR UPDATE OR DELETE OR TRUNCATE ON public."Category" FOR EACH STATEMENT EXECUTE FUNCTION public.cloudflare_migration_read_only();
CREATE TRIGGER cloudflare_migration_read_only BEFORE INSERT OR UPDATE OR DELETE OR TRUNCATE ON public."Profile" FOR EACH STATEMENT EXECUTE FUNCTION public.cloudflare_migration_read_only();
CREATE TRIGGER cloudflare_migration_read_only BEFORE INSERT OR UPDATE OR DELETE OR TRUNCATE ON public."TelegramPost" FOR EACH STATEMENT EXECUTE FUNCTION public.cloudflare_migration_read_only();
CREATE TRIGGER cloudflare_migration_read_only BEFORE INSERT OR UPDATE OR DELETE OR TRUNCATE ON public."Post" FOR EACH STATEMENT EXECUTE FUNCTION public.cloudflare_migration_read_only();
CREATE TRIGGER cloudflare_migration_read_only BEFORE INSERT OR UPDATE OR DELETE OR TRUNCATE ON public."Image" FOR EACH STATEMENT EXECUTE FUNCTION public.cloudflare_migration_read_only();
COMMIT;
