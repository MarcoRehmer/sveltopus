CREATE TYPE "public"."membership_role" AS ENUM('owner', 'member');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_audit_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" text NOT NULL,
	"organization_id" uuid,
	"action" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text,
	"reason" text,
	"request_id" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "membership" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" "membership_role" DEFAULT 'member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_audit_event" ADD CONSTRAINT "admin_audit_event_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership" ADD CONSTRAINT "membership_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership" ADD CONSTRAINT "membership_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "admin_audit_event_actor_idx" ON "admin_audit_event" USING btree ("actor_user_id");--> statement-breakpoint
CREATE INDEX "admin_audit_event_organization_idx" ON "admin_audit_event" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "admin_audit_event_created_at_idx" ON "admin_audit_event" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "membership_organization_user_uidx" ON "membership" USING btree ("organization_id","user_id");--> statement-breakpoint
CREATE INDEX "membership_user_idx" ON "membership" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "membership_organization_idx" ON "membership" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_slug_uidx" ON "organization" USING btree ("slug");--> statement-breakpoint

UPDATE "user" SET "role" = 'user' WHERE "role" IS NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_role_check" CHECK ("role" IN ('user', 'superadmin'));--> statement-breakpoint

DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_runtime') THEN
		CREATE ROLE app_runtime NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_admin') THEN
		CREATE ROLE app_admin NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tenant_provisioner') THEN
		CREATE ROLE tenant_provisioner NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
	END IF;
END
$$;--> statement-breakpoint

GRANT USAGE ON SCHEMA public TO app_runtime, app_admin, tenant_provisioner;--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "user", "session", "account", "verification" TO app_runtime;--> statement-breakpoint
GRANT SELECT ON TABLE "organization", "membership" TO app_runtime;--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "organization", "membership" TO app_admin;--> statement-breakpoint
GRANT SELECT, INSERT ON TABLE "admin_audit_event" TO app_admin;--> statement-breakpoint
GRANT INSERT ON TABLE "organization", "membership" TO tenant_provisioner;--> statement-breakpoint

WITH pending_users AS MATERIALIZED (
	SELECT "id", "name", gen_random_uuid() AS "organization_id"
	FROM "user" u
	WHERE u."role" <> 'superadmin'
		AND NOT EXISTS (SELECT 1 FROM "membership" m WHERE m."user_id" = u."id")
), inserted_organizations AS (
	INSERT INTO "organization" ("id", "name", "slug")
	SELECT
		"organization_id",
		COALESCE(NULLIF(BTRIM("name"), ''), 'My Organization') || '''s Organization',
		'org-' || "organization_id"::text
	FROM pending_users
	RETURNING "id"
)
INSERT INTO "membership" ("organization_id", "user_id", "role")
SELECT p."organization_id", p."id", 'owner'
FROM pending_users p
JOIN inserted_organizations i ON i."id" = p."organization_id";--> statement-breakpoint

ALTER TABLE "organization" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "organization" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "membership" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "membership" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "admin_audit_event" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "admin_audit_event" FORCE ROW LEVEL SECURITY;--> statement-breakpoint

CREATE POLICY "organization_member_select" ON "organization"
	FOR SELECT TO app_runtime
	USING (
		EXISTS (
			SELECT 1
			FROM "membership" m
			WHERE m."organization_id" = "organization"."id"
				AND m."user_id" = NULLIF(current_setting('app.user_id', true), '')
		)
	);--> statement-breakpoint
CREATE POLICY "membership_self_select" ON "membership"
	FOR SELECT TO app_runtime
	USING ("user_id" = NULLIF(current_setting('app.user_id', true), ''));--> statement-breakpoint

CREATE POLICY "organization_admin_all" ON "organization"
	FOR ALL TO app_admin
	USING (true)
	WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "membership_admin_all" ON "membership"
	FOR ALL TO app_admin
	USING (true)
	WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "admin_audit_admin_select" ON "admin_audit_event"
	FOR SELECT TO app_admin
	USING (true);--> statement-breakpoint
CREATE POLICY "admin_audit_admin_insert" ON "admin_audit_event"
	FOR INSERT TO app_admin
	WITH CHECK (true);--> statement-breakpoint

CREATE POLICY "organization_provision_insert" ON "organization"
	FOR INSERT TO tenant_provisioner
	WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "membership_provision_insert" ON "membership"
	FOR INSERT TO tenant_provisioner
	WITH CHECK ("role" = 'owner');--> statement-breakpoint

CREATE FUNCTION public.provision_user_organization()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
	new_organization_id uuid := gen_random_uuid();
BEGIN
	IF NEW.role = 'superadmin' THEN
		RETURN NEW;
	END IF;

	INSERT INTO public.organization (id, name, slug)
	VALUES (
		new_organization_id,
		COALESCE(NULLIF(BTRIM(NEW.name), ''), 'My Organization') || '''s Organization',
		'org-' || new_organization_id::text
	);

	INSERT INTO public.membership (organization_id, user_id, role)
	VALUES (new_organization_id, NEW.id, 'owner');

	RETURN NEW;
END
$$;--> statement-breakpoint
ALTER FUNCTION public.provision_user_organization() OWNER TO tenant_provisioner;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.provision_user_organization() FROM PUBLIC;--> statement-breakpoint
CREATE TRIGGER "user_provision_organization"
	AFTER INSERT ON "user"
	FOR EACH ROW
	EXECUTE FUNCTION public.provision_user_organization();--> statement-breakpoint

CREATE FUNCTION public.prevent_admin_audit_mutation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
	RAISE EXCEPTION 'admin audit events are immutable';
END
$$;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.prevent_admin_audit_mutation() FROM PUBLIC;--> statement-breakpoint
CREATE TRIGGER "admin_audit_event_immutable"
	BEFORE UPDATE OR DELETE ON "admin_audit_event"
	FOR EACH ROW
	EXECUTE FUNCTION public.prevent_admin_audit_mutation();--> statement-breakpoint

CREATE FUNCTION public.protect_last_superadmin()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
	IF OLD.role = 'superadmin' AND (TG_OP = 'DELETE' OR NEW.role <> 'superadmin') THEN
		PERFORM pg_advisory_xact_lock(hashtext('sveltopus.superadmin-role-change'));
		IF (SELECT COUNT(*) FROM public."user" WHERE role = 'superadmin') <= 1 THEN
			RAISE EXCEPTION 'cannot remove the last superadmin';
		END IF;
	END IF;

	IF TG_OP = 'DELETE' THEN
		RETURN OLD;
	END IF;

	RETURN NEW;
END
$$;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.protect_last_superadmin() FROM PUBLIC;--> statement-breakpoint
CREATE TRIGGER "user_protect_last_superadmin"
	BEFORE UPDATE OF "role" ON "user"
	FOR EACH ROW
	EXECUTE FUNCTION public.protect_last_superadmin();--> statement-breakpoint
CREATE TRIGGER "user_protect_last_superadmin_delete"
	BEFORE DELETE ON "user"
	FOR EACH ROW
	EXECUTE FUNCTION public.protect_last_superadmin();
