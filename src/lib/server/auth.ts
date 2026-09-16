import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements } from 'better-auth/plugins/admin/access';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { getConfig } from '$lib/server/config';

const config = getConfig();

const adminAccess = createAccessControl(defaultStatements);
const user = adminAccess.newRole({ user: [], session: [] });
const superadmin = adminAccess.newRole({ user: [], session: [] });

export const auth = betterAuth({
	baseURL: config.auth.ORIGIN,
	secret: config.auth.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: true },
	plugins: [
		admin({
			defaultRole: 'user',
			adminRoles: ['superadmin'],
			ac: adminAccess,
			roles: { user, superadmin }
		}),
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});
