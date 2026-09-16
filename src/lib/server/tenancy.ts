import { and, asc, eq } from 'drizzle-orm';
import { membership, membershipRole } from '$lib/server/db/schema';
import { withTenantContext, withUserContext } from '$lib/server/db';
import { AppError } from '$lib/server/errors';

export type MembershipRole = (typeof membershipRole.enumValues)[number];

export function getDefaultOrganizationId(userId: string): Promise<string | undefined> {
	return withUserContext(userId, async (tx) => {
		const [result] = await tx
			.select({ organizationId: membership.organizationId })
			.from(membership)
			.where(eq(membership.userId, userId))
			.orderBy(asc(membership.createdAt))
			.limit(1);

		return result?.organizationId;
	});
}

export function getMembershipRole(
	userId: string,
	organizationId: string
): Promise<MembershipRole | undefined> {
	return withTenantContext(userId, organizationId, async (tx) => {
		const [result] = await tx
			.select({ role: membership.role })
			.from(membership)
			.where(and(eq(membership.userId, userId), eq(membership.organizationId, organizationId)))
			.limit(1);

		return result?.role;
	});
}

export async function requireMembershipRole(
	userId: string,
	organizationId: string,
	allowedRoles: readonly MembershipRole[]
): Promise<MembershipRole> {
	const role = await getMembershipRole(userId, organizationId);
	if (!role || !allowedRoles.includes(role)) {
		throw new AppError(403, 'Organization access is required');
	}

	return role;
}
