import { z } from 'zod';

/**
 * Environment variable schema for global email configuration.
 * Provider-specific fields are validated in each provider's module.
 */
export const emailConfigSchema = z.object({
	/** Email provider to use (default: scaleway) */
	EMAIL_PROVIDER: z.enum(['scaleway', 'brevo', 'console']).default('scaleway'),
	/** Sender display name for emails */
	EMAIL_SENDER_NAME: z.string().min(1, 'Sender name is required'),
	/** Sender email address */
	EMAIL_SENDER_EMAIL: z.string().email('Invalid sender email address')
});

/**
 * Validated email configuration type.
 */
export type EmailConfig = z.infer<typeof emailConfigSchema>;

/**
 * Validate global email configuration from environment variables.
 * @param env - Environment variables to validate (defaults to process.env)
 * @returns Validated email configuration
 * @throws {Error} if configuration is invalid or missing
 */
export function validateEmailConfig(
	env: Record<string, string | undefined> = process.env
): EmailConfig {
	const result = emailConfigSchema.safeParse({
		EMAIL_PROVIDER: env.EMAIL_PROVIDER,
		EMAIL_SENDER_NAME: env.EMAIL_SENDER_NAME,
		EMAIL_SENDER_EMAIL: env.EMAIL_SENDER_EMAIL
	});

	if (!result.success) {
		const errors = result.error?.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
		throw new Error(`Invalid email configuration: ${errors}`);
	}

	return result.data;
}
