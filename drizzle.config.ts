import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config({
	path: '.env.local'
});

export default {
	schema: './src/lib/server/db/schema.ts',
	out: './src/lib/server/db/drizzle',
	driver: 'pg',
	dbCredentials: {
		port: process.env.POSTGRES_PORT
			? parseInt(process.env.POSTGRES_PORT)
			: 5432,
		host: process.env.POSTGRES_LOCALHOST as string,
		user: process.env.POSTGRES_USER as string,
		password: process.env.POSTGRES_PASSWORD as string,
		database: process.env.POSTGRES_DB as string
	}
} satisfies Config;
