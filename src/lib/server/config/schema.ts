import { z } from 'zod';

export const databaseConfigSchema = z.object({
	DATABASE_URL: z
		.string()
		.min(1, 'DATABASE_URL is required')
		.url('DATABASE_URL must be a valid URL')
});

export const authConfigSchema = z.object({
	ORIGIN: z.string().min(1, 'ORIGIN is required').url('ORIGIN must be a valid URL'),
	BETTER_AUTH_SECRET: z.string().min(32, 'BETTER_AUTH_SECRET must be at least 32 characters')
});

const emailConfigSchema = z
	.object({
		EMAIL_PROVIDER: z.enum(['scaleway', 'brevo', 'console']).default('scaleway'),
		EMAIL_SENDER_NAME: z.string().min(1, 'EMAIL_SENDER_NAME is required'),
		EMAIL_SENDER_EMAIL: z.string().email('EMAIL_SENDER_EMAIL must be a valid email address'),
		EMAIL_SCW_PROJECT_ID: z.string().optional(),
		EMAIL_SCW_API_TOKEN: z.string().optional(),
		EMAIL_SCW_REGION: z.string().default('fr-par'),
		EMAIL_BREVO_API_KEY: z.string().optional()
	})
	.superRefine((config, context) => {
		if (config.EMAIL_PROVIDER === 'scaleway') {
			if (!config.EMAIL_SCW_PROJECT_ID) {
				context.addIssue({
					code: 'custom',
					path: ['EMAIL_SCW_PROJECT_ID'],
					message: 'Required for Scaleway'
				});
			}
			if (!config.EMAIL_SCW_API_TOKEN) {
				context.addIssue({
					code: 'custom',
					path: ['EMAIL_SCW_API_TOKEN'],
					message: 'Required for Scaleway'
				});
			}
		}

		if (config.EMAIL_PROVIDER === 'brevo' && !config.EMAIL_BREVO_API_KEY) {
			context.addIssue({
				code: 'custom',
				path: ['EMAIL_BREVO_API_KEY'],
				message: 'Required for Brevo'
			});
		}
	});

export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;
export type AuthConfig = z.infer<typeof authConfigSchema>;
export type EmailConfig = z.infer<typeof emailConfigSchema>;

export type AppConfig = {
	database: DatabaseConfig;
	auth: AuthConfig;
	email: EmailConfig | undefined;
};

export { emailConfigSchema };
