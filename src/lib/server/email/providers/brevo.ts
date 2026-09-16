import type { EmailMessage, EmailTransport } from '$lib/server/email/transport';

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
 * Receives validated Brevo-specific configuration.
 * @param sender - Sender name and email
 * @returns Brevo transport instance
 */
export function createBrevoTransport(
	sender: { name: string; email: string },
	config: { apiKey: string }
): EmailTransport {
	return new BrevoTransport(config, sender);
}
