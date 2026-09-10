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
- Role
- Permission
- Invitation

## Billing

- Plan
- Subscription

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
