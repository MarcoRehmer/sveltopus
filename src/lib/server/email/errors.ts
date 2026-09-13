/**
 * Unified error class for all email send failures.
 * Never includes credentials, action URLs, or rendered email bodies in messages.
 */
export class EmailSendError extends Error {
	constructor(
		message: string,
		public readonly provider?: string,
		public readonly statusCode?: number,
		public readonly providerErrorCode?: string
	) {
		super(message);
		this.name = 'EmailSendError';
	}
}
