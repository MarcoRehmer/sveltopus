# Sveltopus

## Commands

- Use Bun: `bun run dev`, `bun run build`, `bun run check`, `bun run lint`, and `bun run test` (single run). `lint` runs Prettier validation before ESLint; use `bun run format` to fix formatting.
- Run focused tests with `bun run test -- --project client` or `bun run test -- --project server`. Svelte component tests run in headless Chromium; all other `src` tests run in Node.

## Application and Data

- This is a single SvelteKit application. `src/routes/(auth)` owns login/sign-up, and `src/routes/(app)` is the authenticated application shell; server layout guards redirect between them.
- The project forces Svelte runes mode for application files. For any `.svelte` or `.svelte.ts` change, use the Svelte MCP documentation and run the Svelte autofixer until it is clean.
- Paraglide messages live in `messages/en.json` and `messages/de.json`; do not edit generated `src/lib/paraglide/`.

## Task Files

- Agent-authored feature tasks live in `tasks/` and follow `tasks/feature-template.md`. Use only `new`, `approved`, `in_progress`, or `rejected` for task status; `rejected` requires a reason.
