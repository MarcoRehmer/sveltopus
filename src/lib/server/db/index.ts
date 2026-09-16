import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, sql } from 'drizzle-orm';
import postgres from 'postgres';
import * as schema from './schemas';
import { getConfig } from '$lib/server/config';
import { AppError } from '$lib/server/errors';
import { user } from './auth.schema';
import { adminAuditEvent } from './schema';

const databaseConfig = getConfig().database;
const client = postgres(databaseConfig.DATABASE_URL);
const adminClient = databaseConfig.ADMIN_DATABASE_URL
	? postgres(databaseConfig.ADMIN_DATABASE_URL)
	: undefined;

export const db = drizzle(client, { schema });
const adminDb = adminClient ? drizzle(adminClient, { schema }) : undefined;

export type DatabaseTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export type AdminAuditInput = {
	action: string;
	targetType: string;
	targetId?: string;
	organizationId?: string;
	reason: string;
	requestId?: string;
	metadata?: Record<string, unknown>;
};

export function withUserContext<T>(
	userId: string,
	callback: (tx: DatabaseTransaction) => Promise<T>
): Promise<T> {
	return db.transaction(async (tx) => {
		await tx.execute(sql`select set_config('app.user_id', ${userId}, true)`);
		return callback(tx);
	});
}

export function withTenantContext<T>(
	userId: string,
	organizationId: string,
	callback: (tx: DatabaseTransaction) => Promise<T>
): Promise<T> {
	return db.transaction(async (tx) => {
		await tx.execute(sql`
			select
				set_config('app.user_id', ${userId}, true),
				set_config('app.organization_id', ${organizationId}, true)
		`);
		return callback(tx);
	});
}

export async function withAdminContext<T>(
	userId: string,
	audit: AdminAuditInput,
	callback: (tx: DatabaseTransaction) => Promise<T>
): Promise<T> {
	if (!adminDb) throw new AppError(503, 'Superadmin database access is not configured');

	const [actor] = await db
		.select({ role: user.role })
		.from(user)
		.where(eq(user.id, userId))
		.limit(1);
	if (actor?.role !== 'superadmin') throw new AppError(403, 'Superadmin access is required');

	return adminDb.transaction(async (tx) => {
		await tx.execute(sql`select set_config('app.user_id', ${userId}, true)`);
		await tx.insert(adminAuditEvent).values({ actorUserId: userId, ...audit });
		return callback(tx);
	});
}

export function withAdminTenantContext<T>(
	userId: string,
	organizationId: string,
	audit: Omit<AdminAuditInput, 'organizationId'>,
	callback: (tx: DatabaseTransaction) => Promise<T>
): Promise<T> {
	return withAdminContext(userId, { ...audit, organizationId }, async (tx) => {
		await tx.execute(sql`select set_config('app.organization_id', ${organizationId}, true)`);
		return callback(tx);
	});
}
