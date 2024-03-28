import { db } from '$lib/server/db/client';
import * as schema from '$lib/server/db/schema';
import { type Actions } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

import { nanoid } from 'nanoid';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

type Link = {
	fullLink: string;
	shortLink: string;
	createdAt: string;
};

const fullLinkSchema = z.object({
	fullLink: z.string().url('Invalid URL')
});

const removeLinkSchema = z.object({
	shortLink: z.string().url()
});

export const load: PageServerLoad = async ({ request, locals }) => {
	const linkForm = await superValidate(request, zod(fullLinkSchema));
	const removeLinkForm = await superValidate(request, zod(removeLinkSchema));

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
		links,
		linkForm,
		removeLinkForm
	};
};

export const actions: Actions = {
	save: async ({ request, url, locals }) => {
		const saveForm = await superValidate(request, zod(fullLinkSchema));

		if (!saveForm.valid) {
			return { saveForm };
		}

		const fullLink = saveForm.data.fullLink;
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

		return { saveForm };
	},

	delete: async ({ request }) => {
		const removeLinkForm = await superValidate(request, zod(removeLinkSchema));

		if (!removeLinkForm.valid) {
			return { removeLinkForm };
		}

		const shortLink = removeLinkForm.data.shortLink;
		const { link } = schema;

		await db.delete(link).where(eq(link.shortLink, shortLink));

		return { removeLinkForm };
	}
};

async function userExists(id: string) {
	const result = await db
		.select()
		.from(schema.user)
		.where(eq(schema.user.id, id));

	return result.length === 1;
}
