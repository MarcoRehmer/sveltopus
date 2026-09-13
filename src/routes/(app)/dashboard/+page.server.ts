import { sendEmail } from '$lib/server/email';
import { renderTemplate } from '$lib/server/email/templates';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	sendWelcomeEmail: async () => {
		try {
			const htmlBody = await renderTemplate('welcome.html', {
				name: 'Test User',
				appName: 'Sveltopus'
			});

			const messageId = await sendEmail({
				to: [{ email: 'test@example.com', name: 'Test User' }],
				subject: 'Welcome to Sveltopus!',
				htmlBody,
				textBody: 'Welcome to Sveltopus! Thank you for joining.',
				tags: { purpose: 'welcome' }
			});

			return { success: true, messageId };
		} catch (error) {
			console.error('Failed to send welcome email:', error);
			return fail(500, { success: false, error: 'Failed to send welcome email' });
		}
	}
};
