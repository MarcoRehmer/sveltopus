import { createHash, randomBytes } from 'node:crypto';
import argon2 from 'argon2';
import { db } from '../../../prisma/db.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SESSION_COOKIE = 'session_token';
const SESSION_DAYS = 30;
const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60; // seconds

// ---------------------------------------------------------------------------
// Email
// ---------------------------------------------------------------------------

export function normalizeEmail(email: string): string {
	return email.trim().toLowerCase();
}

// ---------------------------------------------------------------------------
// Password hashing (Argon2id)
// ---------------------------------------------------------------------------

export async function hashPassword(password: string): Promise<string> {
	return argon2.hash(password, { type: argon2.argon2id });
}

export async function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
	try {
		return await argon2.verify(passwordHash, password);
	} catch {
		return false;
	}
}

// ---------------------------------------------------------------------------
// Session token handling
// ---------------------------------------------------------------------------

/** Generate a cryptographically secure random token (hex-encoded). */
export function generateSessionToken(): string {
	// 32 random bytes = 256 bits of entropy, hex-encoded to 64 chars.
	return randomBytes(32).toString('hex');
}

/** SHA-256 hash of a session token for database storage. */
export function hashToken(token: string): string {
	return createHash('sha256').update(token).digest('hex');
}

// ---------------------------------------------------------------------------
// Cookie helpers
// ---------------------------------------------------------------------------

export function sessionCookieOptions(env: string): {
	path: string;
	httpOnly: boolean;
	sameSite: 'lax';
	secure: boolean;
	maxAge: number;
} {
	return {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: env !== 'development',
		maxAge: SESSION_MAX_AGE
	};
}

// ---------------------------------------------------------------------------
// Session CRUD
// ---------------------------------------------------------------------------

/** Create a new session row in the database. Returns the raw token (set as cookie). */
export async function createSession(
	userId: string,
	opts: { ip?: string | null; userAgent?: string | null } = {}
): Promise<string> {
	const token = generateSessionToken();
	const tokenHash = hashToken(token);
	const now = new Date().toISOString();
	const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString();

	await db.orm.public.Session.create({
		id: crypto.randomUUID(),
		userId,
		tokenHash,
		expiresAt,
		createdAt: now,
		updatedAt: now,
		ipAddress: opts.ip ?? null,
		userAgent: opts.userAgent ?? null
	});

	return token;
}

/** Validated session + user pair returned by `resolveSession`. */
export type ResolvedSession = {
	session: {
		id: string;
		userId: string;
		tokenHash: string;
		expiresAt: string;
		revokedAt: string | null;
		lastSeenAt: string | null;
		ipAddress: string | null;
		userAgent: string | null;
		activeOrganizationId: string | null;
		createdAt: string;
		updatedAt: string;
	};
	user: {
		id: string;
		email: string;
		emailNormalized: string;
		name: string | null;
		status: 'active' | 'suspended';
	};
};

/**
 * Resolve a raw session token into a valid session + user pair.
 * Returns `null` for any invalid / expired / revoked / suspended scenario.
 */
export async function resolveSession(token: string): Promise<ResolvedSession | null> {
	if (!token || token.length < 64) return null;

	const tokenHash = hashToken(token);

	const session = await db.orm.public.Session.where({ tokenHash }).first();

	if (!session) return null;
	if (session.revokedAt) return null;
	if (new Date(session.expiresAt) <= new Date()) return null;

	const user = await db.orm.public.User.where({ id: session.userId }).first();

	if (!user) return null;
	if (user.status !== 'active') return null;

	return {
		session: {
			id: session.id,
			userId: session.userId,
			tokenHash: session.tokenHash,
			expiresAt: session.expiresAt,
			revokedAt: session.revokedAt,
			lastSeenAt: session.lastSeenAt,
			ipAddress: session.ipAddress,
			userAgent: session.userAgent,
			activeOrganizationId: session.activeOrganizationId,
			createdAt: session.createdAt,
			updatedAt: session.updatedAt
		},
		user: {
			id: user.id,
			email: user.email,
			emailNormalized: user.emailNormalized,
			name: user.name,
			status: user.status
		}
	};
}

// ---------------------------------------------------------------------------
// Hook helper
// ---------------------------------------------------------------------------

/**
 * Extract the session token from the cookie header of a request.
 */
export function getSessionTokenFromCookie(cookieHeader: string | null): string | null {
	if (!cookieHeader) return null;
	const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]*)`));
	return match?.[1] ?? null;
}
