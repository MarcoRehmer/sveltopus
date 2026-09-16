import { relations } from 'drizzle-orm';
import {
	index,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid
} from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const membershipRole = pgEnum('membership_role', ['owner', 'member']);

export const organization = pgTable(
	'organization',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		name: text('name').notNull(),
		slug: text('slug').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [uniqueIndex('organization_slug_uidx').on(table.slug)]
);

export const membership = pgTable(
	'membership',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organization.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		role: membershipRole('role').notNull().default('member'),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
	},
	(table) => [
		uniqueIndex('membership_organization_user_uidx').on(table.organizationId, table.userId),
		index('membership_user_idx').on(table.userId),
		index('membership_organization_idx').on(table.organizationId)
	]
);

export const adminAuditEvent = pgTable(
	'admin_audit_event',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		actorUserId: text('actor_user_id').notNull(),
		organizationId: uuid('organization_id').references(() => organization.id, {
			onDelete: 'set null'
		}),
		action: text('action').notNull(),
		targetType: text('target_type').notNull(),
		targetId: text('target_id'),
		reason: text('reason').notNull(),
		requestId: text('request_id'),
		metadata: jsonb('metadata').$type<Record<string, unknown>>(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
	},
	(table) => [
		index('admin_audit_event_actor_idx').on(table.actorUserId),
		index('admin_audit_event_organization_idx').on(table.organizationId),
		index('admin_audit_event_created_at_idx').on(table.createdAt)
	]
);

export const organizationRelations = relations(organization, ({ many }) => ({
	memberships: many(membership),
	adminAuditEvents: many(adminAuditEvent)
}));

export const membershipRelations = relations(membership, ({ one }) => ({
	organization: one(organization, {
		fields: [membership.organizationId],
		references: [organization.id]
	}),
	user: one(user, {
		fields: [membership.userId],
		references: [user.id]
	})
}));

export const adminAuditEventRelations = relations(adminAuditEvent, ({ one }) => ({
	organization: one(organization, {
		fields: [adminAuditEvent.organizationId],
		references: [organization.id]
	})
}));
