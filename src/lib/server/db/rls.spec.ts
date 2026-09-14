import postgres from 'postgres';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.RLS_TEST_DATABASE_URL;
const describeRls = databaseUrl ? describe : describe.skip;

describeRls('tenant row-level security', () => {
	const sql = postgres(databaseUrl!);
	const suffix = crypto.randomUUID();
	const userA = `rls-a-${suffix}`;
	const userB = `rls-b-${suffix}`;
	let organizationA = '';
	let organizationB = '';

	beforeAll(async () => {
		await sql`
			insert into "user" (id, name, email, role)
			values
				(${userA}, 'RLS A', ${`${userA}@example.test`}, 'user'),
				(${userB}, 'RLS B', ${`${userB}@example.test`}, 'user')
		`;

		const organizations = await sql<{ organizationId: string; userId: string }[]>`
			select organization_id as "organizationId", user_id as "userId"
			from membership
			where user_id in (${userA}, ${userB})
		`;
		organizationA = organizations.find(({ userId }) => userId === userA)!.organizationId;
		organizationB = organizations.find(({ userId }) => userId === userB)!.organizationId;
	});

	afterAll(async () => {
		await sql`delete from "user" where id in (${userA}, ${userB})`;
		await sql.end();
	});

	it('provisions one owner organization for each user', async () => {
		expect(organizationA).not.toBe(organizationB);
	});

	it('shows only organizations belonging to the current user', async () => {
		const visible = await sql.begin(async (tx) => {
			await tx.unsafe('set local role app_runtime');
			await tx`select set_config('app.user_id', ${userA}, true)`;
			return tx<{ id: string }[]>`select id from organization`;
		});

		expect(visible.map(({ id }) => id)).toEqual([organizationA]);
		expect(visible.some(({ id }) => id === organizationB)).toBe(false);
	});

	it('fails closed when user context is absent', async () => {
		const visible = await sql.begin(async (tx) => {
			await tx.unsafe('set local role app_runtime');
			return tx<{ id: string }[]>`select id from organization`;
		});

		expect(visible).toHaveLength(0);
	});

	it('does not grant membership mutation to the runtime role', async () => {
		await expect(
			sql.begin(async (tx) => {
				await tx.unsafe('set local role app_runtime');
				await tx`select set_config('app.user_id', ${userA}, true)`;
				await tx`
					insert into membership (organization_id, user_id, role)
					values (${organizationB}, ${userA}, 'member')
				`;
			})
		).rejects.toThrow(/permission denied/);
	});

	it('prevents removing the final superadmin', async () => {
		await expect(
			sql.begin(async (tx) => {
				const firstAdmin = `admin-a-${suffix}`;
				const lastAdmin = `admin-b-${suffix}`;
				await tx`
					insert into "user" (id, name, email, role)
					values
						(${firstAdmin}, 'Admin A', ${`${firstAdmin}@example.test`}, 'superadmin'),
						(${lastAdmin}, 'Admin B', ${`${lastAdmin}@example.test`}, 'superadmin')
				`;
				await tx`update "user" set role = 'user' where id = ${firstAdmin}`;
				await tx`delete from "user" where id = ${lastAdmin}`;
			})
		).rejects.toThrow(/cannot remove the last superadmin/);
	});

	it('keeps admin audit events immutable', async () => {
		await expect(
			sql.begin(async (tx) => {
				const [event] = await tx<{ id: string }[]>`
					insert into admin_audit_event (actor_user_id, action, target_type, reason)
					values (${userA}, 'test', 'test', 'security test')
					returning id
				`;
				await tx`update admin_audit_event set action = 'tampered' where id = ${event.id}`;
			})
		).rejects.toThrow(/admin audit events are immutable/);
	});
});
