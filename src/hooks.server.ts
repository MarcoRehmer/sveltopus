import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import type { Handle } from '@sveltejs/kit';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { validateConfig } from '$lib/server/config';
import { handleError } from '$lib/server/errors';
import { getDefaultOrganizationId } from '$lib/server/tenancy';

const handleConfig: Handle = ({ event, resolve }) => {
	validateConfig();
	return resolve(event);
};

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, async ({ request }) => {
		event.request = request;
		return resolve(event);
	});

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
		event.locals.organizationId = await getDefaultOrganizationId(session.user.id);
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

const handleErrors: Handle = async ({ event, resolve }) => {
	try {
		return await resolve(event);
	} catch (error) {
		const { status, message } = handleError(error);
		console.error('Global error handler caught:', error);
		return new Response(message, { status });
	}
};

export const handle: Handle = sequence(
	handleConfig,
	handleParaglide,
	handleBetterAuth,
	handleErrors
);
