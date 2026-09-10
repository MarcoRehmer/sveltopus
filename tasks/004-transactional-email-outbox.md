# Transactional Email: Durable Outbox and Delivery Status

## Goal

Add durable, asynchronous transactional-email delivery only when the application has a deployable worker/runtime capable of processing jobs. This prevents lost non-security mail and provides operational visibility without coupling the app to a provider.

## Depends On

- `tasks/001-transactional-email-transport.md`
- `tasks/002-transactional-email-templates.md`
- A confirmed deployment mechanism for a separate worker, scheduled process, or externally triggered job runner.

## Decision Gate

Do not begin implementation until the deployment target for the worker is selected and documented. The current repository has no queue, scheduler, or worker. If verification/reset delivery must remain synchronous, leave it synchronous; this issue is not a reason to weaken those security flows.

## Scope

- Add a Drizzle-managed PostgreSQL outbox table that records email intent, status, attempts, timestamps, event type, recipient address, locale, template data, provider message ID, and safe failure metadata.
- Store the minimum data necessary. Do not persist password-reset, verification, or email-change action URLs/tokens longer than the delivery attempt requires.
- Add a worker entry point that claims pending records safely, renders templates, calls the provider-neutral transport, and marks outcomes atomically.
- Implement bounded retries with exponential backoff for retryable failures and a terminal failed state for permanent failures.
- Ensure concurrent workers cannot send the same record twice. Document the unavoidable at-least-once boundary and use an idempotency key when the selected provider supports one.
- Add a provider-status update mechanism. For Scaleway TEM this may later use delivery-status polling or verified webhooks; webhook authenticity and replay protection are required before accepting events.
- Move only non-security notifications (for example, welcome and future system notifications) to the outbox initially. Keep verification, password reset, and email-change confirmation synchronous unless the end-to-end token and delivery guarantees are explicitly redesigned.

## Constraints

- Never mark a message delivered solely because the provider accepted it. Use distinct states such as `pending`, `submitted`, `delivered`, `bounced`, and `failed`.
- Store no rendered body, credential, or secret token in logs or database columns unless there is a documented retention and security requirement.
- Keep the outbox and worker provider-neutral. Scaleway-specific payloads/status names must stay in its adapter.
- Add any schema changes through the project's Drizzle workflow; do not hand-edit production databases.
- Do not implement this issue as an in-process timer in a SvelteKit request server.

## Acceptance Criteria

- Email intent is written transactionally with the triggering domain change where required.
- The worker safely processes records, retries transient failures, and records a provider message ID on submission.
- Concurrent worker executions do not produce duplicate sends under normal processing races.
- Security-critical auth messages retain the synchronous behavior specified in task 003.
- Tests cover claiming, retry scheduling, permanent failures, duplicate-processing protection, and sensitive-data redaction.
- Deployment and operational instructions document how the worker runs and how failed messages are monitored/retried.

## Verification

Run relevant server tests, `bun run check`, and `bun run lint`. Exercise the worker against mocked transport/provider responses; do not send real mail in automated tests.
