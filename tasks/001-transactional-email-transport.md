# Transactional Email: Provider-Neutral Transport with Scaleway TEM

## Goal

Create a server-only, provider-neutral email transport module and implement Scaleway Transactional Email (TEM) as the initial provider. Application and authentication code must not import Scaleway APIs or credentials directly.

## Scope

- Create `src/lib/server/email/transport.ts` with a small `EmailMessage` contract and an `EmailTransport` interface.
- The message contract must support:
  - one or more recipients with email and optional display name
  - subject
  - HTML body
  - plain-text body
  - optional reply-to address
  - optional tags/metadata suitable for future observability
- Create a server-only Zod-validated email configuration module. Add the required documented variables to `.env.example`:
  - provider selection, initially fixed to `scaleway-tem`
  - sender name and sender email
  - Scaleway project ID, secret/API token, and region
- Create `src/lib/server/email/scaleway-tem.transport.ts` implementing `EmailTransport` using Scaleway TEM's REST API and native `fetch`.
- Create one composition/factory module that selects the configured transport. This is the only import application code should need.
- Return the provider message ID from successful sends.
- Map provider failures to a typed, safe-to-log error. Never include credentials, action URLs, or rendered email bodies in errors or logs.

## Constraints

- All files must remain server-only under `src/lib/server/`.
- Do not expose Scaleway-specific fields through `EmailMessage`.
- Do not add a queue, outbox table, auth flow, or email templates in this issue.
- Do not introduce an email SDK unless native `fetch` is insufficient.
- Use the Scaleway REST API endpoint and payload documented for Transactional Email. TEM is currently regional (`fr-par`) and uses a `v1alpha1` path; keep this detail isolated in the Scaleway adapter.
- Validate configuration at application startup or first transport creation using Zod. Fail clearly when production configuration is missing or invalid.

## Acceptance Criteria

- No route, action, or Better Auth configuration refers to Scaleway URLs, credentials, or payload shapes.
- A caller can call `emailTransport.send(message)` without knowing the selected provider.
- The Scaleway adapter sends sender, recipients, subject, HTML, and text correctly and returns its provider message ID.
- Invalid/missing mail configuration fails before an outbound request is attempted.
- Unit tests cover configuration validation, the provider-neutral contract, successful Scaleway request construction, and safe error mapping. Mock `fetch`; do not send real mail.

## Verification

Run `bun run test -- --project server`, `bun run check`, and `bun run lint`.

## Reference

- https://www.scaleway.com/en/developers/api/transactional-email
- https://www.scaleway.com/en/docs/transactional-email/reference-content/smtp-configuration
