import { fail, redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { getSafeRedirectPath } from '$lib/server/auth-routing';

export const load: PageServerLoad = ({ url }) => ({
	redirectTo: getSafeRedirectPath(url.searchParams.get('redirectTo'))
});

export const actions: Actions = {
	signUpEmail: async (event) => {
		const formData = await event.request.formData();
		const name = formData.get('name')?.toString().trim() ?? '';
		const email = formData.get('email')?.toString().trim() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const confirmPassword = formData.get('confirmPassword')?.toString() ?? '';
		const redirectTo = getSafeRedirectPath(formData.get('redirectTo')?.toString());

		if (password !== confirmPassword) {
			return fail(400, { message: 'Passwords do not match' });
		}

		try {
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
	}
};
