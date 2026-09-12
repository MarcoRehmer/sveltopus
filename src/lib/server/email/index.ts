import { validateEmailConfig } from './config';
import { providers } from './providers';
import type { EmailMessage, EmailTransport } from './transport';
import { EmailSendError } from './errors';

// Global singleton for the transport instance
let transport: EmailTransport | null = null;

/**
 * Create an email transport instance based on the configured provider.
 * Validates global configuration and creates the appropriate transport.
 * @returns EmailTransport instance
 * @throws {EmailSendError} if configuration is invalid or provider is unsupported
 */
function createTransport(): EmailTransport {
	const config = validateEmailConfig();
	const sender = {
		name: config.EMAIL_SENDER_NAME,
		email: config.EMAIL_SENDER_EMAIL
	};

	const providerFactory = providers[config.EMAIL_PROVIDER];
	if (!providerFactory) {
		throw new EmailSendError(
			`Unsupported email provider: ${config.EMAIL_PROVIDER}`,
			config.EMAIL_PROVIDER
		);
	}

	return providerFactory(sender);
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
