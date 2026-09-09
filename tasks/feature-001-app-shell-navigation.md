# Feature Task

## Metadata

- **ID:** FEATURE-001
- **Title:** Authenticated App Shell Navigation
- **Status:** approved
- **Priority:** medium
- **Created:** 2026-09-02
- **Created by:** Supervisor AI

---

## Goal

Update the authenticated application layout to use a shadcn-svelte topbar with navigation and a shadcn-svelte navigation sidebar. Add three demo feature destinations so the navigation can be verified without implementing any feature functionality.

---

## Problem

The authenticated shell currently has incomplete topbar actions, a basic sidebar, and only a dashboard destination. A consistent shadcn-svelte navigation structure and placeholder destinations are needed before feature work begins.

---

## Requirements

### Functional Requirements

- [ ] Update the authenticated shell to use the existing shadcn-svelte sidebar primitives with responsive desktop and mobile behavior.
- [ ] Add a shadcn-svelte topbar navigation area while preserving the Sveltopus brand and authenticated shell structure.
- [ ] Add three demo feature destinations to the application navigation: Dashboard (`/dashboard`), Packing Table (`/packing-table`), and Orders (`/orders`).
- [ ] Create dummy pages for the demo destinations that display a page title and clearly indicate that the feature is not implemented.
- [ ] Highlight the active navigation destination and ensure all navigation links use normal SvelteKit anchors.

### Non-Functional Requirements

- Performance: Reuse existing shadcn-svelte components and avoid unnecessary client-side state or data loading.
- Security: Keep the routes under the authenticated `(app)` route group and do not expose feature data or new APIs.
- Compatibility: Follow the existing Svelte 5 runes, SvelteKit, Tailwind CSS, and shadcn-svelte conventions.
- Other constraints: This task must only create the navigation shell and dummy pages; do not implement any feature behavior.

---

## Implementation Plan

Update the authenticated shell components to compose the existing shadcn-svelte sidebar provider, sidebar, navigation menu, and responsive trigger patterns. Add the required topbar navigation using shadcn-svelte navigation primitives if they are not already available. Define the three demo destinations in one navigation configuration, use the current route pathname for active state, and add minimal authenticated route pages for each destination.

### Expected Changes

#### Files to create

- `tasks/feature-001-app-shell-navigation.md`
- `src/routes/(app)/packing-table/+page.svelte`
- `src/routes/(app)/orders/+page.svelte`
- Any shadcn-svelte navigation-menu primitive files required by the installed component setup

#### Files to modify

- `src/lib/components/layout/AppShell.svelte`
- `src/lib/components/layout/Topbar.svelte`
- `src/lib/components/layout/Sidebar.svelte`
- `src/routes/(app)/dashboard/+page.svelte`
- Potentially `src/routes/layout.css` if navigation styling requires existing design-token adjustments

#### Files to delete

- None

---

## Technical Details

- Use the existing `$lib/components/ui/sidebar` primitives rather than introducing a separate layout system.
- Preserve the authenticated `(app)` layout guard and render page content through the existing layout children snippet.
- Use `$app/state` for active-route detection, with exact matching for `/dashboard` and prefix matching for future nested routes where appropriate.
- Use accessible links and descriptive page titles so SvelteKit route announcements work correctly.
- Keep dummy pages static and free of database access, form actions, feature services, and API endpoints.
- Run the Svelte autofixer for every changed Svelte component before validation.

---

## Database Changes

- [x] No database changes required

---

## Acceptance Criteria

The task is considered complete when:

- [ ] The authenticated shell displays the Sveltopus topbar with navigation styled through shadcn-svelte primitives.
- [ ] The authenticated shell displays a responsive shadcn-svelte navigation sidebar with desktop and mobile usage supported.
- [ ] Dashboard, Packing Table, and Orders are visible as navigation destinations and link to `/dashboard`, `/packing-table`, and `/orders`.
- [ ] Each destination renders an authenticated dummy page with a distinct title and an explicit not-implemented message.
- [ ] The current destination receives active navigation styling.
- [ ] Navigation remains keyboard accessible and has no Svelte accessibility or type-checking errors.
- [ ] Existing functionality still works.

---

## Testing Requirements

Describe what should be tested.

- [ ] Unit tests for navigation item configuration and active-route behavior, if the implementation extracts testable logic.
- [ ] Integration tests for authenticated navigation to all three demo destinations.
- [ ] Manual testing on desktop and mobile viewport sizes, including keyboard navigation and active-state updates.
- [ ] Run `bun run check`, `bun run lint`, and the relevant client-side tests.

---

## Potential Risks

- Existing uncommitted changes in `Topbar.svelte` may overlap with the layout update and must be preserved or incorporated intentionally.
- The generated shadcn-svelte sidebar primitives may require a specific composition to retain mobile behavior and persisted sidebar state.
- Adding navigation-menu primitives could introduce unnecessary generated files if existing primitives already cover the required behavior.

---

# Review

## Supervisor Notes

This task intentionally defines only the shell, navigation destinations, and placeholder pages. Packing Table and Orders must remain non-functional demo pages until separate feature tasks are approved and implemented.

---

## Human Review

**Decision:** approved

**Reviewer Notes:**

<!-- Write your review notes here -->

---

# Implementation

## Executor AI Notes

<!-- Filled in by the implementing AI -->

---

## Changes Made

<!-- List actual changes -->

---

## Tests Performed

<!-- List tests and results -->

---

## Final Status

**Status:** new

**Completion Notes:**

<!-- Filled in when implementation is complete -->
