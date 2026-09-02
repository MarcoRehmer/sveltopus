import { fail, redirect } from '@sveltejs/kit';
import {
	normalizeEmail,
	hashPassword,
	createSession,
	sessionCookieOptions
} from '$lib/server/auth/session.js';
import { db } from '../../../prisma/db.js';
import type { Actions } from './$types.js';

const MIN_PASSWORD_LENGTH = 8;

/** Conservative email format check — not exhaustive, but rejects obvious garbage. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const emailRaw = String(data.get('email') ?? '');
		const password = String(data.get('password') ?? '');

		// ── Basic validation ───────────────────────────────────────
		const errors: string[] = [];
		if (!emailRaw) errors.push('Email is required.');
		else {
			const emailNormalized = normalizeEmail(emailRaw);
			if (emailNormalized.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(emailNormalized)) {
				errors.push('Please enter a valid email address.');
			}
		}
		if (!password) errors.push('Password is required.');
		else if (password.length < MIN_PASSWORD_LENGTH)
			errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);

		if (errors.length > 0) {
			return fail(400, { error: errors.join(' '), email: emailRaw });
		}

		const email = normalizeEmail(emailRaw);

		// ── Check for existing account ─────────────────────────────
		const existing = await db.orm.public.User.where({ emailNormalized: email }).first();

		if (existing) {
			return fail(400, {
				error: 'An account with this email already exists.',
				email: emailRaw
			});
		}

		// ── Create user ────────────────────────────────────────────
		const now = new Date().toISOString();
		const passwordHash = await hashPassword(password);

		let user;
		try {
			user = await db.orm.public.User.create({
				id: crypto.randomUUID(),
				email: emailRaw.trim(),
				emailNormalized: email,
				passwordHash,
				status: 'active',
				createdAt: now,
				updatedAt: now
			});
		} catch (err: unknown) {
			// Unique-constraint race: the pre-check passed but a concurrent
			// request inserted the same emailNormalized between our lookup
			// and this create.  Surface the same friendly duplicate message.
			if (
				err &&
				typeof err === 'object' &&
				'sqlState' in err &&
				(err as { sqlState: string }).sqlState === '23505'
			) {
				return fail(400, {
					error: 'An account with this email already exists.',
					email: emailRaw
				});
			}
			throw err;
		}

		// ── Create session ─────────────────────────────────────────
		const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? null;
		const userAgent = request.headers.get('user-agent') ?? null;

		const token = await createSession(user.id, { ip, userAgent });

		const opts = sessionCookieOptions(process.env.NODE_ENV ?? 'development');
		cookies.set('session_token', token, opts);

		// ── Redirect ──────────────────────────────────────────────
		throw redirect(303, '/dashboard');
	}
};
