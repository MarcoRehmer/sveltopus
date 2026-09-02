import { fail, redirect } from '@sveltejs/kit';
import {
	normalizeEmail,
	verifyPassword,
	createSession,
	sessionCookieOptions
} from '$lib/server/auth/session.js';
import { db } from '../../../prisma/db.js';
import type { Actions } from './$types.js';

/** Conservative email format check — not exhaustive, but rejects obvious garbage. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const emailRaw = String(data.get('email') ?? '');
		const password = String(data.get('password') ?? '');

		// ── Basic validation ───────────────────────────────────────
		if (!emailRaw || !password) {
			return fail(400, { error: 'Email and password are required.', email: emailRaw });
		}

		const email = normalizeEmail(emailRaw);

		if (email.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(email)) {
			return fail(400, { error: 'Please enter a valid email address.', email: emailRaw });
		}

		// ── Find user ──────────────────────────────────────────────
		const user = await db.orm.public.User.where({ emailNormalized: email }).first();

		// Generic error — never reveal whether the email exists.
		if (!user) {
			return fail(400, { error: 'Invalid email or password.', email: emailRaw });
		}
		if (user.status !== 'active') {
			return fail(400, { error: 'Invalid email or password.', email: emailRaw });
		}
		if (!user.passwordHash) {
			// OAuth-only account — no local password to verify.
			return fail(400, { error: 'Invalid email or password.', email: emailRaw });
		}

		// ── Verify password ────────────────────────────────────────
		const valid = await verifyPassword(user.passwordHash, password);
		if (!valid) {
			return fail(400, { error: 'Invalid email or password.', email: emailRaw });
		}

		// ── Create session ─────────────────────────────────────────
		const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? null;
		const userAgent = request.headers.get('user-agent') ?? null;

		const token = await createSession(user.id, { ip, userAgent });

		// Set cookie.
		const opts = sessionCookieOptions(process.env.NODE_ENV ?? 'development');
		cookies.set('session_token', token, opts);

		// ── Update lastLoginAt ─────────────────────────────────────
		const now = new Date().toISOString();
		await db.orm.public.User.where({ id: user.id }).update({ lastLoginAt: now });

		// ── Redirect ──────────────────────────────────────────────
		throw redirect(303, '/dashboard');
	}
};
