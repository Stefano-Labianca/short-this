import { db } from '$lib/server/db/client';
import * as schema from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const { link } = schema;

	const result = await db
		.select({
			fullLink: link.fullLink
		})
		.from(schema.link)
		.where(eq(link.shortLink, url.href));

	const { fullLink } = result[0];

	redirect(302, fullLink);
};
