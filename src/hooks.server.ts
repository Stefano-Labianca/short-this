import type { Handle } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

export const handle: Handle = async ({ event, resolve }) => {
	let cookieID = event.cookies.get('userID');

	if (!cookieID) {
		cookieID = nanoid(10);
		event.cookies.set('userID', cookieID, {
			path: '/',
			maxAge: 60 * 60 * 24 * 7
		});
	}

	event.locals.userID = cookieID;

	return await resolve(event);
};
