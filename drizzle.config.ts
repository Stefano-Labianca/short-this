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
		connectionString: process.env.POSTGRES_URL as string
	}
} satisfies Config;
