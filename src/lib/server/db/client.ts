import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

dotenv.config({
	path: '.env.local'
});

const queryClient = postgres(process.env.LOCAL_POSTGRES_URL as string);

export const db = drizzle(queryClient, { schema });
