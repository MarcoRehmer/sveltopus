import { fail, redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { getSafeRedirectPath } from '$lib/server/auth-routing';

export const load: PageServerLoad = ({ url }) => ({
	redirectTo: getSafeRedirectPath(url.searchParams.get('redirectTo'))
});

export const actions: Actions = {
	signInEmail: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString().trim() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const redirectTo = getSafeRedirectPath(formData.get('redirectTo')?.toString());

		try {
			await auth.api.signInEmail({
				body: { email, password }
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'Sign in failed' });
			}

			return fail(500, { message: 'Unexpected error while signing in' });
		}

		throw redirect(303, redirectTo);
	}
};
