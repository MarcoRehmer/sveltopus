/**
 * Minimal safe user/session shapes used by App.Locals and server routes.
 * These deliberately exclude passwordHash and tokenHash.
 */

export interface SafeUser {
	id: string;
	email: string;
	emailNormalized: string;
	name: string | null;
	status: 'active' | 'suspended';
}

export interface SafeSession {
	id: string;
	userId: string;
	expiresAt: string;
	lastSeenAt: string | null;
	ipAddress: string | null;
	userAgent: string | null;
	activeOrganizationId: string | null;
}
