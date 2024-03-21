import { db } from '$lib/server/db/client';
import * as schema from '$lib/server/db/schema';
import type { Actions } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { PageServerLoad } from './$types';

type Link = {
	fullLink: string;
	shortLink: string;
	createdAt: string;
};

export const load: PageServerLoad = async ({ locals }) => {
	const id = locals.userID;
	const { link } = schema;
	const { user: userID } = link;

	const links: Link[] = await db
		.select({
			shortLink: link.shortLink,
			fullLink: link.fullLink,
			createdAt: link.createdAt
		})
		.from(link)
		.where(eq(userID, id))
		.orderBy(desc(link.createdAt));

	return {
		links
	};
};

export const actions: Actions = {
	save: async ({ request, url, locals }) => {
		const data = await request.formData();
		const fullLink = data.get('originalUrl') as string;
		const shortLink = url.origin + '/' + nanoid(7);
		const userID = locals.userID;

		const userFound = await userExists(userID);

		if (!userFound) {
			await db.insert(schema.user).values({ id: userID });
		}

		await db.insert(schema.link).values({
			fullLink,
			shortLink,
			createdAt: new Date().toUTCString(),
			user: userID
		});
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const shortLink = data.get('shortLink') as string;
		const { link } = schema;

		await db.delete(link).where(eq(link.shortLink, shortLink));
	}
};

async function userExists(id: string) {
	const result = await db
		.select()
		.from(schema.user)
		.where(eq(schema.user.id, id));

	return result.length === 1;
}
