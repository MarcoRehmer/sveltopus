# Sveltopus

## Commands

- Use Bun and the committed `bun.lock`: `bun run dev`, `bun run build`, `bun run check`, `bun run lint`, and `bun run test` (single run). `lint` runs Prettier before ESLint; use `bun run format` to fix formatting.
- Focus tests with `bun run test -- --project client` or `bun run test -- --project server`. Svelte component tests run in headless Chromium; other `src` tests run in Node.
- Database commands require `DATABASE_URL`: `bun run db:start`, `bun run db:push`, `bun run db:generate`, `bun run db:migrate`, `bun run db:seed`, and `bun run db:studio`. The supplied Compose database listens on port 5432.

## Application

- This is one Node-adapted SvelteKit app. `src/hooks.server.ts` applies Paraglide before Better Auth session loading; `src/routes/+layout.server.ts` centrally redirects `/`, keeps `/login` and `/signup` public, and guards all other routes. `(app)` provides the authenticated shell.
- Runes mode is forced for application code. For every `.svelte` or `.svelte.ts` change, use the Svelte MCP documentation and run the Svelte autofixer until clean.
- Paraglide source messages are `messages/en.json` and `messages/de.json`; `src/lib/paraglide/` is generated and must not be edited.
- Better Auth's generated schema is `src/lib/server/db/auth.schema.ts`; regenerate it with `bun run auth:schema` rather than editing it manually.

## Validation

- Put reusable client-safe Zod schemas in `src/lib/validation/`. For SvelteKit form actions, use `validateFormData` and return its `fieldErrors` in `fail(400, ...)`.
- Infer types from schemas instead of duplicating schema constraints in TypeScript interfaces.

## Configuration

- Keep server-only configuration under `src/lib/server/config/`; use `$env/dynamic/private` only there.
- Validate critical configuration such as the database and authentication settings centrally. Critical validation errors must fail the application.
- Treat optional configuration such as email providers as unavailable when invalid, log a warning to the server console, and expose it as `undefined` rather than using invalid values.
- Config-first rule: the configuration module must only define and validate environment data. It must never import application modules, providers, or service instances.
- Use the factory pattern: application modules create their own instances from validated configuration values. Pass provider-specific configuration into factories instead of having factories read environment variables.

### Configuration Safety Steps

1. Keep configuration schemas as pure data definitions with no business-logic imports.
2. Keep instance creation in application modules and pass validated configuration into their factories.

## Scope

Implement only what the task requires.

Do not:

- add tests unless requested
- refactor unrelated code
- introduce new dependencies without necessity
- change APIs not involved in the task
- rename unrelated files
- change styling unrelated to the task
- add documentation unless requested
- modify configuration unless required

## Implementation

Prefer the smallest change that correctly solves the problem.

Reuse existing patterns before introducing new ones.

Do not:

- introduce abstractions for a single use case
- optimize prematurely
- implement code documentation on your own (only if instructed)
- add documentation
- add unit or integration tests
- change database schema
- change authentication behavior
- improve unrelated UI
- optimize performance
- fix unrelated bugs

unless the task or implementation plan requires it.

"Could be improved" is not the same as "required".

Prefer the smallest implementation that correctly satisfies the task.

## Verification

After implementation:

1. Check the changed code.
2. Run the smallest relevant verification.
3. Do not automatically create new tests.
4. Do not run the entire test suite unless requested or necessary.

If a failure is unrelated or pre-existing, report it instead of changing
unrelated code.

Prefer focused verification over running every available check.

## Unrelated Issues

If you notice unrelated bugs or technical debt:

- do not fix them
- mention them in the final response under "Out of scope"

## Plan Adherence

When a plan has been approved, treat it as the implementation boundary.

Do not silently expand an approved plan.

Minor implementation details may be decided autonomously when they do not
change the architecture, behavior, scope, or public interfaces described by
the plan.

## Code Quality

Keep implementations simple and idiomatic for the existing codebase.

Prefer:

- existing utilities over new utilities
- existing components over new components
- existing patterns over new abstractions
- local changes over broad refactoring
- explicit code over unnecessary abstraction

Do not introduce an abstraction unless there is a demonstrated need for it.

Do not refactor code merely because it could be structured differently.

## Svelte / SvelteKit

Follow the existing Svelte 5 and SvelteKit patterns in the repository.

Prefer existing project conventions for:

- runes
- component structure
- load functions
- form actions
- server/client boundaries
- routing
- error handling
- state management

Do not introduce another state-management pattern when an existing project
pattern already solves the problem.

Use shadcn-svelte components when an appropriate existing component exists.

Do not create a custom component when an existing shadcn-svelte component
already provides the required behavior unless there is a concrete reason.

## Database

Use Drizzle ORM and the existing database conventions.

Do not modify the database schema unless the task requires it.

When schema changes are required:

- follow the existing migration workflow
- preserve existing data
- avoid destructive changes unless explicitly requested
- inspect existing schema and relations before modifying them

Do not introduce raw SQL when the existing Drizzle approach is sufficient.

## Dependencies

Do not add a dependency unless it is necessary for the requested task.

Before adding one, check whether the existing stack already provides an
appropriate solution.

## Final Response

After implementation, report:

- what was changed
- what was verified
- any relevant failures
- any unrelated issues discovered but intentionally left unchanged

Do not claim that something was tested or verified if it was not.
