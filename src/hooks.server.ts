import type { Handle } from '@sveltejs/kit';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { resolveSession, sessionCookieOptions } from '$lib/server/auth/session.js';

const SESSION_COOKIE = 'session_token';

function getCookieValue(cookieHeader: string | null, name: string): string | null {
	if (!cookieHeader) return null;
	const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
	return match?.[1] ?? null;
}

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, async ({ request, locale }) => {
		event.request = request;

		// ── Auth resolution (before routing) ────────────────────────
		const rawToken = getCookieValue(request.headers.get('cookie'), SESSION_COOKIE);
		const resolved = rawToken ? await resolveSession(rawToken) : null;

		let clearInvalidCookie = false;

		if (resolved) {
			event.locals.user = resolved.user;
			event.locals.session = {
				id: resolved.session.id,
				userId: resolved.session.userId,
				expiresAt: resolved.session.expiresAt,
				lastSeenAt: resolved.session.lastSeenAt,
				ipAddress: resolved.session.ipAddress,
				userAgent: resolved.session.userAgent,
				activeOrganizationId: resolved.session.activeOrganizationId
			};
		} else {
			event.locals.user = null;
			event.locals.session = null;
			if (rawToken) {
				clearInvalidCookie = true;
			}
		}

		const response = await resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});

		// Append Set-Cookie to clear stale / invalid session cookie.
		if (clearInvalidCookie) {
			const opts = sessionCookieOptions(process.env.NODE_ENV ?? 'development');
			response.headers.append(
				'Set-Cookie',
				`${SESSION_COOKIE}=; Path=${opts.path}; HttpOnly; SameSite=Lax; Max-Age=0`
			);
		}

		return response;
	});

export const handle: Handle = handleParaglide;
