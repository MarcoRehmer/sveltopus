# Authentication: Wire Transactional Email Flows

## Goal

Connect Better Auth and the account UI to the transactional email service so users can verify their address, reset a password, change their email address, and receive a welcome email after verification.

## Depends On

- `tasks/001-transactional-email-transport.md`
- `tasks/002-transactional-email-templates.md`

## Existing Code Locations

- Better Auth configuration: `src/lib/server/auth.ts`
- Sign-up action: `src/routes/(auth)/signup/+page.server.ts`
- Login action and forgot-password link: `src/routes/(auth)/login/`
- Account page with disabled email/password controls: `src/routes/(app)/account/+page.svelte`
- Auth persistence, including Better Auth's verification-token table: `src/lib/server/db/auth.schema.ts`
- Shared form validation: `src/lib/validation/`

## Scope

- Read the installed Better Auth version's official API/types before implementation. Use its built-in verification, password-reset, and email-change mechanisms; do not create parallel token tables or custom token generation.
- Configure Better Auth callbacks to render and send the verification and password-reset templates through the email transport/service.
- Add a password-reset request page/action, reset completion page/action, and routing needed by Better Auth.
- Implement the account email-change flow using Better Auth's supported API and the email-change template/callback. Re-enable the account UI only once its server action exists.
- Trigger the welcome email only after a user successfully verifies their email address. Make it idempotent so repeated verification requests or revisiting a confirmation URL cannot send duplicates.
- Derive the email locale explicitly from the request/user's existing locale strategy, with a documented English fallback.
- Add Zod schemas under `src/lib/validation/` for every new form boundary. Use `validateFormData` and return `fieldErrors` with `fail(400, ...)` following existing auth action conventions.

## Constraints

- Never reveal whether an email address exists in the password-reset request response.
- Use only trusted, same-origin redirect/action URLs. Follow existing auth redirect helper conventions.
- Await security-critical verification, reset, and email-change delivery so provider failures are visible and handled safely. Do not add a queue in this issue.
- Do not expose reset/verification tokens in logs, form errors, or client-side data.
- Do not send the welcome email at initial sign-up; send it after verification.
- For `.svelte` edits, follow the repository instructions: use Svelte MCP documentation and run the Svelte autofixer until clean.

## Acceptance Criteria

- A newly registered user receives a verification email using the repository template.
- A verified user receives exactly one localized welcome email.
- Password reset requests do not disclose account existence and send a reset email for valid accounts.
- Reset links let a user set a new password through Better Auth's supported flow.
- Account email changes require the appropriate Better Auth confirmation flow and use the repository template.
- New form inputs are Zod-validated and produce field-level errors consistently.
- Integration/unit tests cover successful flows, invalid input, provider failure, duplicate welcome prevention, and password-reset account-enumeration protection.

## Verification

Run `bun run test`, `bun run check`, and `bun run lint`.
