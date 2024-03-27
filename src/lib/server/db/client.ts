import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

dotenv.config({
	path: '.env'
});

const queryClient = postgres({
	port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
	host: process.env.POSTGRES_LOCALHOST as string,
	user: process.env.POSTGRES_USER as string,
	password: process.env.POSTGRES_PASSWORD as string,
	database: process.env.POSTGRES_DB as string
});

export const db = drizzle(queryClient, { schema });
