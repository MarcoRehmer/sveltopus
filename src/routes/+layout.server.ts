import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getReturnPath } from '$lib/server/auth-routing';

const publicAuthPaths = new Set(['/login', '/signup']);

export const load: LayoutServerLoad = ({ locals, url }) => {
	const { pathname } = url;

	if (pathname === '/') {
		throw redirect(303, locals.user ? '/dashboard' : '/login');
	}

	if (publicAuthPaths.has(pathname)) {
		if (locals.user) {
			throw redirect(303, '/dashboard');
		}

		return {};
	}

	if (!locals.user) {
		const redirectTo = encodeURIComponent(getReturnPath(url));
		throw redirect(303, `/login?redirectTo=${redirectTo}`);
	}

	return { user: locals.user, session: locals.session };
};
