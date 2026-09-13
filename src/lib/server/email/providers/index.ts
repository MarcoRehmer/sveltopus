import { createScalewayTransport } from './scaleway';
import { createBrevoTransport } from './brevo';
import { createConsoleTransport } from './console';
import type { EmailTransport } from '$lib/server/email/transport';

/**
 * Static registry of all available email providers.
 * Maps provider names to their factory functions.
 */
export const providers: Record<
	string,
	(sender: { name: string; email: string }) => EmailTransport
> = {
	scaleway: createScalewayTransport,
	brevo: createBrevoTransport,
	console: createConsoleTransport
};
