import type { EmailMessage, EmailTransport } from '$lib/server/email/transport';
import { EmailSendError } from '$lib/server/email/errors';

/**
 * Scaleway-specific configuration.
 */
interface ScalewayConfig {
	projectId: string;
	apiToken: string;
	region: string;
}

/**
 * Scaleway TEM transport implementation.
 * Uses Scaleway's REST API to send emails.
 */
class ScalewayTransport implements EmailTransport {
	private readonly apiUrl: string;

	constructor(
		private config: ScalewayConfig,
		private sender: { name: string; email: string }
	) {
		// Scaleway TEM uses regional endpoints with v1alpha1 API version
		this.apiUrl = `https://api.scaleway.com/transactional-email/v1alpha1/regions/${config.region}/emails`;
	}

	/**
	 * Map provider-neutral EmailMessage to Scaleway-specific payload.
	 */
	private mapMessage(message: EmailMessage): Record<string, unknown> {
		const headers: Array<{ key: string; value: string }> = [];

		// Map reply-to to additional headers
		if (message.replyTo) {
			headers.push({ key: 'Reply-To', value: message.replyTo });
		}

		// Map tags to additional headers
		if (message.tags) {
			headers.push(...Object.entries(message.tags).map(([k, v]) => ({ key: k, value: String(v) })));
		}

		return {
			from: this.sender,
			to: message.to.map((recipient: { email: string; name?: string }) => ({
				email: recipient.email,
				name: recipient.name
			})),
			subject: message.subject,
			text: message.textBody,
			html: message.htmlBody,
			project_id: this.config.projectId,
			...(headers.length > 0 ? { additional_headers: headers } : {})
		};
	}

	/**
	 * Parse Scaleway error response into a safe error message.
	 */
	private async parseError(response: Response): Promise<{ title: string; type: string }> {
		try {
			const data = await response.json();
			return {
				title: data.title || 'Unknown error',
				type: data.type || 'unknown'
			};
		} catch {
			return { title: 'Unknown error', type: 'unknown' };
		}
	}

	/**
	 * Send an email via Scaleway TEM API.
	 * @param message - The email message to send
	 * @returns Promise resolving to Scaleway's message ID
	 * @throws {EmailSendError} if the email cannot be sent
	 */
	async send(message: EmailMessage): Promise<string> {
		const body = this.mapMessage(message);

		const response = await fetch(this.apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Auth-Token': this.config.apiToken
			},
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			const error = await this.parseError(response);
			throw new EmailSendError(
				`Scaleway TEM API error: ${error.title}`,
				'scaleway',
				response.status,
				error.type
			);
		}

		const { messageId } = await response.json();
		return messageId;
	}
}

/**
 * Factory function to create a Scaleway transport instance.
 * Validates Scaleway-specific configuration.
 * @param sender - Sender name and email
 * @returns Scaleway transport instance
 * @throws {EmailSendError} if configuration is missing or invalid
 */
export function createScalewayTransport(sender: { name: string; email: string }): EmailTransport {
	const config = {
		projectId: process.env.EMAIL_SCW_PROJECT_ID!,
		apiToken: process.env.EMAIL_SCW_API_TOKEN!,
		region: process.env.EMAIL_SCW_REGION || 'fr-par'
	};

	if (!config.projectId || !config.apiToken) {
		throw new EmailSendError(
			'Scaleway configuration missing: EMAIL_SCW_PROJECT_ID and EMAIL_SCW_API_TOKEN are required',
			'scaleway'
		);
	}

	return new ScalewayTransport(config, sender);
}
