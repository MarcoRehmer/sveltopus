import type { SafeUser, SafeSession } from './lib/auth/types.js';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			/** Safe user subset — never includes passwordHash. */
			user: SafeUser | null;
			/** Safe session metadata — never includes tokenHash. */
			session: SafeSession | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
