import { fail, redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { getSafeRedirectPath } from '$lib/server/auth-routing';
import { signUpSchema } from '$lib/validation/auth';
import { validateFormData } from '$lib/validation/form';

export const load: PageServerLoad = ({ url }) => ({
	redirectTo: getSafeRedirectPath(url.searchParams.get('redirectTo'))
});

export const actions: Actions = {
	signUpEmail: async (event) => {
		const formData = await event.request.formData();
		const validation = validateFormData(signUpSchema, formData);
		const redirectTo = getSafeRedirectPath(formData.get('redirectTo')?.toString());

		if (!validation.success) {
			return fail(400, {
				message: 'Please correct the highlighted fields',
				fieldErrors: validation.fieldErrors
			});
		}

		try {
			const { name, email, password } = validation.data;

			await auth.api.signUpEmail({
				body: { name, email, password }
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'Sign up failed' });
			}

			return fail(500, { message: 'Unexpected error while signing up' });
		}

		throw redirect(303, redirectTo);
	},
	signInGoogle: async (event) => {
		const redirectTo = getSafeRedirectPath(
			(event.request.url.searchParams.get('redirectTo') || event.url.searchParams.get('redirectTo'))?.toString()
		);

		try {
			await auth.api.signInSocial({
				body: {
					provider: 'google',
					callbackURL: redirectTo
				}
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'Google sign in failed' });
			}

			return fail(500, { message: 'Unexpected error while signing in with Google' });
		}

		throw redirect(303, redirectTo);
	}
};
