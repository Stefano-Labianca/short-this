import { char, date, pgTable, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: char('id', { length: 10 }).primaryKey().notNull()
});

export const link = pgTable('link', {
	shortLink: varchar('short_link', { length: 32 }).primaryKey().notNull(),
	fullLink: varchar('full_link', { length: 256 }).notNull(),
	createdAt: date('created_at').notNull(),
	user: char('user', { length: 10 })
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});
