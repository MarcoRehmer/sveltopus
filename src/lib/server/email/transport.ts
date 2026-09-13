/**
 * Represents a single recipient with email address and optional display name.
 */
export interface EmailRecipient {
	email: string;
	name?: string;
}

/**
 * Provider-neutral email message contract.
 * All fields are provider-agnostic and map to common email concepts.
 */
export interface EmailMessage {
	/** List of recipients */
	to: EmailRecipient[];
	/** Email subject line */
	subject: string;
	/** HTML body of the email */
	htmlBody?: string;
	/** Plain text body of the email */
	textBody?: string;
	/** Reply-to email address */
	replyTo?: string;
	/** Optional tags/metadata for observability */
	tags?: Record<string, string>;
}

/**
 * Interface for email transport implementations.
 * Each provider (Scaleway TEM, Brevo, etc.) implements this interface.
 */
export interface EmailTransport {
	/**
	 * Send an email message through the configured provider.
	 * @param message - The email message to send
	 * @returns Promise resolving to the provider's message ID
	 * @throws {EmailSendError} when the email cannot be sent
	 */
	send(message: EmailMessage): Promise<string>;
}
