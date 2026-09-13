import type { EmailMessage, EmailTransport } from '$lib/server/email/transport';

/**
 * Console transport implementation for development.
 * Outputs rendered email content to the server console.
 */
class ConsoleTransport implements EmailTransport {
	constructor(private sender: { name: string; email: string }) {}

	/**
	 * Send an email by logging its contents to the console.
	 * @param message - The email message to send
	 * @returns Promise resolving to a deterministic stub message ID
	 */
	async send(message: EmailMessage): Promise<string> {
		console.log('[' + 'Console Email' + ']', '='.repeat(60));
		console.log('[' + 'Console Email' + '] From:', this.sender);
		console.log('[' + 'Console Email' + '] To:', message.to);
		console.log('[' + 'Console Email' + '] Subject:', message.subject);

		if (message.replyTo) {
			console.log('[' + 'Console Email' + '] Reply-To:', message.replyTo);
		}

		if (message.tags && Object.keys(message.tags).length > 0) {
			console.log('[' + 'Console Email' + '] Tags:', message.tags);
		}

		if (message.textBody) {
			console.log('[' + 'Console Email' + '] Text Body:');
			console.log('[' + 'Console Email' + '] ---');
			console.log(message.textBody);
			console.log('[' + 'Console Email' + '] ---');
		}

		if (message.htmlBody) {
			console.log('[' + 'Console Email' + '] HTML Body:');
			console.log('[' + 'Console Email' + '] ---');
			console.log(message.htmlBody);
			console.log('[' + 'Console Email' + '] ---');
		}

		console.log('[' + 'Console Email' + ']', '='.repeat(60));

		return 'console-message-id';
	}
}

/**
 * Factory function to create a Console transport instance.
 * No configuration required - always available for development.
 * @param sender - Sender name and email
 * @returns Console transport instance
 */
export function createConsoleTransport(sender: { name: string; email: string }): EmailTransport {
	return new ConsoleTransport(sender);
}
