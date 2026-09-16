# Must-have Entities

## Identity

- User
- Session
- OAuthAccount
- EmailVerification
- PasswordReset

## Multi-Tenant

- Organization
- Membership
- Platform role: `user` or `superadmin`
- Membership role: `owner` or `member`
- Invitation (future)
- Fine-grained permissions (future)

## Billing

- Plan
- Subscription

Billing entities are future work. They must belong to an organization, never directly to a user.

# Multi-Tenant Foundation

## Authorization scopes

- `superadmin` is a platform-wide Better Auth user role for controlled operations across tenants.
- `owner` and `member` are organization-scoped membership roles.
- A user can have a different membership role in each organization.
- Superadmins do not require organization memberships and are not assigned a personal organization.
- Normal registrations atomically create an organization and an `owner` membership.

## Tenant isolation

- Every tenant-owned table has a non-null `organization_id`.
- PostgreSQL row-level security is the tenant isolation boundary.
- Tenant context is set with transaction-local PostgreSQL settings and every scoped query uses the transaction passed to its context callback.
- Missing user or organization context fails closed.
- The runtime database role is not a table owner, superuser, or `BYPASSRLS` role.
- Superadmin database access uses a separate `app_admin` role and explicit admin context.
- Migration, runtime, and superadmin database credentials are separate in production.
- Custom cross-tenant access requires audit context and writes to the immutable admin audit log in the same transaction.
- The migration creates non-login capability roles. Deployment-specific login roles receive either `app_runtime` or `app_admin`; no login receives both.

## Schema rules

- Organization and membership IDs use PostgreSQL-generated UUIDs through Drizzle `defaultRandom()`.
- Tenant-local indexes and unique constraints start with `organization_id` where appropriate.
- Tenant-owned child records include `organization_id` in parent relationships to prevent cross-tenant references.
- Better Auth's generated schema is regenerated through `bun run auth:schema` and is never edited manually.

## Operations

- `MIGRATION_DATABASE_URL` is used only by Drizzle Kit.
- `DATABASE_URL` uses a login granted the `app_runtime` role.
- `ADMIN_DATABASE_URL` is optional and uses a separate login granted the `app_admin` role.
- `bun run admin:create -- --email <email>` bootstraps the first `superadmin` without direct table editing.
- The `superadmin` identity is available for internal audited operations, but Better Auth admin endpoints remain denied until the admin surface adds MFA, re-authentication, and action auditing.
- Impersonation is intentionally not granted.

# Features

1. Foundation
   SvelteKit + Node Adapter
   PostgreSQL + ORM
   Migrations & Seeds
   Environment/Config Handling
   Validation
   Error Handling
   Logging

2. Authentication & Account Management
   Registrierung
   Login / Logout
   Session Management
   Passwort Reset
   Email Verification
   User Profile
   Account Settings
   OAuth optional

3. Multi-Tenant
   Organizations
   Organization Switching
   Mitgliederverwaltung
   Einladungen
   Rollen

4. Dashboard Shell
   Sidebar
   Header
   Mobile Navigation
   User Menu
   Organization Switcher
   Breadcrumbs
   Loading States
   Empty States
   Error States

5. UI & Theme System
   Design Tokens
   Dark Mode
   Komponenten
   Forms
   Tables
   Dialogs
   Toasts
   Settings Pages

6. Command Palette
   CTRL + K
   Navigation
   Actions
   Schnellsuche innerhalb der verfügbaren Commands

7. i18n
   Paraglide
   Locale Detection
   Language Switcher
   Date/Number/Currency Formatting

8. Transactional Emails
   Mail Provider Abstraction
   Welcome Mail
   Verification
   Password Reset
   System Notifications

9. Billing & Subscriptions
   Payment Provider Abstraction
   Lemon Squeezy Integration
   Checkout
   Webhooks
   Subscription Sync
   Plan Management
   Feature Access
