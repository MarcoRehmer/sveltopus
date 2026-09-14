import { env } from '$env/dynamic/private';
import {
	authConfigSchema,
	databaseConfigSchema,
	emailConfigSchema,
	type AppConfig
} from './schema';

let validatedConfig: AppConfig | undefined;
let validationError: Error | undefined;
let emailWarningLogged = false;

function formatIssues(issues: { path: PropertyKey[]; message: string }[]): string {
	return issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
}

export function validateConfig(): AppConfig {
	if (validatedConfig) return validatedConfig;
	if (validationError) throw validationError;

	const database = databaseConfigSchema.safeParse({
		DATABASE_URL: env.DATABASE_URL,
		ADMIN_DATABASE_URL: env.ADMIN_DATABASE_URL || undefined
	});
	const auth = authConfigSchema.safeParse({
		ORIGIN: env.ORIGIN,
		BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET
	});

	if (!database.success || !auth.success) {
		const criticalIssues = [
			...(database.success ? [] : database.error.issues),
			...(auth.success ? [] : auth.error.issues)
		];
		validationError = new Error(
			`Critical configuration is invalid: ${formatIssues(criticalIssues)}`
		);
		throw validationError;
	}

	const email = emailConfigSchema.safeParse({
		EMAIL_PROVIDER: env.EMAIL_PROVIDER,
		EMAIL_SENDER_NAME: env.EMAIL_SENDER_NAME,
		EMAIL_SENDER_EMAIL: env.EMAIL_SENDER_EMAIL,
		EMAIL_SCW_PROJECT_ID: env.EMAIL_SCW_PROJECT_ID,
		EMAIL_SCW_API_TOKEN: env.EMAIL_SCW_API_TOKEN,
		EMAIL_SCW_REGION: env.EMAIL_SCW_REGION,
		EMAIL_BREVO_API_KEY: env.EMAIL_BREVO_API_KEY
	});

	if (!email.success && !emailWarningLogged) {
		console.warn(
			`Optional email configuration is unavailable: ${formatIssues(email.error.issues)}`
		);
		emailWarningLogged = true;
	}

	const config: AppConfig = {
		database: database.data,
		auth: auth.data,
		email: email.success ? email.data : undefined
	};
	validatedConfig = config;
	return config;
}

export function getConfig(): AppConfig {
	return validateConfig();
}
