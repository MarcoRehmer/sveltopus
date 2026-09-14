import type { EmailMessage, EmailTransport } from './transport';
import { EmailSendError } from './errors';
import { getConfig } from '$lib/server/config';
import { createScalewayTransport } from './providers/scaleway';
import { createBrevoTransport } from './providers/brevo';
import { createConsoleTransport } from './providers/console';

// Global singleton for the transport instance
let transport: EmailTransport | null = null;

/**
 * Create an email transport instance based on the configured provider.
 * Validates global configuration and creates the appropriate transport.
 * @returns EmailTransport instance
 * @throws {EmailSendError} if email configuration is unavailable
 */
function createTransport(): EmailTransport {
	const email = getConfig().email;
	if (!email) {
		throw new EmailSendError('Email configuration is unavailable', 'email');
	}

	const sender = {
		name: email.EMAIL_SENDER_NAME,
		email: email.EMAIL_SENDER_EMAIL
	};

	switch (email.EMAIL_PROVIDER) {
		case 'scaleway':
			return createScalewayTransport(sender, {
				projectId: email.EMAIL_SCW_PROJECT_ID!,
				apiToken: email.EMAIL_SCW_API_TOKEN!,
				region: email.EMAIL_SCW_REGION
			});
		case 'brevo':
			return createBrevoTransport(sender, { apiKey: email.EMAIL_BREVO_API_KEY! });
		case 'console':
			return createConsoleTransport(sender);
	}
}

/**
 * Send an email message using the configured transport.
 * This is the main entry point for application code.
 * @param message - The email message to send
 * @returns Promise resolving to the provider's message ID
 * @throws {EmailSendError} if the email cannot be sent
 */
export async function sendEmail(message: EmailMessage): Promise<string> {
	if (!transport) {
		transport = createTransport();
	}
	return transport.send(message);
}

// Re-export types for convenience
// Application code should import from here, not from individual modules
export type { EmailMessage, EmailTransport } from './transport';

export { EmailSendError };
