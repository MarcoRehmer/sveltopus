import type { EmailMessage, EmailTransport } from '$lib/server/email/transport';
import { EmailSendError } from '$lib/server/email/errors';
import { env } from '$env/dynamic/private';

/**
 * Brevo-specific configuration.
 */
interface BrevoConfig {
	apiKey: string;
}

/**
 * Brevo transport implementation (stub for now).
 * Replace with real Brevo API implementation later.
 */
class BrevoTransport implements EmailTransport {
	constructor(
		private config: BrevoConfig,
		private sender: { name: string; email: string }
	) {}

	/**
	 * Send an email via Brevo API (stub implementation).
	 * @param message - The email message to send
	 * @returns Promise resolving to a stub message ID
	 * @throws {EmailSendError} if configuration is missing
	 */
	async send(message: EmailMessage): Promise<string> {
		// STUB: Replace with real Brevo API call later
		console.log('[Brevo Stub] Sending email:', {
			to: message.to,
			subject: message.subject,
			sender: this.sender
		});
		return 'brevo-message-id-stub';
	}
}

/**
 * Factory function to create a Brevo transport instance.
 * Validates Brevo-specific configuration.
 * @param sender - Sender name and email
 * @returns Brevo transport instance
 * @throws {EmailSendError} if configuration is missing or invalid
 */
export function createBrevoTransport(sender: { name: string; email: string }): EmailTransport {
	const apiKey = env.EMAIL_BREVO_API_KEY;

	if (!apiKey) {
		throw new EmailSendError(
			'Brevo configuration missing: EMAIL_BREVO_API_KEY is required',
			'brevo'
		);
	}

	return new BrevoTransport({ apiKey }, sender);
}
